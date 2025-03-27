import { DRESSEUR_POINT, FAVORIS_POINT } from "../config.js";
import AuthService from "./AuthService.js";
import PokemonProvider from "./PokemonProvider.js";

const FavoritesService = {
    async addToFavorites(pokemonId) {
        const currentDresseur = AuthService.getCurrentDresseur();
        if (!currentDresseur) {
            return { success: false, message: "Vous devez être connecté" };
        }
        const favoriteData = {
            dresseur_id: currentDresseur.id,
            pokemon_id: pokemonId
        };
        try {
            const response = await fetch(FAVORIS_POINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(favoriteData)
            });
            if (response.ok) {
                return { success: true, message: "Pokémon ajouté aux favoris" };
            } else {
                return { success: false, message: "Erreur lors de l'ajout aux favoris" };
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout aux favoris :", error);
            return { success: false, message: "Erreur réseau" };
        }
    },

    async removeFromFavorites(pokemonId) {
        const currentDresseur = AuthService.getCurrentDresseur();
        if (!currentDresseur) {
            return { success: false, message: "Vous devez être connecté" };
        }
        try {
            const response = await fetch(`${FAVORIS_POINT}/${pokemonId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                return { success: true, message: "Pokémon retiré des favoris" };
            } else {
                return { success: false, message: "Erreur lors de la suppression des favoris" };
            }
        } catch (error) {
            console.error("Erreur lors de la suppression des favoris :", error);
            return { success: false, message: "Erreur réseau" };
        }
    },

    async getFavorites() {
        const currentDresseur = AuthService.getCurrentDresseur();
        if (!currentDresseur) {
            return [];
        }
        try {
            const response = await fetch(FAVORIS_POINT);
            if (response.ok) {
                const favorites = await response.json();
                return favorites;
            } else {
                console.error("Erreur lors de la récupération des favoris");
                return [];
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des favoris :", error);
            return [];
        }
    },

    async isFavorite(pokemonId) {
        const favorites = await this.getFavorites();
        return favorites.some(fav => fav.pokemon_id === pokemonId);
    }
};

export default FavoritesService;