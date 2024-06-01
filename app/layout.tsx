import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getSpotifyProfile } from '@/actions/profile';
import { User } from '@/types/user';
import { StoreProvider } from './StoreProvider';
import { Card } from '@/components/ui/card';
import Header from './components/header/header';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeSwitcher } from '@/components/theme-switcher';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Octave 2.0',
  description: 'Sound right',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('RootLayout rendered');
  const user: User = await getSpotifyProfile();
  return (
    <StoreProvider>
      <html lang='en'>
        <body className='space-y-2'>
          <NextThemesProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <TooltipProvider delayDuration={0}>
              <Header user={user} />
              {children}
            </TooltipProvider>
            <ThemeSwitcher />
          </NextThemesProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
