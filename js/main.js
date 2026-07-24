// js/main.js
import { store } from './store.js';
import { registerRoute } from './router.js';
import cardDB from './core/card-database.js';
import Deck from './core/deck.js';
import { createCardBrowserView } from './views/card-browser.js';
import { createDeckBuilderView } from './views/deck-builder.js';

// Initialisation du store
store.cardDB = cardDB;
store.currentDeck = new Deck();

// Chargement initial des cartes
cardDB.load(store.language).then(() => {
    store.emit('data-loaded');
});

// Enregistrement des routes
registerRoute('cards', createCardBrowserView);
registerRoute('deck', createDeckBuilderView);
