import Utils from "../../services/Utils.js";
import PokemonProvider from "../../services/PokemonProvider.js";
import PokemonStats from "../../services/PokemonStats.js"; 

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
            PokemonStats(poke.stats)(ctx);
        }, 0);

        return `
        <div class="container mt-4">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <a href="./#pokemons/${previousPokemonId}" class="btn btn-outline-secondary"><i class="bi bi-chevron-left"></i> # ${previousPokemonId} - ${previousPokemon.name.fr}</a>
                        <h1 class="text-center flex-grow-1">#${poke.pokedex_id} - ${poke.name.fr}</h1>
                        <a href="./#pokemons/${nextPokemonId}" class="btn btn-outline-secondary"> # ${nextPokemonId} - ${nextPokemon.name.fr}<i class="bi bi-chevron-right"></i></a>
                    </div>
                    
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-5 text-center">
                                    <img id="pokemon-sprite" src="${spriteOptions.regular}" alt="${poke.name.fr}" class="img-fluid mb-3" loading="lazy">
                                    <div class="sprite-buttons text-center mb-3">
                                        ${spriteOptions.regular !== poke.sprites.regular ? `<button id="normal-btn" class="btn btn-outline-secondary m-1">Normal</button>` : ""}
                                        ${spriteOptions.shiny && spriteOptions.shiny !== poke.sprites.regular ? `<button id="shiny-btn" class="btn btn-outline-secondary m-1">Shiny</button>` : ""}
                                        ${spriteOptions.gmax && spriteOptions.gmax !== poke.sprites.regular ? `<button id="gmax-btn" class="btn btn-outline-secondary m-1">Gmax</button>` : ""}
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <h4 class="card-title mb-3">Informations du Pokémon</h4>
                                    <div class="row">
                                        <div class="col-6">
                                            <p><strong>Catégorie :</strong> ${poke.category}</p>
                                            <p><strong>Génération :</strong> ${poke.generation}</p>
                                            <p><strong>Taille :</strong> ${poke.height || "Inconnu"}</p>
                                            <p><strong>Poids :</strong> ${poke.weight || "Inconnu"}</p>
                                        </div>
                                        <div class="col-6">
                                            <p>
                                                <strong>Types :</strong> 
                                                ${poke.types ? poke.types.map(type => `<img src="${type.image}" alt="${type.name}" class="type-icon" style="max-width: 30px; margin-right: 5px;" loading="lazy">`).join(" ") : "Aucun"}
                                            </p>
                                            <p><strong>Talents :</strong> ${poke.talents ? poke.talents.map(talent => talent.name).join(", ") : "Aucun"}</p>
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