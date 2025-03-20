'use client';

import { Typography, Container } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { PLATFORM_SWITCHER } from '@camino/data';
import Link from 'next/link';
import { OptionType } from 'libs/ui/src/lib/PlatformSwitcher/PlatformSwitcher.types';
import NavCard from '../components/home/NavCard';

export default function Index() {
  const { t } = useTranslation();
  
  const visiblePlatforms = PLATFORM_SWITCHER.filter(platform => !platform.hidden);

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

        {/* Platform Cards */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {visiblePlatforms.map((platform: OptionType) => (
            <div key={platform.name} className="w-full md:w-[400px]">
              <NavCard platform={platform} />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
