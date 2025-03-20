import { ITEM_POINT } from '../config.js';

export default class ItemProvider {
    static fetchItems = async (limit=10) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${ITEM_POINT}?_limit=${limit}`, options);
            // Ajouter un if response.ok ?
            const json = await response.json(); 
            return json;
        } catch(err) {
            console.log("Error getting documents", err);
        }
    }

    static getItem = async (id) => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${ITEM_POINT}?id=${id}`, options);
            const json = await response.json();
            return json[0];
        } catch(err) {
            console.log("Error getting items", err);
        }
    }

    static getAllItem = async () => {
        const options = {
            method : 'GET', 
            headers : {
                'Content-Type':'application/json'
            }
        };
        try {
            const response = await fetch(`${ITEM_POINT}`, options);
            // Ajouter un if response.ok ?
            const json = await response.json(); 
            return json;
        } catch(err) {
            console.log("Error getting documents", err);
        }
    }
} 