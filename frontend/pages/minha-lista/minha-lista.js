import api from '../../services/api.js';
import { initializePage, renderSections } from '../catalogo/pageLoader.js';

const emptyMessage = 'Sua lista esta vazia. Adicione titulos para ver aqui.';
const errorMessage = 'Erro ao carregar sua lista. Verifique se voce esta logado.';

async function loadMyListSections() {
    const myList = await api.getMyList();

    return [
        {
            title: 'Minha lista',
            items: myList
        }
    ];
}

initializePage({
    loadSections: loadMyListSections,
    emptyMessage,
    errorMessage
});

window.addEventListener('my-list-updated', async () => {
    const container = document.getElementById('main-content');

    if (!container) {
        return;
    }

    try {
        const sections = await loadMyListSections();
        renderSections(container, sections, emptyMessage);
    } catch (error) {
        console.error('Error reloading my list:', error);
        container.innerHTML = `<p>${errorMessage}</p>`;
    }
});
