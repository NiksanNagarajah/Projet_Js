import PokemonProvider from "../../services/PokemonProvider.js";
import DresseurProvider from "../../services/DresseurProvider.js";
import ItemProvider from "../../services/ItemProvider.js";

export default class MyPokemon {
    async render() {
        let currentDresseur = JSON.parse(localStorage.getItem("dresseur"));
        if (!currentDresseur) {
            return `
            <div class="favorites-container text-center">
                <div class="alert alert-warning">
                    <h3>Vous devez être connecté pour voir vos pokémons</h3>
                    <p>Veuillez vous <a href="#login">connecter</a> ou <a href="#signup">créer un compte</a> pour continuer.</p>
                </div>
            </div>`;
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
                pokemons[pokemon.pokemon_id].item_url = item.url;
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
                <h2 class="text-center text-primary">Mes Pokémons</h2>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    ${Object.values(pokemons).map(pokemon => `
                        <div class="col">
                            <div class="card h-100 shadow-sm">
                                <a href="#pokemons/${pokemon.pokedex_id}" title="Détail" class="btn btn-outline-primary position-absolute top-0 end-0 m-2 px-3 py-2" style="font-size: 1.1rem;">
                                    <i class="bi bi-info-circle" style="font-size: 1.4rem;"></i>
                                </a>
                                <img src="${pokemon.sprites.regular}" class="card-img-top" alt="${pokemon.name.fr}">
                                <div class="card-body text-center">
                                    <h5 class="card-title">${pokemon.name.fr}</h5>
                                    <p class="card-text">ID: ${pokemon.pokedex_id}</p>
                                    <p class="card-text" style="display: flex; justify-content: center;">Objet: ${pokemon.objet ? `<img id="pokemon-sprite" class="pokemon-sprite" src="${pokemon.item_url}" alt="${pokemon.objet}" loading="lazy" style="width: 30px; margin: 0;"> ${pokemon.objet}` : "Aucun"}</p>
                                    ${pokemon.objet ? 
                                    "" : 
                                    `
                                    <select id="item-select-${pokemon.pokedex_id}" class="form-select">
                                        <option value="">Choisir un objet</option>
                                        ${Object.values(itemsById).map(item => `
                                            <option value="${item.id}">${item.name} (x${item.quantite}) (${item.type})</option>
                                        `).join("")}
                                    </select>` 
                                    }
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
                let dresseurId = JSON.parse(localStorage.getItem("dresseur")).id;
                let pokemonId = e.target.dataset.pokemonId;
                let pokemon = await DresseurProvider.getDresseurPokemon(dresseurId, pokemonId);
                pokemon = pokemon[0];
                let itemId = pokemon.objet;
    
                if (!confirm("Êtes-vous sûr de vouloir retirer l'objet de ce Pokémon ?")) {
                    return;
                }
    
                console.log("Removing item from Pokemon", pokemonId);
                await DresseurProvider.removeItemFromPokemon(dresseurId, pokemonId);
                await DresseurProvider.addItemToDresseur(dresseurId, itemId);
                location.reload();
            });
        });
    }    
}