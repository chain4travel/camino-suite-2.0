import '@testing-library/jest-dom';

import { ReactElement } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { render as rtlRender } from '@testing-library/react';

// Initialize i18next for tests
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    resources: {
      en: {
        common: {
          menu: 'Menu',
          edit: 'Edit',
          add: 'Add',
          // Add other translations used in tests here
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

const render = (ui: ReactElement, options = {}) => {
  return rtlRender(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
