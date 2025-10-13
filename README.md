# PokéFiesta - Application Web Pokémon

## Description

PokéFiesta est une Single Page Application (SPA) de gestion de Pokémon qui permet aux utilisateurs de parcourir un Pokédex, de consulter les détails des Pokémon, de gérer leur équipe personnelle et leur sac d'objets. L'application propose un système d'authentification permettant à chaque dresseur de développer sa propre collection et d'interagir avec les Pokémon.

## Fonctionnalités

### Fonctionnalités principales demandées :
- 📋 **Vue de listing** : Affichage paginé de tous les Pokémon disponibles
- 🔍 **Vue détaillée** : Consultation des caractéristiques d'un Pokémon spécifique
- 📄 **Pagination** : Navigation facilitée à travers le Pokédex
- 🔎 **Recherche** : Outil de recherche pour trouver rapidement un Pokémon
- ⭐ **Système de notation** : Possibilité d'attribuer une note aux Pokémon
- ❤️ **Favoris** : Ajout/suppression de Pokémon aux favoris 
- 🖼️ **Lazy loading** : Chargement optimisé des images
- 🔄 **Relations complexes** : Implémentation de relations 1-n et n-n entre les données

### Fonctionnalités additionnelles :
- 🔐 **Système d'authentification** : Inscription et connexion des dresseurs
- 🧩 **Gestion d'équipe** : Consultation et personnalisation de votre équipe Pokémon
- 🎒 **Sac d'objets** : Gestion de votre inventaire d'objets
- 👤 **Profil utilisateur** : Consultation et gestion de votre profil de dresseur

## Structure du Projet

Le projet est organisé selon une architecture modulaire :
- `index.html` : Point d'entrée unique de l'application (SPA)
- `js/` : Contient tous les scripts JavaScript
  - `App.js` : Routeur principal de l'application
  - `config.js` : Configuration des points d'accès à l'API
  - `services/` : Services pour la gestion des données
    - `AuthService.js` : Gestion de l'authentification
    - `PokemonProvider.js` : Accès aux données des Pokémon
    - `ItemProvider.js` : Accès aux données des objets
    - `FavoriteService.js` : Gestion des favoris
    - `PokemonRating.js` : Système de notation
    - `PokemonStats.js` : Affichage visuel statistiques des Pokémon
    - `PokemonStars.js` : Affichage visuel des notations avec étoiles
    - `DresseurProvider.js` : Accès aux données des dresseurs
    - `Utils.js` : Fonctions utilitaires
  - `views/pages/` : Composants de pages
    - `PokemonAll.js` : Affichage paginé des Pokémon du Pokédex
    - `PokemonShow.js` : Page détaillée d'un Pokémon spécifique
    - `PokemonSearch.js` : Recherche et filtrage des Pokémon
    - `Favorites.js` : Gestion et affichage des Pokémon favoris
    - `Home.js` : Page d'accueil de l'application
    - `About.js` : Page d'information sur l'application
    - `ItemAll.js` : Affichage de tous les objets disponibles
    - `ItemShow.js` : Page détaillée d'un objet spécifique
    - `Login.js` : Page de connexion pour les dresseurs
    - `Signup.js` : Page d'inscription pour les nouveaux dresseurs
    - `Profil.js` : Gestion du profil du dresseur connecté
    - `MyPokemon.js` : Gestion de l'équipe personnelle de Pokémon
    - `MyBag.js` : Gestion du sac d'objets personnel
- `css/` : Fichiers de style CSS
- `images/` : Images 

## Installation et démarrage

Cloner le dépôt :
   ```
   git clone https://github.com/votre-nom/PokeFiesta.git
   cd PokeFiesta
   ```

### Localement

1. Installer json-server (si non installé) :
   ```
   npm install -g json-server
   ```

2. Lancer le serveur JSON pour les données :
   ```
   chmod +x json_server.sh
   ./json_server.sh
   ```
   Ou manuellement :
   ```
   npx json-server pokemon.json
   ```

3. Lancer le serveur web :
   ```
   chmod +x launch.sh
   ./launch.sh
   ```
   Ou manuellement :
   ```
   php -S localhost:8080
   ```

4. Accéder à l'application :
   Ouvrez votre navigateur et accédez à `http://localhost:8080`

### Avec Docker

1. Construire l'image Docker :
   ```
   createContainer.bat
   ```
   ou manuellement :
   ```
   docker build -t pokefiesta .
   ```

2. Lancer le container Docker :
   ```
   launchPokeFiesta.bat
   ```
   ou manuellement :
   ```
   docker run -d -p 8080:8080 -p 3000:3000 --name pokefiesta pokefiesta
   ```

3. Accéder à l'application :
   Ouvrez votre navigateur et accédez à `http://localhost:8080`
   et à l'API JSON Server à `http://localhost:3000`

Un script `stopPokefiesta.bat` est également fourni pour arrêter et supprimer le container Docker.

### Compte de test

  - Email : `a@a.com`
  - Mot de passe : `a`

## Technologie utilisées

- 🌐 **HTML/CSS** : Structure et style de l'application
- 📜 **JavaScript** : Programmation orientée objet, modules ES6
- 🎨 **Bootstrap** : Framework CSS pour l'interface utilisateur
- 🗄️ **JSON Server** : API REST simulée pour les données
- 🔧 **PHP** : Serveur web local

## Fonctionnement

L'application suit une architecture Single Page Application (SPA) :
- Routage client-side avec des URL fragmentées (#)
- Communication avec l'API JSON Server pour les données persistantes
- Gestion locale des favoris via le localStorage
- Modèles de données relationnels avec dresseurs, pokémon et objets

## Auteurs

- Niksan NAGARAJAH
- Arthur JOUAN

