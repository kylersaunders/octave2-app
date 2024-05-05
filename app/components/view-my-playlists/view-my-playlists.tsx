'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export default function ViewMyPlaylists() {
  const [goal, setGoal] = useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline'>My Playlists</Button>
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>{`Make changes to your profile here. Click save when you're done.`}</SheetDescription>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input id='name' value='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Username
            </Label>
            <Input id='username' value='@peduarte' className='col-span-3' />
          </div>
        </div>
        <div className='p-4 pb-0'>
          <div className='flex items-center justify-center space-x-2'>
            <Button variant='outline' size='icon' className='h-8 w-8 shrink-0 rounded-full' onClick={() => onClick(-10)} disabled={goal <= 200}>
              <Minus className='h-4 w-4' />
              <span className='sr-only'>Decrease</span>
            </Button>
            <div className='flex-1 text-center'>
              <div className='text-7xl font-bold tracking-tighter'>{goal}</div>
              <div className='text-[0.70rem] uppercase text-muted-foreground'>Calories/day</div>
            </div>
            <Button variant='outline' size='icon' className='h-8 w-8 shrink-0 rounded-full' onClick={() => onClick(10)} disabled={goal >= 400}>
              <Plus className='h-4 w-4' />
              <span className='sr-only'>Increase</span>
            </Button>
          </div>
          <div className='mt-3 h-[120px]'></div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type='submit'>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
