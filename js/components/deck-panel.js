// js/components/deck-panel.js
import { store } from '../store.js';
import { colorHexMap } from '../i18n.js';

export function createDeckPanel() {
    const panel = document.createElement('div');
    panel.className = 'deck-panel';
    panel.innerHTML = '<h2>Mon Deck</h2><div id="deckCards"></div><div class="deck-stats" id="deckStats"></div><button id="clearDeck" style="width:100%; margin-top:12px; padding:8px; border:1px solid var(--border-color); background:var(--surface-card); color:var(--text-main); border-radius:6px; cursor:pointer;">Vider le deck</button>';

    const deckCardsEl = panel.querySelector('#deckCards');
    const deckStatsEl = panel.querySelector('#deckStats');
    const clearBtn = panel.querySelector('#clearDeck');

    const updateUI = () => {
        const deck = store.currentDeck;
        if (!deck) return;
        deckCardsEl.innerHTML = deck.cards.map(({ fullName, quantity }) => {
            const card = store.cardDB.getCardById(fullName);
            if (!card) return '';
            return `
                <div class="deck-card-item">
                    <img src="${card.images?.thumbnail || card.images?.full}" alt="${fullName}">
                    <div class="deck-card-name">${card.name} ${card.version ? ' - ' + card.version : ''}</div>
                    <div class="deck-card-quantity">
                        <button data-fullname="${fullName}" data-delta="-1">-</button>
                        <span>${quantity}</span>
                        <button data-fullname="${fullName}" data-delta="1">+</button>
                    </div>
                </div>
            `;
        }).join('');

        // Ajouter les événements aux boutons +/-
        deckCardsEl.querySelectorAll('.deck-card-quantity button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fullName = btn.dataset.fullname;
                const delta = parseInt(btn.dataset.delta);
                if (delta > 0) {
                    deck.addCard(fullName, 1);
                } else {
                    const existing = deck.cards.find(c => c.fullName === fullName);
                    if (existing && existing.quantity > 1) {
                        existing.quantity--;
                    } else {
                        deck.removeCard(fullName);
                    }
                }
                store.emit('deck-changed', deck);
                updateUI();
            });
        });

        const totalCards = deck.getTotalCards();
        const costCurve = deck.getCostCurve(store.cardDB);
        const inkRatio = deck.getInkableRatio(store.cardDB);
        deckStatsEl.innerHTML = `
            <div>Total cartes : <span>${totalCards}</span></div>
            <div>Ratio encre : <span>${inkRatio}%</span></div>
            <div>Courbe de coût : <span>${costCurve.join(' - ')}</span></div>
        `;
    };

    clearBtn.addEventListener('click', () => {
        store.setDeck(new Deck()); // importé du scope supérieur
        updateUI();
    });

    // Première mise à jour
    updateUI();

    // Réagir aux changements de deck
    store.on('deck-changed', updateUI);

    return panel;
}
