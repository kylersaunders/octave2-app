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

export const getQueryStringFromObject = <T extends Record<string, any>>(obj: T): string => {
  return new URLSearchParams(obj).toString();
};

export const fetcher = async (options: Request) => {
  const response = await fetch(options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function millisecondsToMMSS(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
}

export const summarizeArtistsMaxN = (artists: { name: string }[], n: number) => {
  const names = artists.map((artist) => artist.name);
  return names.slice(0, n).join(', ') + (names.length > n ? '...' : '');
};
