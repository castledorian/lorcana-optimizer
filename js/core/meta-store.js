// js/core/meta-store.js
class MetaStore {
    constructor() {
        this.archetypes = [];
        this.matchups = [];
        this.cardWinrates = [];
        this.ready = false;
        this.listeners = [];
    }

    async load() {
        try {
            const [archetypesResp, matchupsResp, cardWinratesResp] = await Promise.allSettled([
                fetch('meta/archetypes.json'),
                fetch('meta/matchups.json'),
                fetch('meta/card_winrates.json')
            ]);

            if (archetypesResp.status === 'fulfilled' && archetypesResp.value.ok) {
                const data = await archetypesResp.value.json();
                this.archetypes = data.archetypes || [];
            }
            if (matchupsResp.status === 'fulfilled' && matchupsResp.value.ok) {
                const data = await matchupsResp.value.json();
                this.matchups = data.matchups || [];
            }
            if (cardWinratesResp.status === 'fulfilled' && cardWinratesResp.value.ok) {
                const data = await cardWinratesResp.value.json();
                this.cardWinrates = data.cardWinrates || [];
            }
        } catch (err) {
            console.warn('Erreur lors du chargement des données méta :', err);
        } finally {
            this.ready = true;
            this._notifyListeners();
        }
    }

    onReady(callback) {
        if (this.ready) callback();
        else this.listeners.push(callback);
    }

    _notifyListeners() {
        this.listeners.forEach(cb => cb());
        this.listeners = [];
    }

    /**
     * Retourne le winrate global d'un archétype basé sur ses couleurs.
     */
    getArchetypeWinrate(colors) {
        const sortedColors = [...colors].sort().join('/');
        const archetype = this.archetypes.find(a => {
            const aColors = [...a.colors].sort().join('/');
            return aColors === sortedColors;
        });
        return archetype ? archetype.globalWinrate : null;
    }

    /**
     * Retourne les matchups pour un archétype donné.
     */
    getMatchups(colors) {
        const name = [...colors].sort().join('/');
        return this.matchups.filter(m => m.archetypeA === name || m.archetypeB === name);
    }

    /**
     * Retourne le winrate d'une carte spécifique.
     */
    getCardWinrate(fullName) {
        const entry = this.cardWinrates.find(c => c.fullName === fullName);
        return entry ? entry.winrate : null;
    }
}

const metaStore = new MetaStore();
export default metaStore;
