// js/simulation/game-simulator.js

/**
 * Simule une partie solo de Lorcana en respectant les règles de base.
 * Priorité de jeu : jouer les personnages à fort lore.
 *
 * @module game-simulator
 */

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function defaultMulligan(hand) {
    return hand.filter(c => c.inkwell === false);
}

// ----- simulateGame originale (avec CardDatabase) -----
function resolveCard(fullName, cardDB) {
    const card = cardDB.getCardById(fullName);
    return card ? { fullName, card } : { fullName, card: null };
}

function drawCard(deckList, hand, cardDB) {
    if (deckList.length > 0) {
        hand.push(resolveCard(deckList.shift(), cardDB));
    }
}

export function simulateGame(deck, cardDB, options = {}) {
    const maxTurns = options.maxTurns ?? 10;
    const mulliganFn = options.mulliganFn ?? defaultMulligan;

    const deckList = [];
    deck.cards.forEach(({ fullName, quantity }) => {
        for (let i = 0; i < quantity; i++) deckList.push(fullName);
    });
    shuffle(deckList);

    const hand = deckList.splice(0, 7).map(fn => resolveCard(fn, cardDB));

    const toDiscard = mulliganFn(hand);
    toDiscard.forEach(card => {
        const idx = hand.indexOf(card);
        if (idx !== -1) {
            deckList.push(hand.splice(idx, 1)[0].fullName);
        }
    });
    shuffle(deckList);
    while (hand.length < 7 && deckList.length > 0) {
        hand.push(resolveCard(deckList.shift(), cardDB));
    }

    let inkwell = 0;
    let board = [];
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

    const isStartingPlayer = Math.random() < 0.5;
    if (!isStartingPlayer) {
        drawCard(deckList, hand, cardDB);
    }

    while (turn < maxTurns && deckList.length + hand.length > 0) {
        turn++;
        if (turn > 1 || !isStartingPlayer) {
            drawCard(deckList, hand, cardDB);
        }

        const inkableCard = hand.find(c => c.card && c.card.inkwell);
        if (inkableCard) {
            inkwell++;
            hand.splice(hand.indexOf(inkableCard), 1);
            metrics.cardsInked.set(inkableCard.fullName, (metrics.cardsInked.get(inkableCard.fullName) || 0) + 1);
        }

        let availableInk = inkwell;
        const playable = hand.filter(c => c.card && c.card.type === 'Character' && c.card.cost <= availableInk);
        playable.sort((a, b) => {
            const loreDiff = (b.card.lore || 0) - (a.card.lore || 0);
            if (loreDiff !== 0) return loreDiff;
            return (b.card.cost || 0) - (a.card.cost || 0);
        });

        for (const c of playable) {
            if (c.card.cost <= availableInk) {
                availableInk -= c.card.cost;
                hand.splice(hand.indexOf(c), 1);
                board.push({ card: c.card, summoningSick: true });
                metrics.cardsPlayed.set(c.fullName, (metrics.cardsPlayed.get(c.fullName) || 0) + 1);
            }
        }

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

        board.forEach(entry => { entry.summoningSick = false; });
    }

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

// ----- Nouvelle fonction pour les objets carte explicites -----
function drawCardFromList(deckList, hand) {
    if (deckList.length > 0) hand.push(deckList.shift());
}

/**
 * Simule une partie à partir d'une liste de cartes explicites.
 * @param {Array<{card: Object, quantity: number}>} cardList
 * @param {Object} [options]
 * @returns {SimulationResult}
 */
export function simulateGameWithCardObjects(cardList, options = {}) {
    const maxTurns = options.maxTurns ?? 10;
    const mulliganFn = options.mulliganFn ?? defaultMulligan;

    const deckList = [];
    cardList.forEach(({ card, quantity }) => {
        for (let i = 0; i < quantity; i++) deckList.push(card);
    });
    shuffle(deckList);

    const hand = deckList.splice(0, 7);

    const toDiscard = mulliganFn(hand);
    toDiscard.forEach(card => {
        const idx = hand.indexOf(card);
        if (idx !== -1) {
            deckList.push(hand.splice(idx, 1)[0]);
        }
    });
    shuffle(deckList);
    while (hand.length < 7 && deckList.length > 0) {
        hand.push(deckList.shift());
    }

    let inkwell = 0;
    let board = [];
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

    const isStartingPlayer = Math.random() < 0.5;
    if (!isStartingPlayer) {
        drawCardFromList(deckList, hand);
    }

    while (turn < maxTurns && deckList.length + hand.length > 0) {
        turn++;
        if (turn > 1 || !isStartingPlayer) {
            drawCardFromList(deckList, hand);
        }

        const inkableCard = hand.find(c => c.inkwell);
        if (inkableCard) {
            inkwell++;
            hand.splice(hand.indexOf(inkableCard), 1);
            metrics.cardsInked.set(inkableCard.fullName, (metrics.cardsInked.get(inkableCard.fullName) || 0) + 1);
        }

        let availableInk = inkwell;
        const playable = hand.filter(c => c.type === 'Character' && c.cost <= availableInk);
        playable.sort((a, b) => (b.lore || 0) - (a.lore || 0) || (b.cost || 0) - (a.cost || 0));

        for (const c of playable) {
            if (c.cost <= availableInk) {
                availableInk -= c.cost;
                hand.splice(hand.indexOf(c), 1);
                board.push({ card: c, summoningSick: true });
                metrics.cardsPlayed.set(c.fullName, (metrics.cardsPlayed.get(c.fullName) || 0) + 1);
            }
        }

        let loreThisTurn = 0;
        board.forEach(entry => {
            if (!entry.summoningSick) loreThisTurn += entry.lore || 0;
        });
        lore += loreThisTurn;
        metrics.loreByTurn.push(loreThisTurn);
        metrics.inkByTurn.push(inkwell);
        metrics.boardSizeByTurn.push(board.length);

        board.forEach(entry => { entry.summoningSick = false; });
    }

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
