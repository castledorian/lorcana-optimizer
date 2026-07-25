import { startingHandProbability } from '../core/probability.js';

/**
 * Analyse complète d'un deck
 * @param {Deck} deck
 * @param {CardDatabase} cardDB
 * @returns {object} analysisResult
 */
export function analyzeDeck(deck, cardDB) {
    const cards = deck.cards
        .map(({ fullName, quantity }) => {
            const card = cardDB.getCardById(fullName);
            return { ...card, quantity };
        })
        .filter(c => c !== undefined);

    const totalCards = deck.getTotalCards();
    if (totalCards === 0) {
        return {
            totalCards: 0,
            error: "Le deck est vide. Ajoutez des cartes pour l'analyser."
        };
    }

    // Courbe de coût
    const costCurve = new Array(10).fill(0);
    cards.forEach(({ cost = 0, quantity }) => {
        const idx = Math.min(cost, 9);
        costCurve[idx] += quantity;
    });

    // Types
    const types = { Personnage: 0, Action: 0, Objet: 0, Lieu: 0, Autre: 0 };
    cards.forEach(({ type, quantity }) => {
        if (!type) { types.Autre += quantity; return; }
        // Mapping simple
        if (type.toLowerCase().includes('character') || type === 'Personnage') types.Personnage += quantity;
        else if (type.toLowerCase().includes('action') || type === 'Action') types.Action += quantity;
        else if (type.toLowerCase().includes('item') || type === 'Objet') types.Objet += quantity;
        else if (type.toLowerCase().includes('location') || type === 'Lieu') types.Lieu += quantity;
        else types.Autre += quantity;
    });

    // Encre
    let inkableCount = 0;
    let nonInkableCount = 0;
    cards.forEach(({ inkwell, quantity }) => {
        if (inkwell) inkableCount += quantity;
        else nonInkableCount += quantity;
    });
    const inkRatio = totalCards > 0 ? inkableCount / totalCards : 0;

    // Probabilités
    const probEarlyPlay = (() => {
        // cartes à coût 1 et 2 jouables (on considère jouable si coût <= 2)
        const countEarly = cards.reduce((sum, { cost = 0, quantity }) => sum + (cost <= 2 ? quantity : 0), 0);
        return startingHandProbability(totalCards, countEarly);
    })();
    const probInkable = startingHandProbability(totalCards, inkableCount);

    // Points faibles
    const warnings = [];
    if (costCurve[1] < 8) warnings.push("Peu de cartes à coût 1 (moins de 8) : risque de ne rien jouer au premier tour.");
    if (costCurve[2] < 8) warnings.push("Peu de cartes à coût 2 (moins de 8) : courbe de début de partie faible.");
    if (inkRatio < 0.6) warnings.push("Ratio d'encre insuffisant (moins de 60%). Vous risquez de manquer d'encre.");
    if (nonInkableCount > 12) warnings.push("Trop de cartes non encrables (plus de 12) : cela peut bloquer votre développement.");
    if (types.Personnage < 25) warnings.push("Moins de 25 personnages : votre présence sur le terrain peut être insuffisante.");
    const highCostCount = costCurve.slice(6).reduce((a, b) => a + b, 0);
    if (highCostCount > 6) warnings.push("Plus de 6 cartes de coût 6+ : risque de mains trop lourdes.");

    // Synergies (basées sur les sous‑types)
    const subtypeMap = {};
    cards.forEach(card => {
        const subtypes = card.subtypesText ? card.subtypesText.split(/\s+/) : (card.subtypes || []);
        const qty = card.quantity || 0;
        subtypes.forEach(sub => {
            if (!subtypeMap[sub]) subtypeMap[sub] = 0;
            subtypeMap[sub] += qty;
        });
    });
    const synergies = [];
    Object.entries(subtypeMap).forEach(([subtype, count]) => {
        if (count >= 8 && !['personnage', 'character', 'action', 'item', 'objet', 'lieu', 'location', 'storyborn', 'dreamborn', 'floodborn'].includes(subtype.toLowerCase())) {
            synergies.push({
                type: subtype,
                count,
                message: `Synergie ${subtype} : ${count} cartes partagent ce sous‑type.`
            });
        }
    });

    // Score global (entre 0 et 100)
    let score = 50;
    if (costCurve[1] + costCurve[2] >= 16) score += 10;
    if (costCurve[1] >= 8) score += 5;
    if (costCurve[2] >= 8) score += 5;
    if (inkRatio >= 0.65) score += 10;
    else if (inkRatio >= 0.6) score += 5;
    if (types.Personnage >= 30) score += 10;
    else if (types.Personnage >= 25) score += 5;
    if (highCostCount <= 4) score += 10;
    if (synergies.length > 0) score += 5;
    score = Math.min(100, Math.max(0, score));

    return {
        totalCards,
        costCurve,
        types,
        inkableCount,
        nonInkableCount,
        inkRatio,
        probEarlyPlay,
        probInkable,
        warnings,
        synergies,
        score
    };
}
