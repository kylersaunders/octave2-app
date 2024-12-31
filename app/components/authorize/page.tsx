'use client';
import { Button } from '@/components/ui/button';

export default function Authorize({ authorize }: { authorize: () => void }) {
  return <Button onClick={() => authorize()}>Connect your Spotify</Button>;
}
