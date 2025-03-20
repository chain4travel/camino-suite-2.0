export const WALLET_NAV_ITEMS = [
  { id: 'portfolio', label: 'Portfolio', href: '/wallet' },
  { id: 'send', label: 'Send', href: '/wallet/transfer' },
  { id: 'cross-chain', label: 'Cross Chain', href: '/wallet/cross_chain' },
  { id: 'validator', label: 'Validator', href: '/wallet/validator' },
  { id: 'earn', label: 'Earn', href: '/wallet/earn' },
  { id: 'activity', label: 'Activity', href: '/wallet/activity' },
  { id: 'keys', label: 'Manage Keys', href: '/wallet/keys' },
  { id: 'advanced', label: 'Advanced', href: '/wallet/advanced' },
];

export const PLATFORM_SWITCHER = [
  {
    id: 'wallet',
    name: 'Wallet',
    url: '/wallet',
    description: 'Secure, non-custodial wallet for Camino Assets.',
    hidden: false
  },
  {
    id: 'explorer',
    name: 'Explorer',
    url: '/explorer',
    description: 'Lookup network activity and statistics.',
    hidden: false
  },
  {
    id: 'governance',
    name: 'Governance',
    url: '/governance',
    description: 'Participate and vote on proposals.',
    hidden: true
  },
  {
    id: 'partners',
    name: 'Partners',
    url: '/partners',
    description: 'Partners of the Camino Network.',
    hidden: true
  }
] as const;

export type PlatformId = typeof PLATFORM_SWITCHER[number]['id'];
