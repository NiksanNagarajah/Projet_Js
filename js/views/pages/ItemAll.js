import ItemProvider from "../../services/ItemProvider.js";

export default class ItemAll {
    async render() {
        let items = await ItemProvider.getAllItem();
        console.log(items);

        let view = `
        <section class="pokedex-container">
            <h2 class="pokedex-title">Pokédex</h2>
            <div class="pokemon-grid">
                ${items.map(item => `
                    <div class="pokemon-card">
                        <a href="./#items/${item.id}" class="pokemon-link">
                            <img class="pokemon-sprite" src="${item.url}" alt="${item.name}"  loading="lazy">
                            <!-- <p class="pokemon-name">#${item.id} - ${item.name}</p> -->
                            <p class="pokemon-name">${item.id}. ${item.name}</p>
                        </a>
                    </div>
                `).join("")}
            </div>
        </section>
        `;

        return view;
    }
}