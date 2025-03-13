'use client';

import React from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { formatReadableDate, getWeekStartDate, getWeekEndDate } from '@/lib/utils';

export default function WeekSelector() {
  const { selectedDate, setSelectedDate } = useProjectContext();
  
  const weekStart = getWeekStartDate(selectedDate);
  const weekEnd = getWeekEndDate(selectedDate);
  
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };
  
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };
  
  const goToCurrentWeek = () => {
    setSelectedDate(new Date());
  };
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={goToPreviousWeek}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Previous week"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-lg font-semibold text-gray-800">
          {formatReadableDate(weekStart)} - {formatReadableDate(weekEnd)}
        </h2>
        
        <button
          onClick={goToNextWeek}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Next week"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <button
        onClick={goToCurrentWeek}
        className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100"
      >
        Current Week
      </button>
    </div>
  );
} 