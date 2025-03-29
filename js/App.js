import PokemonAll from "./views/pages/PokemonAll.js"
import About from "./views/pages/About.js"
import Utils from "./services/Utils.js"
import PokemonShow from "./views/pages/PokemonShow.js"
import Home from "./views/pages/Home.js"
import ItemAll from "./views/pages/ItemAll.js"
import ItemShow from "./views/pages/ItemShow.js"
import AuthService from "./services/AuthService.js"
import Login from "./views/pages/Login.js"
import Signup from "./views/pages/Signup.js"
import Profil from "./views/pages/Profil.js"
import MyPokemon from "./views/pages/MyPokemon.js"
import MyBag from "./views/pages/MyBag.js"
import PokemonSearch from "./views/pages/PokemonSearch.js"
import Favorites from "./views/pages/Favorites.js"

const routes = {
    '/': Home,
    '/home': Home,
    '/about': About, 
    '/pokemons': PokemonAll, 
    '/pokemons/:id': PokemonShow, 
    '/pokemons/page/:verb': PokemonAll,
    '/items': ItemAll, 
    '/items/:id': ItemShow, 
    '/login': Login,
    '/signup': Signup, 
    '/profil': Profil, 
    '/my-pokemons': MyPokemon, 
    '/my-bag': MyBag, 
    '/favorites': Favorites,
    '/pokemons/search': PokemonSearch,
    '/pokemons/search/:verb': PokemonSearch,
    '/pokemons/search/:verb/:action': PokemonSearch,
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

    let parsedURL = (request.resource ? '/' + request.resource : '/') + 
                    (request.id ? 
                        request.id === 'page' ? '/page' : 
                        request.id === 'search' ? '/search': 
                        '/:id' : '') + 
                    (request.verb ? '/:verb' : '') + 
                    (request.action ? '/:action' : '');

    let page = routes[parsedURL] ? new routes[parsedURL]() : new Error404();
    
    scrollToTop();

    content.innerHTML = await page.render();
    
    if (typeof page.afterRender === 'function') {
        await page.afterRender();
    }

    updateNavbar();
    setActiveNavItem();
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
    const currentPath = window.location.hash || '#home';

    navLinks.forEach(link => link.classList.remove('active'));
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (
            (linkPath === '/' && (currentPath === '#home' || currentPath === '#/' || currentPath === '/')) ||
            (linkPath !== '/' && currentPath.startsWith(linkPath))
        ) {
            link.classList.add('active');
        }
    });
}

function updateNavbar() {
    let authNav = document.getElementById("auth-nav");
    let myPokemonNav = document.getElementById("my-stuff");
    let currentDresseur = AuthService.getCurrentDresseur();

    if (authNav) {
        if (currentDresseur) {
            authNav.innerHTML = `
                <li class="nav-item">
                    <a href="#profil" class="nav-link">Bonjour, ${currentDresseur.prenom}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="logout-btn">Se déconnecter</a>
                </li>
            `;

            myPokemonNav.innerHTML = `
                <li class="nav-item">
                    <a href="#my-pokemons" class="nav-link">Mes Pokémons</a>
                </li>
                <li class="nav-item">
                    <a href="#my-bag" class="nav-link">Mon Sac</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#Favorites">Favoris</a>
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

            myPokemonNav.innerHTML = '';
        }
    }
}