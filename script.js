// ---------- TRADUCTIONS (inchangées) ----------
const translations = {
    fr: { /* ... */ },
    en: { /* ... */ },
    de: { /* ... */ },
    it: { /* ... */ }
};

const colorHexMap = { /* ... */ };

// ---------- SVG (intégrés en data URI) ----------
const colorSVGDataURIs = { /* ... */ };
const costHexSVG = "data:image/svg+xml,...";
const inkwellSVG = "data:image/svg+xml,...";

let currentLanguage = 'fr';
let allCards = [];
let allSets = {};
let currentPage = 1;
const CARDS_PER_PAGE = 48;
let uniqueCardList = [];
let currentVariants = [];
let currentVariantIndex = 0;

const colorOrder = ['Amber', 'Amethyst', 'Emerald', 'Ruby', 'Sapphire', 'Steel'];
let selectedColors = new Set();
let selectedCosts = new Set();
let onlyInkable = false;

// ---------- FONCTIONS DE CONSTRUCTION DU HEADER ----------
function buildHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <div class="header-container">
            <div class="header-top">
                <div class="brand">
                    <svg class="brand-icon" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    <div class="title" id="mainTitle">Lorcana Card Viewer</div>
                </div>
                <div class="search-box">
                    <svg class="search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" id="search" placeholder="Rechercher une carte...">
                </div>
                <div class="lang-selector">
                    <select id="language">
                        <option value="fr">FR</option>
                        <option value="en">EN</option>
                        <option value="de">DE</option>
                        <option value="it">IT</option>
                    </select>
                </div>
            </div>
            <div class="header-filters">
                <div class="filter-group">
                    <label for="set">Extension</label>
                    <select id="set"><option value="all">Toutes</option></select>
                </div>
                <div class="filter-group">
                    <label>Couleurs</label>
                    <div class="icon-buttons" id="colorButtonsContainer"></div>
                </div>
                <div class="filter-group">
                    <label>Coût</label>
                    <div class="icon-buttons" id="costButtonsContainer"></div>
                </div>
                <div class="filter-group">
                    <label>Encre</label>
                    <div class="icon-buttons" id="inkableButton"></div>
                </div>
                <div class="filter-group">
                    <label for="sort">Tri</label>
                    <select id="sort">
                        <option value="name-asc">Nom A-Z</option>
                        <option value="name-desc">Nom Z-A</option>
                        <option value="cost-asc">Coût ↑</option>
                        <option value="cost-desc">Coût ↓</option>
                    </select>
                </div>
                <button class="clear-filters-btn" id="resetFiltersBtn">✕ Réinitialiser</button>
            </div>
        </div>
    `;
}

// ---------- FONCTIONS DE FILTRES ET D'AFFICHAGE ----------
function buildColorButtons() { /* ... */ }
function buildCostButtons() { /* ... */ }
function buildInkableButton() { /* ... */ }
function toggleColor(color, btn) { /* ... */ }
function toggleCost(cost, btn) { /* ... */ }
function resetAllFilters() { /* ... */ }
function applyFiltersAndDisplay() { /* ... */ }
function renderPage() { /* ... */ }

// ---------- CHARGEMENT DES CARTES (depuis les fichiers JSON locaux) ----------
async function fetchCardsData(lang) {
    const url = `${lang}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Impossible de charger ${url}`);
    return await res.json();
}

async function loadCards(lang) {
    document.getElementById('loading').style.display = 'block';
    try {
        const data = await fetchCardsData(lang);
        allCards = data.cards || [];
        allSets = data.sets || {};
        // ... (traitement des cartes)
        populateSetSelect();
        updateStats();
        applyFiltersAndDisplay();
        document.getElementById('loading').style.display = 'none';
        document.getElementById('stats').style.display = 'flex';
    } catch (err) {
        document.getElementById('loading').innerHTML = `<div class="error">Erreur : ${err.message}<br><button onclick="loadCards('${lang}')">Réessayer</button></div>`;
    }
}

// ---------- INITIALISATION ----------
function initApp() {
    buildHeader();
    buildColorButtons();
    buildCostButtons();
    buildInkableButton();
    applyUILanguage('fr');
    loadCards('fr');
    document.getElementById('resetFiltersBtn').addEventListener('click', resetAllFilters);
}

initApp();
