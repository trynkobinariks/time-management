'use client';

import { Project } from './types';
import { RecognitionLanguage } from './speechRecognition';

export interface ParsedTimeEntry {
  date: string; // YYYY-MM-DD format
  project_name: string;
  hours: number;
  description?: string; // Make description optional
}

export async function parseVoiceInput(
  text: string, 
  projects: Project[],
  language: RecognitionLanguage = 'en-US'
): Promise<ParsedTimeEntry | null> {
  if (!text || !projects.length) return null;
  
  try {
    const response = await fetch('/api/speech-parser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        projects,
        language
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error parsing voice input:', error);
    throw error;
  }
} 
