'use client';

import React, { useState } from 'react';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import HelpPopup from './HelpPopup';

export default function HelpButton() {
  const { t } = useClientTranslation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <button
        onClick={openPopup}
        className="fixed bottom-4 right-4 z-10 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        aria-label={t('help.button')}
      >
        ?
      </button>

      <HelpPopup isOpen={isPopupOpen} onClose={closePopup} />
    </>
  );
}
