import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translations'],
  defaultNS: 'translations',
  resources: {
    en: {
      translations: {
        footer: {
          description: 'Footer description'
        },
        common: {
          copyright: 'Camino Network. All rights reserved.'
        }
      }
    }
  }
});

export default i18n;
