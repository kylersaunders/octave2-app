import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiltersForm } from './components/FiltersForm';
import { useState } from 'react';

export default function FiltersModal() {
  const [showForm, setShowForm] = useState(false);
  return (
    <Dialog open={showForm}>
      <DialogTrigger asChild>
        <Button variant='outline' onClick={() => setShowForm(true)}>
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>Edit filters</DialogTitle>
          <DialogDescription>{`These filters apply to any songs you search for, as well as any recommendations you request.`}</DialogDescription>
        </DialogHeader>
        <FiltersForm setShowForm={setShowForm} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
