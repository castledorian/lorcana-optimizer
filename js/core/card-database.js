// js/core/card-database.js
class CardDatabase {
    constructor() {
        this.cards = [];
        this.sets = {};
        this.ready = false;
        this.listeners = [];
    }

    async load(language = 'fr') {
        const response = await fetch(`data/${language}.json`);
        const data = await response.json();
        this.cards = data.cards;
        this.sets = data.sets;
        this.ready = true;
        this._notifyListeners();
    }

    onReady(callback) {
        if (this.ready) {
            callback();
        } else {
            this.listeners.push(callback);
        }
    }

    _notifyListeners() {
        this.listeners.forEach(cb => cb());
        this.listeners = [];
    }

    getCardsByColor(color) {
        return this.cards.filter(card => card.color.includes(color));
    }

    getCardsByCost(cost) {
        return this.cards.filter(card => card.cost === cost);
    }

    searchCards(query) {
        const q = query.toLowerCase();
        return this.cards.filter(card =>
            card.name.toLowerCase().includes(q) ||
            card.fullName.toLowerCase().includes(q)
        );
    }

    getCardById(id) {
        return this.cards.find(card => card.fullName === id);
    }
}

// Singleton (simple, pour l'instant)
const cardDB = new CardDatabase();
export default cardDB;
