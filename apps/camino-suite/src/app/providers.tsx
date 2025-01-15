'use client';

import { ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: require('../../../public/locales/en.json')
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
