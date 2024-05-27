'use client';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { AdvancedSearchForm } from './components/recommendation-inputs';

export default function AdvancedSearch() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline'>Advanced Search</Button>
      </DrawerTrigger>
      <DrawerContent className='bottom-0'>
        <div className='mx-auto w-full max-w-full p-8'>
          <AdvancedSearchForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
