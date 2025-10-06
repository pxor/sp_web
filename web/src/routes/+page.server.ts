import type { Actions } from './$types';
import 'dotenv/config';
import nodemailer from 'nodemailer';

function transport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false, // STARTTLS on 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const actions: Actions = {
  contact: async ({ request }) => {
    const data = await request.formData();

    // honeypot—if filled, treat as spam
    if ((data.get('company') as string)?.trim()) {
      return { success: true }; // pretend OK
    }

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !message || !EMAIL_RE.test(email)) {
      return { error: 'contact.error' }; // i18n key or plain message
    }

    try {
      const t = transport();

      await t.sendMail({
        from: process.env.SMTP_FROM ?? process.env.SMTP_USER,        // must be your Gmail or verified alias
        to: process.env.SMTP_TO ?? 'nedislav@gmail.com',             // ensure this is your address
        subject: `New contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p>${message.replace(/\n/g, '<br/>')}</p>`,
        replyTo: `"${name}" <${email}>`
      });

      return { success: true };
    } catch (err) {
      console.error('Email error:', err);
      return { error: 'contact.error' };
    }
  }
};
