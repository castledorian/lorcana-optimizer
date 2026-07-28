// js/views/deck-analyzer.js (version finale avec Méta complète)
import { store } from '../store.js';
import { analyzeDeck } from '../analyzers/deck-analyzer.js';
import { evaluateCardPerformance } from '../analyzers/card-performance-evaluator.js';
import { optimizeCopies } from '../optimizer/copy-optimizer.js';
import metaStore from '../core/meta-store.js';

export function createDeckAnalyzerView() {
    const container = document.createElement('div');

    // Header (inchangé)...
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
        <div class="header-container">
            <div class="header-top">
                <div class="brand">
                    <div class="title">Lorcana Optimizer</div>
                </div>
                <div class="nav-links">
                    <a href="#cards" class="nav-link">Cartes</a>
                    <a href="#deck" class="nav-link">Deck Builder</a>
                    <a href="#analyze" class="nav-link active">Analyse</a>
                </div>
            </div>
        </div>
    `;
    container.appendChild(header);

    const main = document.createElement('div');
    main.style.padding = '20px';
    main.style.maxWidth = '1200px';
    main.style.margin = '0 auto';
    container.appendChild(main);

    const title = document.createElement('h2');
    title.textContent = 'Analyse du deck';
    title.style.color = 'var(--accent-gold)';
    title.style.marginBottom = '20px';
    main.appendChild(title);

    const content = document.createElement('div');
    content.id = 'analyzer-content';
    main.appendChild(content);

    const simSection = document.createElement('div');
    simSection.id = 'simulation-section';
    simSection.style.marginTop = '40px';
    main.appendChild(simSection);

    const optSection = document.createElement('div');
    optSection.id = 'optimization-section';
    optSection.style.marginTop = '40px';
    main.appendChild(optSection);

    const metaSection = document.createElement('div');
    metaSection.id = 'meta-section';
    metaSection.style.marginTop = '40px';
    main.appendChild(metaSection);

    let isDestroyed = false;
    let simTimeoutId = null;

    function update() {
        if (isDestroyed) return;
        const deck = store.currentDeck;
        if (!deck) {
            content.innerHTML = '<p style="color:var(--text-muted);">Deck non initialisé.</p>';
            simSection.innerHTML = '';
            optSection.innerHTML = '';
            metaSection.innerHTML = '';
            return;
        }

        const analysis = analyzeDeck(deck, store.cardDB);
        content.innerHTML = renderAnalysis(analysis);

        // Simulation
        simSection.innerHTML = `
            <h3 style="color:var(--accent-gold); margin-bottom:12px;">Performance par carte (simulation Monte Carlo)</h3>
            <button id="run-simulation-btn" class="clear-filters-btn" style="font-size:14px; padding:8px 16px;">
                ⚡ Lancer la simulation (500 parties)
            </button>
            <div id="sim-results" style="margin-top:16px;"></div>
        `;
        const runSimBtn = simSection.querySelector('#run-simulation-btn');
        const simResultsDiv = simSection.querySelector('#sim-results');
        if (runSimBtn) {
            runSimBtn.addEventListener('click', () => {
                if (isDestroyed || !store.cardDB || !store.cardDB.ready) return;
                runSimulation(deck, runSimBtn, simResultsDiv);
            });
        }

        // Optimisation
        optSection.innerHTML = `
            <h3 style="color:var(--accent-gold); margin-bottom:12px;">Optimisation des quantités (Copy Optimizer)</h3>
            <button id="run-optimizer-btn" class="clear-filters-btn" style="font-size:14px; padding:8px 16px;">
                ⚡ Lancer l'optimisation (500 simulations par carte)
            </button>
            <div id="opt-results" style="margin-top:16px;"></div>
        `;
        const optBtn = optSection.querySelector('#run-optimizer-btn');
        const optResultsDiv = optSection.querySelector('#opt-results');
        if (optBtn) {
            optBtn.addEventListener('click', () => {
                if (isDestroyed || !store.cardDB || !store.cardDB.ready) return;
                runOptimizer(deck, optBtn, optResultsDiv);
            });
        }

        // Méta
        updateMetaSection(deck);
    }

    function updateMetaSection(deck) {
        const deckColors = getDeckColors(deck);
        if (deckColors.length === 0) {
            metaSection.innerHTML = '<h3 style="color:var(--accent-gold); margin-bottom:12px;">Données Méta</h3><p style="color:var(--text-muted);">Ajoutez des cartes pour connaître le winrate de cet archétype.</p>';
            return;
        }

        let html = '<h3 style="color:var(--accent-gold); margin-bottom:12px;">Données Méta</h3>';

        // Winrate global
        const winrate = metaStore.getArchetypeWinrate(deckColors);
        if (winrate !== null) {
            html += `<p>Winrate global de <strong>${deckColors.join('/')}</strong> : <span style="color:var(--accent-gold); font-weight:bold;">${winrate}%</span></p>`;
        } else {
            html += `<p style="color:var(--text-muted);">Pas encore de données pour ${deckColors.join('/')}.</p>`;
        }

        // Matchups
        const matchups = metaStore.getMatchups(deckColors);
        if (matchups.length > 0) {
            html += '<h4 style="color:var(--accent-gold); margin-top:16px;">Matchups</h4><ul style="list-style:none; padding:0;">';
            matchups.forEach(m => {
                const isA = m.archetypeA === deckColors.join('/');
                const opponent = isA ? m.archetypeB : m.archetypeA;
                const myWinrate = isA ? m.winrateA : m.winrateB;
                const colorClass = myWinrate >= 50 ? '#4caf50' : '#f44336';
                html += `<li style="margin-bottom:4px;">
                    <span style="color:var(--text-muted);">vs ${opponent}</span> :
                    <span style="color:${colorClass}; font-weight:bold;">${myWinrate.toFixed(1)}%</span>
                    <span style="color:var(--text-muted); font-size:12px;"> (${m.gamesPlayed} parties)</span>
                </li>`;
            });
            html += '</ul>';
        } else {
            html += '<p style="color:var(--text-muted);">Aucune donnée de matchup.</p>';
        }

        // Cartes performantes du deck (si données méta)
        html += '<h4 style="color:var(--accent-gold); margin-top:16px;">Winrate des cartes (méta)</h4>';
        let cardFound = false;
        deck.cards.forEach(({ fullName }) => {
            const wr = metaStore.getCardWinrate(fullName);
            if (wr !== null) {
                cardFound = true;
                html += `<div style="display:flex; justify-content:space-between; font-size:13px; margin:4px 0;">
                    <span>${fullName}</span>
                    <span style="color:${wr>=50?'#4caf50':'#f44336'}; font-weight:bold;">${wr}%</span>
                </div>`;
            }
        });
        if (!cardFound) html += '<p style="color:var(--text-muted);">Aucune donnée pour ces cartes.</p>';

        metaSection.innerHTML = html;
    }

    function getDeckColors(deck) {
        const colorSet = new Set();
        deck.cards.forEach(({ fullName }) => {
            const card = store.cardDB.getCardById(fullName);
            if (card) {
                card.color.split('-').forEach(c => {
                    const trimmed = c.trim();
                    if (['Amber', 'Amethyst', 'Emerald', 'Ruby', 'Sapphire', 'Steel'].includes(trimmed)) {
                        colorSet.add(trimmed);
                    }
                });
            }
        });
        return [...colorSet].sort();
    }

    // ... (fonctions runSimulation, runOptimizer, renderPerformanceTable, renderOptimizationResults, renderAnalysis restent strictement identiques aux versions précédentes)

    // Ajout des écouteurs
    const onDeckChanged = update;
    const onDataLoaded = update;
    store.on('deck-changed', onDeckChanged);
    if (store.cardDB && store.cardDB.ready) {
        update();
    } else {
        store.on('data-loaded', onDataLoaded);
    }
    metaStore.onReady(() => {
        if (!isDestroyed) updateMetaSection(store.currentDeck);
    });

    const destroy = () => {
        isDestroyed = true;
        if (simTimeoutId) clearTimeout(simTimeoutId);
        store.off('deck-changed', onDeckChanged);
        store.off('data-loaded', onDataLoaded);
    };

    const view = container;
    view.destroy = destroy;
    return view;
}

// Les fonctions de rendu (renderPerformanceTable, renderOptimizationResults, renderAnalysis) sont celles déjà fournies précédemment.
