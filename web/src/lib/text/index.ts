import { writable, derived, get } from 'svelte/store';
import en from './en.json';
import bg from './bg.json';

export type Locale = 'en' | 'bg';
export const messages: Record<Locale, Record<string, string>> = { en, bg };

export const locale = writable<Locale>('bg');

export function setLocale(next: Locale) {
  if (next !== get(locale)) locale.set(next);
}

export const t = derived(locale, ($locale) => {
  const dict = messages[$locale] ?? messages.en;
  return (key: string, fallback?: string) => dict[key] ?? fallback ?? key;
});
