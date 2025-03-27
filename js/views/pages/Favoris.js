import PokemonProvider from "../../services/PokemonProvider.js";
import FavoritesService from "../../services/FavoritesService.js";
import AuthService from "../../services/AuthService.js";

export default class Favoris {
    async render() {
        const currentDresseur = AuthService.getCurrentDresseur();

        // If not logged in, show login prompt
        if (!currentDresseur) {
            return `
            <div class="container mt-4 text-center">
                <div class="alert alert-warning">
                    <h3>Accès aux favoris</h3>
                    <p>Vous devez être connecté pour voir vos Pokémon favoris.</p>
                    <a href="#login" class="btn btn-primary mt-3">Se connecter</a>
                </div>
            </div>`;
        }

        // Get favorite Pokemon IDs
        const favorites = await FavoritesService.getFavorites();
        
        // If no favorites
        if (favorites.length === 0) {
            return `
            <div class="container mt-4">
                <div class="alert alert-info text-center">
                    <h3>Favoris</h3>
                    <p>Vous n'avez pas encore de Pokémon en favoris.</p>
                    <a href="#pokemons" class="btn btn-primary mt-3">Découvrir des Pokémon</a>
                </div>
            </div>`;
        }

        // Get full Pokemon details for each favorite
        const favoritePokemons = await Promise.all(
            favorites.map(fav => PokemonProvider.getPokemon(fav.pokemon_id))
        );

        // Render favorites
        return `
        <div class="container mt-4">
            <h2 class="mb-4">Mes Pokémon Favoris</h2>
            <div class="pokemon-grid">
                ${favoritePokemons.map(pokemon => `
                    <div class="pokemon-card">
                        <a href="./#pokemons/${pokemon.pokedex_id}" class="pokemon-link">
                            <img class="pokemon-sprite" src="${pokemon.sprites.regular}" alt="${pokemon.name.fr}" loading="lazy">
                            <p class="pokemon-name">${pokemon.pokedex_id}. ${pokemon.name.fr}</p>
                        </a>
                    </div>
                `).join("")}
            </div>
        </div>`;
    }

    async afterRender() {
        // You can add additional interactivity here if needed
    }
}