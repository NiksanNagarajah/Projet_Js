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

    static getDresseurItem = async (dresseurId, itemId) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${DRESSEUR_ITEM_POINT}?item_id=${itemId}&dresseur_id=${dresseurId}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error getting dresseur item", err);
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

    static removeItemFromDresseur = async (dresseurId, itemId) => {
        let item = await DresseurProvider.getDresseurItem(dresseurId, itemId);
        item = item[0];
        item.quantite--;
        if (item.quantite === 0) {
            await DresseurProvider.deleteItemFromDresseur(dresseurId, itemId);
        } else {
            await DresseurProvider.reduceItemFromDresseur(dresseurId, itemId);
        }
    }

    static deleteItemFromDresseur = async (dresseurId, itemId) => {
        let item = await DresseurProvider.getDresseurItem(dresseurId, itemId);
        item = item[0];
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`${DRESSEUR_ITEM_POINT}/${item.id}`, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log("Error deleting item from dresseur", err);
        }
    }

    static reduceItemFromDresseur = async (dresseurId, itemId) => {
        let item = await DresseurProvider.getDresseurItem(dresseurId, itemId);
        item = item[0];
        item.quantite--;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: item.id, 
                dresseur_id: item.dresseur_id, 
                item_id: item.item_id, 
                quantite: item.quantite
            })
        };
        try {
            const response = await fetch(`${DRESSEUR_ITEM_POINT}/${item.id}`, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log("Error reducing item from dresseur", err);
        }
    }

    static removeItemFromPokemon = async (dresseurId, pokemonId) => {
        let pokemon = await DresseurProvider.getDresseurPokemon(dresseurId, pokemonId);
        pokemon = pokemon[0];
        pokemon.objet = null;
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
            console.log("Error removing item from pokemon", err);
        }
    }

    static addItemToDresseur = async (dresseurId, itemId) => {
        let item = await DresseurProvider.getDresseurItem(dresseurId, itemId);
        if (item.length === 0) {
            await DresseurProvider.addItemIfNotExists(dresseurId, itemId);
        } else {
            await DresseurProvider.increaseItemFromDresseur(dresseurId, itemId);
        }
    }
    
    static addItemIfNotExists = async (dresseurId, itemId) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dresseur_id: dresseurId, 
                item_id: itemId, 
                quantite: 1
            })
        };
        try {
            const response = await fetch(DRESSEUR_ITEM_POINT, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log("Error adding item to dresseur", err);
        }
    }

    static increaseItemFromDresseur = async (dresseurId, itemId) => {
        let item = await DresseurProvider.getDresseurItem(dresseurId, itemId);
        item = item[0];
        item.quantite++;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: item.id, 
                dresseur_id: item.dresseur_id, 
                item_id: item.item_id, 
                quantite: item.quantite
            })
        };
        try {
            const response = await fetch(`${DRESSEUR_ITEM_POINT}/${item.id}`, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log("Error increasing item from dresseur", err);
        }
    }
}