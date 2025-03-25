import { DRESSEUR_POINT } from "../config.js";
import { DRESSEUR_POKEMON_POINT } from "../config.js";
import PokemonProvider from "./PokemonProvider.js";

const AuthService = {

    async getRandomPokemons(dresseurId, nbPokemon=6) {
        let allPokemons = await PokemonProvider.getAllPokemon();
        let melanger = allPokemons.sort(() => Math.random() - 0.5);
        let randomPokemons = melanger.slice(0, nbPokemon);

        let dresseurPokemons = randomPokemons.map(pokemon => ({
            id: `${dresseurId}-${pokemon.pokedex_id}`,
            dresseur_id: dresseurId, 
            pokemon_id: pokemon.pokedex_id,
            surnom: null
        }));

        for (let poke of dresseurPokemons) {
            let response = await fetch(DRESSEUR_POKEMON_POINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(poke)
            });

            if (!response.ok) {
                return { success: false, message: "Erreur lors de la création des pokémons." };
            }
        }
    },

    async register(dresseurData) {
        let existingDresseurs = await fetch(DRESSEUR_POINT).then(res => res.json());
        if (existingDresseurs.some(dresseur => dresseur.email === dresseurData.email)) {
            return { success: false, message: "Cet email est déjà utilisé." };
        }

        let response = await fetch(DRESSEUR_POINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dresseurData)
        });

        if (response.ok) {
            let newDresseur = await response.json();
            await this.getRandomPokemons(newDresseur.id, 6);

            return { success: true, message: "Inscription réussie !" };
        } else {
            return { success: false, message: "Erreur lors de l'inscription." };
        }
    },

    async login(email, password) {
        let dresseurs = await fetch(DRESSEUR_POINT).then(res => res.json());
        let dresseur = dresseurs.find(dresseur => dresseur.email === email && dresseur.password === password);

        if (dresseur) {
            localStorage.setItem("dresseur", JSON.stringify(dresseur));
            return { success: true, message: "Connexion réussie !" };
        } else {
            return { success: false, message: "Email ou mot de passe incorrect." };
        }
    },

    getCurrentDresseur() {
        return JSON.parse(localStorage.getItem("dresseur"));
    },

    logout() {
        localStorage.removeItem("dresseur");
    }
};

export default AuthService;
