import { POKEMON_POINT } from '../config.js';

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
  }

  static getPaginatedPokemon = async (page = 1, limit = 20) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      // Si votre API prend en charge la pagination, utilisez cette méthode
      // const response = await fetch(`${POKEMON_POINT}?_page=${page}&_limit=${limit}`, options);
      
      // Sinon, récupérez tous les pokémons et paginons côté client
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
    } catch(err) {
      console.log("Error getting paginated pokemons", err);
    }
  }
}