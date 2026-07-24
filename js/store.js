// js/store.js
class Store {
    constructor() {
        this.cardDB = null;          // Instance de CardDatabase
        this.language = 'fr';
        this.currentDeck = null;     // Instance de Deck
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) this.listeners.set(event, []);
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        const cbs = this.listeners.get(event) || [];
        cbs.forEach(cb => cb(data));
    }

    setLanguage(lang) {
        this.language = lang;
        this.emit('language-changed', lang);
    }

    setDeck(deck) {
        this.currentDeck = deck;
        this.emit('deck-changed', deck);
    }
}

export const store = new Store();
