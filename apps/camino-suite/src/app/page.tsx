'use client';

import { LanguageSwitcher } from '@camino/ui';
import { Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <Typography variant="h1" as="h1">
              {t('welcome')}
            </Typography>
            <Typography variant="h3" as="h3">
              {t('navigation.home')}
            </Typography>
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-4">
            <Typography variant="body1" as="a" href="/">
              {t('navigation.home')}
            </Typography>
            <Typography variant="body1" as="a" href="/about">
              {t('navigation.about')}
            </Typography>
            <Typography variant="body1" as="a" href="/settings">
              {t('navigation.settings')}
            </Typography>
          </nav>

          {/* Common Text Examples */}
          <div className="flex flex-col gap-2">
            <Typography variant="body2">
              {t('common.loading')}
            </Typography>
            <Typography variant="body2">
              {t('common.error')}
            </Typography>
          </div>

          {/* Language Switcher */}
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
