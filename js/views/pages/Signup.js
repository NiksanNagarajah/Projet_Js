import AuthService from "../../services/AuthService.js";

export default class Signup {
    async render() {
        return `
            <section class="auth-container">
                <h2>Inscription</h2>
                <form id="signup-form">
                    <input type="text" id="prenom" placeholder="Prénom" required>
                    <input type="text" id="nom" placeholder="Nom" required>
                    <input type="number" id="age" placeholder="Âge" required>
                    <input type="email" id="email" placeholder="Email" required>
                    <input type="password" id="password" placeholder="Mot de passe" required>
                    <button type="submit">S'inscrire</button>
                </form>
                <p>Déjà un compte ? <a href="#login">Se connecter</a></p>
            </section>
        `;
    }

    async afterRender() {
        document.getElementById("signup-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            let userData = {
                prenom: document.getElementById("prenom").value,
                nom: document.getElementById("nom").value,
                age: document.getElementById("age").value, 
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            };

            let result = await AuthService.register(userData);
            alert(result.message);
            if (result.success) {
                window.location.href = "#login";
            }
        });
    }
}
