import AuthService from "../../services/AuthService.js";

export default class Profil {
    async render() {
        let dresseur = AuthService.getCurrentDresseur();
        if (!dresseur) {
            return `<h2 class="text-center text-danger">Veuillez vous connecter</h2>`;
        }

        return `
            <div class="container mt-5">
                <div class="card shadow-sm p-4">
                    <h2 class="text-primary text-center">Mon Profil</h2>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>ID :</strong> ${dresseur.id}</li>
                        <li class="list-group-item"><strong>Prénom :</strong> ${dresseur.prenom}</li>
                        <li class="list-group-item"><strong>Nom :</strong> ${dresseur.nom}</li>
                        <li class="list-group-item"><strong>Âge :</strong> ${dresseur.age}</li>
                        <li class="list-group-item"><strong>Email :</strong> ${dresseur.email}</li>
                    </ul>
                    <button id="logout-btn" class="primary-button" style="margin-top: 20px;">Se déconnecter</button>
                </div>
            </div>
        `;
    }

    async afterRender() {
        document.getElementById("logout-btn").addEventListener("click", () => {
            AuthService.logout();
            window.location.href = "#home";
        });
    }
}


