import { DRESSEUR_POINT } from '../config.js';
import { DRESSEUR_ITEM_POINT } from '../config.js';

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
}