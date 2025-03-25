import AuthService from "../../services/AuthService.js";
import PokemonProvider from "../../services/PokemonProvider.js";

export default class Profil {
    async render() {
        let dresseur = AuthService.getCurrentDresseur();
        if (!dresseur) {
            return `<h2>Veuillez vous connecter</h2>`;
        }

        let dresseurPokemons = await PokemonProvider.getDresseurPokemons(dresseur.id);
        dresseurPokemons = await Promise.all(dresseurPokemons.map(async p => await PokemonProvider.getPokemon(p.pokemon_id)));
        console.log(dresseurPokemons);

        return `
            <section class="profile-container">
                <h2>Mon Profil</h2>
                <p><strong>Nom :</strong> ${dresseur.nom} ${dresseur.prenom}</p>
                <p><strong>Email :</strong> ${dresseur.email}</p>
                <p><strong>Mes Pokémon :</strong></p>
                <ul>
                    ${dresseurPokemons.map(p => `<li><a href="./#pokemons/${p.pokedex_id}" class="pokemon-link">${p.name.fr}</a></li>`)}
                </ul>
                <button id="logout-btn">Se déconnecter</button>
            </section>
        `;
    }

    async afterRender() {
        document.getElementById("logout-btn").addEventListener("click", () => {
            AuthService.logout();
            window.location.href = "#home";
        });
    }
}
