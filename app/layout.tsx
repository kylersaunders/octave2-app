import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from './StoreProvider';
import Header from './components/header/header';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

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
  return (
    <ClerkProvider>
      <SignedOut>
        <html lang='en'>
          <body className='h-[33vh] flex items-center justify-center'>
            <SignInButton />
          </body>
        </html>
      </SignedOut>
      <SignedIn>
        <StoreProvider>
          <html lang='en'>
            <body className='space-y-2'>
              <NextThemesProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                <TooltipProvider delayDuration={0}>
                  <Header />
                  {children}
                </TooltipProvider>
                <ThemeSwitcher />
                {/* <LoginWithSpotify /> */}
              </NextThemesProvider>
            </body>
          </html>
        </StoreProvider>
      </SignedIn>
    </ClerkProvider>
  );
}
