require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'file:../data/havaglobal.db',
  JWT_SECRET: process.env.JWT_SECRET || 'hava_global_trade_jwt_secret_dev_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@havaglobaltrade.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'HavaAdmin2026!',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'public/uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.ethereal.email',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'HAVA Global Trade <contact@havaglobaltrade.com>',
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || 'admin@havaglobaltrade.com',
  isProduction: process.env.NODE_ENV === 'production'
};

module.exports = env;
