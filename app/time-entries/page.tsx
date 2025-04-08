'use client';

import { useProjectContext } from '../../contexts/ProjectContext';
import { format } from 'date-fns';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import { useState } from 'react';
import { TimeEntry } from '../../lib/types';
import TimeEntryItem from '../../components/TimeEntryItem/TimeEntryItem';
import EditTimeEntryForm from '../../components/EditTimeEntryForm';

export default function TimeEntriesPage() {
  const { timeEntries, projects, deleteTimeEntry, updateTimeEntry } =
    useProjectContext();
  const { t } = useClientTranslation();
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  // Group time entries by date
  const entriesByDate = timeEntries.reduce(
    (acc, entry) => {
      const date = entry.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    },
    {} as Record<string, typeof timeEntries>,
  );

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
  };

  const handleSave = (updatedEntry: TimeEntry) => {
    updateTimeEntry(updatedEntry);
    setEditingEntry(null);
  };

  const handleDelete = (id: string) => {
    deleteTimeEntry(id);
  };

  return (
    <div className="container mx-auto px-4 py-8 time-entries-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-[var(--text-primary)]">
          {t('header.nav.timeEntries')}
        </h1>
      </div>

      {Object.keys(entriesByDate).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)] mb-4">
            {t('timeEntries.noTimeEntries')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(entriesByDate).map(([dateStr, entries]) => (
            <div
              key={dateStr}
              className="border border-[var(--card-border)] rounded-md bg-[var(--card-background)] overflow-hidden"
            >
              <div className="px-4 py-3 bg-[var(--card-border)] border-b border-[var(--card-border)]">
                <h2 className="text-base font-medium text-[var(--text-primary)]">
                  {format(new Date(dateStr), 'EEEE, MMMM d, yyyy')}
                </h2>
              </div>
              <div className="divide-y divide-[var(--card-border)]">
                {entries.map(entry => {
                  const project = projects.find(p => p.id === entry.project_id);
                  return (
                    <TimeEntryItem
                      key={entry.id}
                      entry={entry}
                      projectName={
                        project?.name || t('timeEntries.unknownProject')
                      }
                      projectType={project?.type || 'INTERNAL'}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEntry && (
        <EditTimeEntryForm
          entry={editingEntry}
          projects={projects}
          onSave={handleSave}
          onCancel={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
}
