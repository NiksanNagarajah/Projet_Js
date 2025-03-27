import PokemonProvider from "../../services/PokemonProvider.js";

export default class PokemonAll {
  constructor() {
    this.pokemonsPerPage = 20;
    this.currentPage = 1;
    this.totalPages = 1;
  }

  async render(page = 1) {
    this.currentPage = parseInt(page) || 1;
    
    const allPokemons = await PokemonProvider.getAllPokemon();
    this.totalPages = Math.ceil(allPokemons.length / this.pokemonsPerPage);
    
    const startIndex = (this.currentPage - 1) * this.pokemonsPerPage;
    const endIndex = startIndex + this.pokemonsPerPage;
    const pokemons = allPokemons.slice(startIndex, endIndex);
    
    let view = `
      <div class="pokedex">
        <div class="top-section">
          <div class="blue-circle"></div>
          <img src="../../images/Pokédex.png" alt="Pokédex" class="pokedex-top" loading="lazy">
          <div class="pokeball"></div>
        </div>
        <div class="top-curve"></div>
        
        <div class="screen">
          <div id="content-area">
            <div class="content">
              <div class="pokemon-grid">
                ${pokemons.map(pokemon => `
                  <div class="pokemon-card">
                    <a href="./#pokemons/${pokemon.pokedex_id}" class="pokemon-link">
                      <img class="pokemon-sprite" src="${pokemon.sprites.regular}" alt="${pokemon.name.fr}" loading="lazy">
                      <p class="pokemon-name">${pokemon.pokedex_id}. ${pokemon.name.fr}</p>
                    </a>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
        
        <div class="control-panel">
          <div class="green-bar">
            <div class="pokedex-pagination">
              <div class="pokedex-btn-group">
                <a href="./#pokemons/page/1" class="pokedex-btn ${this.currentPage === 1 ? 'pokedex-btn-disabled' : ''}">«</a>
                <a href="./#pokemons/page/${Math.max(1, this.currentPage - 1)}" class="pokedex-btn ${this.currentPage === 1 ? 'pokedex-btn-disabled' : ''}">‹</a>
                
                ${this.generatePageButtons()}
                
                <a href="./#pokemons/page/${Math.min(this.totalPages, this.currentPage + 1)}" class="pokedex-btn ${this.currentPage === this.totalPages ? 'pokedex-btn-disabled' : ''}">›</a>
                <a href="./#pokemons/page/${this.totalPages}" class="pokedex-btn ${this.currentPage === this.totalPages ? 'pokedex-btn-disabled' : ''}">»</a>
              </div>
            </div>
          </div>
          
          <div class="d-pad">
            <div class="d-pad-horizontal"></div>
            <div class="d-pad-vertical"></div>
          </div>
          
          <div class="screen-small">
            Page ${this.currentPage} sur ${this.totalPages}
          </div>
          
          <div class="buttons">
            <div class="button-x"></div>
            <div class="button-check"></div>
          </div>
        </div>
      </div>
    `;
    
    return view;
  }

  generatePageButtons() {
    const maxButtons = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(this.totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i)
      .map(num => `
        <a href="./#pokemons/page/${num}" class="pokedex-btn ${this.currentPage === num ? 'pokedex-btn-primary' : ''}">${num}</a>
      `).join('');
  }
  
  async afterRender() {
  }
}