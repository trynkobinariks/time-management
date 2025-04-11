import { TimeEntry } from '../../lib/types';
import { EditIcon, DeleteIcon } from '../icons';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import Badge from '../Badge';

interface TimeEntryItemProps {
  entry: TimeEntry;
  projectName: string;
  projectType: string;
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: string) => void;
}

const TimeEntryItem = ({
  entry,
  projectName,
  projectType,
  onEdit,
  onDelete,
}: TimeEntryItemProps) => {
  const { t } = useClientTranslation();

  return (
    <div className="pl-6 py-4 relative min-h-24">
      <div className="absolute top-2 right-2 flex flex-col space-x-1">
        <button
          onClick={() => onEdit(entry)}
          className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full cursor-pointer transition-colors"
          aria-label="Edit entry"
          title="Edit entry"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full cursor-pointer transition-colors"
          aria-label="Delete entry"
          title="Delete entry"
        >
          <DeleteIcon />
        </button>
      </div>
      <div className="flex justify-between items-start pr-12">
        <div>
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              {projectName}
            </h3>
            <div className="ml-2">
              <Badge
                variant={projectType}
                label={
                  projectType === 'internal'
                    ? t('projects.popup.typeInternal') || 'Internal'
                    : t('projects.popup.typeCommercial') || 'Commercial'
                }
              />
            </div>
          </div>
          {entry.description && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {entry.description}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
            {entry.hours}{' '}
            {entry.hours === 1 ? t('timeEntries.hour') : t('timeEntries.hours')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimeEntryItem;
