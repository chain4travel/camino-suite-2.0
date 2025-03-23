'use client';

import {
  decrement,
  increment,
  useAppDispatch,
  useAppSelector,
} from '@camino/store';
import { LanguageSwitcher } from '@camino/ui';
import { Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  return (
    <div className="w-full">
      <div className="container p-6 mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <Typography variant="h1" as="h1">
              {t('welcome')}
            </Typography>
            <Typography variant="h3" as="h3">
              {t('navigation.home')}
            </Typography>
            <div>
              <h2>Count: {count}</h2>
              <div>
                <button onClick={() => dispatch(increment())}>Increment</button>
                <button onClick={() => dispatch(decrement())}>Decrement</button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-4">
            <Typography variant="body1">{t('navigation.home')}</Typography>
            <Typography variant="body1">{t('navigation.about')}</Typography>
            <Typography variant="body1">{t('navigation.settings')}</Typography>
          </nav>

          {/* Common Text Examples */}
          <div className="flex flex-col gap-2">
            <Typography variant="body2">{t('common.loading')}</Typography>
            <Typography variant="body2">{t('common.error')}</Typography>
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
