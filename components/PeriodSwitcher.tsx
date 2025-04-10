import React from 'react';
import { useClientTranslation } from '../hooks/useClientTranslation';

export type PeriodType = 'weekly' | 'monthly';

interface PeriodSwitcherProps {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  disabled?: boolean;
}

export default function PeriodSwitcher({
  period,
  setPeriod,
  disabled = false,
}: PeriodSwitcherProps) {
  const { t } = useClientTranslation();

  return (
    <div className="relative inline-flex rounded-2xl border border-[var(--card-border)] p-1 bg-[var(--card-border)] shadow-inner">
      <div
        className={`absolute h-[calc(100%-8px)] w-[calc(50%-3px)] bg-[var(--card-background)] rounded-xl shadow-sm transition-all duration-300 ease-in-out ${
          period === 'monthly' ? 'translate-x-[94%]' : ''
        }`}
      />
      <button
        type="button"
        onClick={() => setPeriod('weekly')}
        className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
          period === 'weekly'
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        disabled={disabled}
      >
        {t('dashboard.week')}
      </button>
      <button
        type="button"
        onClick={() => setPeriod('monthly')}
        className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
          period === 'monthly'
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        disabled={disabled}
      >
        {t('dashboard.month')}
      </button>
    </div>
  );
}
