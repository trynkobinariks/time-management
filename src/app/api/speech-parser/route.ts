import { NextRequest, NextResponse } from 'next/server';
import { Project } from '@/lib/types';
import { format, subDays } from 'date-fns';

interface ParsedTimeEntry {
  date: string;
  project_name: string;
  hours: number;
  description: string;
}

interface RequestBody {
  text: string;
  projects: Project[];
}

// Function to handle date extraction with fallback to simple parsing for common terms
function parseDate(text: string): string {
  // Default to today if OpenAI fails or we're in fallback mode
  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');
  
  // Check for common date references without needing AI
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('today') || lowerText.includes(' now ')) {
    return todayFormatted;
  }
  
  if (lowerText.includes('yesterday')) {
    const yesterday = subDays(today, 1);
    return format(yesterday, 'yyyy-MM-dd');
  }
  
  // Try to find date patterns like MM/DD/YYYY or YYYY-MM-DD
  const dateRegex = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/;
  const match = text.match(dateRegex);
  
  if (match) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_fullMatch, month, day, year] = match;
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
  
  return todayFormatted; // Default to today if no date is found
}

// Simple fallback function for parsing without OpenAI
function simpleParse(text: string, projects: Project[]): ParsedTimeEntry | null {
  try {
    const lowerText = text.toLowerCase();
    
    // Extract date
    const date = parseDate(text);
    
    // Find hours - look for numbers followed by "hour(s)" or "h"
    const hoursRegex = /(\d+(\.\d+)?)\s*(hour|hours|hr|hrs|h)/i;
    const hoursMatch = text.match(hoursRegex);
    const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 1; // Default to 1 hour if not specified
    
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
    }
    
    // Description is everything else
    // Remove project name, hours references, and date references for cleaner description
    let description = text
      .replace(new RegExp(projectName, 'gi'), '')
      .replace(/(\d+(\.\d+)?)\s*(hour|hours|hr|hrs|h)/gi, '')
      .replace(/today|yesterday|now/gi, '')
      .replace(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g, '')
      .trim();
    
    // If description is too short, use a placeholder
    if (description.length < 3) {
      description = `Work on ${projectName}`;
    }
    
    return {
      date,
      project_name: projectName,
      hours,
      description
    };
  } catch (e) {
    console.error('Error in simple parsing:', e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RequestBody = await request.json();
    const { text, projects } = body;

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
      const parsedData = simpleParse(text, projects);
      
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
      
      const prompt = `
        Parse the following spoken time entry into structured data with these fields:
        - date: in YYYY-MM-DD format (use today's date if the user says "today" or doesn't specify)
        - project_name: must match one of these existing projects: ${projectNames}
        - hours: numerical value representing hours worked (can be decimal)
        - description: what work was done
        
        The input text is: "${text}"
        
        Return ONLY a valid JSON object with the fields above, nothing else.
      `;
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that parses spoken time entries into structured data.' },
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
      if (!parsedData.date || !parsedData.project_name || !parsedData.hours || !parsedData.description) {
        throw new Error('Parsed data is missing required fields');
      }
      
      // Double-check the date parsing - if it has relative dates, ensure they're handled correctly
      if (text.toLowerCase().includes('today')) {
        parsedData.date = format(new Date(), 'yyyy-MM-dd');
      } else if (text.toLowerCase().includes('yesterday')) {
        parsedData.date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      }
      
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
        description: parsedData.description
      });
    } catch (openAIError) {
      // If OpenAI fails, fall back to simple parsing
      console.error('OpenAI parsing failed, using fallback parser:', openAIError);
      const parsedData = simpleParse(text, projects);
      
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