import AuthService from "../../services/AuthService.js";

export default class Signup {
    async render() {
        return `
            <div class="container d-flex justify-content-center align-items-center">
                <div class="card p-4 shadow-lg" style="max-width: 400px; width: 100%;">
                    <h2 class="text-center text-primary">Inscription</h2>
                    <form id="signup-form">
                        <div class="mb-3">
                            <label for="prenom" class="form-label">Prénom</label>
                            <input type="text" id="prenom" class="form-control" placeholder="Prénom" required>
                        </div>
                        <div class="mb-3">
                            <label for="nom" class="form-label">Nom</label>
                            <input type="text" id="nom" class="form-control" placeholder="Nom" required>
                        </div>
                        <div class="mb-3">
                            <label for="age" class="form-label">Âge</label>
                            <input type="number" id="age" class="form-control" placeholder="Âge" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" class="form-control" placeholder="Email" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Mot de passe</label>
                            <input type="password" id="password" class="form-control" placeholder="Mot de passe" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">S'inscrire</button>
                    </form>
                    <p class="text-center mt-3">Déjà un compte ? <a href="#login">Se connecter</a></p>
                </div>
            </div>
        `;
    }

    async afterRender() {
        document.getElementById("signup-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            let dresseurData = {
                id: Date.now(),
                prenom: document.getElementById("prenom").value,
                nom: document.getElementById("nom").value,
                age: document.getElementById("age").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            };

            let result = await AuthService.register(dresseurData);
            alert(result.message);
            if (result.success) {
                window.location.href = "#login";
            }
        });
    }
}



