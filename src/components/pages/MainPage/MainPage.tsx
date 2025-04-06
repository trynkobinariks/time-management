import VoiceTimeEntry from '@/components/VoiceTimeEntry/VoiceTimeEntry';
import TimeEntriesList from '@/components/TimeEntriesList';
import { useMainPage } from './useMainPage';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import Datepicker from './components/DatePicker/Datepicker';
import RecordButton from '@/components/VoiceTimeEntry/components/RecordButton';
import { useVoiceTimeEntry } from '@/components/VoiceTimeEntry/useVoiceTimeEntry';

const MainPage = () => {
  const { t } = useClientTranslation();
  const {
    projects,
    timeEntries,
    selectedDate,
    setSelectedDate,
    deleteTimeEntry,
    updateTimeEntry,
    days,
    selectedDateEntries,
    getMonthTranslation,
  } = useMainPage();

  // Use the voice entry hook
  const {
    isListening,
    isProcessing,
    handleStartListening,
    handleStopListening,
  } = useVoiceTimeEntry();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-32 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-[var(--text-primary)] text-center w-full lg:text-left lg:w-auto">
          {t('welcome.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* On mobile, TimeEntriesList comes first */}
        <div className="lg:col-span-7 order-2 lg:order-2">
          <TimeEntriesList
            selectedDate={selectedDate}
            timeEntries={selectedDateEntries}
            projects={projects}
            onDeleteEntry={deleteTimeEntry}
            onEditEntry={updateTimeEntry}
          />
        </div>

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

            <VoiceTimeEntry showRecordButton={false} />
          </div>
        </div>
      </div>

      {/* Fixed record button at the bottom center of the screen */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
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

export default MainPage;
