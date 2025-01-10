'use client';

import Dropdown from '../Dropdown';
import clsx from 'clsx';
import { mdiTranslate } from '@mdi/js';
import { useTranslation } from 'react-i18next';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  // Add more languages as needed
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (item: { value: string }) => {
    i18n.changeLanguage(item.value);
  };

  const currentLanguage = languages.find(lang => lang.value === i18n.language);

  return (
    <Dropdown
      trigger={currentLanguage?.label || 'Language'}
      items={languages}
      onSelect={handleLanguageChange}
      startIcon={mdiTranslate}
      menuButtonClassName={clsx(
        '!bg-transparent !border-0',
        'text-gray-900 dark:text-white',
        'hover:!bg-gray-50 dark:hover:!bg-slate-800'
      )}
      menuItemsClassName={clsx(
        'mt-2 min-w-[160px]',
        'bg-white dark:bg-slate-900',
        'border border-gray-200 dark:border-slate-700',
        'shadow-lg rounded-lg'
      )}
      menuItemClassName={clsx(
        'text-gray-900 dark:text-white',
        'hover:bg-gray-50 dark:hover:bg-slate-800'
      )}
    />
  );
};

export default LanguageSwitcher;
