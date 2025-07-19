"use client";

import { useContext } from 'react';
import { I18nContext } from '@/lib/i18n';

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
