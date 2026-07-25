// js/simulation/game-simulator.js

/**
 * Simule une partie solo de Lorcana en respectant les règles de base.
 * Le jeu est simplifié : pas d'effets, pas d'interaction adverse.
 * Priorité de jeu : jouer les personnages à fort lore.
 *
 * @module game-simulator
 */

/**
 * @typedef {Object} CardRef
 * @property {string} fullName
 * @property {Object} card - Données de la carte (depuis CardDatabase)
 */

/**
 * Résultat d'une simulation
 * @typedef {Object} SimulationResult
 * @property {number} lore - Lore total gagné
 * @property {number} inkwell - Encre disponible en fin de partie
 * @property {number} boardSize - Nombre de personnages sur le plateau
 * @property {Object} metrics
 * @property {Map<string, number>} metrics.cardsPlayed - Nombre de fois que chaque carte a été jouée
 * @property {Map<string, number>} metrics.cardsInked - Nombre de fois que chaque carte a été encrée
 * @property {Map<string, number>} metrics.deadDraws - Nombre de cartes restées en main sans jouer/encrer
 * @property {string[]} metrics.startingHand - fullNames de la main de départ
 * @property {number[]} metrics.loreByTurn
 * @property {number[]} metrics.inkByTurn
 * @property {number[]} metrics.boardSizeByTurn
 * @property {number} turn - Nombre de tours joués
 */

/**
 * Simule une partie et retourne les métriques.
 *
 * @param {Deck} deck - Instance de Deck
 * @param {CardDatabase} cardDB - Base de données des cartes
 * @param {Object} [options]
 * @param {number} [options.maxTurns=10] - Nombre maximum de tours
 * @param {Function} [options.mulliganFn] - Fonction(hand) retournant les cartes à défausser (CardRef[])
 * @returns {SimulationResult}
 */
export function simulateGame(deck, cardDB, options = {}) {
    const maxTurns = options.maxTurns ?? 10;
    const mulliganFn = options.mulliganFn ?? defaultMulligan;

    // Préparer le deck physique (liste de fullName)
    const deckList = [];
    deck.cards.forEach(({ fullName, quantity }) => {
        for (let i = 0; i < quantity; i++) deckList.push(fullName);
    });
    shuffle(deckList);

    // Main de départ
    const hand = deckList.splice(0, 7).map(fullName => resolveCard(fullName, cardDB));

    // Mulligan
    const toDiscard = mulliganFn(hand);
    toDiscard.forEach(card => {
        const idx = hand.indexOf(card);
        if (idx !== -1) {
            const removed = hand.splice(idx, 1)[0];
            deckList.push(removed.fullName); // remettre dans le deck
        }
    });
    shuffle(deckList);
    while (hand.length < 7 && deckList.length > 0) {
        hand.push(resolveCard(deckList.shift(), cardDB));
    }

    // État de la partie
    let inkwell = 0;
    let board = [];               // { card, summoningSick: boolean }
    let lore = 0;
    let turn = 0;
    const metrics = {
        loreByTurn: [],
        inkByTurn: [],
        boardSizeByTurn: [],
        cardsPlayed: new Map(),
        cardsInked: new Map(),
        deadDraws: new Map(),
        startingHand: hand.map(c => c.fullName)
    };

    // Déterminer qui commence (aléatoire)
    const isStartingPlayer = Math.random() < 0.5;
    // Si le joueur commence, il ne pioche pas au premier tour
    if (!isStartingPlayer) {
        drawCard(deckList, hand, cardDB);
    }

    while (turn < maxTurns && deckList.length + hand.length > 0) {
        turn++;
        // Pioche du tour (sauf premier tour du joueur qui commence)
        if (turn > 1 || !isStartingPlayer) {
            drawCard(deckList, hand, cardDB);
        }

        // Phase d'encre
        const inkableCard = hand.find(c => c.card && c.card.inkwell);
        if (inkableCard) {
            inkwell++;
            hand.splice(hand.indexOf(inkableCard), 1);
            metrics.cardsInked.set(inkableCard.fullName, (metrics.cardsInked.get(inkableCard.fullName) || 0) + 1);
        }

        // Phase principale : jouer les personnages payables
        let availableInk = inkwell;
        const playableCharacters = hand.filter(c => c.card && c.card.type === 'Character' && c.card.cost <= availableInk);
        // Priorité : plus haut lore, puis plus haut coût (meilleure présence)
        playableCharacters.sort((a, b) => {
            const loreDiff = (b.card.lore || 0) - (a.card.lore || 0);
            if (loreDiff !== 0) return loreDiff;
            return (b.card.cost || 0) - (a.card.cost || 0);
        });

        for (const c of playableCharacters) {
            if (c.card.cost <= availableInk) {
                availableInk -= c.card.cost;
                hand.splice(hand.indexOf(c), 1);
                board.push({ card: c.card, summoningSick: true });
                metrics.cardsPlayed.set(c.fullName, (metrics.cardsPlayed.get(c.fullName) || 0) + 1);
            }
        }

        // Phase de quête
        let loreThisTurn = 0;
        board.forEach(entry => {
            if (!entry.summoningSick) {
                loreThisTurn += entry.card.lore || 0;
            }
        });
        lore += loreThisTurn;
        metrics.loreByTurn.push(loreThisTurn);
        metrics.inkByTurn.push(inkwell);
        metrics.boardSizeByTurn.push(board.length);

        // Fin de tour : les personnages ne sont plus malades
        board.forEach(entry => { entry.summoningSick = false; });
    }

    // Cartes restées en main = dead draws
    hand.forEach(c => {
        metrics.deadDraws.set(c.fullName, (metrics.deadDraws.get(c.fullName) || 0) + 1);
    });

    return {
        lore,
        inkwell,
        boardSize: board.length,
        metrics,
        turn
    };
}

function drawCard(deckList, hand, cardDB) {
    if (deckList.length > 0) {
        hand.push(resolveCard(deckList.shift(), cardDB));
    }
}

function resolveCard(fullName, cardDB) {
    const card = cardDB.getCardById(fullName);
    return { fullName, card };
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function defaultMulligan(hand) {
    // Garder les cartes encrables, défausser les non-encrables
    return hand.filter(c => c.card && !c.card.inkwell);
}
