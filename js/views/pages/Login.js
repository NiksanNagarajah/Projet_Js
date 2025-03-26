import AuthService from "../../services/AuthService.js";

export default class Login {
    async render() {
        return `
            <div class="container d-flex justify-content-center align-items-center">
                <div class="card p-4 shadow-lg" style="max-width: 400px; width: 100%;">
                    <h2 class="text-center text-primary">Connexion</h2>
                    <form id="login-form">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" class="form-control" placeholder="Email" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Mot de passe</label>
                            <input type="password" id="password" class="form-control" placeholder="Mot de passe" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Se connecter</button>
                    </form>
                    <p class="text-center mt-3">Pas encore de compte ? <a href="#signup">S'inscrire</a></p>
                </div>
            </div>
        `;
    }

    async afterRender() {
        document.getElementById("login-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;

            let result = await AuthService.login(email, password);
            // alert(result.message);
            if (result.success) {
                window.location.href = "#home";
            } else {
                alert(result.message);
            }
        });
    }
}


