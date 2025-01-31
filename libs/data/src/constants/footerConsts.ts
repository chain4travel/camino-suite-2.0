import {
  DISCORD,
  GITHUB,
  LINKEDIN,
  TELEGRAM_ANNOUNCEMENTS,
  TELEGRAM_CAMINO,
  X,
  YOUTUBE
} from './routePathsConsts';

export type SocialMediaKey = 'GithubIcon' | 'LinkedInIcon' | 'DiscordIcon' | 'YoutubeIcon' | 'TelegramCaminoIcon' | 'TelegramAnouncementIcon';

// Define type for each social media entry
type SocialMediaIconData = {
  key: SocialMediaKey;
  link: string;
};

// Array-based data structure
export const socialMediaData: SocialMediaIconData[] = [
  { key: 'GithubIcon', link: GITHUB },
  { key: 'LinkedInIcon', link: LINKEDIN },
  { key: 'DiscordIcon', link: DISCORD },
  { key: 'YoutubeIcon', link: YOUTUBE },
  { key: 'TelegramCaminoIcon', link: TELEGRAM_CAMINO },
  { key: 'TelegramAnouncementIcon', link: TELEGRAM_ANNOUNCEMENTS },
];

