const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = path.join(__dirname, '..', '..', 'meta');

// --- Fonction pour télécharger un fichier JSON depuis une URL ---
function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'LorcanaOptimizer/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`JSON invalide depuis ${url}`));
                }
            });
        }).on('error', reject);
    });
}

// --- Source 1 : Lorcanito (données de matchs) ---
async function fetchLorcanitoData() {
    try {
        // Fichier de statistiques d'archétypes (exemple, à vérifier sur le dépôt)
        const archetypesURL = 'https://raw.githubusercontent.com/lorcanito/lorcanito/main/data/archetypes.json';
        const data = await fetchJSON(archetypesURL);
        
        // Adapter au format attendu par ton site
        const archetypes = (data.archetypes || data || []).map(entry => ({
            name: entry.name || entry.archetype,
            colors: entry.colors || [],
            globalWinrate: entry.winrate || entry.winRate || 50,
            gamesPlayed: entry.games || entry.total || 0
        }));
        return { archetypes, matchups: [], cardWinrates: [] };
    } catch (err) {
        console.warn('Lorcanito :', err.message);
        return { archetypes: [], matchups: [], cardWinrates: [] };
    }
}

// --- Source 2 : Inkweave (classification d'archétypes) ---
async function fetchInkweaveData() {
    try {
        const metaURL = 'https://raw.githubusercontent.com/Doberjohn/inkweave/main/data/meta.json';
        const data = await fetchJSON(metaURL);
        
        const archetypes = (data.archetypes || []).map(entry => ({
            name: entry.name,
            colors: entry.colors || [],
            globalWinrate: entry.winrate || 50,
            gamesPlayed: entry.games || 0,
            matchups: entry.matchups || {}
        }));
        return { archetypes, matchups: [], cardWinrates: [] };
    } catch (err) {
        console.warn('Inkweave :', err.message);
        return { archetypes: [], matchups: [], cardWinrates: [] };
    }
}

// --- Source 3 : Lorcast API (cartes, pour enrichir si besoin) ---
async function fetchLorcastCards() {
    try {
        const url = 'https://api.lorcast.com/v0/cards';
        const data = await fetchJSON(url);
        // On peut extraire des stats si disponibles, mais principalement pour les données de cartes
        return { archetypes: [], matchups: [], cardWinrates: [] };
    } catch (err) {
        console.warn('Lorcast :', err.message);
        return { archetypes: [], matchups: [], cardWinrates: [] };
    }
}

// --- Agrégation et écriture ---
async function main() {
    console.log('Collecte des données méta depuis les sources réelles...\n');

    const [lorcanitoData, inkweaveData] = await Promise.allSettled([
        fetchLorcanitoData(),
        fetchInkweaveData()
    ]);

    let archetypes = [];
    let matchups = [];
    let cardWinrates = [];

    if (lorcanitoData.status === 'fulfilled') {
        archetypes = archetypes.concat(lorcanitoData.value.archetypes);
        matchups = matchups.concat(lorcanitoData.value.matchups);
        cardWinrates = cardWinrates.concat(lorcanitoData.value.cardWinrates);
        console.log('✅ Lorcanito :', lorcanitoData.value.archetypes.length, 'archétypes');
    }
    if (inkweaveData.status === 'fulfilled') {
        archetypes = archetypes.concat(inkweaveData.value.archetypes);
        matchups = matchups.concat(inkweaveData.value.matchups);
        console.log('✅ Inkweave :', inkweaveData.value.archetypes.length, 'archétypes');
    }

    // Déduplication
    const uniqueArchetypes = [...new Map(archetypes.map(a => [a.name, a])).values()];

    // Création du dossier de sortie
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // Écriture des fichiers
    fs.writeFileSync(
        path.join(outputDir, 'archetypes.json'),
        JSON.stringify({ 
            updated: new Date().toISOString().split('T')[0], 
            source: 'lorcanito+inkweave', 
            archetypes: uniqueArchetypes 
        }, null, 2)
    );
    fs.writeFileSync(
        path.join(outputDir, 'matchups.json'),
        JSON.stringify({ updated: new Date().toISOString().split('T')[0], matchups }, null, 2)
    );
    fs.writeFileSync(
        path.join(outputDir, 'card_winrates.json'),
        JSON.stringify({ updated: new Date().toISOString().split('T')[0], cardWinrates }, null, 2)
    );

    console.log(`\n📊 ${uniqueArchetypes.length} archétypes sauvegardés dans meta/`);
    console.log('✅ Collecte terminée.');
}

main().catch(console.error);
