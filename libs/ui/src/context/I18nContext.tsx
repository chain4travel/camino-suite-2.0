'use client';

import { I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { PropsWithChildren } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

export type TranslationType = RecursivePartial<{
  [key: string]: string | TranslationType;
}>;

export interface I18nProviderProps extends PropsWithChildren {
  resources: {
    [lang: string]: {
      translation: TranslationType;
    };
  };
}

export const createI18nInstance = (resources: I18nProviderProps['resources']) => {
  const i18n = i18next.createInstance();

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: Object.keys(resources),
      debug: process.env.NODE_ENV === 'development',
      interpolation: { escapeValue: false },
      defaultNS: 'translation',
    });

  return i18n;
};

export function I18nProvider({ children, resources }: I18nProviderProps) {
  const i18n = createI18nInstance(resources);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
