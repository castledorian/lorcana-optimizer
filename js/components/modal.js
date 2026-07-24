// js/components/modal.js
import { translations } from '../i18n.js';
import { store } from '../store.js';

export function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="modalTitle"></div>
                <button class="close-btn">✕</button>
            </div>
            <div class="modal-body" id="modalBody"></div>
            <div class="variant-nav" id="variantNav" style="display: none;">
                <button id="prevVariant">← Variante précédente</button>
                <span class="variant-count" id="variantCount">1 / 1</span>
                <button id="nextVariant">Variante suivante →</button>
            </div>
        </div>
    `;

    const closeBtn = modal.querySelector('.close-btn');
    const prevBtn = modal.querySelector('#prevVariant');
    const nextBtn = modal.querySelector('#nextVariant');

    let currentVariants = null;
    let currentIndex = 0;
    let escHandler = null;

    const renderVariant = (i) => {
        const card = currentVariants[i];
        const t = translations[store.language];
        modal.querySelector('#modalTitle').textContent = card.fullName || card.name;
        const img = card.images?.full || card.images?.thumbnail || '';
        const subtypes = card.subtypesText || (card.subtypes ? card.subtypes.join(' • ') : '-');
        const artists = card.artistsText || (card.artists ? card.artists.join(', ') : '-');
        const flavor = card.flavorText || '';
        const displayColor = card.color.split('-').map(c => t.colorNames[c] || c).join(' / ') || '-';
        const type = t.types[card.type] || card.type || '-';
        const rarity = t.rarities[card.rarity] || card.rarity || '-';
        const inkable = card.inkwell ? 'Encrable' : 'Non encrable';

        modal.querySelector('#modalBody').innerHTML = `
            <div><img src="${img}" alt="${card.fullName}" class="modal-image"></div>
            <div class="modal-details">
                <h3>${card.name || ''} ${card.version ? `<span style="font-size:14px;font-weight:normal;color:var(--text-muted)">— ${card.version}</span>` : ''}</h3>
                <div class="modal-detail-grid">
                    <div class="modal-detail"><span class="modal-detail-label">Type</span><span class="modal-detail-value">${type}</span></div>
                    <div class="modal-detail"><span class="modal-detail-label">Sous-types</span><span class="modal-detail-value">${subtypes}</span></div>
                    <div class="modal-detail"><span class="modal-detail-label">Couleur</span><span class="modal-detail-value">${displayColor}</span></div>
                    <div class="modal-detail"><span class="modal-detail-label">Coût / Encre</span><span class="modal-detail-value">${card.cost || 0} (${inkable})</span></div>
                    ${card.strength !== undefined ? `<div class="modal-detail"><span class="modal-detail-label">Force</span><span class="modal-detail-value">${card.strength}</span></div>` : ''}
                    ${card.willpower !== undefined ? `<div class="modal-detail"><span class="modal-detail-label">Volonté</span><span class="modal-detail-value">${card.willpower}</span></div>` : ''}
                    ${card.lore !== undefined ? `<div class="modal-detail"><span class="modal-detail-label">Lore</span><span class="modal-detail-value">${card.lore}</span></div>` : ''}
                    <div class="modal-detail"><span class="modal-detail-label">Rareté</span><span class="modal-detail-value">${rarity}</span></div>
                    <div class="modal-detail"><span class="modal-detail-label">Extension</span><span class="modal-detail-value">${store.cardDB.sets[card.setCode]?.name || card.setCode || '-'}</span></div>
                    <div class="modal-detail"><span class="modal-detail-label">Numéro</span><span class="modal-detail-value">${card.number || '?'}/${store.cardDB.sets[card.setCode]?.cardCounts?.base || '?'}</span></div>
                    <div class="modal-detail"><span class="modal-detail-label">Artiste(s)</span><span class="modal-detail-value">${artists}</span></div>
                </div>
                ${flavor ? `<div class="modal-text">"${flavor}"</div>` : ''}
                ${card.externalLinks ? `<div class="modal-links">${card.externalLinks.tcgPlayerUrl ? `<a href="${card.externalLinks.tcgPlayerUrl}" target="_blank">TCGPlayer ↗</a>` : ''}${card.externalLinks.cardmarketUrl ? `<a href="${card.externalLinks.cardmarketUrl}" target="_blank">Cardmarket ↗</a>` : ''}</div>` : ''}
            </div>
        `;
        modal.querySelector('#variantCount').textContent = `${i + 1} / ${currentVariants.length}`;
        prevBtn.disabled = i === 0;
        nextBtn.disabled = i === currentVariants.length - 1;
    };

    const open = (variants, index = 0) => {
        currentVariants = variants;
        currentIndex = index;
        renderVariant(currentIndex);
        modal.querySelector('#variantNav').style.display = variants.length > 1 ? 'flex' : 'none';
        modal.classList.add('active');
        // Ajouter l'écouteur clavier global
        if (escHandler) document.removeEventListener('keydown', escHandler);
        escHandler = (e) => {
            if (e.key === 'Escape') {
                close();
            } else if (modal.classList.contains('active')) {
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        };
        document.addEventListener('keydown', escHandler);
    };

    const close = () => {
        modal.classList.remove('active');
        if (escHandler) {
            document.removeEventListener('keydown', escHandler);
            escHandler = null;
        }
    };

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            renderVariant(currentIndex);
        }
    });
    nextBtn.addEventListener('click', () => {
        if (currentIndex < currentVariants.length - 1) {
            currentIndex++;
            renderVariant(currentIndex);
        }
    });

    const destroy = () => {
        // Nettoyer les listeners globaux
        if (escHandler) {
            document.removeEventListener('keydown', escHandler);
            escHandler = null;
        }
        // Les autres listeners sont attachés à des éléments internes, ils seront supprimés avec le DOM
    };

    return { element: modal, open, destroy };
}
