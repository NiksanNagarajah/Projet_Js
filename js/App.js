import PokemonAll from "./views/pages/PokemonAll.js"
import About from "./views/pages/About.js"
import Utils from "./services/Utils.js"
import PokemonShow from "./views/pages/PokemonShow.js"
import Home from "./views/pages/Home.js"

const routes = {
  '/': Home,
  '/home': Home,
  '/about': About,
  '/pokemons': PokemonAll,
  '/pokemons/page/:num': PokemonAll, // Nouvelle route pour la pagination
  '/pokemons/:id': PokemonShow
};

const router = async () => {
  const content = document.querySelector('#content');
  let request = Utils.parseRequestURL();
  console.log("Request parsed:", request);

  // Vérifier si c'est une route de pagination
  if (request.resource === 'pokemons' && request.id === 'page' && request.verb) {
    console.log("Pagination route detected, page:", request.verb);
    const page = parseInt(request.verb);
    const pokemonAllInstance = new PokemonAll();
    content.innerHTML = await pokemonAllInstance.render(page);
    if (typeof pokemonAllInstance.afterRender === 'function') {
      await pokemonAllInstance.afterRender();
    }
    setActiveNavItem(); // Mettre à jour l'élément actif du menu
    return;
  }

  // Vérifier si c'est une route de détail Pokémon
  if (request.resource === 'pokemons' && request.id && !isNaN(request.id)) {
    console.log("Pokemon detail route detected, id:", request.id);
    const pokemonShowInstance = new PokemonShow();
    content.innerHTML = await pokemonShowInstance.render(request.id);
    if (typeof pokemonShowInstance.afterRender === 'function') {
      await pokemonShowInstance.afterRender();
    }
    setActiveNavItem();
    return;
  }

  // Traitement des routes standard
  let parsedURL = (request.resource ? '/' + request.resource : '/');
  console.log("Standard route detected:", parsedURL);
  let page = routes[parsedURL] ? new routes[parsedURL]() : new routes['/']();
  content.innerHTML = await page.render();
  if (typeof page.afterRender === 'function') {
    await page.afterRender();
  }

  setActiveNavItem();
};

window.addEventListener('load', router);
window.addEventListener('hashchange', router);
