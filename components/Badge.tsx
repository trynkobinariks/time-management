import React from 'react';
import { ProjectType } from '../lib/types';

type BadgeVariant = 'internal' | 'commercial' | 'custom';

interface BadgeProps {
  variant: BadgeVariant | string;
  label: string;
  customColors?: string;
  size?: 'sm' | 'md';
}

export default function Badge({
  variant,
  label,
  customColors,
  size = 'sm',
}: BadgeProps) {
  const getStyles = () => {
    if (customColors) return customColors;

    switch (variant) {
      case 'internal':
      case ProjectType.INTERNAL:
        return 'bg-[var(--badge-internal-bg)] text-[var(--badge-internal-text)]';
      case 'commercial':
      case ProjectType.COMMERCIAL:
        return 'bg-[var(--badge-commercial-bg)] text-[var(--badge-commercial-text)]';
      default:
        return 'bg-[var(--badge-default-bg)] text-[var(--badge-default-text)]';
    }
  };

  const sizeStyles =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeStyles} font-medium ${getStyles()}`}
    >
      {label}
    </span>
  );
}
