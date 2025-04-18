'use client';

import React from 'react';
import WeeklyProjectHours from '../WeeklyProjectHours';
import MonthlyProjectHours from '../MonthlyProjectHours';
import { PeriodType } from '../PeriodSwitcher';
import ProjectHoursDialog from '../ProjectHoursDialog/ProjectHoursDialog';

interface ProjectHoursWidgetProps {
  selectedDate: Date;
  isCompact?: boolean;
  periodType?: PeriodType;
}

export default function ProjectHoursWidget({
  selectedDate,
  isCompact = false,
  periodType = 'weekly', // Default to weekly if not provided
}: ProjectHoursWidgetProps) {
  return (
    <ProjectHoursDialog selectedDate={selectedDate}>
      <div>
        {periodType === 'weekly' ? (
          <WeeklyProjectHours
            key={`weekly-${selectedDate.toISOString()}`}
            selectedDate={selectedDate}
            isCompact={isCompact}
          />
        ) : (
          <MonthlyProjectHours
            key={`monthly-${selectedDate.toISOString()}`}
            selectedDate={selectedDate}
            isCompact={isCompact}
          />
        )}
      </div>
    </ProjectHoursDialog>
  );
}
