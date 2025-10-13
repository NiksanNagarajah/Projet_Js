@echo off
docker run -d -p 8080:8080 -p 3000:3000 --name pokefiesta pokefiesta

start "" http://localhost:3000
start "" http://localhost:8080
pause