'use client';

import React from 'react';
import { useClientTranslation } from '../hooks/useClientTranslation';

interface WelcomePopupProps {
  onClose: () => void;
}

export default function WelcomePopup({ onClose }: WelcomePopupProps) {
  const { t } = useClientTranslation();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="welcome-popup-content bg-white rounded-md shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">
            {t('welcome.title')}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label={t('common.close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            {t('welcome.description')}
          </p>
          
          <h3 className="font-medium text-gray-800">{t('welcome.features')}</h3>
          
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>{t('welcome.featuresList.trackHours')}</li>
            <li>{t('welcome.featuresList.setLimits')}</li>
            <li>{t('welcome.featuresList.visualize')}</li>
            <li>{t('welcome.featuresList.manageAllocations')}</li>
            <li>{t('welcome.featuresList.generateReports')}</li>
          </ul>
          
          <p className="text-gray-600">
            {t('welcome.getStarted')}
          </p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
} 
