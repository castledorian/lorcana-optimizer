const fs = require('fs');
const path = require('path');
const duelsink = require('./sources/duelsink');
const lorcanito = require('./sources/lorcanito');
const inkdecks = require('./sources/inkdecks');

const outputDir = path.join(__dirname, '..', '..', 'meta');

async function main() {
    console.log('Début de la collecte...');

    let archetypes = [];
    let matchups = [];
    let cardWinrates = [];

    // Source 1 : Duels.ink (API simulée)
    try {
        const data = await duelsink.fetchData();
        archetypes = archetypes.concat(data.archetypes || []);
        matchups = matchups.concat(data.matchups || []);
        cardWinrates = cardWinrates.concat(data.cardWinrates || []);
        console.log('Duels.ink : OK');
    } catch (err) {
        console.warn('Duels.ink ignoré :', err.message);
    }

    // Source 2 : Lorcanito (si disponible)
    try {
        const data = await lorcanito.fetchData();
        // Fusionner...
        console.log('Lorcanito : OK');
    } catch (err) {
        console.warn('Lorcanito ignoré :', err.message);
    }

    // Source 3 : InkDecks (scraping HTML)
    try {
        const data = await inkdecks.fetchData();
        // Fusionner...
        console.log('InkDecks : OK');
    } catch (err) {
        console.warn('InkDecks ignoré :', err.message);
    }

    // Agréger et écrire les fichiers
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(
        path.join(outputDir, 'archetypes.json'),
        JSON.stringify({ updated: new Date().toISOString().split('T')[0], source: 'aggregated', archetypes }, null, 2)
    );
    fs.writeFileSync(
        path.join(outputDir, 'matchups.json'),
        JSON.stringify({ updated: new Date().toISOString().split('T')[0], matchups }, null, 2)
    );
    fs.writeFileSync(
        path.join(outputDir, 'card_winrates.json'),
        JSON.stringify({ updated: new Date().toISOString().split('T')[0], cardWinrates }, null, 2)
    );

    console.log('Fichiers générés dans', outputDir);
}

main().catch(console.error);
