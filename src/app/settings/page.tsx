'use client';

import React, { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { formatReadableDate, getWeekStartDate } from '@/lib/utils';

export default function Settings() {
  const { 
    dailyLimits, 
    weeklyLimits, 
    setDailyLimit, 
    setWeeklyLimit,
    selectedDate
  } = useProjectContext();
  
  const today = new Date();
  const weekStartDate = getWeekStartDate(selectedDate);
  
  // Find current limits
  const currentDailyLimit = dailyLimits.find(
    limit => limit.date.toDateString() === today.toDateString()
  );
  
  const currentWeeklyLimit = weeklyLimits.find(
    limit => limit.weekStartDate.toDateString() === weekStartDate.toDateString()
  );
  
  // Form state
  const [dailyHours, setDailyHours] = useState(
    currentDailyLimit?.maxHours.toString() || '8'
  );
  
  const [weeklyHours, setWeeklyHours] = useState(
    currentWeeklyLimit?.maxHours.toString() || '40'
  );
  
  // Handle form submissions
  const handleDailyLimitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(dailyHours);
    if (!isNaN(hours) && hours > 0) {
      setDailyLimit(today, hours);
      alert('Daily limit updated successfully!');
    }
  };
  
  const handleWeeklyLimitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(weeklyHours);
    if (!isNaN(hours) && hours > 0) {
      setWeeklyLimit(weekStartDate, hours);
      alert('Weekly limit updated successfully!');
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your time tracking preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Hours Limit */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Hours Limit</h2>
          <p className="text-sm text-gray-500 mb-4">
            Set the maximum number of hours you want to work per day.
            This helps you maintain a healthy work-life balance.
          </p>
          
          <form onSubmit={handleDailyLimitSubmit} className="space-y-4">
            <div>
              <label htmlFor="dailyHours" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Hours for {formatReadableDate(today)}
              </label>
              <input
                type="number"
                id="dailyHours"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                min="1"
                max="24"
                step="0.5"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Current limit: {currentDailyLimit?.maxHours || 8} hours
              </p>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Update Daily Limit
            </button>
          </form>
        </div>
        
        {/* Weekly Hours Limit */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Hours Limit</h2>
          <p className="text-sm text-gray-500 mb-4">
            Set the maximum number of hours you want to work per week.
            This helps you plan your workload across projects.
          </p>
          
          <form onSubmit={handleWeeklyLimitSubmit} className="space-y-4">
            <div>
              <label htmlFor="weeklyHours" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Hours for Week of {formatReadableDate(weekStartDate)}
              </label>
              <input
                type="number"
                id="weeklyHours"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value)}
                min="1"
                max="168"
                step="1"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Current limit: {currentWeeklyLimit?.maxHours || 40} hours
              </p>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Update Weekly Limit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 