@echo off
docker run -d --name pokefiesta -p 8080:8080 -p 3000:3000 pokefiesta

start "" http://localhost:3000
start "" http://localhost:8080
pause