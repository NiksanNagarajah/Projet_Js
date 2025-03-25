import { DRESSEUR_POINT } from "../config.js";

const AuthService = {
    async register(dresseurData) {
        let existingDresseurs = await fetch(DRESSEUR_POINT).then(res => res.json());
        if (existingDresseurs.some(dresseur => dresseur.email === dresseurData.email)) {
            return { success: false, message: "Cet email est déjà utilisé." };
        }

        let response = await fetch(DRESSEUR_POINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dresseurData)
        });

        if (response.ok) {
            return { success: true, message: "Inscription réussie !" };
        } else {
            return { success: false, message: "Erreur lors de l'inscription." };
        }
    },

    async login(email, password) {
        let dresseurs = await fetch(DRESSEUR_POINT).then(res => res.json());
        let dresseur = dresseurs.find(dresseur => dresseur.email === email && dresseur.password === password);

        if (dresseur) {
            localStorage.setItem("dresseur", JSON.stringify(dresseur));
            return { success: true, message: "Connexion réussie !" };
        } else {
            return { success: false, message: "Email ou mot de passe incorrect." };
        }
    },

    getCurrentDresseur() {
        return JSON.parse(localStorage.getItem("dresseur"));
    },

    logout() {
        localStorage.removeItem("dresseur");
    }
};

export default AuthService;
