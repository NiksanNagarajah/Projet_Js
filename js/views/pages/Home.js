export default class Home {
    async render() {
        return `
        <section class="section">
            <div class="hero">
            <img src="images/PokéFiesta.png" alt="PokéFiesta" class="hero-image">
            <p>Bienvenue sur PokéFiesta, votre guide ultime dans l'univers des Pokémon.</p>
            </div>
            
            <div class="about-section">
                <h2>À propos</h2>
                <p>PokéFiesta est une plateforme dédiée à tous les passionnés de Pokémon. Notre mission est de vous offrir une expérience complète pour découvrir et explorer l'ensemble des Pokémon existants, des classiques de la première génération jusqu'aux créatures les plus récentes.</p>
                <p>Que vous soyez un dresseur débutant ou un expert du Pokédex, notre site vous propose des informations détaillées et facilement accessibles sur chaque Pokémon.</p>
            </div>
            
            <div class="features">
                <h2>Nos fonctionnalités</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>Recherche de Pokémon</h3>
                        <p>Trouvez rapidement n'importe quel Pokémon en utilisant notre système de recherche avancée. Filtrez par nom, numéro, type ou génération.</p>
                        <a href="/search" class="feature-link">Accéder à la recherche</a>
                    </div>
                    
                    <div class="feature-card">
                        <h3>Pokédex complet</h3>
                        <p>Explorez notre base de données exhaustive contenant tous les Pokémon avec leurs statistiques, évolutions, capacités et bien plus encore.</p>
                        <a href="#pokemons" class="feature-link">Consulter le Pokédex</a>
                    </div>
                    
                    <div class="feature-card">
                        <h3>Guide des types</h3>
                        <p>Apprenez tout sur les différents types de Pokémon, leurs forces, faiblesses et les meilleures stratégies de combat.</p>
                        <a href="/types" class="feature-link">Explorer les types</a>
                    </div>
                </div>
            </div>
            
            <div class="cta-section">
                <h2>Prêt à commencer votre aventure ?</h2>
                <p>Rejoignez des milliers de passionnés et plongez dans l'univers fascinant des Pokémon dès maintenant !</p>
                <div class="cta-buttons">
                    <a href="#pokemons" class="primary-button">Explorer le Pokédex</a>
                    <a href="/search" class="secondary-button">Rechercher un Pokémon</a>
                </div>
            </div>
        </section>
        `
    }
}