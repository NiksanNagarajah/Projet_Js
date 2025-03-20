import PokemonAll from "./views/pages/PokemonAll.js"
import About from "./views/pages/About.js"
import Utils from "./services/Utils.js"
import PokemonShow from "./views/pages/PokemonShow.js"
import Home from "./views/pages/Home.js"
import ItemAll from "./views/pages/ItemAll.js"
import ItemShow from "./views/pages/ItemShow.js"

// Définir les routes
const routes = {
    '/': Home,
    '/home': Home,
    '/about': About, 
    '/pokemons': PokemonAll, 
    '/pokemons/:id': PokemonShow, 
    '/pokemons/page/:num': PokemonAll,
    '/items': ItemAll, 
    '/items/:id': ItemShow
}; 

const Error404 = {
    async render() {
        return '<h2 style="text-align: center;">Error 404 - Not Found</h2>';
    }
};

const router = async () => {
    const content = document.querySelector('#content');
    let request = Utils.parseRequestURL();
    console.log("Request parsed:", request);

    if (request.resource === 'pokemons' && request.id === 'page' && request.verb) {
        console.log("Pagination route detected, page:", request.verb);
        const page = parseInt(request.verb);
        const pokemonAllInstance = new PokemonAll();
        content.innerHTML = await pokemonAllInstance.render(page);
        if (typeof pokemonAllInstance.afterRender === 'function') {
            await pokemonAllInstance.afterRender();
        }

        return;
    }

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

    let parsedURL = (request.resource ? '/' + request.resource : '/') + 
                    (request.id ? '/:id' : '') + 
                    (request.verb ? '/:verb' : '');

    let page = routes[parsedURL] ? new routes[parsedURL]() : new Error404();
    
    scrollToTop();

    content.innerHTML = await page.render();
    
    if (typeof page.afterRender === 'function') {
        await page.afterRender();
    }


};

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function setActiveNavItem() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPath = window.location.hash || window.location.pathname;

    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        if (
            (linkPath === '/' && (currentPath === '/' || currentPath === '' || currentPath === '#/home' || currentPath === '#home')) ||
            (linkPath !== '/' && currentPath.includes(linkPath.replace('#', '')))
        ) {
            link.classList.add('active');
        }
    });
}
