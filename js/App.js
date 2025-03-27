import PokemonAll from "./views/pages/PokemonAll.js"
import Favoris from "./views/pages/Favoris.js"
import Utils from "./services/Utils.js"
import PokemonShow from "./views/pages/PokemonShow.js"
import Home from "./views/pages/Home.js"
import ItemAll from "./views/pages/ItemAll.js"
import ItemShow from "./views/pages/ItemShow.js"
import AuthService from "./services/AuthService.js"
import Login from "./views/pages/Login.js"
import Signup from "./views/pages/Signup.js"
import Profil from "./views/pages/Profil.js"
import PokemonSearch from "./views/pages/PokemonSearch.js"

const routes = {
    '/': Home,
    '/home': Home,
    '/favoris': Favoris, 
    '/pokemons': PokemonAll, 
    '/pokemons/:id': PokemonShow, 
    '/pokemons/page/:num': PokemonAll,
    '/items': ItemAll, 
    '/items/:id': ItemShow, 
    '/login': Login,
    '/signup': Signup, 
    '/profil': Profil,
    '/pokemons/search/:term': PokemonSearch
    // '/logout': AuthService.logout
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

    if (request.resource === 'pokemons' && request.id === 'search' && request.verb) {
        console.log("Search route detected, term:", request.verb);
        const searchTerm = request.verb;
        const page = request.action ? parseInt(request.action) : 1;
        const pokemonSearchInstance = new PokemonSearch();
        content.innerHTML = await pokemonSearchInstance.render(searchTerm, page);
        if (typeof pokemonSearchInstance.afterRender === 'function') {
            await pokemonSearchInstance.afterRender();
        }
        setActiveNavItem();
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

    updateNavbar();
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


function updateNavbar() {
    let authNav = document.getElementById("auth-nav");
    let currentDresseur = AuthService.getCurrentDresseur();

    if (authNav) {
        if (currentDresseur) {
            authNav.innerHTML = `
                <li class="nav-item">
                    <a href="#profil" class="nav-link">Bonjour, ${currentDresseur.prenom} (ID: ${currentDresseur.id})</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="logout-btn">Se déconnecter</a>
                </li>
            `;

            document.getElementById("logout-btn").addEventListener("click", () => {
                AuthService.logout();
                window.location.href = "#home";
            });
        } else {
            authNav.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="#login">Se connecter</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#signup">S'inscrire</a>
                </li>
            `;
        }
    }
}

