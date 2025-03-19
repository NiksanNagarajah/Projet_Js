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
            function changeSprite(imageUrl) {
                document.getElementById("pokemon-sprite").src = imageUrl;
            }
            
            document.getElementById("normal-btn")?.addEventListener("click", () => changeSprite(spriteOptions.regular));
            if (spriteOptions.shiny) {
                document.getElementById("shiny-btn")?.addEventListener("click", () => changeSprite(spriteOptions.shiny));
            }
            if (spriteOptions.gmax) {
                document.getElementById("gmax-btn")?.addEventListener("click", () => changeSprite(spriteOptions.gmax));
            }
        }, 0);

        return `
        <section class="pokemon-container">
            <h1 class="pokemon-title">#${poke.pokedex_id} - ${poke.name.fr}</h1>
            <div class="pokemon-card">
                <img id="pokemon-sprite" class="pokemon-sprite" src="${spriteOptions.regular}" alt="${poke.name.fr}" loading="lazy">
                <div class="sprite-buttons">
                    <button id="normal-btn">Normal</button>
                    ${spriteOptions.shiny ? `<button id="shiny-btn">Shiny</button>` : ""}
                    ${spriteOptions.gmax ? `<button id="gmax-btn">Gmax</button>` : ""}
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
        </section>`;
    }
}
