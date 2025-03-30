import { format } from 'date-fns';
import { useClientTranslation } from '../hooks/useClientTranslation';
interface TimeEntry {
  id: string;
  project_id: string;
  date: string;
  hours: number;
  description?: string;
}

interface Project {
  id: string;
  name: string;
}

interface TimeEntriesListProps {
  selectedDate: Date;
  timeEntries: TimeEntry[];
  projects: Project[];
  onDeleteEntry: (id: string) => void;
}

export default function TimeEntriesList({ selectedDate, timeEntries, projects, onDeleteEntry }: TimeEntriesListProps) {
  const { t } = useClientTranslation();
  // Get project name by ID
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : t('timeEntries.unknownProject');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>

      {timeEntries.length === 0 ? (
        <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
          {t('timeEntries.noTimeEntriesForThisDate')}
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {timeEntries.map(entry => (
            <div key={entry.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {getProjectName(entry.project_id)}
                  </h3>
                  {entry.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {entry.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                    {entry.hours} {entry.hours === 1 ? 'hour' : 'hours'}
                  </span>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full cursor-pointer transition-colors"
                    aria-label="Delete entry"
                    title="Delete entry"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-4">
              <span className="w-8"></span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {t('timeEntries.totalHours')}
              </span>
            </div>

            <div className="flex-1 mx-8"></div>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {timeEntries.reduce((sum, entry) => sum + entry.hours, 0).toFixed(1)} hours
              </span>
              <span className="w-16"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 