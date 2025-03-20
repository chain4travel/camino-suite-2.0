import { Box, CamBtn, Typography } from '@camino/ui';
import { OptionType } from 'libs/ui/src/lib/PlatformSwitcher/PlatformSwitcher.types';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const NavCard = ({ platform }: { platform: OptionType }) => {
  const { t } = useTranslation();
  const router = useRouter();
  
  const handleClick = () => {
    router.push(platform.url);
  };
  
  return (
    <Box className="!p-2 h-[200px] flex flex-col bg-white dark:bg-slate-950">
      <div className="w-full h-full p-4 flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <Typography variant="h3">
            {platform.name}
          </Typography>
          <Typography variant="body1" className="text-slate-400">
            {platform.description}
          </Typography>
        </div>

        <CamBtn 
          variant="secondary" 
          className="w-full !border-primary hover:!border-primary-50"
          onClick={handleClick}
        >
          {t('common.goTo')} {platform.name}
        </CamBtn>
      </div>
    </Box>
  );
};

export default NavCard;
