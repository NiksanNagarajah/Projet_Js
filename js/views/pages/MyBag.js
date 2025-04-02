import DresseurProvider from "../../services/DresseurProvider.js";
import ItemProvider from "../../services/ItemProvider.js";

export default class MyBag {
    async render() {
        let currentDresseur = JSON.parse(localStorage.getItem("dresseur"));
        if (!currentDresseur) {
            return `
            <div class="favorites-container text-center">
                <div class="alert alert-warning">
                    <h3>Vous devez être connecté pour voir votre sac</h3>
                    <p>Veuillez vous <a href="#login">connecter</a> ou <a href="#signup">créer un compte</a> pour continuer.</p>
                </div>
            </div>`;
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
                                <a href="#items/${item.item_id}" title="Détail" class="btn btn-outline-primary position-absolute top-0 end-0 m-2 px-3 py-2" style="font-size: 1.1rem;">
                                    <i class="bi bi-info-circle" style="font-size: 1.4rem;"></i>
                                </a>
                                <div class="card-body">
                                    <div class="d-flex justify-content-center mb-2">
                                        <img src="${item.url}" class="rounded-circle border p-2 bg-light" 
                                            alt="${item.name}" style="width: 48px; height: 48px;">
                                    </div>
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="fw-bold">Type : ${item.type}</p>
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


