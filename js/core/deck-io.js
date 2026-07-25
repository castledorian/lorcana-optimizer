import { store } from '../store.js';
import Deck from './deck.js';

/**
 * Importe un deck à partir d'un texte au format dreamborn.ink / duel.ink.
 * Formats acceptés :
 *   4 Rabbit - Hunny Paladin
 *   4 Rabbit - Hunny Paladin (13-5)
 * @param {string} text
 * @returns {Deck|null} une instance de Deck ou null en cas d'erreur
 */
export function importDeckFromText(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const newDeck = new Deck();
    const cardDB = store.cardDB;
    const unknown = [];

    for (const line of lines) {
        // Extraction de la quantité et du nom
        const match = line.match(/^(\d+)\s+(.+)/);
        if (!match) continue;
        const quantity = parseInt(match[1], 10);
        const rest = match[2].trim();

        // Essayer de trouver la carte par fullName exact (insensible à la casse)
        let card = cardDB.cards.find(c => c.fullName.toLowerCase() === rest.toLowerCase());

        // Si pas trouvé, essayer en retirant le numéro de set entre parenthèses
        if (!card) {
            const withoutSet = rest.replace(/\s*\(\d+-\d+\)$/, '').trim();
            card = cardDB.cards.find(c => c.fullName.toLowerCase() === withoutSet.toLowerCase());
        }

        if (card) {
            newDeck.addCard(card.fullName, quantity);
        } else {
            unknown.push(rest);
        }
    }

    return { deck: newDeck, unknown };
}

/**
 * Exporte le deck courant au format texte (sans numéro de set).
 * @param {Deck} deck
 * @returns {string}
 */
export function exportDeckToText(deck) {
    if (!deck || deck.getTotalCards() === 0) return '';
    const cardDB = store.cardDB;
    const lines = deck.cards.map(({ fullName, quantity }) => {
        const card = cardDB.getCardById(fullName);
        const displayName = card ? card.fullName : fullName;
        return `${quantity} ${displayName}`;
    });
    return lines.join('\n');
}
