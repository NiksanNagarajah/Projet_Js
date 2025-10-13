#!/bin/sh
# Lancer JSON Server en arrière-plan
json-server --watch pokemon.json --host 0.0.0.0 --port 3000 &

# Lancer PHP en premier plan (le container reste vivant)
php -S 0.0.0.0:8080
