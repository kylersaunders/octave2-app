import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getSpotifyProfile } from '@/actions/profile';
import { User } from '@/types/user';
import { StoreProvider } from './StoreProvider';

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
        <body className={inter.className}>
          <div className='flex flex-col items-center justify-center w-screen h-screen my-8 space-y-4'>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl'>Octave</h1>
            {user ? <h2>Welcome {user.display_name}</h2> : <h2>Not logged in</h2>}
            {children}
          </div>
        </body>
      </html>
    </StoreProvider>
  );
}
