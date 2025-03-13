import { ENDPOINT } from '../config.js';

export default class PokemonProvider {
    static fetchPokemons = async (limit=10) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${ENDPOINT}?_limit=${limit}`, options);
            // Ajouter un if response.ok ?
            const json = await response.json(); 
            return json;
        } catch(err) {
            console.log("Error getting documents", err);
        }
    }

    static getPokemon = async (id) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${ENDPOINT}/${id}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error getting pokemon", err);
        }
    }
} 