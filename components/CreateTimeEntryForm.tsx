import { useState } from 'react';
import { TimeEntry } from '../lib/types';
import { CloseIcon } from './icons';
import { useClientTranslation } from '../hooks/useClientTranslation';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
}

interface CreateTimeEntryFormProps {
  selectedDate: Date;
  projects: Project[];
  onSave: (
    entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => void;
  onCancel: () => void;
}

export default function CreateTimeEntryForm({
  selectedDate,
  projects,
  onSave,
  onCancel,
}: CreateTimeEntryFormProps) {
  const { t } = useClientTranslation();
  const [newEntry, setNewEntry] = useState({
    project_id: projects.length > 0 ? projects[0].id : '',
    hours: 1,
    description: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newEntry);
  };

  return (
    <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--card-background)] rounded-lg shadow-xl max-w-lg w-full mx-4 transform transition-all">
        <div className="px-6 py-4 border-b border-[var(--card-border)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-[var(--text-primary)]">
              {t('timeEntries.createEntry')}
            </h2>
            <button
              onClick={onCancel}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <CloseIcon />
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
                value={newEntry.project_id}
                onChange={e =>
                  setNewEntry({ ...newEntry, project_id: e.target.value })
                }
                className="block w-full rounded-md border-[var(--card-border)] shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-[var(--card-background)] text-[var(--text-primary)] sm:text-sm transition-colors px-3 py-2"
              >
                {projects.map(project => (
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
                  value={newEntry.hours}
                  onChange={e =>
                    setNewEntry({
                      ...newEntry,
                      hours: parseFloat(e.target.value),
                    })
                  }
                  className="block w-full rounded-md border-[var(--card-border)] shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-[var(--card-background)] text-[var(--text-primary)] sm:text-sm transition-colors px-3 py-2 pr-12"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-[var(--text-secondary)] sm:text-sm">
                    {newEntry.hours === 1
                      ? t('timeEntries.hour')
                      : t('timeEntries.hours')}
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
              value={newEntry.description || ''}
              onChange={e =>
                setNewEntry({ ...newEntry, description: e.target.value })
              }
              className="block w-full rounded-md border-[var(--card-border)] shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-[var(--card-background)] text-[var(--text-primary)] sm:text-sm transition-colors px-3 py-2"
              rows={3}
              placeholder={t('timeEntries.descriptionPlaceholder')}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--card-background)] border border-[var(--card-border)] rounded-md hover:bg-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
