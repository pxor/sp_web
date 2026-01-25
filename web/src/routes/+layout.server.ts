import type { LayoutServerLoad, Actions } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return { lang: locals.lang };
};

export const actions: Actions = {
  setLang: async ({ request, cookies }) => {
    const data = await request.formData();
    const lang = String(data.get('lang') ?? 'bg');
    if (lang === 'en' || lang === 'bg') {
      cookies.set('lang', lang, { path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
      return { ok: true };
    }
    return { ok: false };
  }
};
