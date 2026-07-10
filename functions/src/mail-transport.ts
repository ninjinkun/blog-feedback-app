import { createTransport, Transporter } from 'nodemailer';

export function transport(): Transporter {
  // Formerly functions.config().gmail.*; the runtime config API was shut down.
  // Set these via `firebase functions:secrets:set` or functions/.env.
  const gmailEmail = process.env.GMAIL_EMAIL;
  const gmailPassword = process.env.GMAIL_PASSWORD;

  return createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
      user: gmailEmail,
      pass: gmailPassword,
    },
  });
}
