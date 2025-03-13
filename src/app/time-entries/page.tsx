'use client';

import { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import TimeEntryForm from '@/components/TimeEntryForm';
import { format } from 'date-fns';

export default function TimeEntriesPage() {
  const { timeEntries, projects, deleteTimeEntry } = useProjectContext();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      deleteTimeEntry(entryId);
    }
  };

  // Sort entries by date (newest first)
  const sortedEntries = [...timeEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group entries by date
  const entriesByDate = sortedEntries.reduce((acc, entry) => {
    const dateStr = format(new Date(entry.date), 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(entry);
    return acc;
  }, {} as Record<string, typeof timeEntries>);

  // Get project name by ID
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Time Entries</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors"
        >
          Add Time Entry
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-white">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Add Time Entry</h2>
          <TimeEntryForm 
            onSuccess={handleFormSuccess} 
            onCancel={handleFormCancel} 
          />
        </div>
      )}

      {Object.keys(entriesByDate).length === 0 && !showAddForm ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No time entries yet. Add your first entry to get started.</p>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors"
          >
            Add Time Entry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(entriesByDate).map(([dateStr, entries]) => (
            <div key={dateStr} className="border border-gray-200 rounded-md bg-white overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">
                  {format(new Date(dateStr), 'EEEE, MMMM d, yyyy')}
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {entries.map(entry => (
                  <div key={entry.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          {getProjectName(entry.projectId)}
                        </h3>
                        {entry.notes && (
                          <p className="mt-1 text-sm text-gray-600">{entry.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-4">
                          {entry.hours} {entry.hours === 1 ? 'hour' : 'hours'}
                        </span>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                          aria-label="Delete entry"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 