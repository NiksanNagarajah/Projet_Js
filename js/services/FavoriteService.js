import { FAVORITES_POINT } from "../config.js";
import PokemonProvider from "./PokemonProvider.js";

const FavoriteService = {
    async getFavorites(dresseurId) {
        try {
            const response = await fetch(`${FAVORITES_POINT}?dresseur_id=${dresseurId}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des favoris');
            }
            
            const favorites = await response.json();
            
            // Récupérer les détails des Pokémon favoris
            const pokemonPromises = favorites.map(async (fav) => {
                const pokemon = await PokemonProvider.getPokemon(fav.pokemon_id);
                return {
                    ...fav,
                    pokemon
                };
            });
            
            return Promise.all(pokemonPromises);
        } catch (error) {
            console.error('Erreur:', error);
            return [];
        }
    },
    
    async isPokemonFavorite(dresseurId, pokemonId) {
        try {
            const response = await fetch(`${FAVORITES_POINT}?dresseur_id=${dresseurId}&pokemon_id=${pokemonId}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la vérification des favoris');
            }
            
            const favorites = await response.json();
            return favorites.length > 0;
        } catch (error) {
            console.error('Erreur:', error);
            return false;
        }
    },
    
    async addFavorite(dresseurId, pokemonId) {
        try {
            const isFavorite = await this.isPokemonFavorite(dresseurId, pokemonId);
            if (isFavorite) {
                return { success: true, message: "Déjà dans les favoris" };
            }
            
            const response = await fetch(FAVORITES_POINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: `${dresseurId}-${pokemonId}`,
                    dresseur_id: dresseurId,
                    pokemon_id: pokemonId,
                    date_added: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout aux favoris');
            }
            
            return { success: true, message: "Ajouté aux favoris avec succès" };
        } catch (error) {
            console.error('Erreur:', error);
            return { success: false, message: "Erreur lors de l'ajout aux favoris" };
        }
    },
    
    async removeFavorite(dresseurId, pokemonId) {
        try {
            const favoriteId = `${dresseurId}-${pokemonId}`;
            const response = await fetch(`${FAVORITES_POINT}/${favoriteId}`, {
                method: "DELETE"
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression des favoris');
            }
            
            return { success: true, message: "Retiré des favoris avec succès" };
        } catch (error) {
            console.error('Erreur:', error);
            return { success: false, message: "Erreur lors de la suppression des favoris" };
        }
    }
};

export default FavoriteService;