import './global.css';

import { I18nProvider, Layout, ThemeProvider } from '@camino/ui';

import { Inter } from 'next/font/google';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
import frTranslations from '../locales/fr.json';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
};

export const metadata = {
  title: 'Camino Suite: wallet, data, partners showroom',
  description:
    'Discover Camino Suite — hub for crypto wallets, on-chain data, transactions, Camino Messenger configuration, and Partner Showroom of Camino Network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col items-center justify-center w-full ${inter.variable}`}
      >
        <ThemeProvider>
          <AuthProvider>
            <I18nProvider resources={resources}>
              <Layout>{children}</Layout>
            </I18nProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
