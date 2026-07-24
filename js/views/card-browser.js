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

    // Header
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
        <div class="header-container">
            <div class="header-top">
                <div class="brand">
                    <svg class="brand-icon" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
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

    // Stats (avec références internes)
    const statsDiv = document.createElement('div');
    statsDiv.className = 'stats';
    const totalCardsSpan = document.createElement('span');
    totalCardsSpan.className = 'stat-value';
    const displayedCardsSpan = document.createElement('span');
    displayedCardsSpan.className = 'stat-value';
    const totalSetsSpan = document.createElement('span');
    totalSetsSpan.className = 'stat-value';

    statsDiv.innerHTML = `
        <div>Total : <span class="stat-value" id="totalCardsVal">0</span></div>
        <div>Affichées : <span class="stat-value" id="displayedCardsVal">0</span></div>
        <div>Extensions : <span class="stat-value" id="totalSetsVal">0</span></div>
    `;
    // Récupérer les spans pour mise à jour sans querySelector
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

    function applyFiltersAndRender() {
        if (!store.cardDB.ready) return;
        const cards = store.cardDB.cards;

        // Récupération sécurisée des valeurs de filtre
        const setSelect = document.getElementById('set');
        const sortSelect = document.getElementById('sort');
        if (!setSelect || !sortSelect) return; // sécurité

        const selectedSet = setSelect.value || 'all';
        const sortValue = sortSelect.value || 'name-asc';
        const [sortField, sortOrder] = sortValue.split('-');

        let filtered = cards.slice();
        if (selectedSet !== 'all') filtered = filtered.filter(c => c.setCode === selectedSet);

        const selectedColors = new Set();
        document.querySelectorAll('.color-btn.active').forEach(btn => selectedColors.add(btn.dataset.color));
        if (selectedColors.size > 0) {
            filtered = filtered.filter(c => {
                const cardColors = c.color.split('-').map(x => {
                    for (const [eng, loc] of Object.entries(translations[store.language].colorNames)) {
                        if (loc.toLowerCase() === x.trim().toLowerCase()) return eng;
                    }
                    return x;
                });
                return cardColors.some(color => selectedColors.has(color));
            });
        }

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

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c => c.searchText && c.searchText.includes(q));
        }

        filtered.sort((a, b) => {
            let valA = sortField === 'name' ? (a.name || '').toLowerCase() : (a.cost || 0);
            let valB = sortField === 'name' ? (b.name || '').toLowerCase() : (b.cost || 0);
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        const groups = new Map();
        filtered.forEach(card => {
            const key = card.fullName || `${card.name} - ${card.version}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(card);
        });
        uniqueCardList = Array.from(groups, ([, variants]) => ({ representative: variants[0], variants }));

        // Mise à jour des stats avec les références sauvegardées
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
