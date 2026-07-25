// js/components/pagination.js
import { translations } from '../i18n.js';
import { store } from '../store.js';

export function createPagination({ currentPage, totalPages, onPageChange }) {
    const container = document.createElement('div');
    container.className = 'pagination';
    if (totalPages <= 1) return container;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = translations[store.language].prevBtn;
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));

    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    const updateText = () => {
        pageInfo.textContent = `${translations[store.language].page} ${currentPage} ${translations[store.language].of} ${totalPages}`;
    };
    updateText();

    const nextBtn = document.createElement('button');
    nextBtn.textContent = translations[store.language].nextBtn;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));

    container.appendChild(prevBtn);
    container.appendChild(pageInfo);
    container.appendChild(nextBtn);

    // Mise à jour de la langue
    store.on('language-changed', () => {
        prevBtn.textContent = translations[store.language].prevBtn;
        nextBtn.textContent = translations[store.language].nextBtn;
        updateText();
    });

    return container;
}
