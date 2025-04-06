import { format } from 'date-fns';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import { useState } from 'react';
import { TimeEntry } from '@/lib/types';
import EditTimeEntryForm from '../EditTimeEntryForm';
import TimeEntryItem from '../TimeEntryItem/TimeEntryItem';

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

export default function TimeEntriesList({
  selectedDate,
  timeEntries,
  projects,
  onDeleteEntry,
  onEditEntry,
}: TimeEntriesListProps) {
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
          {t(
            'common.calendar.days.' +
              format(selectedDate, 'EEEE').toLowerCase(),
          )}
          ,{' '}
          {t(
            'common.calendar.months.' +
              format(selectedDate, 'MMMM').toLowerCase(),
          )}{' '}
          {format(selectedDate, 'd, yyyy')}
        </h2>
      </div>

      {timeEntries.length === 0 ? (
        <div className="px-6 py-4 text-center text-[var(--text-secondary)]">
          {t('timeEntries.noTimeEntriesForThisDate')}
        </div>
      ) : (
        <>
          <div className="divide-y divide-[var(--card-border)] overflow-y-auto max-h-[50vh]">
            {timeEntries.map(entry => (
              <TimeEntryItem
                key={entry.id}
                entry={entry}
                projectName={getProjectName(entry.project_id)}
                onEdit={handleEdit}
                onDelete={onDeleteEntry}
              />
            ))}
          </div>

          <div className="px-6 py-4 flex items-center justify-between bg-[var(--card-border)] border-t border-[var(--card-border)]">
            <div className="flex items-center space-x-4">
              <span className="w-8"></span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {t('timeEntries.totalHours')}
              </span>
            </div>

            <div className="flex-1 mx-8"></div>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                {timeEntries
                  .reduce((sum, entry) => sum + entry.hours, 0)
                  .toFixed(1)}{' '}
                {t('timeEntries.hours')}
              </span>
              <span className="w-16"></span>
            </div>
          </div>
        </>
      )}

      {editingEntryId && (
        <EditTimeEntryForm
          entry={timeEntries.find(entry => entry.id === editingEntryId)!}
          projects={projects}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
