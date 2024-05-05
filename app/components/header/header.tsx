import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types/user';

export default function Header({ user }: { user: User }) {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <Card className='flex items-center justify-between p-4'>
        <a href='/'>
          <h1 className='text-2xl font-bold'>Octave</h1>
        </a>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <>Welcome {user.display_name}</>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className='p-2'>
            <h2>Not logged in</h2>
          </div>
        )}
      </Card>
    </header>
  );
}
