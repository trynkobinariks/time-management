'use client';

import React, { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';

export default function WeeklyLimitsSettings() {
  const { internalHoursLimit, setInternalHoursLimit, weeklyLimits, setWeeklyLimit } = useProjectContext();
  const [isEditing, setIsEditing] = useState(false);
  const [newInternalLimit, setNewInternalLimit] = useState(internalHoursLimit);
  const [newWeeklyLimit, setNewWeeklyLimit] = useState(weeklyLimits[0]?.maxHours || 40);

  const handleSave = () => {
    // Update internal hours limit
    setInternalHoursLimit(newInternalLimit);
    
    // Update weekly limit for the current week
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setWeeklyLimit(now, newWeeklyLimit);
    
    setIsEditing(false);
  };

  if (!isEditing) {
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
            <span className="text-sm font-medium text-gray-800">{weeklyLimits[0]?.maxHours || 40} hrs/week</span>
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
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 