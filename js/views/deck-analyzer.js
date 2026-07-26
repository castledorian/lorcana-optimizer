import { store } from '../store.js';
import { analyzeDeck } from '../analyzers/deck-analyzer.js';
import { evaluateCardPerformance } from '../analyzers/card-performance-evaluator.js';
import { optimizeCopies } from '../optimizer/copy-optimizer.js';

export function createDeckAnalyzerView() {
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.maxWidth = '1200px';
    container.style.margin = '0 auto';

    const title = document.createElement('h2');
    title.textContent = 'Analyse du deck';
    title.style.color = 'var(--accent-gold)';
    title.style.marginBottom = '20px';
    container.appendChild(title);

    const content = document.createElement('div');
    content.id = 'analyzer-content';
    container.appendChild(content);

    const simSection = document.createElement('div');
    simSection.id = 'simulation-section';
    simSection.style.marginTop = '40px';
    container.appendChild(simSection);

    const optSection = document.createElement('div');
    optSection.id = 'optimization-section';
    optSection.style.marginTop = '40px';
    container.appendChild(optSection);

    let isDestroyed = false;      // pour annuler les simulations en cours
    let currentSimDeck = null;    // deck en cours de simulation
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

        // --- Section Simulation Monte Carlo ---
        simSection.innerHTML = `
            <h3 style="color:var(--accent-gold); margin-bottom:12px;">Performance par carte (simulation Monte Carlo)</h3>
            <button id="run-simulation-btn" class="clear-filters-btn" style="font-size:14px; padding:8px 16px;">
                ⚡ Lancer la simulation (500 parties)
            </button>
            <div id="sim-results" style="margin-top:16px;"></div>
        `;

        // Attacher l'événement directement
        const runSimBtn = simSection.querySelector('#run-simulation-btn');
        const simResultsDiv = simSection.querySelector('#sim-results');
        if (runSimBtn) {
            runSimBtn.addEventListener('click', () => {
                if (isDestroyed) return;
                if (!store.cardDB || !store.cardDB.ready) {
                    simResultsDiv.innerHTML = '<p style="color:var(--text-muted);">Base de données non chargée.</p>';
                    return;
                }
                runSimulation(deck, runSimBtn, simResultsDiv);
            });
        }

        // --- Section Optimisation ---
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
                if (isDestroyed) return;
                if (!store.cardDB || !store.cardDB.ready) {
                    optResultsDiv.innerHTML = '<p style="color:var(--text-muted);">Base de données non chargée.</p>';
                    return;
                }
                runOptimizer(deck, optBtn, optResultsDiv);
            });
        }
    }

    function runSimulation(deck, btn, resultsDiv) {
        if (isDestroyed) return;
        btn.disabled = true;
        btn.textContent = '⏳ Simulation en cours... (quelques secondes)';
        resultsDiv.innerHTML = '';

        // Annuler tout timeout précédent
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

    // Écouteurs du store
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

// ---------- Rendu ----------

function renderPerformanceTable(perfMap, deck) {
    if (!perfMap || perfMap.size === 0) return '<p style="color:var(--text-muted);">Aucune donnée de simulation disponible.</p>';

    const rows = [];
    for (const [fullName, perf] of perfMap) {
        const card = store.cardDB.getCardById(fullName);
        const displayName = card ? card.fullName : fullName;
        const isPlayable = card && card.type === 'Character';
        const playRate = isPlayable ? (perf.playRate * 100).toFixed(1) + '%' : 'Non jouable';
        const inkRate = (perf.inkRate * 100).toFixed(1) + '%';
        const deadRate = (perf.deadRate * 100).toFixed(1) + '%';
        const avgCopies = isPlayable ? perf.avgCopiesPlayed.toFixed(2) : '–';

        const playBar = isPlayable ? `<div style="background:var(--surface-card); height:6px; border-radius:3px; width:100px; display:inline-block; margin-left:8px;"><div style="width:${(perf.playRate*100).toFixed(1)}%; height:100%; background:#4caf50; border-radius:3px;"></div></div>` : '';
        const deadBar = `<div style="background:var(--surface-card); height:6px; border-radius:3px; width:100px; display:inline-block; margin-left:8px;"><div style="width:${(perf.deadRate*100).toFixed(1)}%; height:100%; background:#f44336; border-radius:3px;"></div></div>`;

        rows.push(`
            <tr>
                <td style="font-weight:500;">${displayName}</td>
                <td>${playRate} ${playBar}</td>
                <td>${inkRate}</td>
                <td>${deadRate} ${deadBar}</td>
                <td>${avgCopies}</td>
            </tr>
        `);
    }

    return `
        <table style="width:100%; border-collapse: collapse; margin-top:12px;">
            <thead>
                <tr style="border-bottom:1px solid var(--border-color); text-align:left;">
                    <th style="padding:8px;">Carte</th>
                    <th style="padding:8px;">Taux de jeu</th>
                    <th style="padding:8px;">Taux d'encrage</th>
                    <th style="padding:8px;">Taux de carte morte</th>
                    <th style="padding:8px;">Copies jouées (moy.)</th>
                </tr>
            </thead>
            <tbody>
                ${rows.join('')}
            </tbody>
        </table>
        <p style="color:var(--text-muted); font-size:12px; margin-top:8px;">
            <strong>Taux de jeu</strong> : probabilité que la carte soit jouée au moins une fois (personnages uniquement).<br>
            <strong>Taux d'encrage</strong> : probabilité qu'elle soit utilisée comme encre.<br>
            <strong>Taux de carte morte</strong> : probabilité qu'elle reste en main sans être ni jouée ni encrée.<br>
            <strong>Copies jouées</strong> : nombre moyen d'exemplaires mis en jeu par partie.
        </p>
    `;
}

function renderOptimizationResults(optResults) {
    if (!optResults || optResults.length === 0) return '<p style="color:var(--text-muted);">Aucun résultat.</p>';

    let html = `<table style="width:100%; border-collapse:collapse;">
        <thead>
            <tr style="border-bottom:1px solid var(--border-color); text-align:left;">
                <th style="padding:8px;">Carte</th>
                <th style="padding:8px;">Qté actuelle</th>
                <th style="padding:8px;">Qté optimale</th>
                <th style="padding:8px;">Lore moyen</th>
                <th style="padding:8px;">Stabilité encre</th>
                <th style="padding:8px;">Score</th>
            </tr>
        </thead>
        <tbody>`;

    for (const item of optResults) {
        const card = store.cardDB.getCardById(item.fullName);
        const displayName = card ? card.fullName : item.fullName;
        const currentQty = store.currentDeck.cards.find(c => c.fullName === item.fullName)?.quantity || 0;
        const best = item.results.find(r => r.quantity === item.bestQuantity);
        if (!best) continue;
        const score = (best.avgLore * best.inkStability).toFixed(2);

        html += `<tr>
            <td>${displayName}</td>
            <td>${currentQty}</td>
            <td style="font-weight:bold; color:var(--accent-gold);">${item.bestQuantity}</td>
            <td>${best.avgLore.toFixed(1)}</td>
            <td>${(best.inkStability*100).toFixed(1)}%</td>
            <td>${score}</td>
        </tr>`;
    }

    html += `</tbody></table>`;
    html += `<p style="color:var(--text-muted); font-size:12px; margin-top:8px;">
        Le score est le produit Lore moyen × Stabilité d'encre. La quantité optimale maximise ce score.
    </p>`;
    return html;
}

function renderAnalysis(a) {
    if (a.error) return `<p style="color:var(--text-muted)">${a.error}</p>`;

    const progressBar = (value, max, color = 'var(--accent-gold)') => {
        const pct = Math.min(100, (value / max) * 100);
        return `<div style="background:var(--surface-card); height:8px; border-radius:4px; margin:6px 0;">
            <div style="width:${pct}%; height:100%; background:${color}; border-radius:4px;"></div>
        </div>`;
    };

    const curveRows = a.costCurve.map((count, cost) => {
        let color = 'var(--text-muted)';
        if (cost >= 1 && cost <= 3) color = count >= 8 ? '#4caf50' : '#ff9800';
        else if (cost >= 4 && cost <= 5) color = count >= 4 ? '#4caf50' : '#ff9800';
        else if (cost >= 6) color = count <= 4 ? '#4caf50' : '#f44336';
        return `
            <div style="margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; font-size:13px;">
                    <span>Coût ${cost === 9 ? '9+' : cost}</span>
                    <span style="font-weight:bold; color:${color}">${count} carte${count>1?'s':''}</span>
                </div>
                ${progressBar(count, 12, color)}
            </div>`;
    }).join('');

    const typeBars = Object.entries(a.types).map(([type, count]) => {
        const max = Math.max(...Object.values(a.types), 1);
        const color = type === 'Personnage' ? '#4caf50' : (type === 'Action' ? '#2196f3' : (type === 'Objet' ? '#ff9800' : (type === 'Lieu' ? '#9c27b0' : '#607d8b')));
        return `
            <div style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; font-size:13px;">
                    <span>${type}</span>
                    <span>${count}</span>
                </div>
                ${progressBar(count, max, color)}
            </div>`;
    }).join('');

    const synergyItems = a.synergies.map(s => `<li>${s.message}</li>`).join('');

    return `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px;">
            <div>
                <h3 style="color:var(--accent-gold); margin-bottom:10px;">Courbe de coût</h3>
                ${curveRows}
            </div>
            <div>
                <h3 style="color:var(--accent-gold); margin-bottom:10px;">Types</h3>
                ${typeBars}
                <h3 style="color:var(--accent-gold); margin-top:20px; margin-bottom:10px;">Encre</h3>
                <div style="font-size:14px;">
                    <div>Encrables : ${a.inkableCount} / ${a.totalCards}</div>
                    <div>Ratio : <span style="font-weight:bold; color:${a.inkRatio>=0.6?'#4caf50':'#f44336'}">${(a.inkRatio*100).toFixed(1)}%</span></div>
                </div>
                <h3 style="color:var(--accent-gold); margin-top:20px; margin-bottom:10px;">Probabilités</h3>
                <div>Probabilité d'avoir au moins une carte jouable (coût ≤2) en main de départ : <strong>${(a.probEarlyPlay*100).toFixed(1)}%</strong></div>
                <div>Probabilité d'avoir au moins une carte encrable en main : <strong>${(a.probInkable*100).toFixed(1)}%</strong></div>
            </div>
        </div>
        <div style="margin-top:30px;">
            <h3 style="color:var(--accent-gold); margin-bottom:10px;">Points faibles</h3>
            ${a.warnings.length ? '<ul style="color:var(--text-muted); padding-left:20px;">' + a.warnings.map(w => `<li style="margin-bottom:6px;">${w}</li>`).join('') + '</ul>' : '<p style="color:var(--text-muted);">Aucun problème détecté.</p>'}
        </div>
        <div style="margin-top:20px;">
            <h3 style="color:var(--accent-gold); margin-bottom:10px;">Synergies</h3>
            ${synergyItems ? '<ul style="color:var(--text-muted); padding-left:20px;">' + synergyItems + '</ul>' : '<p style="color:var(--text-muted);">Aucune synergie forte détectée.</p>'}
        </div>
        <div style="margin-top:30px; text-align:center;">
            <h3 style="color:var(--accent-gold);">Score de cohérence</h3>
            <div style="font-size:48px; font-weight:bold; color:var(--accent-gold);">${a.score}/100</div>
            <p style="color:var(--text-muted);">Ce score est indicatif et reflète l'équilibre du deck.</p>
        </div>
    `;
}
