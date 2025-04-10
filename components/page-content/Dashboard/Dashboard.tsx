import TimeEntriesList from '../../TimeEntriesList/TimeEntriesList';
import { useMainPage } from './useMainPage';
import { useClientTranslation } from '../../../hooks/useClientTranslation';
import Datepicker from './components/DatePicker/Datepicker';
import RecordButton from '../../VoiceTimeEntry/components/RecordButton';
import { useVoiceTimeEntry } from '../../VoiceTimeEntry/useVoiceTimeEntry';
import ProjectHoursWidget from '../../ProjectHoursWidget';
import PeriodSwitcher, { PeriodType } from '../../PeriodSwitcher';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { t } = useClientTranslation();
  const [periodType, setPeriodType] = useState<PeriodType>('weekly');

  const {
    projects,
    timeEntries,
    selectedDate,
    setSelectedDate,
    deleteTimeEntry,
    updateTimeEntry,
    addTimeEntry,
    days,
    selectedDateEntries,
    getMonthTranslation,
  } = useMainPage();

  const {
    isListening,
    isProcessing,
    handleStartListening,
    handleStopListening,
  } = useVoiceTimeEntry();

  // Persist and restore periodType from localStorage
  useEffect(() => {
    // Get saved period type when component mounts
    const savedPeriodType = localStorage.getItem('dashboardPeriodType');
    if (savedPeriodType === 'weekly' || savedPeriodType === 'monthly') {
      setPeriodType(savedPeriodType as PeriodType);
    }
  }, []);

  // Save periodType to localStorage when it changes
  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriodType(newPeriod);
    localStorage.setItem('dashboardPeriodType', newPeriod);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative flex flex-col h-[calc(100vh-64px-54px)]">
      <div className="flex flex-col mb-6 space-y-3">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center sm:px-4">
            <h1 className="text-xl font-medium text-[var(--text-primary)]">
              {t('welcome.title')}
            </h1>
            <PeriodSwitcher
              period={periodType}
              setPeriod={handlePeriodChange}
            />
          </div>
          <div className="mt-2 lg:mt-0 w-full">
            <ProjectHoursWidget
              selectedDate={selectedDate}
              isCompact={true}
              periodType={periodType}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow pb-20 lg:pb-16">
        <div className="lg:col-span-5 order-1 lg:order-1">
          <div className="grid grid-cols-1 gap-6">
            <Datepicker
              t={t}
              getMonthTranslation={getMonthTranslation}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              days={days}
              timeEntries={timeEntries}
            />
          </div>
        </div>

        <div className="lg:col-span-7 order-2 lg:order-2 flex flex-col mb-40 lg:mb-0">
          <TimeEntriesList
            selectedDate={selectedDate}
            timeEntries={selectedDateEntries}
            projects={projects}
            onDeleteEntry={deleteTimeEntry}
            onEditEntry={updateTimeEntry}
            onCreateEntry={addTimeEntry}
          />
        </div>
      </div>

      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <RecordButton
          isListening={isListening}
          isProcessing={isProcessing}
          handleStartListening={handleStartListening}
          handleStopListening={handleStopListening}
        />
      </div>
    </div>
  );
};

export default Dashboard;
