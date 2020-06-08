import { transport } from './mail-transport';
import { gaImageSrc } from './mail-ga';
import EmailTemplate = require('email-templates');

export function sendWelcomeMail(to: string, userId: string): Promise<void> {
  const email = new EmailTemplate({
    message: {
      from: '"BlogFeedback" <info@blog-feedback.app>'
    }, 
    transport: transport(),
  });

  return email.send({
    template: 'welcome',
    message: {
      to,
    },
    locals: {
      ga: gaImageSrc(userId, 'welcome', '/mail/welcome'),
    },
  });
}
