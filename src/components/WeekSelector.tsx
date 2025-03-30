'use client';

import React from 'react';
import { format } from 'date-fns';

interface WeekSelectorProps {
  currentWeekStart: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
}

export default function WeekSelector({ 
  currentWeekStart, 
  onPreviousWeek, 
  onNextWeek, 
  onCurrentWeek 
}: WeekSelectorProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPreviousWeek}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors"
          aria-label="Previous week"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-base font-medium text-gray-800">
          {format(currentWeekStart, 'MMM d')} - {format(new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
        </h2>
        
        <button
          onClick={onNextWeek}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors"
          aria-label="Next week"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <button
        onClick={onCurrentWeek}
        className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
      >
        Today
      </button>
    </div>
  );
} 
