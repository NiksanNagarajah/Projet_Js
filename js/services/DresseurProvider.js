import { DRESSEUR_POINT } from '../config.js';
import { DRESSEUR_ITEM_POINT } from '../config.js';
import { DRESSEUR_POKEMON_POINT } from '../config.js';

export default class DresseurProvider {

    static getDresseur = async (id) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${DRESSEUR_POINT}/${id}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error getting dresseur", err);
        }
    }

    static getPokemonsByDresseurId = async (id) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${DRESSEUR_POINT}/${id}/pokemons`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error getting pokemons", err);
        }
    }

    static getDresseurItems = async (id) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${DRESSEUR_ITEM_POINT}?dresseur_id=${id}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error getting items", err);
        }
    }

    static getDresseurPokemon = async (dresseurId, pokemonId) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${DRESSEUR_POKEMON_POINT}?pokemon_id=${pokemonId}&dresseur_id=${dresseurId}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error getting dresseur pokemon", err);
        }
    }

    static assignItemToPokemon = async (dresseurId, pokemonId, itemId) => {
        let pokemon = await DresseurProvider.getDresseurPokemon(dresseurId, pokemonId);
        pokemon = pokemon[0];
        pokemon.objet = itemId;
        console.log(pokemon);
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: pokemon.id, 
                dresseur_id: pokemon.dresseur_id, 
                pokemon_id: pokemon.pokemon_id, 
                surnom: pokemon.surnom, 
                objet: pokemon.objet
            })
        };
        try {
            const response = await fetch(`${DRESSEUR_POKEMON_POINT}/${pokemon.id}`, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log("Error assigning item", err);
        }
    }

    
}