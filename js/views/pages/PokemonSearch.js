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
        
        this.filteredPokemons = allPokemons.filter(pokemon => {
            const nameMatch = !this.searchTerm.trim() || 
                pokemon.name.fr.toLowerCase().includes(this.searchTerm.toLowerCase());
            
            const typeMatch = !this.selectedType || 
                pokemon.types.some(t => 
                    t.name.toLowerCase() === this.selectedType.toLowerCase()
                );
                
            // console.log("Type Pokémon:", pokemon.types.map(t => t.name), "Selected:", this.selectedType);
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
                            <option value="Acier" ${this.selectedType === 'Acier' ? 'selected' : ''}>Acier</option>
                            <option value="Combat" ${this.selectedType === 'Combat' ? 'selected' : ''}>Combat</option>
                            <option value="Dragon" ${this.selectedType === 'Dragon' ? 'selected' : ''}>Dragon</option>
                            <option value="Eau" ${this.selectedType === 'Eau' ? 'selected' : ''}>Eau</option>
                            <option value="Électrik" ${this.selectedType === 'Électrik' ? 'selected' : ''}>Électrik</option>
                            <option value="Feu" ${this.selectedType === 'Feu' ? 'selected' : ''}>Feu</option>
                            <option value="Glace" ${this.selectedType === 'Glace' ? 'selected' : ''}>Glace</option>
                            <option value="Insecte" ${this.selectedType === 'Insecte' ? 'selected' : ''}>Insecte</option>
                            <option value="Normal" ${this.selectedType === 'Normal' ? 'selected' : ''}>Normal</option>
                            <option value="Plante" ${this.selectedType === 'Plante' ? 'selected' : ''}>Plante</option>
                            <option value="Poison" ${this.selectedType === 'Poison' ? 'selected' : ''}>Poison</option>
                            <option value="Psy" ${this.selectedType === 'Psy' ? 'selected' : ''}>Psy</option>
                            <option value="Roche" ${this.selectedType === 'Roche' ? 'selected' : ''}>Roche</option>
                            <option value="Sol" ${this.selectedType === 'Sol' ? 'selected' : ''}>Sol</option>
                            <option value="Spectre" ${this.selectedType === 'Spectre' ? 'selected' : ''}>Spectre</option>
                            <option value="Ténèbres" ${this.selectedType === 'Ténèbres' ? 'selected' : ''}>Ténèbres</option>
                            <option value="Vol" ${this.selectedType === 'Vol' ? 'selected' : ''}>Vol</option>
                            <option value="Fée" ${this.selectedType === 'Fée' ? 'selected' : ''}>Fée</option>
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
        console.log("Selected type value (init):", typeSelect.value);
        const searchBtn = document.getElementById('search-btn');

        searchBtn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Selected type (on click):", typeSelect.value);
            const searchTerm = searchInput.value.trim();
            const selectedType = typeSelect.value; 
        
            window.location.hash = selectedType
                ? `#pokemons/search/${encodeURIComponent(searchTerm)}/${selectedType}`
                : (searchTerm 
                    ? `#pokemons/search/${encodeURIComponent(searchTerm)}` 
                    : '#pokemons/search/');
        });
        

        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchBtn.click();
            }
        });
    }




    
    
}