'use client';

import React, { useState, useEffect } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';

const TOTAL_WEEKLY_HOURS_LIMIT = 40;

export default function WeeklyLimitsSettings() {
  const { internalHoursLimit, setInternalHoursLimit } = useProjectContext();
  const [isEditing, setIsEditing] = useState(false);
  const [newInternalLimit, setNewInternalLimit] = useState(internalHoursLimit);
  const [newWeeklyLimit, setNewWeeklyLimit] = useState(TOTAL_WEEKLY_HOURS_LIMIT - internalHoursLimit);
  const [error, setError] = useState<string | null>(null);

  // Validate total hours whenever limits change
  useEffect(() => {
    const total = newInternalLimit + newWeeklyLimit;
    if (total > TOTAL_WEEKLY_HOURS_LIMIT) {
      setError(`Total hours (${total}h) exceed the maximum of ${TOTAL_WEEKLY_HOURS_LIMIT}h`);
    } else {
      setError(null);
    }
  }, [newInternalLimit, newWeeklyLimit]);

  const handleSave = () => {
    const total = newInternalLimit + newWeeklyLimit;
    if (total > TOTAL_WEEKLY_HOURS_LIMIT) {
      return; // Don't save if total exceeds limit
    }

    // Update internal hours limit
    setInternalHoursLimit(newInternalLimit);
    setIsEditing(false);
  };

  if (!isEditing) {
    const totalHours = internalHoursLimit + (TOTAL_WEEKLY_HOURS_LIMIT - internalHoursLimit);
    
    return (
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Weekly Limits</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-gray-700 hover:text-gray-900 font-medium cursor-pointer transition-colors"
          >
            Edit Limits
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Internal Projects (Shared)</span>
            <span className="text-sm font-medium text-gray-800">{internalHoursLimit} hrs/week</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Default External Projects</span>
            <span className="text-sm font-medium text-gray-800">{TOTAL_WEEKLY_HOURS_LIMIT - internalHoursLimit} hrs/week</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">Total Weekly Hours</span>
            <span className="text-sm font-medium text-gray-800">
              {totalHours} / {TOTAL_WEEKLY_HOURS_LIMIT} hrs
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Edit Weekly Limits</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="internalLimit" className="block text-sm font-medium text-gray-700 mb-1">
            Internal Projects Limit (Shared)
          </label>
          <input
            type="number"
            id="internalLimit"
            value={newInternalLimit}
            onChange={(e) => setNewInternalLimit(Math.max(0, parseFloat(e.target.value) || 0))}
            min="0"
            step="0.5"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This limit is shared among all internal projects
          </p>
        </div>
        
        <div>
          <label htmlFor="weeklyLimit" className="block text-sm font-medium text-gray-700 mb-1">
            Default External Projects Limit
          </label>
          <input
            type="number"
            id="weeklyLimit"
            value={newWeeklyLimit}
            onChange={(e) => setNewWeeklyLimit(Math.max(0, parseFloat(e.target.value) || 0))}
            min="0"
            step="0.5"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This is the default weekly limit for all time tracking
          </p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-700">Total Weekly Hours</span>
          <span className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-800'}`}>
            {newInternalLimit + newWeeklyLimit} / {TOTAL_WEEKLY_HOURS_LIMIT} hrs
          </span>
        </div>
        
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
            {error}
          </p>
        )}
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={() => {
              setNewInternalLimit(internalHoursLimit);
              setNewWeeklyLimit(TOTAL_WEEKLY_HOURS_LIMIT - internalHoursLimit);
              setIsEditing(false);
              setError(null);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!!error}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors ${
              error ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 