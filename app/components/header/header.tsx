import { ModeToggle } from '@/components/mode-toggle';
import { User } from '@/types/user';

import { UserButton } from '@clerk/nextjs';

export default function Header({ user }: { user?: User }) {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex items-center justify-between p-4'>
        <a href='/'>
          <h1 className='text-2xl font-bold'>Octave</h1>
        </a>
        <div className='flex items-center justify-center space-x-4'>
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
