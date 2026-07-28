const axios = require('axios');

// Exemple avec une API hypothétique (à adapter selon la documentation réelle)
const API_BASE = 'https://api.duels.ink/v1'; // fictif

async function fetchData() {
    // Récupération des archétypes et winrates globaux
    const response = await axios.get(`${API_BASE}/meta/archetypes`);
    const data = response.data;
    // Normaliser dans le format attendu
    const archetypes = data.map(entry => ({
        name: entry.name,
        colors: entry.colors,
        globalWinrate: entry.winrate,
        gamesPlayed: entry.games,
        matchups: entry.matchups || {}
    }));
    return { archetypes };
}

module.exports = { fetchData };
