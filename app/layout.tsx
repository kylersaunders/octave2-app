import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getSpotifyProfile } from '@/actions/profile';
import { User } from '@/types/user';
import { StoreProvider } from './StoreProvider';
import { Card } from '@/components/ui/card';

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
        <body>
          <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='flex items-center justify-between p-4'>
              <a href='/'>
                <h1 className='text-2xl font-bold'>Octave</h1>
              </a>
              {user ? (
                <Card className='p-2'>
                  <h2>Welcome {user.display_name}</h2>
                </Card>
              ) : (
                <Card className='p-2'>
                  <h2>Not logged in</h2>
                </Card>
              )}
            </div>
          </header>
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
