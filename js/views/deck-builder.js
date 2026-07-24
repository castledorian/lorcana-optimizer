// js/views/deck-builder.js
import { store } from '../store.js';
import { createCardPool } from '../components/card-pool.js';
import { createDeckPanel } from '../components/deck-panel.js';
import { createLanguageSelector } from '../components/language-selector.js';

export function createDeckBuilderView() {
    const container = document.createElement('div');

    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
        <div class="header-container">
            <div class="header-top">
                <div class="brand">
                    <svg class="brand-icon" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    <div class="title">Lorcana Deck Builder</div>
                </div>
                <div class="nav-links">
                    <a href="#cards" class="nav-link">Cartes</a>
                    <a href="#deck" class="nav-link active">Deck Builder</a>
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
    header.querySelector('.header-container').appendChild(topRow);

    const mainContainer = document.createElement('div');
    mainContainer.className = 'deck-builder-container';

    const cardPool = createCardPool();
    const deckPanel = createDeckPanel(); // doit retourner { element, destroy }

    mainContainer.appendChild(cardPool.element);
    mainContainer.appendChild(deckPanel.element);
    container.appendChild(mainContainer);

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
