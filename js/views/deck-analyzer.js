import { store } from '../store.js';
import { analyzeDeck } from '../analyzers/deck-analyzer.js';
import { evaluateCardPerformance } from '../analyzers/card-performance-evaluator.js';
import { optimizeCopies } from '../optimizer/copy-optimizer.js';

export function createDeckAnalyzerView() {
    const container = document.createElement('div');

    // ---------- Header (identique aux autres vues) ----------
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

    // ---------- Contenu principal ----------
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

    let isDestroyed = false;
    let simTimeoutId = null;

    function update() {
        if (isDestroyed) return;
        const deck = store.currentDeck;
        if (!deck) {
            content.innerHTML = '<p style="color:var(--text-muted);">Deck non initialisé.</p>';
            simSection.innerHTML = '';
            optSection.innerHTML = '';
            return;
        }

        const analysis = analyzeDeck(deck, store.cardDB);
        content.innerHTML = renderAnalysis(analysis);

        // --- Simulation Monte Carlo ---
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

        // --- Optimisation ---
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
    }

    function runSimulation(deck, btn, resultsDiv) {
        if (isDestroyed) return;
        btn.disabled = true;
        btn.textContent = '⏳ Simulation en cours... (quelques secondes)';
        resultsDiv.innerHTML = '';
        if (simTimeoutId) clearTimeout(simTimeoutId);
        simTimeoutId = setTimeout(() => {
            if (isDestroyed) return;
            try {
                const perfMap = evaluateCardPerformance(deck, store.cardDB, 500);
                resultsDiv.innerHTML = renderPerformanceTable(perfMap, deck);
            } catch (e) {
                resultsDiv.innerHTML = '<p style="color:var(--text-muted);">Erreur lors de la simulation.</p>';
                console.error(e);
            }
            btn.disabled = false;
            btn.textContent = '⚡ Relancer la simulation';
            simTimeoutId = null;
        }, 50);
    }

    function runOptimizer(deck, btn, resultsDiv) {
        if (isDestroyed) return;
        btn.disabled = true;
        btn.textContent = '⏳ Optimisation en cours... (peut être long)';
        resultsDiv.innerHTML = '';
        if (simTimeoutId) clearTimeout(simTimeoutId);
        simTimeoutId = setTimeout(() => {
            if (isDestroyed) return;
            try {
                const results = optimizeCopies(deck, store.cardDB, 500);
                resultsDiv.innerHTML = renderOptimizationResults(results);
            } catch (e) {
                resultsDiv.innerHTML = '<p style="color:var(--text-muted);">Erreur lors de l\'optimisation.</p>';
                console.error(e);
            }
            btn.disabled = false;
            btn.textContent = '⚡ Relancer l\'optimisation';
            simTimeoutId = null;
        }, 50);
    }

    // Écouteurs
    const onDeckChanged = update;
    const onDataLoaded = update;
    store.on('deck-changed', onDeckChanged);
    if (store.cardDB && store.cardDB.ready) {
        update();
    } else {
        store.on('data-loaded', onDataLoaded);
    }

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

// ------ Rendu (inchangé) ------
function renderPerformanceTable(perfMap, deck) { /* ... */ }
function renderOptimizationResults(optResults) { /* ... */ }
function renderAnalysis(a) { /* ... */ }
