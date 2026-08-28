const { getTransporter } = require('../config/mailer');
const env = require('../config/env');
const logger = require('../config/logger');

const emailService = {
  async sendInquiryNotification(inquiry) {
    try {
      const transporter = getTransporter();

      // Email à l'administrateur
      const adminMailOptions = {
        from: env.SMTP_FROM,
        to: env.NOTIFICATION_EMAIL,
        subject: `🔔 Nouvelle demande de devis : ${inquiry.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #d97706; padding-bottom: 8px;">Nouvelle Cotation B2B Reçue</h2>
            <p><strong>Client :</strong> ${inquiry.name}</p>
            <p><strong>Email :</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
            <p><strong>Téléphone :</strong> ${inquiry.phone || 'Non renseigné'}</p>
            <p><strong>Société :</strong> ${inquiry.company || 'Non renseigné'} (${inquiry.country || 'Pays non précisé'})</p>
            <p><strong>Secteur concerné :</strong> ${inquiry.categorySlug || 'Général'}</p>
            <p><strong>Objet :</strong> ${inquiry.subject}</p>
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #d97706; margin: 15px 0;">
              <strong>Message du client :</strong><br>
              <p style="white-space: pre-line;">${inquiry.message}</p>
            </div>
            <p style="font-size: 0.85rem; color: #64748b;">Connectez-vous au panneau d'administration pour traiter cette demande.</p>
          </div>
        `
      };

      // Email de confirmation au prospect
      const clientMailOptions = {
        from: env.SMTP_FROM,
        to: inquiry.email,
        subject: `Confirmation de réception de votre demande - HAVA Global Trade`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #0f172a; margin: 0;">HAVA Global Trade</h1>
              <p style="color: #d97706; font-size: 0.9rem; margin-top: 4px;">Commerce International & Sourcing · Istanbul, Turquie</p>
            </div>
            <h3 style="color: #0f172a;">Bonjour ${inquiry.name},</h3>
            <p>Nous vous remercions pour votre intérêt envers nos services d'exportation et de sourcing.</p>
            <p>Votre demande relative à <strong>"${inquiry.subject}"</strong> a bien été enregistrée par notre pôle commercial.</p>
            <p>Un de nos conseillers experts étudie votre dossier et reviendra vers vous sous <strong>24 à 48 heures ouvrées</strong> avec les meilleures cotations et conditions logistiques.</p>
            <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; margin: 20px 0; font-size: 0.9rem; color: #475569;">
              <strong>Besoin d'une réponse urgente ?</strong><br>
              Contactez directement notre desk commercial via WhatsApp au <strong>+90 543 173 61 73</strong>.
            </div>
            <p style="font-size: 0.85rem; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px;">
              HAVA Global Trade - Merkez Mah. Abide-i Hürriyet Cad. Şişli, Istanbul, Turquie.<br>
              Email: contact@havaglobaltrade.com
            </p>
          </div>
        `
      };

      await Promise.allSettled([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(clientMailOptions)
      ]);

      logger.info(`📧 Notifications email envoyées pour le devis #${inquiry.id}`);
    } catch (err) {
      logger.error(`❌ Échec de l'envoi d'email pour le devis #${inquiry.id}: ${err.message}`);
    }
  }
};

module.exports = emailService;
