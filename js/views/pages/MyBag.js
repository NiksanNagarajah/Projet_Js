import DresseurProvider from "../../services/DresseurProvider.js";
import ItemProvider from "../../services/ItemProvider.js";

export default class MyBag {
    async render() {
        let currentDresseur = JSON.parse(localStorage.getItem("dresseur"));
        if (!currentDresseur) {
            return `<h2 class="text-center text-danger">Error 404 - Veuillez vous connecter</h2>`;
        }

        let itemsIds = await DresseurProvider.getDresseurItems(currentDresseur.id);
        let allItems = await Promise.all(itemsIds.map(item => ItemProvider.getItem(item.item_id)));

        let dresseurItems = {};
        for (let item of itemsIds) {
            let fullItem = allItems.find(i => i.id == item.item_id);
            dresseurItems[item.item_id] = { ...item, ...fullItem };
        }
        console.log("Items by ID:", dresseurItems);

        return `
            <div class="container mt-5">
                <h2 class="text-center text-primary">Mon Sac</h2>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    ${Object.values(dresseurItems).map(item => `
                        <div class="col">
                            <div class="card h-100 shadow-sm text-center">
                                <div class="card-body">
                                    <div class="d-flex justify-content-center mb-2">
                                        <img src="${item.url}" class="rounded-circle border p-2 bg-light" 
                                            alt="${item.name}" style="width: 48px; height: 48px;">
                                    </div>
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text text-muted">${item.description}</p>
                                    <p class="fw-bold">Quantité : ${item.quantite}</p>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }
}


