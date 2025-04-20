# File managment express

## Objectif

Création d'un gestionnaire de fichiers.

- Authentification avec un API key
- Upload de fichiers
- Téléchargement de fichiers
- Suppression de fichiers

## Installation

```bash
git clone https://github.com/math-dev-24/file-managment-express-api.git
cd file-managment-express-api
npm install
npm run dev
```

## Configuration

Copier le fichier `.exemple.env` en `.env` et remplir les variables.

## Documentation

### API

L'API est documentée avec Swagger. Via l'url `/docs`.

### Routes

- `/user/subscription`
  - method: POST
  - Créer un compte
- `/user/apiKey/{userId}`
  - method: POST
  - Créer une clé API pour un utilisateur
  - Besoin de votre mot de passe et user ID
  - ...
- `/user/all`
  - Obtenir tous les utilisateurs
  - ...
- `/user`
  - Obtenir un utilisateur par ID
  - Mettre à jour un utilisateur
  - Supprimer un utilisateur
  - ...
- `/file`
  - Uploader un fichier
  - Obtenir tous les fichiers
  - Obtenir un fichier par ID
  - Télécharger un fichier
  - Supprimer un fichier
  - ...