// PokemonRating.js
import PokemonProvider from "./PokemonProvider.js";

export default class PokemonRating {
    /**
     * Initialise le système de notation pour un Pokémon
     * @param {Object} pokemon - Le Pokémon à noter
     * @param {Object} dresseur - Le dresseur qui note
     * @param {Object} dresseurANote - L'éventuelle note existante du dresseur
     * @returns {String} - Le HTML à insérer dans la page
     */
    static getHTML(pokemon, dresseur, dresseurANote) {
        if (!dresseur) return '';

        return `
        <div class="mt-3 rating-container">
            <h5>${dresseurANote ? 'Modifier votre note' : 'Ajouter une note'}</h5>
            <div class="d-flex justify-content-center align-items-center">
                <div class="rating-stars my-2">
                    <i class="bi bi-star rating-star" data-value="1"></i>
                    <i class="bi bi-star rating-star" data-value="2"></i>
                    <i class="bi bi-star rating-star" data-value="3"></i>
                    <i class="bi bi-star rating-star" data-value="4"></i>
                    <i class="bi bi-star rating-star" data-value="5"></i>
                    <input type="hidden" id="selected-rating" value="${dresseurANote ? dresseurANote.stars : '0'}">
                </div>
            </div>
            <button id="submit-rating" class="btn btn-primary btn-sm mt-2" ${dresseurANote ? '' : 'disabled'}>
                ${dresseurANote ? 'Mettre à jour' : 'Soumettre'} ma note
            </button>
            <div id="rating-status" class="mt-2"></div>
        </div>
        `;
    }

    /**
     * Initialise les événements du système de notation
     * @param {Object} pokemon - Le Pokémon à noter
     * @param {Object} dresseur - Le dresseur qui note
     * @param {Object} dresseurANote - L'éventuelle note existante du dresseur
     */
    static initEvents(pokemon, dresseur, dresseurANote) {
        if (!dresseur) return;
        
        const ratingStars = document.querySelectorAll('.rating-star');
        const submitRatingBtn = document.getElementById('submit-rating');
        
        // Ajouter des événements pour les étoiles de notation
        ratingStars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-value'));
                
                // Mettre à jour l'apparence des étoiles
                ratingStars.forEach(s => {
                    const starValue = parseInt(s.getAttribute('data-value'));
                    s.classList.remove('bi-star-fill', 'bi-star');
                    s.classList.add(starValue <= rating ? 'bi-star-fill' : 'bi-star');
                    if (starValue <= rating) {
                        s.classList.add('text-warning');
                    } else {
                        s.classList.remove('text-warning');
                    }
                });
                
                // Mettre à jour le score sélectionné
                document.getElementById('selected-rating').value = rating;
                submitRatingBtn.disabled = false;
            });
        });
        
        // Gérer la soumission de la note
        submitRatingBtn.addEventListener('click', async () => {
            const rating = parseInt(document.getElementById('selected-rating').value);
            if (rating >= 1 && rating <= 5) {
                try {
                    const result = await PokemonProvider.ratePokemon(
                        pokemon.pokedex_id, 
                        dresseur.id, 
                        rating, 
                        dresseurANote ? 'update' : 'create'
                    );
                    
                    if (result) {
                        // Mettre à jour l'affichage sans recharger la page
                        const ratingStatusEl = document.getElementById('rating-status');
                        ratingStatusEl.textContent = dresseurANote ? 'Note modifiée avec succès!' : 'Note ajoutée avec succès!';
                        ratingStatusEl.classList.add('text-success');
                        
                        // Attendre un moment puis recharger la page pour montrer la nouvelle moyenne
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    }
                } catch (error) {
                    console.error('Erreur lors de la notation:', error);
                    const ratingStatusEl = document.getElementById('rating-status');
                    ratingStatusEl.textContent = 'Erreur lors de la notation. Veuillez réessayer.';
                    ratingStatusEl.classList.add('text-danger');
                }
            }
        });
        
        // Préremplir les étoiles si le dresseur a déjà noté
        if (dresseurANote) {
            const existingRating = dresseurANote.stars;
            ratingStars.forEach(star => {
                const starValue = parseInt(star.getAttribute('data-value'));
                star.classList.remove('bi-star-fill', 'bi-star');
                star.classList.add(starValue <= existingRating ? 'bi-star-fill' : 'bi-star');
                if (starValue <= existingRating) {
                    star.classList.add('text-warning');
                }
            });
            document.getElementById('selected-rating').value = existingRating;
        }
    }
}