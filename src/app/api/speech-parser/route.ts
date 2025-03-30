import { NextRequest, NextResponse } from 'next/server';
import { Project } from '@/lib/types';
import { format, subDays } from 'date-fns';
import { RecognitionLanguage } from '@/lib/speechRecognition';

interface ParsedTimeEntry {
  date: string;
  project_name: string;
  hours: number;
  description?: string;
}

interface RequestBody {
  text: string;
  projects: Project[];
  language?: RecognitionLanguage;
}

// Function to handle date extraction with fallback to simple parsing for common terms
function parseDate(text: string, language: RecognitionLanguage = 'en-US'): string {
  // Default to today if OpenAI fails or we're in fallback mode
  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');
  
  // Check for common date references without needing AI
  const lowerText = text.toLowerCase();
  
  if (language === 'uk-UA') {
    // Ukrainian date references - using more thorough pattern matching
    if (
      lowerText.includes('сьогодні') || 
      lowerText.includes('сьогодня') || 
      lowerText.includes('зараз') ||
      lowerText.includes('сегодня') // Common mixing of Russian/Ukrainian
    ) {
      console.log("Ukrainian today date detected");
      return todayFormatted;
    }
    
    if (
      lowerText.includes('вчора') || 
      lowerText.includes('вчера')
    ) {
      const yesterday = subDays(today, 1);
      return format(yesterday, 'yyyy-MM-dd');
    }

    // Ukrainian ordinal dates (e.g., "20 березня")
    const ukMonths: Record<string, number> = {
      'січня': 0, 'лютого': 1, 'березня': 2, 'квітня': 3, 'травня': 4, 'червня': 5,
      'липня': 6, 'серпня': 7, 'вересня': 8, 'жовтня': 9, 'листопада': 10, 'грудня': 11
    };

    const ukOrdinalMatch = text.match(/(\d+)\s+(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)/i);
    if (ukOrdinalMatch) {
      const day = parseInt(ukOrdinalMatch[1]);
      const month = ukMonths[ukOrdinalMatch[2].toLowerCase()];
      const year = today.getFullYear();
      
      // If the date is in the future, use previous year
      const date = new Date(year, month, day);
      if (date > today) {
        date.setFullYear(year - 1);
      }
      
      return format(date, 'yyyy-MM-dd');
    }
  } else {
    // English date references
    if (lowerText.includes('today') || lowerText.includes(' now ')) {
      return todayFormatted;
    }
    
    if (lowerText.includes('yesterday')) {
      const yesterday = subDays(today, 1);
      return format(yesterday, 'yyyy-MM-dd');
    }

    // English ordinal dates (e.g., "20th March")
    const enMonths: Record<string, number> = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
      'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
    };

    const enOrdinalMatch = text.match(/(\d+)(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i);
    if (enOrdinalMatch) {
      const day = parseInt(enOrdinalMatch[1]);
      const month = enMonths[enOrdinalMatch[2].toLowerCase()];
      const year = today.getFullYear();
      
      // If the date is in the future, use previous year
      const date = new Date(year, month, day);
      if (date > today) {
        date.setFullYear(year - 1);
      }
      
      return format(date, 'yyyy-MM-dd');
    }
  }
  
  // Try to find date patterns like MM/DD/YYYY or YYYY-MM-DD or DD.MM.YYYY
  const dateRegex = /\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})\b/;
  const match = text.match(dateRegex);
  
  if (match) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_fullMatch, first, second, year] = match;
      let month, day;
      
      // For Ukrainian format (DD.MM.YYYY)
      if (language === 'uk-UA' && text.includes('.')) {
        day = first;
        month = second;
      } else {
        // Default to US format (MM/DD/YYYY)
        month = first;
        day = second;
      }
      
      // Handle 2-digit years
      const fullYear = year.length === 2 ? `20${year}` : year;
      // Create a date object to validate and format correctly
      const date = new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      if (!isNaN(date.getTime())) {
        return format(date, 'yyyy-MM-dd');
      }
    } catch (e) {
      console.error('Error parsing date from regex:', e);
    }
  }
  
  // Ukrainian input with no explicit date should default to today
  if (language === 'uk-UA') {
    console.log("Ukrainian input with no date - using today's date");
    return todayFormatted;
  }
  
  return todayFormatted; // Default to today if no date is found
}

// Simple fallback function for parsing without OpenAI
function simpleParse(text: string, projects: Project[], language: RecognitionLanguage = 'en-US'): ParsedTimeEntry | null {
  try {
    console.log(`Using simpleParse with language: ${language}, text: "${text}"`);
    const lowerText = text.toLowerCase();
    
    // Extract date
    const date = parseDate(text, language);
    console.log(`Parsed date: ${date}`);
    
    // Find hours - look for numbers followed by "hour(s)" or "h"
    let hoursRegex;
    if (language === 'uk-UA') {
      // Expanded Ukrainian hours pattern
      hoursRegex = /(\d+(?:[.,]\d+)?)\s*(годин|година|години|год|годину|г\.)/i;
    } else {
      hoursRegex = /(\d+(?:[.,]\d+)?)\s*(hour|hours|hr|hrs|h)/i;
    }
    
    let hours = 1; // Default
    const hoursMatch = text.match(hoursRegex);
    if (hoursMatch) {
      // Handle both dot and comma as decimal separators
      const hourStr = hoursMatch[1].replace(',', '.');
      hours = parseFloat(hourStr);
      console.log(`Found hours in text: ${hours}`);
    } else {
      // Try to find any number in the text
      const numMatch = text.match(/\d+(?:[.,]\d+)?/);
      if (numMatch) {
        const hourStr = numMatch[0].replace(',', '.');
        hours = parseFloat(hourStr);
        console.log(`No explicit hours mentioned, using number found in text: ${hours}`);
      } else {
        console.log(`No hours found in text, using default: ${hours}`);
      }
    }
    
    // Find project - check each project name in the text
    let projectName = '';
    let bestMatchLength = 0;
    
    for (const project of projects) {
      if (lowerText.includes(project.name.toLowerCase())) {
        // Use the longest matching project name to avoid substring matches
        if (project.name.length > bestMatchLength) {
          projectName = project.name;
          bestMatchLength = project.name.length;
        }
      }
    }
    
    // If no project found, use the first project
    if (!projectName && projects.length > 0) {
      projectName = projects[0].name;
      console.log(`No project found in text, using first project: ${projectName}`);
    } else {
      console.log(`Found project in text: ${projectName}`);
    }
    
    // Description is optional, only include if supported by database
    let description;
    
    // Remove project name, hours references, and date references
    if (language === 'uk-UA') {
      description = text
        .replace(new RegExp(projectName, 'gi'), '')
        .replace(/(\d+(?:[.,]\d+)?)\s*(годин|година|години|год|годину|г\.)/gi, '')
        .replace(/сьогодні|сьогодня|вчора|вчера|зараз|сегодня/gi, '')
        .replace(/\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})\b/g, '')
        .trim();
    } else {
      description = text
        .replace(new RegExp(projectName, 'gi'), '')
        .replace(/(\d+(?:[.,]\d+)?)\s*(hour|hours|hr|hrs|h)/gi, '')
        .replace(/today|yesterday|now/gi, '')
        .replace(/\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})\b/g, '')
        .trim();
    }
    
    // If description is too short, use a placeholder
    if (description.length < 3) {
      description = language === 'uk-UA' 
        ? `Робота над ${projectName}` 
        : `Work on ${projectName}`;
      console.log(`Description too short, using placeholder: "${description}"`);
    } else {
      console.log(`Extracted description: "${description}"`);
    }
    
    // Now include description field since DB supports it
    const result = {
      date,
      project_name: projectName,
      hours,
      description
    };
    
    console.log('SimpleParse result:', result);
    return result;
  } catch (e) {
    console.error('Error in simple parsing:', e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RequestBody = await request.json();
    const { text, projects, language = 'en-US' } = body;

    // Validate request data
    if (!text || !projects || !projects.length) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if API key is set in environment
    const apiKey = process.env.OPENAI_API_KEY;
    
    // If no API key, use fallback parser
    if (!apiKey) {
      console.log('No OpenAI API key found, using fallback parser');
      const parsedData = simpleParse(text, projects, language);
      
      if (!parsedData) {
        return NextResponse.json(
          { error: 'Failed to parse speech using fallback method' },
          { status: 422 }
        );
      }
      
      return NextResponse.json(parsedData);
    }

    try {
      // Try OpenAI parsing first
      const projectNames = projects.map(p => p.name).join(', ');
      
      // Create appropriate prompt based on language
      let prompt;
      
      if (language === 'uk-UA') {
        prompt = `
          Розпізнай наступний голосовий запис про роботу в структуровані дані з такими полями:
          - date: у форматі YYYY-MM-DD (використовуй сьогоднішню дату "${format(new Date(), 'yyyy-MM-dd')}" якщо користувач каже "сьогодні", "сьогодня", "зараз", "сегодня" або не вказує дату; використовуй вчорашню дату "${format(subDays(new Date(), 1), 'yyyy-MM-dd')}" якщо користувач каже "вчора" або "вчера"; для дат у форматі "20 березня" використовуй відповідну дату)
          - project_name: має відповідати одному з цих проектів: ${projectNames}
          - hours: числове значення відпрацьованих годин (може бути десяткове)
          - description: над чим працював

          Вхідний текст: "${text}"

          Важливо: для дат у форматі "20 березня" перетвори їх у формат YYYY-MM-DD, використовуючи поточний рік.
          Поверни ТІЛЬКИ валідний JSON об'єкт з полями вище, більше нічого.
        `;
      } else {
        prompt = `
          Parse the following spoken time entry into structured data with these fields:
          - date: in YYYY-MM-DD format (use today's date "${format(new Date(), 'yyyy-MM-dd')}" if the user says "today" or doesn't specify; use yesterday's date "${format(subDays(new Date(), 1), 'yyyy-MM-dd')}" if user says "yesterday"; for dates like "20th March" convert them to YYYY-MM-DD format using the current year)
          - project_name: must match one of these existing projects: ${projectNames}
          - hours: numerical value representing hours worked (can be decimal)
          - description: what work was done
          
          The input text is: "${text}"
          
          Important: For dates like "20th March", convert them to YYYY-MM-DD format using the current year.
          Return ONLY a valid JSON object with the fields above, nothing else.
        `;
      }
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { 
              role: 'system', 
              content: language === 'uk-UA' 
                ? 'Ви корисний асистент, який розпізнає голосові записи про час роботи в структуровані дані.'
                : 'You are a helpful assistant that parses spoken time entries into structured data.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.status}`);
      }
  
      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Extract JSON from the response
      const jsonMatch = content.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse OpenAI response as JSON');
      }
      
      const parsedData = JSON.parse(jsonMatch[0]) as ParsedTimeEntry;
      
      // Validate the parsed data
      if (!parsedData.date || !parsedData.project_name || !parsedData.hours) {
        throw new Error('Parsed data is missing required fields');
      }

      // Log the parsed data for debugging
      console.log('OpenAI parsed data:', parsedData);
      
      // Double-check the date parsing - if it has relative dates, ensure they're handled correctly
      if (language === 'uk-UA') {
        const lowerCaseText = text.toLowerCase();
        // Check for Ukrainian today references
        if (
          lowerCaseText.includes('сьогодні') || 
          lowerCaseText.includes('сьогодня') || 
          lowerCaseText.includes('зараз') ||
          lowerCaseText.includes('сегодня')
        ) {
          console.log("Force setting Ukrainian date to today");
          parsedData.date = format(new Date(), 'yyyy-MM-dd');
        } 
        // Check for Ukrainian yesterday references
        else if (
          lowerCaseText.includes('вчора') || 
          lowerCaseText.includes('вчера')
        ) {
          parsedData.date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        }
      } else {
        // For English, only override if explicitly mentioned
        const lowerCaseText = text.toLowerCase();
        if (lowerCaseText.includes('today')) {
          console.log("Explicit 'today' mentioned, setting date to today");
          parsedData.date = format(new Date(), 'yyyy-MM-dd');
        } else if (lowerCaseText.includes('yesterday')) {
          console.log("Explicit 'yesterday' mentioned, setting date to yesterday");
          parsedData.date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        } else {
          // For ordinal dates, ensure they're in the correct format
          const dateObj = new Date(parsedData.date);
          if (!isNaN(dateObj.getTime())) {
            console.log("Using parsed date from OpenAI:", parsedData.date);
          } else {
            console.log("Invalid date from OpenAI, falling back to simple parser");
            const simpleParsedData = simpleParse(text, projects, language);
            if (simpleParsedData) {
              parsedData.date = simpleParsedData.date;
            }
          }
        }
      }
      
      // Log the final date being used
      console.log("Final date being used:", parsedData.date);
      
      // Validate project name against actual projects
      const projectMatch = projects.find(p => 
        p.name.toLowerCase() === parsedData.project_name.toLowerCase()
      );
      
      if (!projectMatch) {
        throw new Error(`Project "${parsedData.project_name}" not found in your projects`);
      }
      
      // Return the validated data
      return NextResponse.json({
        date: parsedData.date,
        project_name: projectMatch.name,
        hours: parsedData.hours,
        description: parsedData.description || ''
      });
    } catch (openAIError) {
      // If OpenAI fails, fall back to simple parsing
      console.error('OpenAI parsing failed, using fallback parser:', openAIError);
      const parsedData = simpleParse(text, projects, language);
      
      if (!parsedData) {
        return NextResponse.json(
          { error: 'Failed to parse speech with both OpenAI and fallback method' },
          { status: 422 }
        );
      }
      
      return NextResponse.json(parsedData);
    }
  } catch (error) {
    console.error('Error processing speech text:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
