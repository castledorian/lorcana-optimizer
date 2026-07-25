// js/analyzers/card-performance-evaluator.js

import { simulateGame } from '../simulation/game-simulator.js';

/**
 * Évalue la performance individuelle des cartes dans un deck via simulation Monte Carlo.
 * Produit des métriques objectives : play rate, ink rate, dead draw rate.
 *
 * @module card-performance-evaluator
 */

/**
 * @typedef {Object} CardPerformance
 * @property {string} fullName
 * @property {number} playRate - Probabilité que la carte soit jouée au moins une fois (0-1)
 * @property {number} inkRate - Probabilité d'être utilisée comme encre
 * @property {number} deadRate - Probabilité de rester en main sans être jouée ni encrée
 * @property {number} avgCopiesPlayed - Nombre moyen d'exemplaires joués par partie
 */

/**
 * Lance N simulations et calcule les métriques pour chaque carte du deck.
 *
 * @param {Deck} deck - Instance de Deck
 * @param {CardDatabase} cardDB - Base de données des cartes
 * @param {number} [simulations=500] - Nombre de simulations (500 recommandé pour précision correcte)
 * @returns {Map<string, CardPerformance>} Clé = fullName, valeur = métriques
 */
export function evaluateCardPerformance(deck, cardDB, simulations = 500) {
    const totalCards = deck.getTotalCards();
    if (totalCards === 0) return new Map();

    // Accumulateurs
    const accumulators = new Map();
    deck.cards.forEach(({ fullName }) => {
        accumulators.set(fullName, {
            played: 0,          // nombre de simulations où la carte a été jouée au moins une fois
            inked: 0,           // nombre de simulations où elle a été encrée au moins une fois
            dead: 0,            // nombre de simulations où elle est restée morte
            totalCopiesPlayed: 0, // somme des exemplaires joués sur toutes les simulations
            totalSims: 0
        });
    });

    for (let i = 0; i < simulations; i++) {
        const result = simulateGame(deck, cardDB, { maxTurns: 10 });
        const { metrics } = result;

        accumulators.forEach((acc, fullName) => {
            acc.totalSims++;
            const playedCount = metrics.cardsPlayed.get(fullName) || 0;
            if (playedCount > 0) {
                acc.played++;
                acc.totalCopiesPlayed += playedCount;
            }
            const inkedCount = metrics.cardsInked.get(fullName) || 0;
            if (inkedCount > 0) acc.inked++;
            const deadCount = metrics.deadDraws.get(fullName) || 0;
            if (deadCount > 0) acc.dead++;
        });
    }

    // Calcul des métriques finales
    const performanceMap = new Map();
    accumulators.forEach((acc, fullName) => {
        const totalSims = acc.totalSims || 1;
        performanceMap.set(fullName, {
            fullName,
            playRate: acc.played / totalSims,
            inkRate: acc.inked / totalSims,
            deadRate: acc.dead / totalSims,
            avgCopiesPlayed: acc.totalCopiesPlayed / totalSims
        });
    });

    return performanceMap;
}
