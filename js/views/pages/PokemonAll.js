import PokemonProvider from "../../services/PokemonProvider.js";

export default class PokemonAll {
  constructor() {
    this.pokemonsPerPage = 20;
    this.currentPage = 1;
    this.totalPages = 1;
  }

  async render(page = 1) {
    this.currentPage = parseInt(page) || 1;
    
    const { pokemons, totalPages } = await PokemonProvider.getPaginatedPokemon(this.currentPage, this.pokemonsPerPage);
    this.totalPages = totalPages;
    
    let view = `
      <div class="pokedex">
        <div class="top-section">
            <div class="blue-circle"></div>
            <div class="top-curve"></div>
            <div class="pokeball"></div>
        </div>
        
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
            <div class="green-bar"></div>
            <div class="d-pad">
                <div class="d-pad-horizontal"></div>
                <div class="d-pad-vertical"></div>
            </div>
            <div class="screen-small"></div>
            <div class="buttons">
                <div class="button-x"></div>
                <div class="button-check"></div>
            </div>
        </div>
      </div>
      ${this.renderPagination()}
    `;
    
    return view;
  }

  renderPagination() {
    let paginationHtml = '';
    if (this.totalPages <= 1) {
      return '';
    }
    
    // Determine which page buttons to display
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    paginationHtml = `
      <div class="pagination-container">
        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
          <div class="btn-group me-2" role="group" aria-label="First group">
            ${startPage > 1 ? `<a href="./#pokemons/page/1" class="btn btn-secondary">1</a>` : ''}
            ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
            ${Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i)
              .map(num => `
                <a href="./#pokemons/page/${num}" class="btn ${this.currentPage === num ? 'btn-primary' : 'btn-secondary'}">${num}</a>
              `).join('')}
            ${endPage < this.totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
            ${endPage < this.totalPages ? `<a href="./#pokemons/page/${this.totalPages}" class="btn btn-secondary">${this.totalPages}</a>` : ''}
          </div>
        </div>
        <div class="pagination-info">Page ${this.currentPage} sur ${this.totalPages}</div>
      </div>
    `;
    return paginationHtml;
  }
  
  async afterRender() {
    // Si vous avez besoin d'ajouter des écouteurs d'événements après le rendu
    // Cette méthode serait appelée par le routeur après avoir injecté le HTML
  }
}