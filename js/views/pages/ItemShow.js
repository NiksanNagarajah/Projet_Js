import Utils from "../../services/Utils.js";
import ItemProvider from "../../services/ItemProvider.js";

export default class ItemShow {
    async render() {
        let request = Utils.parseRequestURL();
        let item = await ItemProvider.getItem(request.id);
        console.log(item);

        if (!item) {
            return `<h2 style="text-align: center;">Error 404 - Pokémon non trouvé</h2>`;
        }

        const previousItemId = parseInt(item.id, 10) <= 1 ? 40 : parseInt(item.id, 10) - 1 ;
        const nextItemId = parseInt(item.id, 10) >= 40 ? 1 : parseInt(item.id, 10) + 1;

        return `
        <section class="pokemon-container">
            <a href="./#items/${previousItemId}" class="pokemon-link"><</a>
            <h1 class="pokemon-title">#${item.id} - ${item.name}</h1>
            <div class="pokemon-card">
                <img id="pokemon-sprite" class="pokemon-sprite" src="${item.url}" alt="${item.name}" loading="lazy">
                <div class="pokemon-info">
                    <p><strong>Type :</strong> ${item.type}</p>
                    <p><strong>Description :</strong> ${item.description}</p>
                </div>
            </div>
            <a href="./#items/${nextItemId}" class="pokemon-link">></a>
        </section>`;
    }
}
