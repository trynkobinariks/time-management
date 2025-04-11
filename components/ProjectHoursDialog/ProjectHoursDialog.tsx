'use client';

import React from 'react';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogBody,
} from '@/components/ui/Dialog';
import WeeklyProjectHours from '@/components/WeeklyProjectHours';
import MonthlyProjectHours from '@/components/MonthlyProjectHours';
import ProjectTimeBreakdown from '@/components/ProjectTimeBreakdown';

// CSS Animations
const fadeAnimationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

interface ProjectHoursDialogProps {
  children: React.ReactNode;
  selectedDate: Date;
}

export default function ProjectHoursDialog({
  children,
  selectedDate,
}: ProjectHoursDialogProps) {
  const { t } = useClientTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <style jsx global>
        {fadeAnimationStyles}
      </style>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer w-full">{children}</div>
        </DialogTrigger>
        <DialogOverlay className="transition-all duration-300 ease-in-out opacity-100 data-[state=closed]:opacity-0" />
        <DialogContent className="!max-w-6xl transition-all duration-300 ease-in-out scale-100 opacity-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0">
          <DialogHeader className="mb-0">
            <DialogTitle className="text-lg sm:text-2xl">
              {t('dashboard.projectHoursDetails')}
            </DialogTitle>
          </DialogHeader>

          <DialogBody
            style={{
              animation: 'fadeIn 0.3s ease-in-out forwards',
            }}
          >
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {/* Hours Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Weekly Section */}
                <div className="bg-[var(--card-background)] rounded-lg p-2 sm:p-4 border border-[var(--card-border)] shadow-sm">
                  <h3 className="text-sm sm:text-lg font-medium text-[var(--text-primary)] mb-1 sm:mb-2">
                    {t('dashboard.weeklyHours')}
                  </h3>
                  <div className="w-full transform scale-[0.92] origin-top-left -ml-1.5 -mt-1">
                    <WeeklyProjectHours
                      key={`dialog-weekly-${selectedDate.toISOString()}`}
                      selectedDate={selectedDate}
                      isCompact={true}
                    />
                  </div>
                </div>

                {/* Monthly Section */}
                <div className="bg-[var(--card-background)] rounded-lg p-2 sm:p-4 border border-[var(--card-border)] shadow-sm">
                  <h3 className="text-sm sm:text-lg font-medium text-[var(--text-primary)] mb-1 sm:mb-2">
                    {t('dashboard.monthlyHours')}
                  </h3>
                  <div className="w-full transform scale-[0.92] origin-top-left -ml-1.5 -mt-1">
                    <MonthlyProjectHours
                      key={`dialog-monthly-${selectedDate.toISOString()}`}
                      selectedDate={selectedDate}
                      isCompact={true}
                    />
                  </div>
                </div>
              </div>

              {/* Project Breakdown Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Weekly Projects */}
                <div className="bg-[var(--card-background)] rounded-lg p-2 sm:p-4 border border-[var(--card-border)] shadow-sm">
                  <h3 className="text-sm sm:text-lg font-medium text-[var(--text-primary)] mb-1 sm:mb-2">
                    {t('projects.title')} - {t('dashboard.week')}
                  </h3>
                  <h4 className="text-xs text-[var(--text-secondary)] mb-2">
                    {t('dashboard.projectBreakdown')}
                  </h4>
                  <ProjectTimeBreakdown
                    selectedDate={selectedDate}
                    periodType="weekly"
                  />
                </div>

                {/* Monthly Projects */}
                <div className="bg-[var(--card-background)] rounded-lg p-2 sm:p-4 border border-[var(--card-border)] shadow-sm">
                  <h3 className="text-sm sm:text-lg font-medium text-[var(--text-primary)] mb-1 sm:mb-2">
                    {t('projects.title')} - {t('dashboard.month')}
                  </h3>
                  <h4 className="text-xs text-[var(--text-secondary)] mb-2">
                    {t('dashboard.projectBreakdown')}
                  </h4>
                  <ProjectTimeBreakdown
                    selectedDate={selectedDate}
                    periodType="monthly"
                  />
                </div>
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
