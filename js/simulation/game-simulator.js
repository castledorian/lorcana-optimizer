/**
 * Moteur de simulation solo d'une partie de Lorcana.
 * Respecte les règles fondamentales (pioche, encre, jeu, quête) sans effets complexes.
 * Permet d'évaluer la performance brute d'un deck (Lore, développement).
 *
 * @module game-simulator
 */

/**
 * Simule une partie et retourne les métriques détaillées.
 * @param {Deck} deck - Le deck à simuler (instance de Deck)
 * @param {CardDatabase} cardDB - Base de données pour résoudre les cartes
 * @param {Object} [options]
 * @param {number} [options.maxTurns=10] - Nombre de tours maximum
 * @param {Function} [options.mulliganFn] - Fonction(hand) retournant les cartes à défausser
 * @returns {SimulationResult}
 */
export function simulateGame(deck, cardDB, options = {}) {
    const maxTurns = options.maxTurns ?? 10;
    const mulliganFn = options.mulliganFn ?? defaultMulligan;

    // Initialisation du deck (liste des fullName en quantité)
    const deckList = [];
    deck.cards.forEach(({ fullName, quantity }) => {
        for (let i = 0; i < quantity; i++) deckList.push(fullName);
    });
    shuffle(deckList);

    // Main du joueur
    const hand = deckList.splice(0, 7).map(fullName => resolveCard(fullName, cardDB));

    // Mulligan
    const toDiscard = mulliganFn(hand);
    toDiscard.forEach(card => {
        const idx = hand.indexOf(card);
        if (idx !== -1) {
            deckList.push(hand.splice(idx, 1)[0].fullName); // remettre dans le deck
        }
    });
    shuffle(deckList);
    while (hand.length < 7 && deckList.length > 0) {
        hand.push(resolveCard(deckList.shift(), cardDB));
    }

    // État de la partie
    let inkwell = 0;              // quantité d'encre disponible
    let board = [];               // personnages en jeu (avec tours restants avant de pouvoir quêter)
    let lore = 0;
    let turn = 0;
    const metrics = {
        loreByTurn: [],
        inkByTurn: [],
        boardSizeByTurn: [],
        cardsPlayed: new Map(),   // fullName -> nombre de fois joué
        cardsInked: new Map(),    // fullName -> nombre de fois encré
        deadDraws: new Map(),     // fullName -> nombre de fois resté en main jusqu'à la fin
        startingHand: hand.map(c => c.fullName)
    };

    // Le joueur qui commence est aléatoire (pioche au premier tour ou pas)
    const isStartingPlayer = Math.random() < 0.5;
    // Si le joueur commence, il ne pioche pas au premier tour
    if (!isStartingPlayer) {
        drawCard(deckList, hand, cardDB);
    }

    while (turn < maxTurns && (deckList.length > 0 || hand.length > 0)) {
        turn++;
        // Phase de début de tour (pioche si ce n'est pas le premier tour du joueur qui commence)
        if (turn > 1 || !isStartingPlayer) {
            if (turn > 1) {
                drawCard(deckList, hand, cardDB);
            }
        } else {
            // Premier tour du joueur qui commence : pas de pioche déjà faite
        }

        // Phase d'encre : poser une carte encrable si possible
        const inkableCard = hand.find(c => c.card && c.card.inkwell);
        if (inkableCard) {
            inkwell++;
            hand.splice(hand.indexOf(inkableCard), 1);
            metrics.cardsInked.set(inkableCard.fullName, (metrics.cardsInked.get(inkableCard.fullName) || 0) + 1);
        }

        // Phase principale : jouer les personnages payables
        let availableInk = inkwell;
        const playableCharacters = hand.filter(c => c.card && c.card.type === 'Character' && c.card.cost <= availableInk);
        // Trier par lore décroissant puis coût décroissant (stratégie simple)
        playableCharacters.sort((a, b) => {
            const loreDiff = (b.card.lore || 0) - (a.card.lore || 0);
            if (loreDiff !== 0) return loreDiff;
            return (b.card.cost || 0) - (a.card.cost || 0);
        });

        for (const c of playableCharacters) {
            if (c.card.cost <= availableInk) {
                availableInk -= c.card.cost;
                hand.splice(hand.indexOf(c), 1);
                // Ajouter au plateau avec summoning sickness : ne peut pas quêter ce tour
                board.push({ card: c.card, summoningSick: true });
                metrics.cardsPlayed.set(c.fullName, (metrics.cardsPlayed.get(c.fullName) || 0) + 1);
            }
        }

        // Phase de quête : tous les personnages non malades quêtent
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

    // Fin de partie : identifier les dead draws (cartes restées en main sans être jouées/encrées)
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
    // Défausse les cartes non encrables pour maximiser l'encrage tôt
    return hand.filter(c => c.card && !c.card.inkwell);
}
