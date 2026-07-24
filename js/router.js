// js/router.js
import { store } from './store.js';

const routes = {};

export function registerRoute(hash, viewFactory) {
    routes[hash] = viewFactory;
}

function resolveRoute() {
    const hash = location.hash.slice(1) || 'cards';
    const factory = routes[hash];
    if (!factory) return;
    const app = document.getElementById('app');
    app.innerHTML = '';
    const view = factory();
    store.activeView = view;
    app.appendChild(view);
    if (view.init) view.init();
}

window.addEventListener('hashchange', resolveRoute);
window.addEventListener('load', resolveRoute);
