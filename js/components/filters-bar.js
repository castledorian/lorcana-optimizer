import { store } from '../store.js';
import { translations, colorOrder, colorSVGDataURIs, costHexSVG, inkwellSVG } from '../i18n.js';

export function createFiltersBar({ onFilterChange }) {
    const container = document.createElement('div');
    container.className = 'header-filters';

    // Extension
    const setGroup = document.createElement('div');
    setGroup.className = 'filter-group';
    setGroup.innerHTML = `<label>${translations[store.language].filterSetLabel}</label>
        <select id="set">
            <option value="all">${translations[store.language].allSets}</option>
        </select>`;
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

    // Nouveau groupe : Type de couleur
    const colorTypeGroup = document.createElement('div');
    colorTypeGroup.className = 'filter-group';
    colorTypeGroup.innerHTML = '<label>Type</label><div class="icon-buttons" id="colorTypeButtons"></div>';
    container.appendChild(colorTypeGroup);

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
        updateColorFilters();

        // Réinitialiser les boutons de type
        const typeBtns = container.querySelectorAll('#colorTypeButtons button');
        typeBtns.forEach(b => {
            b.classList.remove('active');
            b.style.background = 'var(--surface-color)';
            b.style.color = 'var(--text-muted)';
            b.style.borderColor = 'var(--border-color)';
        });
        const allBtn = container.querySelector('#colorTypeButtons [data-type="filterTypeAll"]');
        if (allBtn) {
            allBtn.classList.add('active');
            allBtn.style.background = 'var(--accent-gold)';
            allBtn.style.color = '#000';
            allBtn.style.borderColor = 'var(--accent-gold)';
        }

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

    // Conteneur des couleurs
    const colorContainer = container.querySelector('#colorButtonsContainer');
    colorContainer.style.display = 'flex';
    colorContainer.style.flexDirection = 'row';
    colorContainer.style.flexWrap = 'nowrap';
    colorContainer.style.gap = '6px';
    colorContainer.style.alignItems = 'center';

    const colorButtons = [];
    colorOrder.forEach(color => {
        const btn = document.createElement('div');
        btn.className = 'color-btn';
        btn.style.backgroundImage = `url('${costHexSVG}')`;
        btn.style.backgroundSize = 'cover';
        btn.dataset.color = color;
        btn.title = translations[store.language].colorNames[color] || color;

        const icon = document.createElement('img');
        icon.src = colorSVGDataURIs[color];
        icon.className = 'color-icon';
        btn.appendChild(icon);

        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            updateColorFilters();
            if (onFilterChange) onFilterChange();
        });

        colorContainer.appendChild(btn);
        colorButtons.push(btn);
    });

    function updateColorFilters() {
        const anyActive = colorButtons.some(b => b.classList.contains('active'));
        colorButtons.forEach(btn => {
            const isActive = btn.classList.contains('active');
            if (isActive) {
                btn.style.filter = 'brightness(1.4) drop-shadow(0 0 4px var(--accent-gold-glow))';
            } else {
                btn.style.filter = anyActive ? 'grayscale(100%) brightness(0.7)' : 'brightness(0.8)';
            }
        });
    }
    updateColorFilters();

    // Conteneur des coûts
    const costContainer = container.querySelector('#costButtonsContainer');
    costContainer.style.display = 'flex';
    costContainer.style.flexDirection = 'row';
    costContainer.style.flexWrap = 'nowrap';
    costContainer.style.gap = '6px';
    costContainer.style.alignItems = 'center';

    for (let i = 1; i <= 8; i++) {
        const btn = document.createElement('div');
        btn.className = 'cost-btn';
        btn.style.backgroundImage = `url('${costHexSVG}')`;
        btn.style.backgroundSize = 'cover';
        btn.textContent = i;
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
    btn9.dataset.cost = '9+';
    btn9.addEventListener('click', () => {
        btn9.classList.toggle('active');
        if (onFilterChange) onFilterChange();
    });
    costContainer.appendChild(btn9);

    // Conteneur encre
    const inkContainer = container.querySelector('#inkableButton');
    inkContainer.style.display = 'flex';
    inkContainer.style.flexDirection = 'row';
    inkContainer.style.flexWrap = 'nowrap';

    const inkBtn = document.createElement('div');
    inkBtn.className = 'inkable-btn';
    inkBtn.style.backgroundImage = `url('${inkwellSVG}')`;
    inkBtn.title = 'Filtrer cartes encrables';
    inkBtn.addEventListener('click', () => {
        inkBtn.classList.toggle('active');
        if (onFilterChange) onFilterChange();
    });
    inkContainer.appendChild(inkBtn);

    // Boutons Type de couleur
    const colorTypeContainer = container.querySelector('#colorTypeButtons');
    ['filterTypeAll', 'filterTypeMono', 'filterTypeBi'].forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'clear-filters-btn';
        btn.textContent = translations[store.language][key];
        btn.dataset.type = key;
        btn.style.cssText = 'font-size:11px; padding:4px 8px; border:1px solid var(--border-color); border-radius:4px; background:var(--surface-color); color:var(--text-muted); cursor:pointer; white-space:nowrap; transition: all 0.2s;';
        btn.addEventListener('click', () => {
            colorTypeContainer.querySelectorAll('button').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'var(--surface-color)';
                b.style.color = 'var(--text-muted)';
                b.style.borderColor = 'var(--border-color)';
            });
            btn.classList.add('active');
            btn.style.background = 'var(--accent-gold)';
            btn.style.color = '#000';
            btn.style.borderColor = 'var(--accent-gold)';
            if (onFilterChange) onFilterChange();
        });
        colorTypeContainer.appendChild(btn);
    });

    // Activer "Toutes" par défaut
    const defaultTypeBtn = colorTypeContainer.querySelector('[data-type="filterTypeAll"]');
    if (defaultTypeBtn) {
        defaultTypeBtn.classList.add('active');
        defaultTypeBtn.style.background = 'var(--accent-gold)';
        defaultTypeBtn.style.color = '#000';
        defaultTypeBtn.style.borderColor = 'var(--accent-gold)';
    }

    // Événements de changement
    container.querySelector('#set').addEventListener('change', onFilterChange);
    container.querySelector('#sort').addEventListener('change', onFilterChange);

    // Mise à jour de la langue
    store.on('language-changed', () => {
        setGroup.querySelector('label').textContent = translations[store.language].filterSetLabel;
        sortGroup.querySelector('label').textContent = 'Tri'; // ou traduire si nécessaire
        const sortSelect = container.querySelector('#sort');
        sortSelect.options[0].textContent = translations[store.language].sortNameAsc;
        sortSelect.options[1].textContent = translations[store.language].sortNameDesc;
        sortSelect.options[2].textContent = translations[store.language].sortCostAsc;
        sortSelect.options[3].textContent = translations[store.language].sortCostDesc;
        container.querySelectorAll('.color-btn').forEach(btn => {
            const color = btn.dataset.color;
            btn.title = translations[store.language].colorNames[color] || color;
        });
        // Mettre à jour les boutons de type
        const typeBtns = container.querySelectorAll('#colorTypeButtons button');
        typeBtns.forEach(btn => {
            const key = btn.dataset.type;
            btn.textContent = translations[store.language][key];
        });
    });

    return container;
}
