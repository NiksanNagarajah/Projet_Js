export default class AuthService {
    static async register(userData) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let existingUser = users.find(user => user.email === userData.email);

        if (existingUser) {
            return { success: false, message: "Cet email est déjà utilisé." };
        }

        userData.id = users.length + 1; // Génère un ID unique
        users.push(userData);
        localStorage.setItem("users", JSON.stringify(users));
        return { success: true, message: "Inscription réussie." };
    }

    static async login(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(user => user.email === email && user.password === password);

        if (!user) {
            return { success: false, message: "Email ou mot de passe incorrect." };
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        return { success: true, message: "Connexion réussie." };
    }

    static logout() {
        localStorage.removeItem("currentUser");
    }

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem("currentUser"));
    }
}
