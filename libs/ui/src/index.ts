// Use this file to export React client components (e.g. those with 'use client' directive) or other non-server utilities
import '../ui.css';

// components
export { default as CamBtn } from './lib/CamBtn';
export { default as Typography } from './lib/Typography';
export { default as Box } from './lib/Box';

//layout components
export { default as Layout } from './lib/Layout';
export { default as Footer } from './lib/Footer';
export { default as NavBar } from './lib/NavBar';

// logos
export { default as CaminoLogo } from './logos/CaminoLogo';

// context Theme configuration
export * from './context/ThemeContext';

// LanguageSwitcher
export * from './lib/LanguageSwitcher';

// i18n
export * from './context/I18nContext';

export type { TranslationType } from './context/I18nContext';
