import { PlusIcon } from './icons';
import { useClientTranslation } from '@/hooks/useClientTranslation';

interface CreateButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'icon' | 'text' | 'both';
  className?: string;
}

export default function CreateButton({
  onClick,
  label,
  variant = 'both',
  className = '',
}: CreateButtonProps) {
  const { t } = useClientTranslation();
  const buttonLabel = label || t('common.create');

  switch (variant) {
    case 'icon':
      return (
        <button
          onClick={onClick}
          className={`w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${className}`}
          aria-label={buttonLabel}
          title={buttonLabel}
        >
          <PlusIcon />
        </button>
      );
    case 'text':
      return (
        <button
          onClick={onClick}
          className={`px-4 py-2 text-sm font-medium text-[var(--background)] bg-[var(--text-primary)] rounded-md hover:bg-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--card-border)] cursor-pointer transition-colors active:bg-[var(--card-border)] touch-action-manipulation ${className}`}
          aria-label={buttonLabel}
          role="button"
        >
          {buttonLabel}
        </button>
      );
    case 'both':
    default:
      return (
        <button
          onClick={onClick}
          className={`px-4 py-2 text-sm font-medium text-[var(--background)] bg-[var(--text-primary)] rounded-md hover:bg-[var(--card-border)] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--card-border)] cursor-pointer transition-colors active:bg-[var(--card-border)] touch-action-manipulation ${className}`}
          aria-label={buttonLabel}
          role="button"
        >
          <PlusIcon className="w-4 h-4" />
          {buttonLabel}
        </button>
      );
  }
}
