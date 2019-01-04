import { transport } from './mail-transport';
import EmailTemplate = require('email-templates');

export function sendWelcomeMail(to: string) {
  const email = new EmailTemplate({
    message: {
      from: 'info@blog-feedback.app'
    }, 
    transport: transport(),
  });

  return email.send({
    template: 'welcome',
    message: {
      to,
    },
    locals: {},
  });
}
