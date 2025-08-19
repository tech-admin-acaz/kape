"use client";

import React, { createContext, useState, useCallback, useMemo } from 'react';
import en from '@/content/locales/en.json';
import pt from '@/content/locales/pt.json';

type Locale = 'en' | 'pt';
type Translations = typeof en;

const translations: Record<Locale, Translations> = { en, pt };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Translations, ...args: (string | number)[]) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('pt');

  const t = useCallback((key: keyof Translations, ...args: (string | number)[]) => {
    let translation = translations[locale][key] || translations['en'][key] || key;
    if (args.length > 0) {
      args.forEach((arg, index) => {
        translation = translation.replace(`{${index}}`, String(arg));
      });
    }
    return translation;
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
  }), [locale, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}
