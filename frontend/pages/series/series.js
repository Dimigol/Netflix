import api from '../../services/api.js';
import { initializePage, loadCategorySections } from '../catalogo/pageLoader.js';

initializePage({
    loadSections: () => loadCategorySections(api, [
        { title: 'Séries', limit: 12 },
        { title: 'Comédia' },
        { title: 'Suspense' },
        { title: 'Documentários' }
    ]),
    emptyMessage: 'Nenhuma serie encontrada no momento.',
    errorMessage: 'Erro ao carregar a pagina de series. Tente novamente.'
});
