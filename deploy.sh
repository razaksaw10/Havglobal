#!/bin/bash
# ==============================================================================
# Script de Déploiement et Mise à jour Automatique - HAVA Global Trade
# ==============================================================================

set -e

echo "🚀 [1/5] Récupération des dernières modifications Git..."
git pull origin main

echo "📦 [2/5] Installation des dépendances Backend & Frontend..."
npm install
cd backend && npm install && cd ../frontend && npm install && cd ..

echo "🗄️ [3/5] Synchronisation de la Base de Données Prisma..."
cd backend && npx prisma generate && npx prisma db push && cd ..

echo "🔨 [4/5] Compilation de l'application (NestJS & Next.js)..."
npm run build

echo "🔄 [5/5] Redémarrage des processus PM2..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save

echo "✅ Déploiement terminé avec succès !"
pm2 status
