// Use this file to export React client components (e.g. those with 'use client' directive) or other non-server utilities
import '../ui.css';

// components
export { default as CamBtn } from './lib/CamBtn';
export { default as Typography } from './lib/Typography';
export { default as Box } from './lib/Box';
export { default as Input } from './lib/Input';
export { default as AccessOption } from './lib/AccessOption';
export { default as Dropdown } from './lib/Dropdown';
export { default as CamBadge } from './lib/CamBadge';
export { default as PlatformSwitcher } from './lib/PlatformSwitcher';
export { default as LanguageSwitcher } from './lib/LanguageSwitcher';
export { default as Alert } from './lib/Alert';
export { default as Modal } from './lib/Modal';
export { default as Checkbox } from './lib/Checkbox';
export { default as Tooltip } from './lib/Tooltip';

//layout components
export { default as Layout } from './lib/Layout';
export { default as Footer } from './lib/Footer';
export { default as NavBar } from './lib/NavBar';

// logos
export { default as CaminoLogo } from './logos/CaminoLogo';
export { default as Logo } from './logos/Logo';

// context Theme configuration
export * from './context/ThemeContext';

// LanguageSwitcher
export * from './lib/LanguageSwitcher';

// i18n
export * from './context/I18nContext';

export type { TranslationType } from './context/I18nContext';

export { default as FileInput } from './lib/FileInput';
export * from './lib/FileInput/FileInput.types';

export { default as MnemonicInput } from './lib/MnemonicInput';
export * from './lib/MnemonicInput/MnemonicInput.types';

// icons
export * from './lib/Icons';

export * from './lib/Tabs';

export * from './lib/Loader';

export * from './lib/Table';
