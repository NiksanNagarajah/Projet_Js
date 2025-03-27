import PokemonProvider from "../../services/PokemonProvider.js";

export default class PokemonSearch {
    constructor() {
        this.searchTerm = '';
        this.selectedType = '';
        this.filteredPokemons = [];
    }

    async render(term = '', type = '') {
        this.searchTerm = decodeURIComponent(term);
        this.selectedType = type;
        
        const allPokemons = await PokemonProvider.getAllPokemon();
        
        // Filter Pokémon by name and type
        this.filteredPokemons = allPokemons.filter(pokemon => {
            const nameMatch = !this.searchTerm.trim() || 
                pokemon.name.fr.toLowerCase().includes(this.searchTerm.toLowerCase());
            
            const typeMatch = !this.selectedType || 
                pokemon.types.some(t => 
                    t.name.toLowerCase() === this.selectedType.toLowerCase()
                );
            
            return nameMatch && typeMatch;
        });

        let view = `
        <div class="container mt-4">
            <form id="pokemon-search-form" class="mb-4">
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <input type="text" id="search-input" class="form-control" 
                               placeholder="Rechercher un Pokémon" 
                               value="${this.searchTerm}">
                    </div>
                    <div class="col-md-4 mb-2">
                        <select id="type-select" class="form-control">
                            <option value="">Tous les types</option>
                            <option value="acier" ${this.selectedType === 'acier' ? 'selected' : ''}>Acier</option>
                            <option value="combat" ${this.selectedType === 'combat' ? 'selected' : ''}>Combat</option>
                            <option value="dragon" ${this.selectedType === 'dragon' ? 'selected' : ''}>Dragon</option>
                            <option value="eau" ${this.selectedType === 'eau' ? 'selected' : ''}>Eau</option>
                            <option value="electrik" ${this.selectedType === 'electrik' ? 'selected' : ''}>Électrik</option>
                            <option value="feu" ${this.selectedType === 'feu' ? 'selected' : ''}>Feu</option>
                            <option value="glace" ${this.selectedType === 'glace' ? 'selected' : ''}>Glace</option>
                            <option value="insecte" ${this.selectedType === 'insecte' ? 'selected' : ''}>Insecte</option>
                            <option value="normal" ${this.selectedType === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="plante" ${this.selectedType === 'plante' ? 'selected' : ''}>Plante</option>
                            <option value="poison" ${this.selectedType === 'poison' ? 'selected' : ''}>Poison</option>
                            <option value="psy" ${this.selectedType === 'psy' ? 'selected' : ''}>Psy</option>
                            <option value="roche" ${this.selectedType === 'roche' ? 'selected' : ''}>Roche</option>
                            <option value="sol" ${this.selectedType === 'sol' ? 'selected' : ''}>Sol</option>
                            <option value="spectre" ${this.selectedType === 'spectre' ? 'selected' : ''}>Spectre</option>
                            <option value="tenebre" ${this.selectedType === 'tenebre' ? 'selected' : ''}>Ténèbre</option>
                            <option value="vol" ${this.selectedType === 'vol' ? 'selected' : ''}>Vol</option>
                            <option value="fee" ${this.selectedType === 'fee' ? 'selected' : ''}>Fée</option>
                        </select>
                    </div>
                    <div class="col-md-2 mb-2">
                        <button id="search-btn" class="btn btn-primary w-100">Rechercher</button>
                    </div>
                </div>
            </form>
            
            <h2>
                ${this.searchTerm || this.selectedType 
                    ? `Résultats ${this.searchTerm ? `pour "${this.searchTerm}"` : ''} 
                       ${this.selectedType ? `(Type: ${this.selectedType})` : ''}` 
                    : 'Tous les Pokémon'}
            </h2>
            <p>${this.filteredPokemons.length} Pokémon trouvés</p>
            
            <div class="pokemon-grid">
                ${this.filteredPokemons.map(pokemon => `
                    <div class="pokemon-card">
                        <a href="./#pokemons/${pokemon.pokedex_id}" class="pokemon-link">
                            <img class="pokemon-sprite" src="${pokemon.sprites.regular}" alt="${pokemon.name.fr}" loading="lazy">
                            <p class="pokemon-name">${pokemon.pokedex_id}. ${pokemon.name.fr}</p>
                            <p class="pokemon-types">${pokemon.types.map(t => t.name).join(', ')}</p>
                        </a>
                    </div>
                `).join("")}
            </div>
        </div>
        `;
        return view;
    }

    async afterRender() {
        const searchInput = document.getElementById('search-input');
        const typeSelect = document.getElementById('type-select');
        const searchBtn = document.getElementById('search-btn');

        searchBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const searchTerm = searchInput.value.trim();
            const selectedType = typeSelect.value;
            
            // Update URL with search parameters
            window.location.hash = selectedType
                ? `#pokemons/search/${encodeURIComponent(searchTerm)}/${selectedType}`
                : (searchTerm 
                    ? `#pokemons/search/${encodeURIComponent(searchTerm)}` 
                    : '#pokemons/search/');
        });

        // Allow searching by pressing Enter
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchBtn.click();
            }
        });
    }
}