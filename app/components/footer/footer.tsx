'use client';
import { useAppSelector } from '@/lib/hooks';
import Autoplay from '../Autoplay';
import { selectSelectedUrl } from '@/lib/features/recommendations/recommendationsSlice';

export default function Footer() {
  const url = useAppSelector(selectSelectedUrl);
  console.log('Footer', url);
  if (!url) return null;
  if (url === '#') return null;
  return <Autoplay src={url} />;
}
