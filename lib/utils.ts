import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { kv } from '@vercel/kv';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomUserState = (length: number): string => {
  const state = Array.from({ length }, () => (Math.random() * 36).toString(36)[Math.random() >= 0.5 ? 'toString' : 'toUpperCase']()).join('');
  kv.set('app_state', state);
  return state;
};

// convert new Date().getTime() + expiresIn * 1000 to readable local time
export const convertExpiresAt = (expiresAt: string | null): string => {
  if (!expiresAt) throw new Error('expiresAt is required');
  return new Date(expiresAt).toLocaleString();
};
