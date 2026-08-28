const nodemailer = require('nodemailer');
const env = require('./env');
const logger = require('./logger');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    if (env.SMTP_USER && env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS
        }
      });
      logger.info('📧 Service Mailer configuré avec transporteur SMTP.');
    } else {
      // Mock transporter en dev / absence d'identifiants
      transporter = {
        sendMail: async (mailOptions) => {
          logger.info(`[Mail Mock] Email simulé envoyé à : ${mailOptions.to} | Sujet: "${mailOptions.subject}"`);
          return { messageId: `mock-${Date.now()}` };
        }
      };
      logger.info('📧 Service Mailer initialisé en mode simulation (pas de SMTP configuré).');
    }
  }
  return transporter;
}

module.exports = {
  getTransporter
};
