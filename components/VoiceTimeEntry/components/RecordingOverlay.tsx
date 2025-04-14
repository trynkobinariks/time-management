import React from 'react';

interface RecordingOverlayProps {
  isListening: boolean;
}

const RecordingOverlay: React.FC<RecordingOverlayProps> = ({ isListening }) => {
  return (
    <div
      className={`fixed inset-0 z-[5] transition-all duration-500 ease-in-out pointer-events-none ${
        isListening ? 'bg-black/20 backdrop-blur-sm' : 'backdrop-blur-0'
      }`}
    />
  );
};

export default RecordingOverlay;
