'use client';

import { useProjectContext } from '../../contexts/ProjectContext';
import { format } from 'date-fns';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import { useState, useMemo } from 'react';
import { TimeEntry, ProjectType } from '../../lib/types';
import TimeEntryItem from '../../components/TimeEntryItem/TimeEntryItem';
import TimeEntryForm from '../../components/TimeEntryForm';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../components/ui/Accordion';
import Badge from '../../components/Badge';
import { DeleteConfirmationProvider } from '../../components/ui/DeleteConfirmationProvider';

const ITEMS_PER_PAGE = 5;

export default function TimeEntriesPage() {
  const { timeEntries, projects, deleteTimeEntry, updateTimeEntry } =
    useProjectContext();
  const { t } = useClientTranslation();
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Group time entries by date and sort dates in descending order
  const entriesByDate = useMemo(() => {
    const groupedEntries = timeEntries.reduce(
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

    // Sort dates in descending order (newest first)
    return Object.fromEntries(
      Object.entries(groupedEntries).sort((a, b) => {
        return new Date(b[0]).getTime() - new Date(a[0]).getTime();
      }),
    );
  }, [timeEntries]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(Object.keys(entriesByDate).length / ITEMS_PER_PAGE);
  }, [entriesByDate]);

  // Get paginated entries
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return Object.entries(entriesByDate)
      .slice(startIndex, endIndex)
      .reduce(
        (acc, [date, entries]) => {
          acc[date] = entries;
          return acc;
        },
        {} as Record<string, typeof timeEntries>,
      );
  }, [entriesByDate, currentPage]);

  // Calculate summary statistics for each date
  const dateStats = useMemo(() => {
    return Object.entries(entriesByDate).reduce(
      (acc, [dateStr, entries]) => {
        const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
        const internalHours = entries.reduce((sum, entry) => {
          const project = projects.find(p => p.id === entry.project_id);
          return project?.type === ProjectType.INTERNAL
            ? sum + entry.hours
            : sum;
        }, 0);
        const commercialHours = totalHours - internalHours;

        acc[dateStr] = {
          totalHours,
          internalHours,
          commercialHours,
        };

        return acc;
      },
      {} as Record<
        string,
        { totalHours: number; internalHours: number; commercialHours: number }
      >,
    );
  }, [entriesByDate, projects]);

  const handleAccordionChange = (value: string[]) => {
    setOpenItems(value);
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
  };

  const handleSave = (
    updatedEntry:
      | TimeEntry
      | Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => {
    // Since we're in edit mode, we know this is a full TimeEntry
    updateTimeEntry(updatedEntry as TimeEntry);
    setEditingEntry(null);
  };

  const handleDelete = (id: string) => {
    deleteTimeEntry(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset open items when changing pages
    setOpenItems([]);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DeleteConfirmationProvider>
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
          <>
            <Accordion
              type="multiple"
              className="space-y-6"
              value={openItems}
              onValueChange={handleAccordionChange}
            >
              {Object.entries(paginatedEntries).map(([dateStr, entries]) => (
                <AccordionItem
                  key={dateStr}
                  value={dateStr}
                  className="border border-[var(--card-border)] rounded-md bg-[var(--card-background)] overflow-hidden transition-shadow duration-300 hover:shadow-md"
                >
                  <AccordionTrigger className="px-4 py-3 bg-[var(--card-border)] border-b border-[var(--card-border)] hover:no-underline cursor-pointer transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2">
                      <h2 className="text-base font-medium text-[var(--text-primary)] text-left">
                        {format(new Date(dateStr), 'EEEE, MMMM d, yyyy')}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                        {dateStats[dateStr]?.internalHours > 0 && (
                          <Badge
                            variant="internal"
                            label={`${dateStats[dateStr].internalHours} ${t('timeEntries.hours')}`}
                          />
                        )}
                        {dateStats[dateStr]?.commercialHours > 0 && (
                          <Badge
                            variant="commercial"
                            label={`${dateStats[dateStr].commercialHours} ${t('timeEntries.hours')}`}
                          />
                        )}
                        <span className="text-sm text-[var(--text-secondary)]">
                          {dateStats[dateStr].totalHours}{' '}
                          {dateStats[dateStr].totalHours === 1
                            ? t('timeEntries.hour')
                            : t('timeEntries.hours')}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 transition-all will-change-[height]">
                    <div className="divide-y divide-[var(--card-border)]">
                      {entries.map(entry => {
                        const project = projects.find(
                          p => p.id === entry.project_id,
                        );
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
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-[var(--card-border)] bg-[var(--card-background)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Previous page"
                  >
                    &laquo;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-[var(--card-border)] bg-[var(--card-background)] text-[var(--text-primary)] cursor-pointer'
                        }`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-[var(--card-border)] bg-[var(--card-background)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Next page"
                  >
                    &raquo;
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Edit Form */}
        {editingEntry && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[var(--card-background)] rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-[var(--text-primary)]">
                  {t('timeEntries.editEntry')}
                </h2>
                <button
                  onClick={() => setEditingEntry(null)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label={t('common.close')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <TimeEntryForm
                mode="edit"
                entry={editingEntry}
                projects={projects}
                onSave={handleSave}
                onCancel={() => setEditingEntry(null)}
              />
            </div>
          </div>
        )}
      </div>
    </DeleteConfirmationProvider>
  );
}
