import Utils from "../../services/Utils.js";
import PokemonProvider from "../../services/PokemonProvider.js";

export default class PokemonShow {
    async render() {
        let request = Utils.parseRequestURL();
        let art = await PokemonProvider.getPokemon();

        return `
        <section>
        <h1>Pokemon index : ${art.index}</h1>
        <h2>Title : ${art.title}</h2>
        <p></p>
        <section>
        `
    }

}
