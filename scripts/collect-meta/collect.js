const fs = require('fs');
const path = require('path');
const axios = require('axios');
const puppeteer = require('puppeteer');

const outputDir = path.join(__dirname, '..', '..', 'meta');

// ------ Fonctions de scraping / API ------

async function fetchDuelsInk() {
    // Exemple avec axios (si API publique documentée)
    // Remplace l'URL par la vraie
    try {
        const resp = await axios.get('https://api.duels.ink/v1/meta', { timeout: 10000 });
        const data = resp.data;
        // Adapter au format attendu
        return {
            archetypes: data.archetypes || [],
            matchups: data.matchups || [],
            cardWinrates: data.cards || []
        };
    } catch (e) {
        console.warn('Duels.ink injoignable :', e.message);
        return { archetypes: [], matchups: [], cardWinrates: [] };
    }
}

async function fetchInkDecks() {
    // Scraping avec Puppeteer (exemple)
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    try {
        await page.goto('https://inkdecks.com/meta', { waitUntil: 'networkidle2', timeout: 30000 });
        const archetypes = await page.evaluate(() => {
            const rows = document.querySelectorAll('table.meta-table tbody tr');
            return Array.from(rows).map(row => {
                const cols = row.querySelectorAll('td');
                return {
                    name: cols[0]?.textContent.trim(),
                    colors: cols[1]?.textContent.split('/').map(s => s.trim()),
                    globalWinrate: parseFloat(cols[2]?.textContent),
                    gamesPlayed: parseInt(cols[3]?.textContent.replace(/\D/g, ''))
                };
            });
        });
        await browser.close();
        return { archetypes, matchups: [], cardWinrates: [] };
    } catch (e) {
        console.warn('InkDecks scraping échoué :', e.message);
        await browser.close();
        return { archetypes: [], matchups: [], cardWinrates: [] };
    }
}

// ------ Agrégation et écriture ------

async function main() {
    console.log('Collecte des données méta...');

    // Récupérer de plusieurs sources (Promise.allSettled pour ne pas bloquer)
    const [duelsData, inkdecksData] = await Promise.allSettled([
        fetchDuelsInk(),
        fetchInkDecks()
    ]);

    let archetypes = [];
    let matchups = [];
    let cardWinrates = [];

    if (duelsData.status === 'fulfilled') {
        archetypes = archetypes.concat(duelsData.value.archetypes);
        matchups = matchups.concat(duelsData.value.matchups);
        cardWinrates = cardWinrates.concat(duelsData.value.cardWinrates);
    }
    if (inkdecksData.status === 'fulfilled') {
        archetypes = archetypes.concat(inkdecksData.value.archetypes);
        matchups = matchups.concat(inkdecksData.value.matchups);
        cardWinrates = cardWinrates.concat(inkdecksData.value.cardWinrates);
    }

    // Déduplication simple (par nom pour archetypes, par paire pour matchups, par fullName pour cartes)
    const uniqueArchetypes = [...new Map(archetypes.map(a => [a.name, a])).values()];
    const uniqueMatchups = [...new Map(matchups.map(m => [`${m.archetypeA}|${m.archetypeB}`, m])).values()];
    const uniqueCards = [...new Map(cardWinrates.map(c => [c.fullName, c])).values()];

    // Écriture
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(
        path.join(outputDir, 'archetypes.json'),
        JSON.stringify({ updated: new Date().toISOString().split('T')[0], source: 'aggregated', archetypes: uniqueArchetypes }, null, 2)
    );
    fs.writeFileSync(
        path.join(outputDir, 'matchups.json'),
        JSON.stringify({ updated: new Date().toISOString().split('T')[0], matchups: uniqueMatchups }, null, 2)
    );
    fs.writeFileSync(
        path.join(outputDir, 'card_winrates.json'),
        JSON.stringify({ updated: new Date().toISOString().split('T')[0], cardWinrates: uniqueCards }, null, 2)
    );

    console.log(`✅ ${uniqueArchetypes.length} archétypes, ${uniqueMatchups.length} matchups, ${uniqueCards.length} cartes sauvegardées.`);
}

main().catch(console.error);
