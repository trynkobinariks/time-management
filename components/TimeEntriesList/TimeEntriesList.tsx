import { format } from 'date-fns';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import { useState, useEffect } from 'react';
import { TimeEntry } from '../../lib/types';
import TimeEntryItem from '../TimeEntryItem/TimeEntryItem';
import TimeEntryForm from '../TimeEntryForm';
import CreateButton from '../CreateButton';

interface Project {
  id: string;
  name: string;
  type: string;
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

  useEffect(() => {
    if (sortedTimeEntries.length > 0) {
      const mostRecentEntry = sortedTimeEntries[0];
      setHighlightedEntryId(mostRecentEntry.id);

      const timer = setTimeout(() => {
        setHighlightedEntryId(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [sortedTimeEntries.length, sortedTimeEntries[0]?.id]);

  // Get project name by ID
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : t('timeEntries.unknownProject');
  };

  // Get project type by ID
  const getProjectType = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.type : 'INTERNAL';
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntryId(entry.id);
  };

  const handleSave = (
    editedEntry:
      | TimeEntry
      | Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => {
    // Since we're in edit mode, we know this is a full TimeEntry
    onEditEntry(editedEntry as TimeEntry);
    setEditingEntryId(null);
  };

  const handleCancel = () => {
    setEditingEntryId(null);
    setIsCreating(false);
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

  return (
    <div className="bg-[var(--card-background)] rounded-lg shadow-sm lg:flex lg:flex-col">
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
          <div className="divide-y divide-[var(--card-border)] overflow-y-auto max-h-[45vh] lg:max-h-[30vh]">
            {sortedTimeEntries.map(entry => (
              <div
                key={entry.id}
                className={`transition-colors duration-300 ${
                  highlightedEntryId === entry.id
                    ? 'bg-[var(--card-border)]'
                    : ''
                }`}
              >
                <TimeEntryItem
                  entry={entry}
                  projectName={getProjectName(entry.project_id)}
                  projectType={getProjectType(entry.project_id)}
                  onEdit={handleEdit}
                  onDelete={onDeleteEntry}
                />
              </div>
            ))}
          </div>

          <div className="px-4 py-4 flex items-center justify-between bg-[var(--card-border)] border-t border-[var(--card-border)] rounded-b-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {t('timeEntries.totalHours')}
              </span>
            </div>

            <div className="flex-1"></div>

            <div className="flex items-center">
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                {sortedTimeEntries
                  .reduce((sum, entry) => sum + entry.hours, 0)
                  .toFixed(1)}{' '}
                {t('timeEntries.hours')}
              </span>
            </div>
          </div>
        </>
      )}

      {editingEntryId && (
        <TimeEntryForm
          mode="edit"
          entry={timeEntries.find(entry => entry.id === editingEntryId)!}
          projects={projects}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {isCreating && (
        <TimeEntryForm
          mode="create"
          selectedDate={selectedDate}
          projects={projects}
          onSave={handleCreateSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
