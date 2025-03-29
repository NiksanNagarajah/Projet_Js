import AuthService from "../../services/AuthService.js";
import FavoriteService from "../../services/FavoriteService.js";

export default class Favorites {
    constructor() {
        this.currentDresseur = AuthService.getCurrentDresseur();
        this.addCSS(); // Appeler la méthode pour ajouter le lien vers le CSS
    }

    // Méthode pour ajouter dynamiquement le lien vers le CSS
    addCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './css/favoris.css'; // Remplace 'path/to/styles.css' par le chemin réel vers ton fichier CSS
        document.head.appendChild(link);
    }

    async render() {
        if (!this.currentDresseur) {
            return `
            <div class="favorites-container">
                <div class="alert alert-warning">
                    <h3>Vous devez être connecté pour voir vos favoris</h3>
                    <p>Veuillez vous <a href="#login">connecter</a> ou <a href="#signup">créer un compte</a> pour continuer.</p>
                </div>
            </div>`;
        }

        return `
        <div class="favorites-container">
            <h1>Mes Pokémon Favoris</h1>
            <div id="favorites-content" class="pokemon-list">
                <div class="loading">Chargement...</div>
            </div>
        </div>`;
    }

    async afterRender() {
        if (!this.currentDresseur) return;

        const favoritesContainer = document.getElementById("favorites-content");

        try {
            const favorites = await FavoriteService.getFavorites(this.currentDresseur.id);

            if (favorites.length === 0) {
                this.showEmptyFavoritesMessage(favoritesContainer);
                return;
            }

            favoritesContainer.innerHTML = favorites.map(item => {
                const pokemon = item.pokemon;
                return `
                <div class="pokemon-card favorite-item">
                    <h5 class="pokemon-title">#${pokemon.pokedex_id} - ${pokemon.name.fr}</h5>
                    <img src="${pokemon.sprites.regular}" alt="${pokemon.name.fr}" class="pokemon-image" loading="lazy">
                    <div class="card-content">
                        <div class="type-container">
                            ${pokemon.types ? pokemon.types.map(type => 
                                `<img src="${type.image}" alt="${type.name}" class="type-icon" loading="lazy">`
                            ).join('') : ''}
                        </div>
                        
                        <div class="card-buttons">
                            <a href="#pokemons/${pokemon.pokedex_id}" class="btn-details">Détails</a>
                            <button class="btn-remove-favorite" data-pokemon-id="${pokemon.pokedex_id}">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>`
            }).join("");

            // Ajout des écouteurs d'événements pour les boutons de suppression
            document.querySelectorAll(".btn-remove-favorite").forEach(button => {
                button.addEventListener("click", async (e) => {
                    const pokemonId = e.currentTarget.getAttribute("data-pokemon-id");
                    const result = await FavoriteService.removeFavorite(this.currentDresseur.id, pokemonId);

                    if (result.success) {
                        location.reload(); // Rafraîchissement immédiat
                    } else {
                        alert("Erreur lors de la suppression: " + result.message);
                    }
                });
            });

        } catch (error) {
            console.error("Erreur lors du chargement des favoris:", error);
            favoritesContainer.innerHTML = `
            <div class="alert alert-danger">
                <h4>Erreur lors du chargement des favoris</h4>
                <p>Veuillez réessayer plus tard.</p>
            </div>`;
        }
    }

    showEmptyFavoritesMessage(container) {
        container.innerHTML = `
        <div class="alert alert-info">
            <h4>Vous n'avez pas encore de Pokémon favoris</h4>
            <p>Explorez le <a href="#pokemons">Pokédex</a> et ajoutez vos Pokémon préférés !</p>
        </div>`;
    }
}
