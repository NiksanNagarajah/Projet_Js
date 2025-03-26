import PokemonProvider from "../../services/PokemonProvider.js";

export default class PokemonSearch {
    constructor() {
        this.searchTerm = '';
        this.filteredPokemons = [];
    }

    async render(term) {
        this.searchTerm = decodeURIComponent(term);

        const allPokemons = await PokemonProvider.getAllPokemon();
        
        // Filtrer les Pokemon par nom (en français, insensible à la casse)
        this.filteredPokemons = allPokemons.filter(pokemon => 
            pokemon.name.fr.toLowerCase().includes(this.searchTerm.toLowerCase())
        );

        let view = `
            <div class="container mt-4">
                <h2>Résultats de recherche pour "${this.searchTerm}"</h2>
                <p>${this.filteredPokemons.length} Pokémon trouvés</p>
                
                <div class="pokemon-grid">
                    ${this.filteredPokemons.map(pokemon => `
                        <div class="pokemon-card">
                            <a href="./#pokemons/${pokemon.pokedex_id}" class="pokemon-link">
                                <img class="pokemon-sprite" src="${pokemon.sprites.regular}" alt="${pokemon.name.fr}" loading="lazy">
                                <p class="pokemon-name">${pokemon.pokedex_id}. ${pokemon.name.fr}</p>
                            </a>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
        return view;
    }

    async afterRender() {
        // Méthode laissée vide pour des fonctionnalités potentielles futures
    }
}