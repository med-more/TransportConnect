# 🚛 TransportConnect

> **Plateforme MERN multi-rôle pour la logistique du transport de marchandises**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](https://github.com/your-username/transportconnect)

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Documentation](#-api-documentation)
- [Déploiement](#-déploiement)
- [Tests](#-tests)
- [Contribution](#-contribution)
- [Support](#-support)
- [Licence](#-licence)

## 🎯 À Propos

**TransportConnect** est une application web complète qui connecte les conducteurs de véhicules de transport avec les expéditeurs ayant besoin d'envoyer des marchandises. La plateforme facilite la logistique du transport en permettant aux conducteurs de publier leurs trajets disponibles et aux expéditeurs de rechercher des solutions de transport adaptées à leurs besoins.

### 🎭 Rôles Utilisateurs

- **👤 Conducteurs** : Publient des annonces de trajets et gèrent les demandes de transport
- **📦 Expéditeurs** : Recherchent des trajets et envoient des demandes de transport
- **⚡ Administrateurs** : Modèrent la plateforme et accèdent aux statistiques

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- Inscription/Connexion sécurisée avec JWT
- Gestion des rôles et permissions
- Protection des routes sensibles
- Validation des données côté client/serveur

### 🚗 Gestion des Trajets (Conducteurs)
- Publication d'annonces de trajets avec détails complets
- Gestion des demandes reçues (acceptation/refus)
- Historique des trajets effectués
- Système d'évaluation des expéditeurs

### 📋 Recherche & Demandes (Expéditeurs)
- Recherche avancée de trajets avec filtres
- Envoi de demandes de transport détaillées
- Suivi du statut des demandes
- Évaluation des conducteurs

### 📊 Dashboard Administrateur
- Statistiques complètes de la plateforme
- Gestion des utilisateurs (validation, suspension)
- Modération des annonces
- Graphiques de performance (react-chartjs-2)

### 🔔 Fonctionnalités Avancées
- Notifications en temps réel (Socket.IO)
- Système d'évaluations bidirectionnel
- Messagerie intégrée
- Notifications par email (Nodemailer)
- Interface responsive (Mobile-first)

## 🛠 Technologies

### Backend
```
Node.js          - Runtime JavaScript
Express.js       - Framework web
MongoDB          - Base de données NoSQL
Mongoose         - ODM pour MongoDB
JWT              - Authentification
Bcrypt           - Hashage des mots de passe
Socket.IO        - Communications temps réel
Nodemailer       - Envoi d'emails
Express-validator - Validation des données
```

### Frontend
```
React.js         - Bibliothèque UI
React Router     - Routage côté client
Tailwind CSS     - Framework CSS utilitaire
React Hook Form  - Gestion des formulaires
Axios            - Client HTTP
React-chartjs-2  - Graphiques et statistiques
Lucide React     - Icônes modernes
```

### DevOps & Déploiement
```
Docker           - Containerisation
Nginx            - Reverse proxy & serveur web
PM2              - Process manager
Jenkins          - CI/CD Pipeline
```


## 🚀 Installation

### Prérequis

- **Node.js** v18+ et npm
- **MongoDB** v6+ (local ou Atlas)
- **Git**
- **Docker** (optionnel, pour le déploiement)

### 1. Cloner le Repository

```bash
git clone https://github.com/your-username/transportconnect.git
cd transportconnect
```

### 2. Installation Backend

```bash
cd backend
npm install
```

### 3. Installation Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### 1. Variables d'Environnement Backend

Créez un fichier `.env` dans le dossier `backend/` :

```bash
# Serveur
PORT=5000
NODE_ENV=development

# Base de données
MONGODB_URI=mongodb://localhost:27017/transportconnect
# ou pour MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/transportconnect

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Email (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Autres
CLIENT_URL=http://localhost:3000
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Variables d'Environnement Frontend

Créez un fichier `.env` dans le dossier `frontend/` :

```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🎮 Utilisation

### Mode Développement

#### 1. Démarrer le Backend
```bash
cd backend
npm run dev
```
Le serveur sera accessible sur `http://localhost:5000`

#### 2. Démarrer le Frontend
```bash
cd frontend
npm start
```
L'application sera accessible sur `http://localhost:3000`

### Mode Production

```bash
# Build du frontend
cd frontend
npm run build

# Démarrage avec PM2
cd ../backend
npm run prod
```

## 📚 API Documentation

### Endpoints Principaux

#### 🔐 Authentification
```
POST   /api/auth/register    - Inscription
POST   /api/auth/login       - Connexion
POST   /api/auth/logout      - Déconnexion
GET    /api/auth/profile     - Profil utilisateur
```

#### 👥 Utilisateurs
```
GET    /api/users/profile    - Profil utilisateur
PUT    /api/users/profile    - Mettre à jour le profil
GET    /api/users/:id        - Obtenir un utilisateur
```

#### 📢 Annonces
```
GET    /api/announcements              - Lister les annonces
POST   /api/announcements              - Créer une annonce
GET    /api/announcements/:id          - Détail d'une annonce
PUT    /api/announcements/:id          - Modifier une annonce
DELETE /api/announcements/:id          - Supprimer une annonce
```

#### 📋 Demandes
```
GET    /api/requests                   - Lister les demandes
POST   /api/requests                   - Créer une demande
PUT    /api/requests/:id/accept        - Accepter une demande
PUT    /api/requests/:id/reject        - Refuser une demande
```

#### ⭐ Évaluations
```
POST   /api/ratings                    - Créer une évaluation
GET    /api/ratings/user/:id           - Évaluations d'un utilisateur
```

#### 👑 Administration
```
GET    /api/admin/stats                - Statistiques
GET    /api/admin/users                - Gestion utilisateurs
PUT    /api/admin/users/:id/verify     - Vérifier un utilisateur
PUT    /api/admin/users/:id/suspend    - Suspendre un utilisateur
```

### Collection Postman

Importez la collection Postman disponible dans `docs/TransportConnect.postman_collection.json` pour tester tous les endpoints.

## 🐳 Déploiement

### Avec Docker

#### 1. Construction des Images

```bash
# Backend
docker build -t transportconnect-backend ./backend

# Frontend
docker build -t transportconnect-frontend ./frontend
```

#### 2. Docker Compose

```bash
docker-compose up -d
```

### Avec PM2 et Nginx

#### 1. Configuration PM2

```bash
# Installation globale de PM2
npm install -g pm2

# Démarrage de l'application
pm2 start ecosystem.config.js

# Monitoring
pm2 monit
```

#### 2. Configuration Nginx

Copiez le fichier `nginx/transportconnect.conf` vers `/etc/nginx/sites-available/` et activez-le :

```bash
sudo ln -s /etc/nginx/sites-available/transportconnect.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### CI/CD avec Jenkins

Le pipeline Jenkins est configuré dans `Jenkinsfile` pour :
- Tests automatisés
- Build des applications
- Déploiement automatique
- Notifications en cas d'échec

## 🧪 Tests

### Backend
```bash
cd backend
npm run test          # Tests unitaires
npm run test:watch    # Mode watch
npm run test:coverage # Couverture de code
```

### Frontend
```bash
cd frontend
npm test              # Tests composants
npm run test:e2e      # Tests end-to-end
```

## 📊 Scripts Disponibles

### Backend
```bash
npm start            # Production
npm run dev          # Développement avec nodemon
npm run test         # Tests
npm run seed         # Données de test
```

### Frontend
```bash
npm start            # Développement
npm run build        # Build production
npm run test         # Tests
npm run lint         # Linting
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment procéder :

1. **Fork** le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Standards de Code

- Utilisez **ESLint** et **Prettier** pour le formatage
- Écrivez des **tests** pour les nouvelles fonctionnalités
- Documentez les **changements majeurs**
- Respectez les **conventions de commit**

## 🐛 Support

Pour tout problème ou question :

- 🐞 **Issues** : [GitHub Issues](https://github.com/med-more)
- 📧 **Email** : mohammedbaba1505@gmail.com
- 💬 **Discussion** : [GitHub Discussions](https://medfolio-mb.netlify.app/)


## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.


---

<div align="center">

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

Made with ❤️ by [Your Team Name]

</div>
