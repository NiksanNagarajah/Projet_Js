import PokemonProvider from "../../services/PokemonProvider.js";

export default class PokemonAll {
    async render() {
        let pokemons = await PokemonProvider.getAllPokemon();

        let view = `
        <section class="pokedex-container">
            <h2 class="pokedex-title">Pokédex</h2>
            <div class="pokemon-grid">
                ${pokemons.map(pokemon => `
                    <div class="pokemon-card">
                        <a href="./#pokemons/${pokemon.id}" class="pokemon-link">
                            <img class="pokemon-sprite" src="${pokemon.sprites.regular}" alt="${pokemon.name.fr}">
                            <p class="pokemon-name">#${pokemon.pokedex_id} - ${pokemon.name.fr}</p>
                        </a>
                    </div>
                `).join("")}
            </div>
        </section>
        `;

        return view;
    }
}