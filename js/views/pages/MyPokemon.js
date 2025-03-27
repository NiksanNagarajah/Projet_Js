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
        let pokemonsData = await Promise.all(pokemonsIds.map(poke => PokemonProvider.getPokemon(poke.pokemon_id)));


        let pokemons = {};
        for (let pokemon of pokemonsIds) {
            let fullPokemon = pokemonsData.find(p => p.pokedex_id == pokemon.pokemon_id);
            pokemons[pokemon.pokemon_id] = { ...pokemon, ...fullPokemon };
            if (pokemon.objet) {
                let item = await ItemProvider.getItem(pokemon.objet);
                pokemons[pokemon.pokemon_id].objet = item.name;
            }
        }
        console.log("Pokemons by ID:", pokemons);

        let itemsIds = await DresseurProvider.getDresseurItems(currentDresseur.id);
        let allItems = await Promise.all(itemsIds.map(item => ItemProvider.getItem(item.item_id)));
        let dresseurItems = await DresseurProvider.getDresseurItems(currentDresseur.id);
        
        console.log("Pokemons:", pokemons);
        console.log("Items:", allItems);
        console.log("Dresseur items:", dresseurItems);

        let itemsById = {};
        for (let item of dresseurItems) {
            let fullItem = allItems.find(i => i.id == item.item_id);
            itemsById[item.item_id] = { ...item, ...fullItem };
        }
        console.log("Items by ID:", itemsById);

        return `
            <div class="container mt-5">
                <h2 class="text-center text-primary">Mes Pokémon</h2>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    ${Object.values(pokemons).map(pokemon => `
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
                                    ${pokemon.objet 
                                        ? `<button class="btn btn-danger mt-2 remove-item-btn" data-pokemon-id="${pokemon.pokedex_id}">Retirer Objet</button>` 
                                        : `<button class="btn btn-success mt-2 assign-item-btn" data-pokemon-id="${pokemon.pokedex_id}">Donner Objet</button>`
                                    }
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    async afterRender() {
        console.log("afterRender executed");
    
        document.querySelectorAll(".assign-item-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                let dresseur_id = JSON.parse(localStorage.getItem("dresseur")).id;
                console.log(dresseur_id);
                let pokemonId = e.target.dataset.pokemonId;
                let select = document.getElementById(`item-select-${pokemonId}`);
                let itemId = select.value;
    
                if (!itemId) return;
                await DresseurProvider.assignItemToPokemon(dresseur_id, pokemonId, itemId);
                await DresseurProvider.removeItemFromDresseur(dresseur_id, itemId);
                location.reload();
            });
        });
    
        document.querySelectorAll(".remove-item-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                let pokemonId = e.target.dataset.pokemonId;
    
                console.log("Removing item from Pokemon", pokemonId);
                await DresseurProvider.removeItemFromPokemon(pokemonId);
                location.reload();
            });
        });
    }    
}