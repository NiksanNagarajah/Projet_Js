import Utils from "../../services/Utils.js";
import PokemonProvider from "../../services/PokemonProvider.js";
import PokemonStats from "../../services/PokemonStats.js"; 
import PokemonStars from "../../services/PokemonStars.js";
import DresseurProvider from "../../services/DresseurProvider.js";
import ItemProvider from "../../services/ItemProvider.js";
import FavoriteService from "../../services/FavoriteService.js";
import PokemonRating from "../../services/PokemonRating.js";

export default class PokemonShow {
    async render() {
        let request = Utils.parseRequestURL();
        let poke = await PokemonProvider.getPokemon(request.id);
        console.log(poke);

        if (!poke) {
            return `<div class="container text-center"><h2 class="mt-5">Error 404 - Pokémon non trouvé</h2></div>`;
        }

        const previousPokemonId = poke.pokedex_id <= 1 ? 1025 : poke.pokedex_id - 1;
        const previousPokemon = await PokemonProvider.getPokemon(previousPokemonId);
        const nextPokemonId = poke.pokedex_id >= 1025 ? 1 : poke.pokedex_id + 1;
        const nextPokemon = await PokemonProvider.getPokemon(nextPokemonId);

        let currentDresseur = JSON.parse(localStorage.getItem("dresseur"));
        let itemDonner = null;
        let isFavorite = false;
        
        if (currentDresseur) {
            itemDonner = await DresseurProvider.getDresseurPokemon(currentDresseur.id, poke.pokedex_id);
            if (itemDonner.length > 0) {
                itemDonner = itemDonner[0];
                let item = await ItemProvider.getItem(itemDonner.objet);
                itemDonner = { ...itemDonner, ...item };
                console.log(itemDonner);
                if (itemDonner.type === "Pokéballs") {
                    poke.weight = poke.weight.split(' kg')[0].replace(',', '.');
                    poke.weight = parseFloat(poke.weight) * 1.1;
                    poke.weight = poke.weight.toFixed(1) + " kg";
                    poke.weight = poke.weight.replace('.', ',');
                } else if (itemDonner.type === "Médecine") {
                    poke.height = poke.height.split(' m')[0].replace(',', '.');
                    poke.height = parseFloat(poke.height) * 1.5;
                    poke.height = poke.height.toFixed(1) + " m";
                    poke.height = poke.height.replace('.', ',');
                } 
            }
            
            // Vérifier si le Pokémon est en favoris
            isFavorite = await FavoriteService.isPokemonFavorite(currentDresseur.id, poke.pokedex_id);
        }

        const stars = await PokemonProvider.getPokemonStars(poke.pokedex_id);
        const moyenne = stars.length > 0 ? stars.reduce((acc, curr) => acc + curr.stars, 0) / stars.length : null;
        const dresseurANote = stars.find(star => star.dresseur_id === currentDresseur?.id);

        let spriteOptions = {
            regular: poke.sprites.regular,
            shiny: poke.sprites.shiny,
            gmax: poke.sprites.gmax?.regular || null
        };

        setTimeout(() => {
            function changeSprite(imageUrl, spriteType) {
                document.getElementById("pokemon-sprite").src = imageUrl;
        
                const spriteButtons = document.querySelector(".sprite-buttons");
                spriteButtons.innerHTML = ""; 
        
                if (spriteType !== "normal") {
                    const normalBtn = document.createElement("button");
                    normalBtn.classList.add("btn", "btn-outline-secondary", "m-1");
                    normalBtn.id = "normal-btn";
                    normalBtn.textContent = "Normal";
                    normalBtn.addEventListener("click", () => changeSprite(spriteOptions.regular, "normal"));
                    spriteButtons.appendChild(normalBtn);
                }
        
                if (spriteOptions.shiny && spriteOptions.shiny !== spriteOptions.regular && spriteType !== "shiny") {
                    const shinyBtn = document.createElement("button");
                    shinyBtn.classList.add("btn", "btn-outline-secondary", "m-1");
                    shinyBtn.id = "shiny-btn";
                    shinyBtn.textContent = "Shiny";
                    shinyBtn.addEventListener("click", () => changeSprite(spriteOptions.shiny, "shiny"));
                    spriteButtons.appendChild(shinyBtn);
                }
        
                if (spriteOptions.gmax && spriteOptions.gmax !== spriteOptions.regular && spriteType !== "gmax") {
                    const gmaxBtn = document.createElement("button");
                    gmaxBtn.classList.add("btn", "btn-outline-secondary", "m-1");
                    gmaxBtn.id = "gmax-btn";
                    gmaxBtn.textContent = "Gmax";
                    gmaxBtn.addEventListener("click", () => changeSprite(spriteOptions.gmax, "gmax"));
                    spriteButtons.appendChild(gmaxBtn);
                }
            }
        
            document.getElementById("normal-btn")?.addEventListener("click", () => changeSprite(spriteOptions.regular, "normal"));
            if (spriteOptions.shiny) {
                document.getElementById("shiny-btn")?.addEventListener("click", () => changeSprite(spriteOptions.shiny, "shiny"));
            }
            if (spriteOptions.gmax) {
                document.getElementById("gmax-btn")?.addEventListener("click", () => changeSprite(spriteOptions.gmax, "gmax"));
            }
        
            const ctx = document.getElementById("stats-chart").getContext("2d");
            PokemonStats(poke.stats, itemDonner?.type === "Machines")(ctx);
            PokemonRating.initEvents(poke, currentDresseur, dresseurANote); 

            // Ajouter l'écouteur d'événement pour le bouton de favoris
            const favoriteBtn = document.getElementById("favorite-btn");
            if (favoriteBtn) {
                favoriteBtn.addEventListener("click", async () => {
                    const currentDresseur = JSON.parse(localStorage.getItem("dresseur"));
                    if (!currentDresseur) {
                        alert("Vous devez être connecté pour ajouter ce Pokémon aux favoris.");
                        return;
                    }
                    
                    const isFav = await FavoriteService.isPokemonFavorite(currentDresseur.id, poke.pokedex_id);
                    
                    if (isFav) {
                        await FavoriteService.removeFavorite(currentDresseur.id, poke.pokedex_id);
                        favoriteBtn.innerHTML = '<i class="bi bi-star"></i> Ajouter aux favoris';
                        favoriteBtn.classList.remove("btn-warning");
                        favoriteBtn.classList.add("btn-outline-warning");
                    } else {
                        await FavoriteService.addFavorite(currentDresseur.id, poke.pokedex_id);
                        favoriteBtn.innerHTML = '<i class="bi bi-star-fill"></i> Retirer des favoris';
                        favoriteBtn.classList.remove("btn-outline-warning");
                        favoriteBtn.classList.add("btn-warning");
                    }
                });
            }
        }, 0);

        console.log("Item donner:", itemDonner);

        return `
        <div class="container mt-4">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <a href="./#pokemons/${previousPokemonId}" class="btn btn-outline-secondary"><i class="bi bi-chevron-left"></i> #${previousPokemonId} - ${previousPokemon.name.fr}</a>
                        <h1 class="text-center flex-grow-1">#${poke.pokedex_id} - ${poke.name.fr}</h1>
                        <a href="./#pokemons/${nextPokemonId}" class="btn btn-outline-secondary"> #${nextPokemonId} - ${nextPokemon.name.fr}<i class="bi bi-chevron-right"></i></a>
                    </div>
                    
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="col-md-12 d-flex justify-content-between align-items-center mb-3">
                                <div class="d-inline-flex align-items-center p-2 border rounded shadow-sm bg-light">
                                    <h5 class="mb-0 me-2">Note moyenne :</h5>
                                    <p class="mb-0 fw-bold text-warning">
                                        ${moyenne ? PokemonStars(moyenne.toFixed(1)) : '<span class="text-muted">Aucune note</span>'}
                                    </p>
                                </div>
                                ${currentDresseur ? 
                                    `<button id="favorite-btn" class="btn ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}">
                                        <i class="bi bi-${isFavorite ? 'star-fill' : 'star'}"></i> 
                                        ${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                    </button>` 
                                    : ''
                                }
                            </div>
                            <div class="row">
                                <div class="col-md-5 text-center">
                                    <img id="pokemon-sprite" src="${spriteOptions.regular}" alt="${poke.name.fr}" class="img-fluid mb-3" loading="lazy">
                                    <div class="sprite-buttons text-center mb-3">
                                        ${spriteOptions.regular !== poke.sprites.regular ? `<button id="normal-btn" class="btn btn-outline-secondary m-1">Normal</button>` : ""}
                                        ${spriteOptions.shiny && spriteOptions.shiny !== poke.sprites.regular ? `<button id="shiny-btn" class="btn btn-outline-secondary m-1">Shiny</button>` : ""}
                                        ${spriteOptions.gmax && spriteOptions.gmax !== poke.sprites.regular ? `<button id="gmax-btn" class="btn btn-outline-secondary m-1">Gmax</button>` : ""}
                                    </div>
                                    ${PokemonRating.getHTML(poke, currentDresseur, dresseurANote)}
                                </div>
                                <div class="col-md-7">
                                    <h4 class="card-title mb-3">Informations du Pokémon</h4>
                                    <div class="row">
                                        <div class="col-6">
                                            <p><strong>Catégorie :</strong> ${poke.category}</p>
                                            <p><strong>Génération :</strong> ${poke.generation}</p>
                                            <p><strong>Taille :</strong> ${poke.height || "Inconnu"}<span style="color: green;">${itemDonner && itemDonner.type === "Médecine" ? " (+50%)" : ""}</span></p>
                                            <p><strong>Poids :</strong> ${poke.weight || "Inconnu"}<span style="color: green;">${itemDonner && itemDonner.type === "Pokéballs" ? " (+10%)" : ""}</span></p>
                                        </div>
                                        <div class="col-6">
                                            <p>
                                                <strong>Types :</strong> 
                                                ${poke.types ? poke.types.map(type => `<img src="${type.image}" title=${type.name} alt="${type.name}" class="type-icon" style="max-width: 30px; height: auto; margin-right: 5px;" loading="lazy">`).join(" ") : "Aucun"}
                                            </p>
                                            <p><strong>Talents :</strong> ${poke.talents ? poke.talents.map(talent => talent.name).join(", ") : "Aucun"}</p>
                                            ${itemDonner && itemDonner.objet !== null && Object.keys(itemDonner).length !== 0 ?
                                                `<p style="color: green;"><img src="${itemDonner.url}" class="rounded-circle border p-2 bg-light" alt="${itemDonner.name}" style="width: 48px; height: 48px; margin-right: 10px;">${itemDonner.name}</p>`
                                                : ""
                                            }
                                            
                                        </div>
                                    </div>
                                    <canvas id="stats-chart" class="mt-3" width="400" height="300"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
}