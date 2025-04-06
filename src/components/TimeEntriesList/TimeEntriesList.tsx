import { format } from 'date-fns';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import { useState, useEffect } from 'react';
import { TimeEntry } from '@/lib/types';
import EditTimeEntryForm from '../EditTimeEntryForm';
import TimeEntryItem from '../TimeEntryItem/TimeEntryItem';
import CreateTimeEntryForm from '../CreateTimeEntryForm';
import CreateButton from '../CreateButton';

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
  onCreateEntry: (
    entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => void;
}

export default function TimeEntriesList({
  selectedDate,
  timeEntries,
  projects,
  onDeleteEntry,
  onEditEntry,
  onCreateEntry,
}: TimeEntriesListProps) {
  const { t } = useClientTranslation();
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [highlightedEntryId, setHighlightedEntryId] = useState<string | null>(
    null,
  );

  // Sort time entries by created_at (most recent first)
  const sortedTimeEntries = [...timeEntries].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // Highlight the most recent entry for 3 seconds
  useEffect(() => {
    if (sortedTimeEntries.length > 0) {
      const mostRecentEntry = sortedTimeEntries[0];
      setHighlightedEntryId(mostRecentEntry.id);

      const timer = setTimeout(() => {
        setHighlightedEntryId(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sortedTimeEntries.length, sortedTimeEntries[0]?.id,]);

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

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleCreateSave = (
    newEntry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => {
    onCreateEntry(newEntry);
    setIsCreating(false);
  };

  const handleCreateCancel = () => {
    setIsCreating(false);
  };

  return (
    <div className="bg-[var(--card-background)] rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-[var(--card-border)] flex justify-between items-center">
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
        <CreateButton
          onClick={handleCreate}
          variant="icon"
          label={t('timeEntries.addTimeEntry')}
        />
      </div>

      {sortedTimeEntries.length === 0 ? (
        <div className="px-6 py-4 text-center text-[var(--text-secondary)]">
          {t('timeEntries.noTimeEntriesForThisDate')}
        </div>
      ) : (
        <>
          <div className="divide-y divide-[var(--card-border)] overflow-y-auto max-h-[50vh]">
            {sortedTimeEntries.map(entry => (
              <div
                key={entry.id}
                className={`transition-colors duration-300 ${
                  highlightedEntryId === entry.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                <TimeEntryItem
                  entry={entry}
                  projectName={getProjectName(entry.project_id)}
                  onEdit={handleEdit}
                  onDelete={onDeleteEntry}
                />
              </div>
            ))}
          </div>

          <div className="px-6 py-4 flex items-center justify-between bg-[var(--card-border)] border-t border-[var(--card-border)] rounded-b-lg">
            <div className="flex items-center space-x-4">
              <span className="w-8"></span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {t('timeEntries.totalHours')}
              </span>
            </div>

            <div className="flex-1 mx-8"></div>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                {sortedTimeEntries
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

      {isCreating && (
        <CreateTimeEntryForm
          selectedDate={selectedDate}
          projects={projects}
          onSave={handleCreateSave}
          onCancel={handleCreateCancel}
        />
      )}
    </div>
  );
}
