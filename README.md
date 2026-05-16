# HAVA Global Trade

Ce projet a été transformé en application Node.js avec stockage serveur pour que les modifications du catalogue soient partagées par tous les visiteurs.

## Architecture

- `server.js` : serveur Express qui sert les fichiers statiques et expose une API REST pour les produits.
- `product-manager.js` : front-end qui utilise l'API `/api/products` pour lire, créer, modifier et supprimer les produits.
- `package.json` : dépendances et script de démarrage.

## Exécution locale

1. Ouvrir un terminal dans `d:\Bureau\havagloba`
2. Installer les dépendances :

```powershell
npm install
```

3. Lancer le serveur :

```powershell
npm start
```

4. Ouvrir le site dans le navigateur :

```text
http://localhost:3000
```

## Tester l'API

- Lire tous les produits : `GET /api/products`
- Lire les produits d'une catégorie : `GET /api/products?category=sante`
- Ajouter un produit : `POST /api/products`
- Mettre à jour un produit : `PUT /api/products/:id`
- Supprimer un produit : `DELETE /api/products/:id`

## Déploiement sur DigitalOcean App Platform

Pour que le site reste synchronisé pour tous les visiteurs, vous devez déployer cette application comme une application Node.js, pas comme un simple site statique.

### Étapes générales

1. Pousser le dépôt sur GitHub.
2. Créer une nouvelle application dans DigitalOcean App Platform.
3. Sélectionner le dépôt GitHub et la branche.
4. Choisir le type d'application `Node.js`.
5. La commande de démarrage doit être :

```bash
npm start
```

6. Le dossier racine doit être `./`.
7. Déployer.

### Persistance de la base

Cette version utilise MySQL.

- Configurez une base MySQL accessible depuis l'application.
- Définissez les variables d'environnement suivantes sur DigitalOcean :
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
- L'application crée la table `products` automatiquement si elle n'existe pas.

### Configuration locale

Créez un fichier `.env` à la racine avec les valeurs de votre base MySQL :

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=motdepasse
DB_NAME=havagloba
PORT=3000
```

Puis lancez :

```powershell
npm install
npm start
```

## Notes importantes

- Les changements du catalogue ne sont plus stockés dans `localStorage`.
- Ils sont maintenant partagés via la base de données serveur.
- Un commit Git ne déploie pas automatiquement l'app à moins que DigitalOcean soit configuré pour le faire.

## Remarque

Si vous souhaitez, je peux aussi adapter cette API pour utiliser une base de données managée (PostgreSQL ou MySQL) au lieu de SQLite, ce qui est recommandé pour un vrai site en production.
