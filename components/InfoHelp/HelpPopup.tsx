'use client';

import React from 'react';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import {
  CloseIcon,
  TimeTrackingIcon,
  ProjectsIcon,
  VoiceEntryIcon,
  ReportsIcon,
  SettingsIcon,
} from '../icons';

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpPopup({ isOpen, onClose }: HelpPopupProps) {
  const { t } = useClientTranslation();

  if (!isOpen) return null;

  const sections = [
    {
      key: 'timeTracking',
      icon: <TimeTrackingIcon />,
    },
    {
      key: 'projects',
      icon: <ProjectsIcon />,
    },
    {
      key: 'voiceEntry',
      icon: <VoiceEntryIcon />,
    },
    {
      key: 'reports',
      icon: <ReportsIcon />,
    },
    {
      key: 'settings',
      icon: <SettingsIcon />,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--card-background)] rounded-lg shadow-xl p-4 sm:p-5 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl w-full mx-3 sm:mx-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
            {t('help.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            aria-label={t('help.close')}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {sections.map(section => (
            <div
              key={section.key}
              className="p-2 sm:p-3 border border-[var(--card-border)] rounded-md"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="text-blue-600 mt-0.5 flex-shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] text-sm sm:text-base mb-0.5 sm:mb-1">
                    {t(`help.sections.${section.key}.title`)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    {t(`help.sections.${section.key}.content`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-5 pt-2 border-t border-[var(--card-border)]">
          <button
            onClick={onClose}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            {t('help.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
