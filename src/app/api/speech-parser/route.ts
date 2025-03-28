import { NextRequest, NextResponse } from 'next/server';
import { Project } from '@/lib/types';

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

export async function POST(request: NextRequest) {
  try {
    // Check if API key is set in environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured on server' },
        { status: 500 }
      );
    }

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

    const projectNames = projects.map(p => p.name).join(', ');
    
    const prompt = `
      Parse the following spoken time entry into structured data with these fields:
      - date: in YYYY-MM-DD format (use today's date if not specified)
      - project_name: must match one of these existing projects: ${projectNames}
      - hours: numerical value representing hours worked (can be decimal)
      - description: what work was done
      
      The input text is: "${text}"
      
      Return ONLY a valid JSON object with the fields above, nothing else.
    `;

    // Call OpenAI API
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
      return NextResponse.json(
        { error: `OpenAI API error: ${errorData.error?.message || response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Extract JSON from the response
    const jsonMatch = content.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse OpenAI response as JSON' },
        { status: 422 }
      );
    }
    
    const parsedData = JSON.parse(jsonMatch[0]) as ParsedTimeEntry;
    
    // Validate the parsed data
    if (!parsedData.date || !parsedData.project_name || !parsedData.hours || !parsedData.description) {
      return NextResponse.json(
        { error: 'Parsed data is missing required fields' },
        { status: 422 }
      );
    }
    
    // Validate project name against actual projects
    const projectMatch = projects.find(p => 
      p.name.toLowerCase() === parsedData.project_name.toLowerCase()
    );
    
    if (!projectMatch) {
      return NextResponse.json(
        { error: `Project "${parsedData.project_name}" not found in your projects` },
        { status: 422 }
      );
    }
    
    // Return the validated data
    return NextResponse.json({
      date: parsedData.date,
      project_name: projectMatch.name,
      hours: parsedData.hours,
      description: parsedData.description
    });
    
  } catch (error) {
    console.error('Error processing speech text:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 