import Utils from "../../services/Utils.js";
import PokemonProvider from "../../services/PokemonProvider.js";

export default class PokemonShow {
    async render() {
        let request = Utils.parseRequestURL();
        let poke = await PokemonProvider.getPokemon(request.id);
        console.log(poke);

        if (!poke) {
            return `<h2 style="text-align: center;">Error 404 - Pokémon non trouvé</h2>`;
        }

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
                    normalBtn.id = "normal-btn";
                    normalBtn.textContent = "Normal";
                    normalBtn.addEventListener("click", () => changeSprite(spriteOptions.regular, "normal"));
                    spriteButtons.appendChild(normalBtn);
                }
        
                if (spriteOptions.shiny && spriteOptions.shiny !== spriteOptions.regular && spriteType !== "shiny") {
                    const shinyBtn = document.createElement("button");
                    shinyBtn.id = "shiny-btn";
                    shinyBtn.textContent = "Shiny";
                    shinyBtn.addEventListener("click", () => changeSprite(spriteOptions.shiny, "shiny"));
                    spriteButtons.appendChild(shinyBtn);
                }
        
                if (spriteOptions.gmax && spriteOptions.gmax !== spriteOptions.regular && spriteType !== "gmax") {
                    const gmaxBtn = document.createElement("button");
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
        
        }, 0);
        
        
        

        const previousPokemonId = poke.pokedex_id <= 1 ? 1025 : poke.pokedex_id - 1 ;
        const nextPokemonId = poke.pokedex_id >= 1025 ? 1 : poke.pokedex_id + 1;

        return `
        <section class="pokemon-container">
            <a href="./#pokemons/${previousPokemonId}" class="pokemon-link"><</a>
            <h1 class="pokemon-title">#${poke.pokedex_id} - ${poke.name.fr}</h1>
            <div class="pokemon-card">
                <img id="pokemon-sprite" class="pokemon-sprite" src="${spriteOptions.regular}" alt="${poke.name.fr}" loading="lazy">
                <div class="sprite-buttons">
                    ${spriteOptions.regular !== poke.sprites.regular ? `<button id="normal-btn">Normal</button>` : ""}
                    ${spriteOptions.shiny && spriteOptions.shiny !== poke.sprites.regular ? `<button id="shiny-btn">Shiny</button>` : ""}
                    ${spriteOptions.gmax && spriteOptions.gmax !== poke.sprites.regular ? `<button id="gmax-btn">Gmax</button>` : ""}
                </div>
                <div class="pokemon-info">
                    <p><strong>Catégorie :</strong> ${poke.category}</p>
                    <p><strong>Génération :</strong> ${poke.generation}</p>
                    <p><strong>Taille :</strong> ${poke.height || "Inconnu"}</p>
                    <p><strong>Poids :</strong> ${poke.weight || "Inconnu"}</p>
                    <p><strong>Types :</strong> ${poke.types ? poke.types.map(type => `<img src="${type.image}" alt="${type.name}" class="type-icon">`).join(" ") : "Aucun"}</p>
                    <p><strong>Talents :</strong> ${poke.talents ? poke.talents.map(talent => talent.name).join(", ") : "Aucun"}</p>
                </div>
            </div>
            <a href="./#pokemons/${nextPokemonId}" class="pokemon-link">></a>
        </section>`;
    }
}
