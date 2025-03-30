'use client';

import { useProjectContext } from '@/contexts/ProjectContext';
import { format } from 'date-fns';
import { useClientTranslation } from '@/hooks/useClientTranslation';
export default function TimeEntriesPage() {
  const { timeEntries, projects, deleteTimeEntry } = useProjectContext();
  const { t } = useClientTranslation();

  // Group time entries by date
  const entriesByDate = timeEntries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof timeEntries>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-800">{t('header.nav.timeEntries')}</h1>
      </div>

      {Object.keys(entriesByDate).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">{t('timeEntries.noTimeEntries')}</p>
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
                {entries.map((entry) => (
                  <div key={entry.id} className="px-4 py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {projects.find(p => p.id === entry.project_id)?.name || t('timeEntries.unknownProject')}
                        </h3>
                        {entry.description && (
                          <p className="mt-1 text-sm text-gray-600">
                            {entry.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">
                          {entry.hours} {entry.hours === 1 ? t('timeEntries.hour') : t('timeEntries.hours')}
                        </span>
                        <button
                          onClick={() => deleteTimeEntry(entry.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full cursor-pointer transition-colors"
                          aria-label={t('timeEntries.deleteEntry')}
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
