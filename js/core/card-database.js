// js/core/card-database.js
class CardDatabase {
    constructor() {
        this.cards = [];
        this.sets = {};
        this.ready = false;
        this.listeners = [];
    }

    async load(language = 'fr') {
        const url = `data/${language}.json`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erreur HTTP ${response.status} pour ${url}`);
            const data = await response.json();
            this.cards = data.cards;
            this.sets = data.sets;

            // Création de searchText pour une recherche étendue
            this.cards.forEach(card => {
                const subtypes = card.subtypesText || (card.subtypes ? card.subtypes.join(' ') : '');
                const artists = card.artistsText || (card.artists ? card.artists.join(' ') : '');
                const story = card.story || '';
                const flavor = card.flavorText || '';
                const text = card.text || '';              // ← capacités et mots‑clés
                card.searchText = `${card.name} ${card.version} ${card.fullName} ${card.simpleName} ${subtypes} ${artists} ${story} ${flavor} ${text}`.toLowerCase();
            });

            this.ready = true;
            this._notifyListeners();
        } catch (err) {
            console.error('Échec de chargement des cartes :', err);
            throw new Error(`Impossible de charger les cartes (${url}). Vérifiez que le fichier existe dans le dossier data/.`);
        }
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

const cardDB = new CardDatabase();
export default cardDB;
