import type { Meta, StoryObj } from '@storybook/react';

import { I18nProvider } from '../../context/I18nContext';
import  LanguageSwitcher  from '.';

const mockResources = {
  en: {
    translation: {
      welcome: 'Welcome',
      navigation: {
        home: 'Home',
        about: 'About',
        settings: 'Settings'
      }
    }
  },
  es: {
    translation: {
      welcome: 'Bienvenido',
      navigation: {
        home: 'Inicio',
        about: 'Acerca de',
        settings: 'Configuración'
      }
    }
  },
  fr: {
    translation: {
      welcome: 'Bienvenue',
      navigation: {
        home: 'Accueil',
        about: 'À propos',
        settings: 'Paramètres'
      }
    }
  }
};

const meta: Meta<typeof LanguageSwitcher> = {
  component: LanguageSwitcher,
  title: 'Components/LanguageSwitcher',
  decorators: [(Story) => <I18nProvider resources={mockResources}><Story /></I18nProvider>],
};

export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

export const Primary: Story = {
  args: {},
};
