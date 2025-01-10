import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {
          console.log('changeLanguage');
        }),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {
      console.log('init');
    },
  },
}));
