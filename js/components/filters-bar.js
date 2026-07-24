// js/components/filters-bar.js
import { store } from '../store.js';
import { translations, colorOrder, colorSVGDataURIs, costHexSVG, inkwellSVG } from '../i18n.js';

export function createFiltersBar({ onFilterChange }) {
    const container = document.createElement('div');
    container.className = 'header-filters';
    // Forcer l'affichage en ligne même si le CSS n'est pas appliqué
    Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'flex-end',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
    });

    // Extension
    const setGroup = document.createElement('div');
    setGroup.className = 'filter-group';
    setGroup.innerHTML = `<label>${translations[store.language].allSets}</label><select id="set"><option value="all">${translations[store.language].allSets}</option></select>`;
    container.appendChild(setGroup);

    // Couleurs
    const colorGroup = document.createElement('div');
    colorGroup.className = 'filter-group';
    colorGroup.innerHTML = '<label>Couleurs</label><div class="icon-buttons" id="colorButtonsContainer"></div>';
    container.appendChild(colorGroup);

    // Coût
    const costGroup = document.createElement('div');
    costGroup.className = 'filter-group';
    costGroup.innerHTML = '<label>Coût</label><div class="icon-buttons" id="costButtonsContainer"></div>';
    container.appendChild(costGroup);

    // Encrable
    const inkGroup = document.createElement('div');
    inkGroup.className = 'filter-group';
    inkGroup.innerHTML = '<label>Encre</label><div class="icon-buttons" id="inkableButton"></div>';
    container.appendChild(inkGroup);

    // Tri
    const sortGroup = document.createElement('div');
    sortGroup.className = 'filter-group';
    sortGroup.innerHTML = `<label for="sort">Tri</label>
        <select id="sort">
            <option value="name-asc">${translations[store.language].sortNameAsc}</option>
            <option value="name-desc">${translations[store.language].sortNameDesc}</option>
            <option value="cost-asc">${translations[store.language].sortCostAsc}</option>
            <option value="cost-desc">${translations[store.language].sortCostDesc}</option>
        </select>`;
    container.appendChild(sortGroup);

    // Bouton reset
    const resetBtn = document.createElement('button');
    resetBtn.className = 'clear-filters-btn';
    resetBtn.textContent = '✕ Réinitialiser';
    resetBtn.addEventListener('click', () => {
        container.querySelector('#set').value = 'all';
        container.querySelector('#sort').value = 'name-asc';
        document.querySelectorAll('.color-btn, .cost-btn, .inkable-btn').forEach(b => b.classList.remove('active'));
        if (onFilterChange) onFilterChange();
    });
    container.appendChild(resetBtn);

    // Remplir les sets
    const setSelect = container.querySelector('#set');
    const populateSets = () => {
        const sets = store.cardDB.sets;
        setSelect.innerHTML = `<option value="all">${translations[store.language].allSets}</option>`;
        Object.entries(sets).forEach(([id, set]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = `${set.number} - ${set.name}`;
            setSelect.appendChild(opt);
        });
    };
    if (store.cardDB.ready) populateSets();
    else store.on('data-loaded', populateSets);

    // Création des boutons de couleur (corrigés)
    const colorContainer = container.querySelector('#colorButtonsContainer');
    colorOrder.forEach(color => {
        const btn = document.createElement('div');
        btn.className = 'color-btn';
        btn.style.backgroundImage = `url(${colorSVGDataURIs[color]})`;
        btn.style.backgroundSize = 'contain';
        btn.style.backgroundRepeat = 'no-repeat';
        btn.style.backgroundPosition = 'center';
        btn.style.backgroundColor = 'transparent';
        btn.title = translations[store.language].colorNames[color] || color;
        btn.dataset.color = color;
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            if (onFilterChange) onFilterChange();
        });
        colorContainer.appendChild(btn);
    });

    // Boutons de coût (inchangés)
    const costContainer = container.querySelector('#costButtonsContainer');
    for (let i = 1; i <= 8; i++) {
        const btn = document.createElement('div');
        btn.className = 'cost-btn';
        btn.style.backgroundImage = `url('${costHexSVG}')`;
        btn.style.backgroundSize = 'cover';
        btn.textContent = i;
        btn.style.lineHeight = '36px';
        btn.dataset.cost = i;
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            if (onFilterChange) onFilterChange();
        });
        costContainer.appendChild(btn);
    }
    const btn9 = document.createElement('div');
    btn9.className = 'cost-btn';
    btn9.style.backgroundImage = `url('${costHexSVG}')`;
    btn9.style.backgroundSize = 'cover';
    btn9.textContent = '9+';
    btn9.style.lineHeight = '36px';
    btn9.dataset.cost = '9+';
    btn9.addEventListener('click', () => {
        btn9.classList.toggle('active');
        if (onFilterChange) onFilterChange();
    });
    costContainer.appendChild(btn9);

    // Bouton encre (inchangé)
    const inkContainer = container.querySelector('#inkableButton');
    const inkBtn = document.createElement('div');
    inkBtn.className = 'inkable-btn';
    inkBtn.style.backgroundImage = `url('${inkwellSVG}')`;
    inkBtn.title = 'Filtrer cartes encrables';
    inkBtn.addEventListener('click', () => {
        inkBtn.classList.toggle('active');
        if (onFilterChange) onFilterChange();
    });
    inkContainer.appendChild(inkBtn);

    // Événements de changement
    container.querySelector('#set').addEventListener('change', onFilterChange);
    container.querySelector('#sort').addEventListener('change', onFilterChange);

    // Mise à jour de la langue
    store.on('language-changed', () => {
        setGroup.querySelector('label').textContent = translations[store.language].allSets;
        sortGroup.querySelector('label').textContent = translations[store.language].allSets;
        const sortSelect = container.querySelector('#sort');
        sortSelect.options[0].textContent = translations[store.language].sortNameAsc;
        sortSelect.options[1].textContent = translations[store.language].sortNameDesc;
        sortSelect.options[2].textContent = translations[store.language].sortCostAsc;
        sortSelect.options[3].textContent = translations[store.language].sortCostDesc;
        container.querySelectorAll('.color-btn').forEach(btn => {
            const color = btn.dataset.color;
            btn.title = translations[store.language].colorNames[color] || color;
        });
    });

    return container;
}
