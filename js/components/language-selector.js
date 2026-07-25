// js/components/language-selector.js
import { store } from '../store.js';
import { translations } from '../i18n.js';

export function createLanguageSelector() {
    const container = document.createElement('div');
    container.className = 'lang-selector';
    container.innerHTML = `
        <select>
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="it">IT</option>
        </select>
    `;
    const select = container.querySelector('select');
    select.value = store.language;
    select.addEventListener('change', (e) => {
        const lang = e.target.value;
        store.setLanguage(lang);
        // Recharger les données pour la nouvelle langue
        store.cardDB.load(lang).then(() => {
            store.emit('data-loaded');
        });
    });
    return container;
}
