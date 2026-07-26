import { store } from './store.js';

const routes = {};
let currentView = null;

export function registerRoute(hash, viewFactory) {
    routes[hash] = viewFactory;
}

function resolveRoute() {
    const hash = location.hash.slice(1) || 'cards';
    const factory = routes[hash];
    if (!factory) return;

    const app = document.getElementById('app');
    if (!app) return;

    // Détruire la vue précédente proprement
    if (currentView && typeof currentView.destroy === 'function') {
        try {
            currentView.destroy();
        } catch (e) {
            console.error('Erreur lors de la destruction de la vue précédente :', e);
        }
    }
    currentView = null;

    // Vider le conteneur principal
    app.innerHTML = '';

    // Créer la nouvelle vue
    let newView;
    try {
        newView = factory();
    } catch (e) {
        console.error('Erreur lors de la création de la vue :', e);
        app.innerHTML = '<div style="text-align:center;padding:60px;">Impossible de charger la page. Veuillez réessayer.</div>';
        return;
    }

    app.appendChild(newView);
    currentView = newView;

    if (typeof newView.init === 'function') {
        try {
            newView.init();
        } catch (e) {
            console.error('Erreur lors de l’initialisation de la vue :', e);
        }
    }
}

window.addEventListener('hashchange', resolveRoute);
window.addEventListener('load', resolveRoute);
