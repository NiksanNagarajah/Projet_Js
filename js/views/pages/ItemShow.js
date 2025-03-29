import Utils from "../../services/Utils.js";
import ItemProvider from "../../services/ItemProvider.js";

export default class ItemShow {
    async render() {
        let request = Utils.parseRequestURL();
        let item = await ItemProvider.getItem(request.id);
        console.log(item);

        if (!item) {
            return `<div class="container text-center"><h2 class="mt-5">Error 404 - Objet non trouvé</h2></div>`;
        }

        const previousItemId = parseInt(item.id, 10) <= 1 ? 40 : parseInt(item.id, 10) - 1;
        const nextItemId = parseInt(item.id, 10) >= 40 ? 1 : parseInt(item.id, 10) + 1;

        const previousItem = await ItemProvider.getItem(previousItemId);
        const nextItem = await ItemProvider.getItem(nextItemId);

        return `
        <div class="container mt-4">
            <div class="row justify-content-center">
                <div class="col-lg-20">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <a href="./#items/${previousItemId}" class="btn btn-outline-secondary">
                            <i class="bi bi-chevron-left"></i> #${previousItemId} - ${previousItem.name}
                        </a>
                        <h1 class="text-center flex-grow-1">#${item.id} - ${item.name}</h1>
                        <a href="./#items/${nextItemId}" class="btn btn-outline-secondary">
                            #${nextItemId} - ${nextItem.name} <i class="bi bi-chevron-right"></i>
                        </a>
                    </div>
                    
                    <div class="card shadow-sm">
                        <div class="card-body text-center">
                            <!-- Image plus grande -->
                            <img id="item-sprite" src="${item.url}" alt="${item.name}" class="img-fluid mb-3" loading="lazy" style="max-width: 250px;"> 
                            <h4 class="card-title mb-3">${item.name}</h4>
                            <p><strong>Type :</strong> ${item.type}</p>
                            <p><strong>Description :</strong> ${item.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
}
