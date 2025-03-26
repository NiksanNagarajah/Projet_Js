import PokemonProvider from "../../services/PokemonProvider.js";
import DresseurProvider from "../../services/DresseurProvider.js";
import ItemProvider from "../../services/ItemProvider.js";

export default class MyPokemon {
    async render() {
        let currentDresseur = JSON.parse(localStorage.getItem("dresseur"));
        if (!currentDresseur) {
            return `<h2 class="text-center text-danger">Error 404 - Veuillez vous connecter</h2>`;
        }

        let pokemonsIds = await PokemonProvider.getDresseurPokemons(currentDresseur.id);
        let pokemons = await Promise.all(pokemonsIds.map(poke => PokemonProvider.getPokemon(poke.pokemon_id)));
        let itemsIds = await DresseurProvider.getDresseurItems(currentDresseur.id);
        let allItems = await Promise.all(itemsIds.map(item => ItemProvider.getItem(item.item_id)));
        let dresseurItems = await DresseurProvider.getDresseurItems(currentDresseur.id);
        
        console.log("Pokemons:", pokemons);
        console.log("Items:", allItems);
        console.log("Dresseur items:", dresseurItems);

        let itemsById = dresseurItems.reduce((acc, item) => {
            acc[item.item_id] = { ...item, ...allItems.find(i => i.id == item.item_id) };
            return acc;
        }, {});

        return `
            <div class="container mt-5">
                <h2 class="text-center text-primary">Mes Pokémon</h2>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    ${pokemons.map(pokemon => `
                        <div class="col">
                            <div class="card h-100 shadow-sm">
                                <img src="${pokemon.sprites.regular}" class="card-img-top" alt="${pokemon.name.fr}">
                                <div class="card-body text-center">
                                    <h5 class="card-title">${pokemon.name.fr}</h5>
                                    <p class="card-text">ID: ${pokemon.pokedex_id}</p>
                                    <p class="card-text">Objet: ${pokemon.objet ? pokemon.objet : "Aucun"}</p>
                                    <select id="item-select-${pokemon.pokedex_id}" class="form-select">
                                        <option value="">Choisir un objet</option>
                                        ${Object.values(itemsById).map(item => `
                                            <option value="${item.id}">${item.name} (x${item.quantite})</option>
                                        `).join("")}
                                    </select>
                                    <button class="btn btn-success mt-2" onclick="assignItem(${pokemon.id})">Donner Objet</button>
                                    ${pokemon.objet ? `<button class="btn btn-danger mt-2" onclick="removeItem(${pokemon.id})">Retirer Objet</button>` : ""}
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
                <h2 class="text-center text-secondary mt-5">Mes Objets</h2>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    ${Object.values(itemsById).map(item => `
                        <div class="col">
                            <div class="card h-100 shadow-sm">
                                <img src="${item.url}" class="card-img-top" alt="${item.name}">
                                <div class="card-body text-center">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text">${item.description}</p>
                                    <p class="card-text">Quantité: ${item.quantite}</p>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    async afterRender() {
        window.assignItem = async (pokemonId) => {
            let select = document.getElementById(`item-select-${pokemonId}`);
            let itemId = select.value;
            if (!itemId) return;
            await DresseurProvider.assignItemToPokemon(pokemonId, itemId);
            location.reload();
        };

        window.removeItem = async (pokemonId) => {
            await DresseurProvider.removeItemFromPokemon(pokemonId);
            location.reload();
        };
    }
}