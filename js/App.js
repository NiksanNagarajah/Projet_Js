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
    '/pokemons/:id': PokemonShow
}; 

const router = async() => {
    const content = null || document.querySelector('#content');
    let request = Utils.parseRequestURL();
    console.log(request);

    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/:verb' : '');
    let page = routes[parsedURL] ? new routes[parsedURL] : new routes['/'];
    content.innerHTML = await page.render();
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

// const page = async() => {
//     const content = document.querySelector('#content')
//     content.innerHTML = await ArticleAll.render()
// }

// window.addEventListener('load', page);