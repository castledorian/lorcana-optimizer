// js/components/card-pool.js
import { store } from '../store.js';
import { createSearchBar } from './search-bar.js';

export function createCardPool() {
    const container = document.createElement('div');
    container.className = 'card-pool';
    container.innerHTML = '<h2>Cartes disponibles</h2>';
    const searchBar = createSearchBar({ onSearch: (query) => {
        // sera branché dans la vue
    }});
    container.appendChild(searchBar);
    const gridContainer = document.createElement('div');
    gridContainer.className = 'card-pool-grid';
    container.appendChild(gridContainer);

    const renderPool = (cards) => {
        gridContainer.innerHTML = cards.map(card => `
            <div class="card-pool-item" data-fullname="${card.fullName}">
                <img src="${card.images?.thumbnail || card.images?.full}" alt="${card.fullName}" loading="lazy">
            </div>
        `).join('');
        gridContainer.querySelectorAll('.card-pool-item').forEach(item => {
            item.addEventListener('click', () => {
                const fullName = item.dataset.fullname;
                store.currentDeck.addCard(fullName);
                store.emit('deck-changed', store.currentDeck);
            });
        });
    };

    return { element: container, renderPool };
}
