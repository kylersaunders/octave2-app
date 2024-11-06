'use client';

import * as React from 'react';

import { Progress } from '@/components/ui/progress';

export function ProgressBar({ duration }: { duration: number }) {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const interval = (87 / duration) * 10;
    let currentProgress = 13;

    const timer = setInterval(() => {
      currentProgress += interval;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return <Progress value={progress} className='w-[100%]' />;
}
