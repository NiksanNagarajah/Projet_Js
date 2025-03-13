import Utils from "../../services/Utils.js";
import PokemonProvider from "../../services/PokemonProvider.js";

export default class PokemonShow {
    async render() {
        let request = Utils.parseRequestURL();
        let poke = await PokemonProvider.getPokemon(request.id);

        if (!poke) {
            return `<section><h1>Pokémon non trouvé</h1></section>`;
        }

        return `
        <section class="pokemon-container">
            <h1 class="pokemon-title">#${poke.pokedex_id} - ${poke.name.fr}</h1>
            <div class="pokemon-card">
                <img class="pokemon-sprite" src="${poke.sprites.regular}" alt="${poke.name.fr}">
                <div class="pokemon-info">
                    <p><strong>Catégorie :</strong> ${poke.category}</p>
                    <p><strong>Génération :</strong> ${poke.generation}</p>
                    <p><strong>Taille :</strong> ${poke.height || "Inconnu"}</p>
                    <p><strong>Poids :</strong> ${poke.weight || "Inconnu"}</p>
                    <p><strong>Types :</strong> ${poke.types ? poke.types.map(type => `<img src="${type.image}" alt="${type.name}" class="type-icon">`).join(" ") : "Aucun"}</p>
                    <p><strong>Talents :</strong> ${poke.talents ? poke.talents.map(talent => talent.name).join(", ") : "Aucun"}</p>
                </div>
            </div>
        </section>
        `;
    }
}