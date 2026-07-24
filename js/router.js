// js/router.js
import { store } from './store.js';

const routes = {};
let currentView = null; // référence à la vue active

export function registerRoute(hash, viewFactory) {
    routes[hash] = viewFactory;
}

function resolveRoute() {
    const hash = location.hash.slice(1) || 'cards';
    const factory = routes[hash];
    if (!factory) return;

    // Destruction de la vue précédente
    if (currentView && currentView.destroy) {
        currentView.destroy();
        currentView = null;
    }

    const app = document.getElementById('app');
    app.innerHTML = '';
    const view = factory();
    currentView = view;
    app.appendChild(view);
    if (view.init) view.init();
}

window.addEventListener('hashchange', resolveRoute);
window.addEventListener('load', resolveRoute);
