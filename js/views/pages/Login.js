import AuthService from "../../services/AuthService.js";

export default class Login {
    async render() {
        return `
            <section class="auth-container">
                <h2>Connexion</h2>
                <form id="login-form">
                    <input type="email" id="email" placeholder="Email" required>
                    <input type="password" id="password" placeholder="Mot de passe" required>
                    <button type="submit">Se connecter</button>
                </form>
                <p>Pas encore de compte ? <a href="#signup">S'inscrire</a></p>
            </section>
        `;
    }

    async afterRender() {
        document.getElementById("login-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;

            let result = await AuthService.login(email, password);
            alert(result.message);
            if (result.success) {
                window.location.href = "#home";
            }
        });
    }
}


