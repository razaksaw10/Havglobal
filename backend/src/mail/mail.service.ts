import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    try {
      const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
      const port = Number(process.env.SMTP_PORT || 587);
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;

      if (user && pass) {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });
      } else {
        this.logger.warn('SMTP non configuré. Les emails seront simulés en log.');
      }
    } catch (err) {
      this.logger.error('Erreur initialisation transporteur mail', err);
    }
  }

  async sendInquiryNotification(inquiry: any) {
    const from = process.env.SMTP_FROM || 'HAVA Global Trade <contact@havaglobaltrade.com>';
    const to = process.env.NOTIFICATION_EMAIL || 'admin@havaglobaltrade.com';
    const subject = `[Nouvelle Demande B2B] ${inquiry.subject || 'Devis'} - ${inquiry.company || inquiry.name}`;

    const text = `
Nouvelle demande de devis reçue sur HAVA Global Trade :

Nom: ${inquiry.name}
Email: ${inquiry.email}
Téléphone: ${inquiry.phone || 'Non renseigné'}
Société: ${inquiry.company || 'Non renseigné'}
Pays: ${inquiry.country || 'Non renseigné'}
Secteur: ${inquiry.categorySlug || 'Général'}
Message:
${inquiry.message}

Date: ${new Date().toLocaleString('fr-FR')}
    `;

    this.logger.log(`📧 Notification Devis prête pour ${to} (${inquiry.email})`);

    if (this.transporter) {
      try {
        await this.transporter.sendMail({ from, to, subject, text });
        this.logger.log(`✅ Email envoyé avec succès à ${to}`);
      } catch (err) {
        this.logger.error(`❌ Échec envoi email: ${err.message}`);
      }
    }
  }
}
