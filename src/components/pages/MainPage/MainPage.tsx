import VoiceTimeEntry from '@/components/VoiceTimeEntry/VoiceTimeEntry';
import TimeEntriesList from '@/components/TimeEntriesList/TimeEntriesList';
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative flex flex-col h-[calc(100vh-64px-54px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-[var(--text-primary)] text-center w-full lg:text-left lg:w-auto">
          {t('welcome.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
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

        <div className="lg:col-span-5 order-1 lg:order-1">
          <div className="grid grid-cols-1 gap-6">
            <VoiceTimeEntry showRecordButton={false} />
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

export default MainPage;
