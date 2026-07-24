class Deck {
    constructor() {
        this.cards = []; // { fullName: string, quantity: number }
    }

    addCard(fullName, quantity = 1) {
        const existing = this.cards.find(c => c.fullName === fullName);
        if (existing) {
            existing.quantity = Math.min(4, existing.quantity + quantity);
        } else {
            this.cards.push({ fullName, quantity });
        }
    }

    removeCard(fullName) {
        this.cards = this.cards.filter(c => c.fullName !== fullName);
    }

    getTotalCards() {
        return this.cards.reduce((sum, c) => sum + c.quantity, 0);
    }

    getColorDistribution(cardDB) {
        const colors = {};
        this.cards.forEach(({ fullName, quantity }) => {
            const card = cardDB.getCardById(fullName);
            if (!card) return;
            card.color.split('-').forEach(color => {
                colors[color] = (colors[color] || 0) + quantity;
            });
        });
        return colors;
    }

    getCostCurve(cardDB) {
        const curve = Array(10).fill(0);
        this.cards.forEach(({ fullName, quantity }) => {
            const card = cardDB.getCardById(fullName);
            if (!card) return;
            const cost = Math.min(card.cost || 0, 9);
            curve[cost] += quantity;
        });
        return curve;
    }

    getInkableRatio(cardDB) {
        let total = 0;
        let inkable = 0;
        this.cards.forEach(({ fullName, quantity }) => {
            const card = cardDB.getCardById(fullName);
            if (!card) return;
            total += quantity;
            if (card.inkwell) inkable += quantity;
        });
        return total > 0 ? (inkable / total * 100).toFixed(1) : 0;
    }

    validate() {
        const errors = [];
        const totalCards = this.getTotalCards();
        if (totalCards < 60) errors.push("Le deck doit contenir au moins 60 cartes.");
        this.cards.forEach(({ fullName, quantity }) => {
            if (quantity > 4) errors.push(`${fullName} : maximum 4 exemplaires.`);
        });
        return errors;
    }
}

export default Deck;
