import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const lang = event.cookies.get('lang');
  if (lang === 'bg' || lang === 'en') {
    event.locals.lang = lang;
  } else {
    event.locals.lang = 'en';
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => html
  });
};
