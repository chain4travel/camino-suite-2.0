import {
  DISCORD,
  GITHUB,
  LINKEDIN,
  TELEGRAM_ANNOUNCEMENTS,
  TELEGRAM_CAMINO,
  X,
  YOUTUBE,
} from '@camino/data';
import {
  DiscordIcon,
  GithubIcon,
  LinkedInIcon,
  TelegramAnouncementIcon,
  TelegramCaminoIcon,
  XIcon,
  YoutubeIcon,
} from '../lib/Icons';

import { FooterDataProps } from '../lib/Footer/Footer.types';
import React from 'react';

const socialMediaIcons: Record<string, React.FC> = {
  XIcon,
  GithubIcon,
  LinkedInIcon,
  DiscordIcon,
  YoutubeIcon,
  TelegramCaminoIcon,
  TelegramAnouncementIcon,
};

const SOCIAL_MEDIA_LINKS: Record<string, string> = {
  XIcon: X,
  GithubIcon: GITHUB,
  LinkedInIcon: LINKEDIN,
  DiscordIcon: DISCORD,
  YoutubeIcon: YOUTUBE,
  TelegramCaminoIcon: TELEGRAM_CAMINO,
  TelegramAnouncementIcon: TELEGRAM_ANNOUNCEMENTS,
};

export const fetchFooterData = async (): Promise<FooterDataProps> => {
  const response = await fetch(
    'https://storage.googleapis.com/camino-suite-static/footer-consts.json'
  );
  return response.json();
};

export const getSocialMediaLinks = (key: string): string => {
  return SOCIAL_MEDIA_LINKS[key] ?? key;
};

export const getSocialMedia = (data: FooterDataProps['SocialMediaLinks']) => {
  return data?.map(({ name, icon }) => {
    const Icon = socialMediaIcons[icon];
    return {
      key: icon,
      name,
      url: getSocialMediaLinks(icon),
      icon: Icon ? <Icon /> : null,
    };
  });
};
