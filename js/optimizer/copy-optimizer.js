import { simulateGameWithCardObjects } from '../simulation/game-simulator.js';

function createFillerCard(index) {
    return {
        fullName: `Filler-${index}`,
        name: 'Filler',
        cost: 1,
        inkwell: true,
        type: 'Character',
        lore: 1,
        strength: 1,
        willpower: 1
    };
}

function resolveCard(fullName, cardDB) {
    const card = cardDB.getCardById(fullName);
    if (!card) throw new Error(`Carte introuvable : ${fullName}`);
    return {
        fullName: card.fullName,
        cost: card.cost || 0,
        inkwell: card.inkwell || false,
        type: card.type || 'Character',
        lore: card.lore || 0,
        strength: card.strength || 0,
        willpower: card.willpower || 0
    };
}

function buildVariantDeck(originalDeck, targetFullName, quantity, cardDB) {
    const variantCards = [];
    let total = 0;

    originalDeck.cards.forEach(({ fullName, quantity: qty }) => {
        if (fullName === targetFullName) {
            if (quantity > 0) {
                variantCards.push({ card: resolveCard(fullName, cardDB), quantity });
                total += quantity;
            }
        } else {
            variantCards.push({ card: resolveCard(fullName, cardDB), quantity: qty });
            total += qty;
        }
    });

    if (!originalDeck.cards.some(c => c.fullName === targetFullName)) {
        variantCards.push({ card: resolveCard(targetFullName, cardDB), quantity });
        total += quantity;
    }

    let fillerIndex = 0;
    while (total < 60) {
        variantCards.push({ card: createFillerCard(fillerIndex++), quantity: 1 });
        total++;
    }

    return variantCards;
}

function evaluateVariant(cardList, simulations = 500) {
    let totalLore = 0;
    let totalStableInk = 0;
    let totalBoardSize = 0;

    for (let i = 0; i < simulations; i++) {
        const result = simulateGameWithCardObjects(cardList, { maxTurns: 10 });
        totalLore += result.lore;
        totalBoardSize += result.boardSize;

        const inkByTurn = result.metrics.inkByTurn;
        let stable = true;
        for (let t = 0; t < Math.min(4, inkByTurn.length); t++) {
            if (inkByTurn[t] < t + 1) {
                stable = false;
                break;
            }
        }
        if (stable) totalStableInk++;
    }

    return {
        avgLore: totalLore / simulations,
        inkStability: totalStableInk / simulations,
        avgBoardSize: totalBoardSize / simulations
    };
}

/**
 * Optimise la quantité de chaque carte d'un deck.
 * @param {Deck} deck
 * @param {CardDatabase} cardDB
 * @param {number} [simulations=500]
 * @returns {Array<{ fullName: string, bestQuantity: number, results: Array }>}
 */
export function optimizeCopies(deck, cardDB, simulations = 500) {
    const optimizationResults = [];
    const uniqueCards = deck.cards.map(c => c.fullName);

    for (const fullName of uniqueCards) {
        const variantResults = [];

        for (let qty = 1; qty <= 4; qty++) {
            try {
                const cardList = buildVariantDeck(deck, fullName, qty, cardDB);
                const perf = evaluateVariant(cardList, simulations);
                variantResults.push({ quantity: qty, ...perf });
            } catch (e) {
                console.error(`Erreur pour ${fullName} x${qty}`, e);
            }
        }

        if (variantResults.length === 0) continue;

        let best = variantResults[0];
        for (const res of variantResults) {
            const score = res.avgLore * res.inkStability;
            if (score > best.avgLore * best.inkStability) best = res;
        }

        optimizationResults.push({
            fullName,
            bestQuantity: best.quantity,
            results: variantResults
        });
    }

    return optimizationResults;
}
