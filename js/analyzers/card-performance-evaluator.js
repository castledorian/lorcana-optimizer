import { simulateGame } from '../simulation/game-simulator.js';

/**
 * Évalue la performance individuelle des cartes d'un deck via simulation Monte Carlo.
 * Retourne des métriques décisionnelles par carte, sans seuils arbitraires.
 *
 * @module card-performance-evaluator
 */

/**
 * @typedef {Object} CardPerformance
 * @property {string} fullName
 * @property {number} playRate - Probabilité d'être jouée (0-1)
 * @property {number} inkRate - Probabilité d'être encrée
 * @property {number} deadRate - Probabilité de rester en main jusqu'à la fin
 * @property {number} avgLoreContribution - Lore moyen gagné par quête de ce personnage (si personnage)
 * @property {number} avgTurnPlayed - Tour moyen où la carte est jouée (si jouée)
 */

/**
 * Lance N simulations et calcule les métriques pour chaque carte du deck.
 * @param {Deck} deck
 * @param {CardDatabase} cardDB
 * @param {number} [simulations=1000] - Nombre de simulations
 * @returns {Map<string, CardPerformance>} Clé = fullName, valeur = métriques
 */
export function evaluateCardPerformance(deck, cardDB, simulations = 1000) {
    const totalCards = deck.getTotalCards();
    if (totalCards === 0) return new Map();

    // Accumulateurs
    const accumulators = new Map();
    deck.cards.forEach(({ fullName }) => {
        accumulators.set(fullName, {
            played: 0,
            inked: 0,
            dead: 0,
            loreSum: 0,
            turnSum: 0,
            playedCount: 0,
            totalSims: 0
        });
    });

    for (let i = 0; i < simulations; i++) {
        const result = simulateGame(deck, cardDB, { maxTurns: 10 });
        const { metrics } = result;

        // Mise à jour pour chaque carte du deck
        accumulators.forEach((acc, fullName) => {
            acc.totalSims++;
            const played = metrics.cardsPlayed.get(fullName) || 0;
            if (played > 0) {
                acc.played++;
                acc.playedCount += played;
                // On ne peut pas connaître le tour exact de jeu avec cette simulation simple,
                // mais on peut approximer en prenant le tour moyen où le premier exemplaire a été joué ?
                // Pour simplifier, on enregistre juste la quantité jouée.
            }
            const inked = metrics.cardsInked.get(fullName) || 0;
            if (inked > 0) acc.inked++;
            const dead = metrics.deadDraws.get(fullName) || 0;
            if (dead > 0) acc.dead++;

            // Contribution Lore : si la carte est un personnage, on suppose que chaque fois qu'il est joué,
            // il quête chaque tour suivant jusqu'à la fin. Difficile à attribuer exactement.
            // Pour l'instant, on laisse cette métrique de côté.
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
            avgCopiesPlayed: acc.playedCount / totalSims,
            // avgLoreContribution: ... à implémenter avec une meilleure modélisation
        });
    });

    return performanceMap;
}
