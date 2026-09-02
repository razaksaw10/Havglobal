# 🌍 HAVA Global Trade – Plateforme Internationale & Écosystème Multidisciplinaire

<p align="center">
  <img src="frontend/public/logo.png" alt="HAVA Global Trade" width="140" />
</p>

<p align="center">
  <strong>Commerce B2B International · MEDI-TOUR ASSISTANCE · Visites Guidées & Séjours d'Affaires en Turquie</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-MySQL-2D3748?style=flat-square&logo=prisma" alt="Prisma MySQL" />
  <img src="https://img.shields.io/badge/PM2-Production-2B037A?style=flat-square&logo=pm2" alt="PM2" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
</p>

---

## 📌 Présentation du Projet

**HAVA Global Trade** est une plateforme web moderne et hautement sécurisée reliant l'Afrique de l'Ouest, l'Europe et les marchés mondiaux à l'excellence industrielle, médicale et touristique de la **Turquie**.

La plateforme s'articule autour de **3 grands pôles d'excellence** :

1. 📦 **Pôle Sourcing & Export B2B Turquie** :
   - Approvisionnement direct usine sans intermédiaires.
   - Secteurs clés : *Textile & Confection Pro*, *Mobilier & Hôtellerie*, *Santé & Dermo-Cosmétique*, *Agroalimentaire & Terroir*.
   - Personnalisation sous marque blanche (Private Label / OEM), contrôle qualité AQL et gestion complète du fret maritime/aérien.

2. 🩺 **Pôle MEDI-TOUR ASSISTANCE (Santé & Évacuation Sanitaire)** :
   - Organisation d'évacuations sanitaires d'urgence et de séjours médicaux depuis le Burkina Faso / Afrique vers les hôpitaux de référence accrédités **JCI** en Turquie.
   - Spécialités : Oncologie, Cardiologie, Orthopédie robotisée, PMA/FIV, Neurochirurgie, Greffes et Check-Up VIP.
   - Équipe de coordination médicale francophone dédiée basée entre Ouagadougou, Istanbul et Bolu.

3. 🏛️ **Pôle Visites Guidées & Tourisme Professionnel** :
   - Accompagnement de délégations d'affaires, participation aux salons internationaux (CNR, Tüyap, IFCO) et visites d'usines avec interprète bilingue turc-français.
   - Circuits de sourcing grossistes dans les quartiers textiles d'Istanbul (Merter, Laleli, Osmanbey).
   - Séjours touristiques VIP clés en main (Istanbul historique, Bosphore, Cappadoce en montgolfière, Bursa).

---

## 🛠️ Stack Technologique

### Frontend
- **Framework** : [Next.js 14 (App Router)](https://nextjs.org/) + React 18
- **Langage** : TypeScript
- **Styles** : CSS Vanilla moderne, Design System cohérent (variables CSS, glassmorphism, responsive mobile-first)
- **Icônes** : [Lucide React](https://lucide.dev/)

### Backend & Base de Données
- **Architecture** : NestJS / Node.js REST API
- **ORM** : [Prisma ORM](https://www.prisma.io/)
- **Base de données** : **MySQL 8.0+**
- **Sécurité** : JWT Authentication, Bcrypt, Helmet, CORS strict, Rate Limiting
- **Uploads** : Multer (stockage public sécurisé pour images de produits et catalogues)

### Déploiement & Serveur
- **Système d'exploitation** : Ubuntu 24.04 LTS (VPS)
- **Process Manager** : PM2 (Cluster / Fork mode)
- **Reverse Proxy** : Nginx avec SSL Let's Encrypt (Certbot)

---

## 📁 Structure du Projet

```text
havaglobal/
├── backend/                  # API REST NestJS
│   ├── prisma/
│   │   ├── schema.prisma     # Schéma de base de données MySQL
│   │   └── seed.ts           # Script d'insertion des catégories, produits & admin
│   ├── src/                  # Modules NestJS (auth, products, categories, inquiries...)
│   ├── public/uploads/       # Répertoire des fichiers/images téléversés
│   ├── .env.example          # Exemple de configuration d'environnement backend
│   └── package.json
│
├── frontend/                 # Application Next.js 14
│   ├── public/               # Assets statiques, logos officiels & images
│   │   ├── logo.png          # Logo officiel HAVA Global Trade
│   │   ├── meditour-logo.png # Logo officiel MEDI-TOUR ASSISTANCE
│   │   ├── meditour-hero.jpg # Photo authentique bloc opératoire / chirurgie
│   │   └── tourisme-hero.jpg # Photo panoramique aérienne Istanbul & Bosphore
│   ├── src/
│   │   ├── app/              # Routes Next.js App Router
│   │   │   ├── page.tsx      # Page d'accueil (Présentation des 3 pôles)
│   │   │   ├── catalogue/    # Catalogue B2B avec filtres et recherche
│   │   │   ├── meditour/     # Page dédiée MEDI-TOUR ASSISTANCE
│   │   │   ├── tourisme/     # Page dédiée Visites Guidées & Salons B2B
│   │   │   ├── services/     # Services de sourcing & logistique
│   │   │   ├── engagements/  # Charte qualité et engagements RSE
│   │   │   ├── contact/      # Formulaire de cotation multi-pôles
│   │   │   └── admin/        # Espace d'administration sécurisé
│   │   ├── components/       # Composants réutilisables (Navbar, Footer, Modals...)
│   │   ├── lib/              # Client API et données de secours (fallbackData)
│   │   └── styles/           # globals.css (Design System)
│   └── package.json
│
├── ecosystem.config.js       # Configuration PM2 pour déploiement serveur
├── .env.example              # Variables d'environnement globales
└── README.md                 # Documentation du projet
```

---

## 🚀 Installation & Démarrage Local

### 1. Prérequis
- [Node.js](https://nodejs.org/) (version 18.x ou 20.x recommandée)
- [MySQL Server](https://www.mysql.com/) (version 8.0+)
- [Git](https://git-scm.com/)

### 2. Cloner le Dépôt
```bash
git clone https://github.com/razaksaw10/Havglobal.git
cd Havglobal
```

### 3. Configuration du Backend
1. Rendez-vous dans le dossier backend :
   ```bash
   cd backend
   npm install
   ```

2. Créez le fichier `.env` :
   ```env
   PORT=3001
   NODE_ENV=development
   DATABASE_URL="mysql://havaglobal_user:HavaAdmin2026@localhost:3306/havaglobal"
   JWT_SECRET="votre_super_cle_secrete_jwt_2026"
   JWT_EXPIRES_IN="7d"
   FRONTEND_URL="http://localhost:3000"
   ```

3. Synchronisez les tables MySQL et insérez les données initiales :
   ```bash
   # Création des tables
   npx prisma db push

   # Insertion des catégories, produits de démonstration et compte administrateur
   npm run seed
   ```

4. Lancez le serveur Backend :
   ```bash
   npm run start:dev
   ```
   *L'API est accessible sur `http://localhost:3001`.*

---

### 4. Configuration du Frontend
1. Dans un autre terminal, accédez au dossier frontend :
   ```bash
   cd frontend
   npm install
   ```

2. Créez le fichier `frontend/.env.local` :
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
   *L'application est accessible sur `http://localhost:3000`.*

---

## 🌐 Déploiement en Production sur Serveur VPS (Ubuntu)

Sur votre serveur VPS (`/var/www/Havglobal`) avec **PM2** et **Nginx** :

### Mise à jour et Redémarrage Rapide
```bash
cd /var/www/Havglobal

# 1. Récupérer les dernières modifications
git pull origin main

# 2. Mettre à jour la base de données (si modification de schéma)
cd backend
npx prisma db push
npm run seed # optionnel si déjà initialisé

# 3. Compiler le Frontend Next.js
cd ../frontend
npm install --production=false
npm run build

# 4. Redémarrer les processus PM2
cd ..
pm2 restart all --update-env
```

### Configuration PM2 (`ecosystem.config.js`)
```javascript
module.exports = {
  apps: [
    {
      name: 'havaglobal-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start:prod',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'havaglobal-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

---

## 🔒 Espace Administrateur

- **URL d'accès** : `/admin/login`
- **Identifiants par défaut** :
  - **Email** : `admin@havaglobal.com`
  - **Mot de passe** : `AdminHava2026!`
- **Fonctionnalités Admin** :
  - 📊 Tableau de bord KPIs (nombre de produits, demandes de devis, secteurs actifs).
  - 📦 Gestion complète des produits (création, modification, upload d'images, statut vedette).
  - 📨 Gestion des demandes de devis et dossiers médicaux reçus (changement de statut : Nouveau, En cours, Traité, Archivé).
  - ⚙️ Paramètres de sécurité et journalisation des activités.

---

## 📞 Coordonnées & Sièges Internationaux

- 📍 **Turquie (Siège Opérationnel & Médical)** : Istanbul & Bolu, Turquie
- 📍 **Burkina Faso (Siège Administratif Afrique)** : Ouagadougou, Burkina Faso
- 📞 **Service Commercial B2B & Tourisme** : `+90 543 173 61 73`
- 🩺 **MEDI-TOUR ASSISTANCE (Urgences & Santé)** : `+90 541 882 95 49` / `+90 541 886 24 45`
- ✉️ **Email central** : `havaglobaltrade@gmail.com`

---

## 📄 Licence
Ce projet est la propriété exclusive de **HAVA Global Trade SARL** et **MEDI-TOUR ASSISTANCE**. Tous droits réservés.
