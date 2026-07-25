import { store } from '../store.js';
import { createCardPool } from '../components/card-pool.js';
import { createDeckPanel } from '../components/deck-panel.js';
import { createLanguageSelector } from '../components/language-selector.js';
import { importDeckFromText, exportDeckToText } from '../core/deck-io.js';
import Deck from '../core/deck.js';

export function createDeckBuilderView() {
    const container = document.createElement('div');

    // Header
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
        <div class="header-container">
            <div class="header-top">
                <div class="brand">
                    <div class="title">Lorcana Deck Builder</div>
                </div>
                <div class="nav-links">
                    <a href="#cards" class="nav-link">Cartes</a>
                    <a href="#deck" class="nav-link active">Deck Builder</a>
                    <a href="#analyze" class="nav-link">Analyse</a>
                </div>
            </div>
        </div>
    `;
    container.appendChild(header);

    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.gap = '12px';
    topRow.style.alignItems = 'center';
    topRow.style.marginBottom = '12px';
    topRow.style.flexWrap = 'wrap';
    topRow.appendChild(createLanguageSelector());

    // Boutons Importer / Exporter
    const importBtn = document.createElement('button');
    importBtn.className = 'clear-filters-btn'; // réutilisation du style
    importBtn.textContent = '📥 Importer';
    importBtn.style.cssText = 'font-size:12px; padding:6px 12px;';
    topRow.appendChild(importBtn);

    const exportBtn = document.createElement('button');
    exportBtn.className = 'clear-filters-btn';
    exportBtn.textContent = '📤 Exporter';
    exportBtn.style.cssText = 'font-size:12px; padding:6px 12px;';
    topRow.appendChild(exportBtn);

    header.querySelector('.header-container').appendChild(topRow);

    const mainContainer = document.createElement('div');
    mainContainer.className = 'deck-builder-container';

    const cardPool = createCardPool();
    const deckPanel = createDeckPanel();

    mainContainer.appendChild(cardPool.element);
    mainContainer.appendChild(deckPanel.element);
    container.appendChild(mainContainer);

    // --- Zone d'import (cachée par défaut) ---
    const importArea = document.createElement('div');
    importArea.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:200; justify-content:center; align-items:center;';
    importArea.innerHTML = `
        <div style="background:var(--surface-color); padding:24px; border-radius:12px; max-width:600px; width:90%;">
            <h3 style="color:var(--accent-gold); margin-bottom:12px;">Importer un deck</h3>
            <textarea id="import-textarea" rows="10" style="width:100%; background:var(--bg-color); color:var(--text-main); border:1px solid var(--border-color); border-radius:8px; padding:12px; font-family:monospace; resize:vertical;"></textarea>
            <div id="import-message" style="margin-top:8px; font-size:13px; color:var(--text-muted);"></div>
            <div style="display:flex; gap:12px; margin-top:16px; justify-content:flex-end;">
                <button id="import-cancel-btn" class="clear-filters-btn">Annuler</button>
                <button id="import-load-btn" class="clear-filters-btn" style="background:var(--accent-gold); color:#000; border:none;">Importer</button>
            </div>
        </div>
    `;
    container.appendChild(importArea);

    // Gestion de l'import
    importBtn.addEventListener('click', () => {
        importArea.style.display = 'flex';
        document.getElementById('import-textarea').value = '';
        document.getElementById('import-message').textContent = '';
    });

    const cancelImport = () => { importArea.style.display = 'none'; };
    document.getElementById('import-cancel-btn').addEventListener('click', cancelImport);
    importArea.addEventListener('click', (e) => { if (e.target === importArea) cancelImport(); });

    document.getElementById('import-load-btn').addEventListener('click', () => {
        const text = document.getElementById('import-textarea').value;
        const result = importDeckFromText(text);
        if (result.unknown.length > 0) {
            document.getElementById('import-message').textContent = `Cartes non reconnues : ${result.unknown.join(', ')}`;
        } else {
            // Remplacer le deck
            store.setDeck(result.deck);
            importArea.style.display = 'none';
        }
    });

    // Gestion de l'export
    exportBtn.addEventListener('click', () => {
        const deck = store.currentDeck;
        const text = exportDeckToText(deck);
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Deck copié dans le presse-papiers !');
            }).catch(() => {
                // Fallback : montrer le texte dans une zone
                const win = window.open('', '_blank', 'width=600,height=400');
                win.document.write('<pre>' + text + '</pre>');
                win.document.close();
            });
        } else {
            alert('Le deck est vide.');
        }
    });

    // Recherche dans le pool
    const searchInput = cardPool.element.querySelector('input');
    let allCards = [];
    const updatePool = (query = '') => {
        if (!store.cardDB.ready) return;
        const filtered = query ? store.cardDB.searchCards(query) : allCards;
        cardPool.renderPool(filtered);
    };
    if (searchInput) {
        searchInput.addEventListener('input', (e) => updatePool(e.target.value));
    }

    const onDataLoaded = () => {
        allCards = store.cardDB.cards;
        cardPool.renderPool(allCards);
    };
    if (store.cardDB.ready) {
        allCards = store.cardDB.cards;
        cardPool.renderPool(allCards);
    } else {
        store.on('data-loaded', onDataLoaded);
    }

    const destroy = () => {
        store.off('data-loaded', onDataLoaded);
        if (deckPanel && typeof deckPanel.destroy === 'function') {
            deckPanel.destroy();
        }
    };

    const view = container;
    view.destroy = destroy;
    return view;
}
