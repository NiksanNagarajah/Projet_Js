const PokemonStars = (moyenne) => {
    if (!moyenne) return "Aucune note";
        let starsHtml = "";
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<span style="color:${i <= moyenne ? "#ffa723" : "#666"}; font-size: 30px;">★</span>`;
        }
    return starsHtml;
}

export default PokemonStars;

