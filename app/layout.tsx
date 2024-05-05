import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getSpotifyProfile } from '@/actions/profile';
import { User } from '@/types/user';
import { StoreProvider } from './StoreProvider';
import { Card } from '@/components/ui/card';
import Header from './components/header/header';

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
          <Header user={user} />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
