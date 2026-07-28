// js/core/meta-store.js
class MetaStore {
    constructor() {
        this.archetypes = [];
        this.ready = false;
        this.listeners = [];
    }

    async load() {
        try {
            const response = await fetch('meta/archetypes.json');
            if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
            const data = await response.json();
            this.archetypes = data.archetypes || [];
            this.updated = data.updated;
            this.ready = true;
            this._notifyListeners();
        } catch (err) {
            console.warn('Données méta non chargées :', err.message);
            // On ne bloque pas l'application
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
     * @param {string[]} colors - exemple ['Ruby', 'Amethyst']
     * @returns {number|null} winrate (0-100) ou null si inconnu
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
     * Retourne le winrate estimé d'un matchup.
     * @param {string[]} colorsA - couleurs du deck A
     * @param {string[]} colorsB - couleurs du deck B
     * @returns {number|null} winrate de A contre B (0-100)
     */
    getMatchupWinrate(colorsA, colorsB) {
        const nameA = [...colorsA].sort().join('/');
        const archetypeA = this.archetypes.find(a => [...a.colors].sort().join('/') === nameA);
        if (!archetypeA) return null;
        const nameB = [...colorsB].sort().join('/');
        return archetypeA.matchups[nameB] ?? null;
    }
}

const metaStore = new MetaStore();
export default metaStore;
