import { DRESSEUR_POKEMON_POINT, POKEMON_POINT, POKEMON_STARS_POINT } from '../config.js';

export default class PokemonProvider {
    static fetchPokemons = async (limit=10) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${POKEMON_POINT}?_limit=${limit}`, options);
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
            const response = await fetch(`${POKEMON_POINT}?pokedex_id=${id}`, options);
            const json = await response.json();
            return json[0];
        } catch(err) {
            console.log("Error getting pokemon", err);
        }
    }

    static getAllPokemon = async () => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${POKEMON_POINT}`, options);
            // Ajouter un if response.ok ?
            const json = await response.json(); 
            return json;
        } catch(err) {
            console.log("Error getting documents", err);
        }
    }

    static getPaginatedPokemon = async (page = 1, limit = 20) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {

            const response = await fetch(`${POKEMON_POINT}`, options);
            const allPokemons = await response.json();

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedPokemons = allPokemons.slice(startIndex, endIndex);

            return {
                pokemons: paginatedPokemons,
                total: allPokemons.length,
                totalPages: Math.ceil(allPokemons.length / limit),
                currentPage: page
            };
        } catch (err) {
            console.log("Error getting paginated pokemons", err);
        }
    }

    static getDresseurPokemons = async (dresseurId) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${DRESSEUR_POKEMON_POINT}?dresseur_id=${dresseurId}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error getting dresseur pokemons", err);
        }
    }

    static getPokemonStars = async (pokemonId) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${POKEMON_STARS_POINT}?pokemon_id=${pokemonId}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error getting pokemon stars", err);
        }
    }

    static async addRating(pokemonId, dresseurId, stars) {
        const options = {
            method : 'POST',
            headers : {
                'Content-Type':'application/json'
            },
            body : JSON.stringify({
                id: `${pokemonId}-${dresseurId}`,
                pokemon_id : pokemonId,
                dresseur_id : dresseurId,
                stars : stars
            })
        };
        try {
            const response = await fetch(`${POKEMON_STARS_POINT}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error adding rating", err);
        }
    }

    static async getRating(pokemonId, dresseurId) {
        const options = {
            method : 'GET',
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${POKEMON_STARS_POINT}?pokemon_id=${pokemonId}&dresseur_id=${dresseurId}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error getting rating", err);
        }
    }

    static async updateRating(pokemonId, dresseurId, stars) {
        const options = {
            method : 'PUT',
            headers : {
                'Content-Type':'application/json'
            },
            body : JSON.stringify({
                id: `${pokemonId}-${dresseurId}`,
                pokemon_id : pokemonId,
                dresseur_id : dresseurId,
                stars : stars
            })
        };
        try {
            const response = await fetch(`${POKEMON_STARS_POINT}/${pokemonId}-${dresseurId}`, options);
            const json = await response.json();
            return json;
        } catch(err) {
            console.log("Error updating rating", err);
        }
    }

    static async ratePokemon(pokemonId, dresseurId, stars, action = 'create') {
        if (action === 'create') {
            return await PokemonProvider.addRating(pokemonId, dresseurId, stars);
        } else if (action === 'update') {
            return await PokemonProvider.updateRating(pokemonId, dresseurId, stars);
        }
    }
}
