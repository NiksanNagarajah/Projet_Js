import { DRESSEUR_POINT } from "../config.js";
import { DRESSEUR_POKEMON_POINT } from "../config.js";
import { DRESSEUR_ITEM_POINT } from "../config.js";
import ItemProvider from "./ItemProvider.js";
import PokemonProvider from "./PokemonProvider.js";

const AuthService = {

    async getRandomItems(dresseurId) {
        let allItems = await ItemProvider.getAllItem();
    
        let totalItems = 0; 
        let dresseurItems = [];
    
        while (totalItems < 30) {
            let randomItem = allItems[Math.floor(Math.random() * allItems.length)]; 
            let quantite = Math.min(Math.floor(Math.random() * 5) + 1, 30 - totalItems);
    
            dresseurItems.push({
                id: `${dresseurId}-${randomItem.id}`,
                dresseur_id: dresseurId,
                item_id: randomItem.id,
                quantite: quantite
            });
    
            totalItems += quantite; 
        }
    
        for (let item of dresseurItems) {
            await fetch(DRESSEUR_ITEM_POINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item)
            });
        }
    },    

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
            await this.getRandomItems(newDresseur.id);

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
