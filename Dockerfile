# Étape 1 : image de base avec PHP
FROM php:8.2-cli

# Étape 2 : installer Node.js (pour JSON Server)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g json-server \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Étape 3 : créer le dossier de travail
WORKDIR /app

# Étape 4 : copier tous les fichiers de ton projet
COPY . .

# Étape 5 : exposer les ports
EXPOSE 3000 8080

# Étape 6 : lancer JSON Server et PHP en parallèle
CMD ["./start.sh"]
