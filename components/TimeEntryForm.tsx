'use client';

import { useState, useEffect } from 'react';
import { TimeEntry } from '../lib/types';
import { CloseIcon } from './icons';
import { useClientTranslation } from '../hooks/useClientTranslation';
import { format } from 'date-fns';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useProjectContext } from '../contexts/ProjectContext';

interface Project {
  id: string;
  name: string;
}

interface TimeEntryFormProps {
  mode: 'create' | 'edit';
  selectedDate?: Date;
  entry?: TimeEntry;
  projects: Project[];
  onSave: (
    entry:
      | Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>
      | TimeEntry,
  ) => void;
  onCancel: () => void;
}

export default function TimeEntryForm({
  mode,
  selectedDate,
  entry,
  projects,
  onSave,
  onCancel,
}: TimeEntryFormProps) {
  const { t } = useClientTranslation();
  const { settings } = useUserSettings();
  const { timeEntries } = useProjectContext();
  const [error, setError] = useState<string | null>(null);
  const [enforceLimit, setEnforceLimit] = useState<boolean>(true);

  // Initialize form data based on mode
  const [formData, setFormData] = useState({
    project_id: projects.length > 0 ? projects[0].id : '',
    hours: 1,
    description: '',
    date: selectedDate
      ? format(selectedDate, 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd'),
    ...(entry && mode === 'edit'
      ? {
          id: entry.id,
          created_at: entry.created_at,
          updated_at: entry.updated_at,
          user_id: entry.user_id,
        }
      : {}),
  });

  // Set form data from entry when editing
  useEffect(() => {
    if (mode === 'edit' && entry) {
      setFormData({
        project_id: entry.project_id,
        hours: entry.hours,
        description: entry.description || '',
        date: entry.date,
        id: entry.id,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
        user_id: entry.user_id,
      });
    }
  }, [mode, entry]);

  // Calculate total hours for the selected date
  const totalHoursForDate = timeEntries
    .filter(item => {
      const date =
        mode === 'create'
          ? selectedDate
            ? format(selectedDate, 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd')
          : entry?.date;

      // For edit mode, exclude the current entry from the total
      return item.date === date && (mode === 'create' || item.id !== entry?.id);
    })
    .reduce((sum, item) => sum + item.hours, 0);

  // Get daily hours limit from settings
  const dailyHoursLimit = settings?.working_hours_per_day || 8;

  // Calculate available hours (can be negative if already over limit)
  const availableHours = dailyHoursLimit - totalHoursForDate;

  const handleHoursChange = (value: number) => {
    // Enforce daily limit if enabled
    if (enforceLimit && totalHoursForDate + value > dailyHoursLimit) {
      // Cap the value at the available hours (or minimum 0.5)
      const maxAllowedHours = Math.max(0.5, availableHours);
      setFormData({ ...formData, hours: maxAllowedHours });
      setError(
        `${t('timeEntries.dailyLimitEnforced')} ${dailyHoursLimit}h. ${t('timeEntries.maxAllowed')} ${maxAllowedHours.toFixed(1)}h.`,
      );
    } else {
      setFormData({ ...formData, hours: value });

      // Clear previous error
      setError(null);

      // Show warning if exceeding limit but not enforcing
      if (!enforceLimit && totalHoursForDate + value > dailyHoursLimit) {
        setError(
          `${t('timeEntries.dailyLimitExceeded')} ${(totalHoursForDate + value).toFixed(1)}/${dailyHoursLimit}h (+${(totalHoursForDate + value - dailyHoursLimit).toFixed(1)}h overtime)`,
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final check - enforce limit if enabled
    if (enforceLimit && totalHoursForDate + formData.hours > dailyHoursLimit) {
      const maxAllowedHours = Math.max(0.5, availableHours);
      setFormData(prev => ({ ...prev, hours: maxAllowedHours }));
      return; // Prevent form submission
    }

    // Allow submission
    onSave(formData);
  };

  const toggleEnforceLimit = () => {
    const newEnforceState = !enforceLimit;
    setEnforceLimit(newEnforceState);

    // If enabling enforcement and current value would exceed limit, adjust it down
    if (
      newEnforceState &&
      totalHoursForDate + formData.hours > dailyHoursLimit
    ) {
      const maxAllowedHours = Math.max(0.5, availableHours);
      setFormData(prev => ({ ...prev, hours: maxAllowedHours }));
      setError(
        `${t('timeEntries.dailyLimitEnforced')} ${dailyHoursLimit}h. ${t('timeEntries.maxAllowed')} ${maxAllowedHours.toFixed(1)}h.`,
      );
    } else if (
      !newEnforceState &&
      totalHoursForDate + formData.hours > dailyHoursLimit
    ) {
      // If disabling enforcement but still over limit, show warning
      setError(
        `${t('timeEntries.dailyLimitExceeded')} ${(totalHoursForDate + formData.hours).toFixed(1)}/${dailyHoursLimit}h (+${(totalHoursForDate + formData.hours - dailyHoursLimit).toFixed(1)}h overtime)`,
      );
    } else {
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--card-background)] rounded-lg shadow-xl max-w-lg w-full mx-4 transform transition-all">
        <div className="px-6 py-4 border-b border-[var(--card-border)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-[var(--text-primary)]">
              {mode === 'create'
                ? t('timeEntries.createEntry')
                : t('timeEntries.editEntry')}
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
                value={formData.project_id}
                onChange={e =>
                  setFormData({ ...formData, project_id: e.target.value })
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
                  value={formData.hours}
                  onChange={e => handleHoursChange(parseFloat(e.target.value))}
                  className={`block w-full rounded-md shadow-sm focus:ring-blue-500 bg-[var(--card-background)] sm:text-sm transition-colors px-3 py-2 pr-12 ${error ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-[var(--card-border)] focus:border-blue-500 text-[var(--text-primary)]'}`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span
                    className={`sm:text-sm ${error ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}
                  >
                    {formData.hours === 1
                      ? t('timeEntries.hour')
                      : t('timeEntries.hours')}
                  </span>
                </div>
              </div>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                {t('timeEntries.dailyHoursInfo')} {totalHoursForDate.toFixed(1)}
                /{dailyHoursLimit}h (
                {Math.max(0, dailyHoursLimit - totalHoursForDate).toFixed(1)}h
                remaining)
              </p>
              <div className="mt-2 flex items-center">
                <input
                  id="enforce-limit"
                  type="checkbox"
                  checked={enforceLimit}
                  onChange={toggleEnforceLimit}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="enforce-limit"
                  className="ml-2 block text-xs text-[var(--text-secondary)]"
                >
                  {t('timeEntries.enforceDailyLimit')}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t('timeEntries.description')}
            </label>
            <textarea
              value={formData.description || ''}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
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
