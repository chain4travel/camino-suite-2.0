'use client';

import {
  FooterButtonsProps,
  FooterDataProps,
  FooterLinksProps,
} from './Footer.types';
import { fetchFooterData, getSocialMedia } from '../../utils/socialMedia';
import { useEffect, useState } from 'react';

import CamBtn from '../CamBtn';
import CaminoLogo from '../../logos/CaminoLogo';
import Typography from '../Typography';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [footerData, setFooterData] = useState<FooterDataProps | null>(null);

  useEffect(() => {
    fetchFooterData().then(setFooterData);
  }, []);

  const socialMedia = footerData
    ? getSocialMedia(footerData.SocialMediaLinks)
    : [];

  return (
    <footer
      className={clsx(
        'w-full px-2 lg:px-8 py-10 border-t border-slate-400',
        theme === 'light' ? 'bg-white text-black' : 'bg-slate-950 text-white'
      )}
    >
      <div className="container mx-auto">
        {/* Top Section */}
        <div className="flex flex-col justify-between gap-8 mb-10 lg:flex-row">
          {/* Logo and Description */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <CaminoLogo />
            </div>
            <Typography variant="h6" as="p" className="!text-slate-400">
              {t('footer.description')}
            </Typography>
            {/* Social Icons */}
            <div className="flex flex-wrap gap-4 mt-6">
              {socialMedia?.map(({ name, url, icon }) => (
                <a
                  href={url}
                  rel="noopener noreferrer"
                  target="_blank"
                  key={name}
                  aria-label={name}
                  className={clsx(
                    'cursor-pointer hover:scale-110 transition-all duration-300 [&>svg]:w-8 [&>svg]:h-8',
                    theme === 'light'
                      ? 'text-slate-950 hover:text-black'
                      : 'text-slate-100 hover:text-white'
                  )}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-8 text-sm lg:gap-16">
            {footerData?.FooterLinks.map(
              (section: FooterLinksProps, index: number) => (
                <div key={index}>
                  <Typography variant="h4" as="h4" className="mb-3">
                    {section.name}
                  </Typography>
                  <ul className="space-y-2">
                    {section.links.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={clsx(
                            'hover:underline bg-transparent border-none cursor-pointer',
                            theme === 'light'
                              ? 'text-slate-950'
                              : 'text-slate-100 hover:text-white'
                          )}
                        >
                          <Typography
                            variant="h6"
                            as="p"
                            className="!text-slate-400"
                          >
                            {link.text}
                          </Typography>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap w-full gap-4 mb-10">
          {footerData?.FooterButtons.map(
            (button: FooterButtonsProps, index: number) => (
              <CamBtn
                key={index}
                variant="secondary"
                onClick={() => window.open(button.url, '_blank')}
              >
                {button.name}
              </CamBtn>
            )
          )}
        </div>

        {/* Bottom Section */}
        <div
          className={clsx(
            'w-full border-t pt-6 text-center text-xs border-slate-400'
          )}
        >
          <Typography
            variant="body2"
            as="p"
            color={theme === 'light' ? '#666' : '#BBB'}
          >
            &copy; {new Date().getFullYear()} {t('common.copyright')}
          </Typography>
          <Typography
            variant="caption"
            as="span"
            color={theme === 'light' ? '#666' : '#BBB'}
          >
            version
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
