import * as functions from 'firebase-functions';
import { createTransport, Transporter } from 'nodemailer';

export function transport(): Transporter {
  const gmailEmail = functions.config().gmail.email;
  const gmailPassword = functions.config().gmail.password;
  
  return createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
  });  
}
