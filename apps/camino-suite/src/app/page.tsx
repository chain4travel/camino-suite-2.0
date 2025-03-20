'use client';

import { Typography, Container } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { PLATFORM_SWITCHER } from '@camino/data';
import Link from 'next/link';
import { OptionType } from 'libs/ui/src/lib/PlatformSwitcher/PlatformSwitcher.types';
import NavCard from '../components/home/NavCard';

export default function Index() {
  const { t } = useTranslation();

  return (
    <Container>
      <div className="flex flex-col gap-8 py-12">
        {/* Header Section */}
        <div className="text-center flex flex-col gap-1">
          <Typography variant="h1" className="mb-4">
            Camino Suite
          </Typography>
          <Typography variant="h5" className="text-slate-400">
            {t('common.suiteDescription')}
          </Typography>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_SWITCHER.map((platform: OptionType) => (
            <NavCard key={platform.name} platform={platform} />
          ))}
        </div>
      </div>
    </Container>
  );
}
