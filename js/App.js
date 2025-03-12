import PokemonAll from "./views/pages/PokemonAll.js"
import About from "./views/pages/About.js"
import Utils from "./services/Utils.js"

const routes = {
    '/' : About, 
    '/about' : About, 
    '/pokemons' : PokemonAll
}; 

const router = async() => {
    const constent = null || document.querySelector('#content');
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