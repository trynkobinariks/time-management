import { format } from 'date-fns';
import { useClientTranslation } from '../hooks/useClientTranslation';
import { useState } from 'react';
import { TimeEntry } from '@/lib/types';

interface Project {
  id: string;
  name: string;
}

interface TimeEntriesListProps {
  selectedDate: Date;
  timeEntries: TimeEntry[];
  projects: Project[];
  onDeleteEntry: (id: string) => void;
  onEditEntry: (entry: TimeEntry) => void;
}

interface EditFormProps {
  entry: TimeEntry;
  projects: Project[];
  onSave: (entry: TimeEntry) => void;
  onCancel: () => void;
}

function EditForm({ entry, projects, onSave, onCancel }: EditFormProps) {
  const { t } = useClientTranslation();
  const [editedEntry, setEditedEntry] = useState(entry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedEntry);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card-background)] rounded-lg shadow-xl max-w-lg w-full mx-4 transform transition-all">
        <div className="px-6 py-4 border-b border-[var(--card-border)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-[var(--text-primary)]">
              {t('timeEntries.editEntry')}
            </h2>
            <button
              onClick={onCancel}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                {t('timeEntries.project')}
              </label>
              <select
                value={editedEntry.project_id}
                onChange={(e) => setEditedEntry({ ...editedEntry, project_id: e.target.value })}
                className="block w-full rounded-md border-[var(--card-border)] shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-[var(--card-background)] text-[var(--text-primary)] sm:text-sm transition-colors px-3 py-2"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                {t('timeEntries.hours')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={editedEntry.hours}
                  onChange={(e) => setEditedEntry({ ...editedEntry, hours: parseFloat(e.target.value) })}
                  className="block w-full rounded-md border-[var(--card-border)] shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-[var(--card-background)] text-[var(--text-primary)] sm:text-sm transition-colors px-3 py-2 pr-12"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-[var(--text-secondary)] sm:text-sm">
                    {editedEntry.hours === 1 ? t('timeEntries.hour') : t('timeEntries.hours')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t('timeEntries.description')}
            </label>
            <textarea
              value={editedEntry.description || ''}
              onChange={(e) => setEditedEntry({ ...editedEntry, description: e.target.value })}
              className="block w-full rounded-md border-[var(--card-border)] shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-[var(--card-background)] text-[var(--text-primary)] sm:text-sm transition-colors px-3 py-2"
              rows={3}
              placeholder={t('timeEntries.descriptionPlaceholder')}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--card-background)] border border-[var(--card-border)] rounded-md hover:bg-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TimeEntriesList({ selectedDate, timeEntries, projects, onDeleteEntry, onEditEntry }: TimeEntriesListProps) {
  const { t } = useClientTranslation();
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Get project name by ID
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : t('timeEntries.unknownProject');
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntryId(entry.id);
  };

  const handleSave = (editedEntry: TimeEntry) => {
    onEditEntry(editedEntry);
    setEditingEntryId(null);
  };

  const handleCancel = () => {
    setEditingEntryId(null);
  };

  return (
    <div className="bg-[var(--card-background)] rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-[var(--card-border)]">
        <h2 className="text-lg font-medium text-[var(--text-primary)]">
          {t('common.calendar.days.' + format(selectedDate, 'EEEE').toLowerCase())}, {t('common.calendar.months.' + format(selectedDate, 'MMMM').toLowerCase())} {format(selectedDate, 'd, yyyy')}
        </h2>
      </div>

      {timeEntries.length === 0 ? (
        <div className="px-6 py-4 text-center text-[var(--text-secondary)]">
          {t('timeEntries.noTimeEntriesForThisDate')}
        </div>
      ) : (
        <div className="divide-y divide-[var(--card-border)]">
          {timeEntries.map(entry => (
            <div key={entry.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    {getProjectName(entry.project_id)}
                  </h3>
                  {entry.description && (
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {entry.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                    {entry.hours} {entry.hours === 1 ? t('timeEntries.hour') : t('timeEntries.hours')}
                  </span>
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full cursor-pointer transition-colors"
                    aria-label="Edit entry"
                    title="Edit entry"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
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

          <div className="px-6 py-4 flex items-center justify-between bg-[var(--card-border)]">
            <div className="flex items-center space-x-4">
              <span className="w-8"></span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {t('timeEntries.totalHours')}
              </span>
            </div>

            <div className="flex-1 mx-8"></div>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                {timeEntries.reduce((sum, entry) => sum + entry.hours, 0).toFixed(1)} {t('timeEntries.hours')}
              </span>
              <span className="w-16"></span>
            </div>
          </div>
        </div>
      )}

      {editingEntryId && (
        <EditForm
          entry={timeEntries.find(entry => entry.id === editingEntryId)!}
          projects={projects}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
} 