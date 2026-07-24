// js/components/card-grid.js
export function createCardGrid({ cards, onCardClick, onHover, onLeave }) {
    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    if (!cards.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">Aucune carte trouvée</div>';
        return grid;
    }

    cards.forEach(group => {
        const card = group.representative;
        const img = card.images?.thumbnail || card.images?.full || '';
        const safeName = (card.fullName || card.name || '').replace(/"/g, '&quot;');
        const frame = document.createElement('div');
        frame.className = 'card-frame';
        frame.dataset.color = card.color || '';
        frame.dataset.fullname = safeName;
        frame.innerHTML = `<div class="card"><img src="${img}" alt="${safeName}" class="card-image" loading="lazy"></div>`;
        
        frame.addEventListener('click', () => onCardClick(group));
        frame.addEventListener('mouseover', () => onHover(frame));
        frame.addEventListener('mouseout', () => onLeave(frame));
        
        grid.appendChild(frame);
    });

    return grid;
}
