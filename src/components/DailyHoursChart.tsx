'use client';

import React from 'react';
import { DailySummary } from '@/lib/types';
import { formatReadableDate } from '@/lib/utils';

interface DailyHoursChartProps {
  dailySummaries: DailySummary[];
}

export default function DailyHoursChart({ dailySummaries }: DailyHoursChartProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Hours</h3>
      
      <div className="grid grid-cols-7 gap-2">
        {dailySummaries.map((day) => {
          const isToday = day.date.toDateString() === today.toDateString();
          const isPast = day.date < today;
          
          // Calculate percentage of daily limit
          const percentUsed = Math.min(100, Math.round((day.totalHoursWorked / day.maxHours) * 100));
          
          // Determine bar color based on percentage
          let barColor = 'bg-primary-500';
          if (percentUsed > 90) {
            barColor = 'bg-red-500';
          } else if (percentUsed > 75) {
            barColor = 'bg-amber-500';
          }
          
          return (
            <div 
              key={day.date.toISOString()} 
              className={`flex flex-col items-center p-2 rounded-md ${
                isToday ? 'bg-primary-50 border border-primary-200' : ''
              }`}
            >
              <span className="text-xs font-medium text-gray-500 mb-1">
                {formatReadableDate(day.date).split(',')[0]}
              </span>
              
              <div className="w-full h-24 bg-gray-100 rounded-md relative mb-1">
                <div 
                  className={`absolute bottom-0 left-0 right-0 ${barColor} rounded-md transition-all duration-300`}
                  style={{ height: `${percentUsed}%` }}
                />
                
                {/* Daily limit indicator */}
                <div className="absolute w-full border-t border-dashed border-gray-400 z-10" style={{ top: '0%' }} />
              </div>
              
              <span className="text-xs font-semibold text-gray-700">
                {day.totalHoursWorked}/{day.maxHours}h
              </span>
              
              <span className="text-xs text-gray-500 mt-1">
                {isPast && day.totalHoursWorked === 0 ? 'Missed' : ''}
                {isToday ? 'Today' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 