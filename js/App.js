import PokemonAll from "./views/pages/PokemonAll.js"
import About from "./views/pages/About.js"
import Utils from "./services/Utils.js"
import PokemonShow from "./views/pages/PokemonShow.js"
import Home from "./views/pages/Home.js"
import ItemAll from "./views/pages/ItemAll.js"
import ItemShow from "./views/pages/ItemShow.js"

const routes = {
    '/': Home,
    '/home': Home,
    '/about': About, 
    '/pokemons': PokemonAll, 
    '/pokemons/:id': PokemonShow, 
    '/items': ItemAll, 
    '/items/:id': ItemShow
}; 

const Error404 = {
    async render() {
        return '<h2 style="text-align: center;">Error 404 - Not Found</h2>';
    }
}

const router = async() => {
    const content = null || document.querySelector('#content');
    let request = Utils.parseRequestURL();
    console.log(request);

    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/:verb' : '');
    let page = routes[parsedURL] ? new routes[parsedURL] : Error404;
    scrollToTop()
    content.innerHTML = await page.render();
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

// const page = async() => {
//     const content = document.querySelector('#content')
//     content.innerHTML = await ArticleAll.render()
// }

// window.addEventListener('load', page);

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}