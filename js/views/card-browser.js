// js/views/card-browser.js
import { store } from '../store.js';
import { createSearchBar } from '../components/search-bar.js';
import { createLanguageSelector } from '../components/language-selector.js';
import { createFiltersBar } from '../components/filters-bar.js';
import { createCardGrid } from '../components/card-grid.js';
import { createPagination } from '../components/pagination.js';
import { createModal } from '../components/modal.js';
import { translations, colorHexMap } from '../i18n.js';

export function createCardBrowserView() {
    const container = document.createElement('div');

    // Header avec nouveau logo
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
        <div class="header-container">
            <div class="header-top">
                <div class="brand">
                    <svg class="brand-icon" viewBox="0 0 24 24" fill="none">
                        <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" stroke="var(--accent-gold)" stroke-width="1.5" fill="rgba(245,196,81,0.1)"/>
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--accent-gold)" opacity="0.9"/>
                    </svg>
                    <div class="title">Lorcana Card Viewer</div>
                </div>
                <div class="nav-links">
                    <a href="#cards" class="nav-link active">Cartes</a>
                    <a href="#deck" class="nav-link">Deck Builder</a>
                </div>
            </div>
        </div>
    `;
    container.appendChild(header);

    // Barre de recherche + langue
    const searchLangRow = document.createElement('div');
    searchLangRow.style.display = 'flex';
    searchLangRow.style.gap = '12px';
    searchLangRow.style.alignItems = 'center';
    searchLangRow.style.marginBottom = '12px';
    searchLangRow.style.flexWrap = 'wrap';

    let searchQuery = '';
    const onSearch = (q) => { searchQuery = q; applyFiltersAndRender(); };
    searchLangRow.appendChild(createSearchBar({ onSearch }));
    searchLangRow.appendChild(createLanguageSelector());
    header.querySelector('.header-container').appendChild(searchLangRow);

    // Filtres
    const filters = createFiltersBar({ onFilterChange: applyFiltersAndRender });
    header.querySelector('.header-container').appendChild(filters);

    // Stats
    const statsDiv = document.createElement('div');
    statsDiv.className = 'stats';
    statsDiv.innerHTML = `
        <div>Total : <span class="stat-value" id="totalCardsVal">0</span></div>
        <div>Affichées : <span class="stat-value" id="displayedCardsVal">0</span></div>
        <div>Extensions : <span class="stat-value" id="totalSetsVal">0</span></div>
    `;
    const totalCardsEl = statsDiv.querySelector('#totalCardsVal');
    const displayedCardsEl = statsDiv.querySelector('#displayedCardsVal');
    const totalSetsEl = statsDiv.querySelector('#totalSetsVal');
    container.appendChild(statsDiv);

    // Grille de cartes
    let currentPage = 1;
    const CARDS_PER_PAGE = 48;
    let uniqueCardList = [];
    const gridEl = document.createElement('div');
    gridEl.id = 'cardsGrid';
    container.appendChild(gridEl);

    const paginationEl = document.createElement('div');
    paginationEl.id = 'pagination';
    container.appendChild(paginationEl);

    // Modal
    const modal = createModal();
    container.appendChild(modal.element);

    const onCardClick = (group) => modal.open(group.variants, 0);
    const onHover = (frame) => {
        const color = frame.dataset.color;
        if (color) frame.style.background = getColorStyle(color);
    };
    const onLeave = (frame) => frame.style.background = '';

    function getColorStyle(colorField) {
        if (!colorField) return 'var(--accent-gold)';
        const colors = colorField.split('-').map(c => {
            for (const [eng, loc] of Object.entries(translations[store.language].colorNames)) {
                if (loc.toLowerCase() === c.trim().toLowerCase()) return eng;
            }
            return c;
        });
        const hexes = colors.map(c => colorHexMap[c]).filter(Boolean);
        if (hexes.length === 1) return hexes[0];
        if (hexes.length >= 2) return `linear-gradient(135deg, ${hexes[0]}, ${hexes[1]})`;
        return 'var(--accent-gold)';
    }

    // --- Nouvelle logique de filtre par couleur ---
    function getNormalizedColors(card) {
        return card.color.split('-').map(c => {
            const trimmed = c.trim();
            for (const [eng, loc] of Object.entries(translations[store.language].colorNames)) {
                if (loc.toLowerCase() === trimmed.toLowerCase()) return eng;
            }
            return trimmed;
        }).sort();
    }

    function applyFiltersAndRender() {
        if (!store.cardDB.ready) return;
        const cards = store.cardDB.cards;
        const setSelect = document.getElementById('set');
        const sortSelect = document.getElementById('sort');
        if (!setSelect || !sortSelect) return;

        const selectedSet = setSelect.value || 'all';
        const sortValue = sortSelect.value || 'name-asc';
        const [sortField, sortOrder] = sortValue.split('-');

        let filtered = cards.slice();
        if (selectedSet !== 'all') filtered = filtered.filter(c => c.setCode === selectedSet);

        // Récupération des couleurs sélectionnées
        const selectedColors = new Set();
        document.querySelectorAll('.color-btn.active').forEach(btn => selectedColors.add(btn.dataset.color));

        if (selectedColors.size > 0) {
            filtered = filtered.filter(card => {
                const cardColors = getNormalizedColors(card);
                if (selectedColors.size === 1) {
                    // Une seule couleur : on veut les cartes monocolores exactement de cette couleur
                    return cardColors.length === 1 && cardColors[0] === [...selectedColors][0];
                } else if (selectedColors.size === 2) {
                    // Deux couleurs : cartes bicolores exactement ces deux couleurs
                    const sortedSelection = [...selectedColors].sort();
                    return cardColors.length === 2 &&
                           cardColors[0] === sortedSelection[0] &&
                           cardColors[1] === sortedSelection[1];
                } else {
                    // Trois couleurs ou plus : cartes bicolores dont les deux couleurs sont dans la sélection
                    return cardColors.length === 2 &&
                           cardColors.every(c => selectedColors.has(c));
                }
            });
        }

        // Filtre par coût (inchangé)
        const selectedCosts = new Set();
        document.querySelectorAll('.cost-btn.active').forEach(btn => selectedCosts.add(btn.dataset.cost));
        if (selectedCosts.size > 0) {
            filtered = filtered.filter(c => {
                const cost = c.cost || 0;
                return [...selectedCosts].some(sc => {
                    if (sc === '9+') return cost >= 9;
                    return cost === parseInt(sc);
                });
            });
        }

        const onlyInkable = document.querySelector('.inkable-btn.active') !== null;
        if (onlyInkable) filtered = filtered.filter(c => c.inkwell === true);

        // Recherche textuelle (inclut désormais les capacités)
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c => c.searchText && c.searchText.includes(q));
        }

        // Tri
        filtered.sort((a, b) => {
            let valA = sortField === 'name' ? (a.name || '').toLowerCase() : (a.cost || 0);
            let valB = sortField === 'name' ? (b.name || '').toLowerCase() : (b.cost || 0);
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        // Regrouper par fullName pour éviter les doublons de variantes
        const groups = new Map();
        filtered.forEach(card => {
            const key = card.fullName || `${card.name} - ${card.version}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(card);
        });
        uniqueCardList = Array.from(groups, ([, variants]) => ({ representative: variants[0], variants }));

        totalCardsEl.textContent = store.cardDB.cards.length;
        displayedCardsEl.textContent = uniqueCardList.length;
        totalSetsEl.textContent = Object.keys(store.cardDB.sets).length;

        currentPage = 1;
        renderPage();
    }

    function renderPage() {
        const totalPages = Math.ceil(uniqueCardList.length / CARDS_PER_PAGE) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const start = (currentPage - 1) * CARDS_PER_PAGE;
        const pageCards = uniqueCardList.slice(start, start + CARDS_PER_PAGE);

        gridEl.innerHTML = '';
        gridEl.appendChild(createCardGrid({ cards: pageCards, onCardClick, onHover, onLeave }));

        paginationEl.innerHTML = '';
        paginationEl.appendChild(createPagination({
            currentPage,
            totalPages,
            onPageChange: (page) => {
                currentPage = page;
                renderPage();
                window.scrollTo(0, 0);
            }
        }));
    }

    const onDataLoaded = () => { applyFiltersAndRender(); };
    if (store.cardDB.ready) {
        applyFiltersAndRender();
    } else {
        store.on('data-loaded', onDataLoaded);
    }

    const destroy = () => {
        store.off('data-loaded', onDataLoaded);
        if (modal && typeof modal.destroy === 'function') {
            modal.destroy();
        }
    };

    container.init = () => {
        if (store.cardDB.ready) {
            totalCardsEl.textContent = store.cardDB.cards.length;
            totalSetsEl.textContent = Object.keys(store.cardDB.sets).length;
        }
    };

    const view = container;
    view.destroy = destroy;
    return view;
}
