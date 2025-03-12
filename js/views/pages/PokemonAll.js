import PokemonProvider from "../../services/PokemonProvider.js";

export default class PokemonAll {
    async render() {
        let pokemons = await PokemonProvider.fetchPokemons(20);
        let view = `
        <h2>Les pokemons</h2>
        <ul>
            ${pokemons.map(pokemon => 
                `<li>${pokemon.name.fr}</li>`
            ).join("\n")
        }
        </ul>
        `;
        console.log(pokemons);
        return view;
    }
}