const app = require('./src/app');
const env = require('./src/config/env');
const prisma = require('./src/config/prisma');
const logger = require('./src/config/logger');

const PORT = env.PORT || 3000;

async function startServer() {
  try {
    // Vérification de la connexion à la base de données Prisma
    await prisma.$connect();
    logger.info('📦 Connexion à la base de données Prisma établie avec succès.');

    const server = app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`  🚀 HAVA Global Trade Enterprise Server Prêt !`);
      console.log(`  📍 Port d'écoute : ${PORT} [Mode: ${env.NODE_ENV}]`);
      console.log(`  🌐 Site web      : http://localhost:${PORT}`);
      console.log(`  🛡️ Admin Panel   : http://localhost:${PORT}/admin`);
      console.log(`  📦 API v1 Base   : http://localhost:${PORT}/api/v1/products`);
      console.log(`  ❤️ Health Check  : http://localhost:${PORT}/health`);
      console.log(`===================================================`);
    });

    // Arrêt propre (Graceful Shutdown)
    const shutdown = async (signal) => {
      logger.info(`Signal ${signal} reçu. Fermeture gracieuse du serveur...`);
      server.close(async () => {
        logger.info('Serveur HTTP fermé.');
        await prisma.$disconnect();
        logger.info('Connexions Prisma fermées.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Impossible de démarrer le serveur :', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
