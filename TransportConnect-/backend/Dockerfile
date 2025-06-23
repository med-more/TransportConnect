# Utiliser une image Node officielle comme image de base
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste de l'application
COPY . .

# Exposer le port utilisé par l'application
EXPOSE 5000

# Démarrer l'application
CMD ["node", "server.js"] 