import api from '../../services/api.js';
import { initializePage, loadCategorySections } from './pageLoader.js';

initializePage({
    loadSections: () => loadCategorySections(api, [
        { title: 'Épicos' },
        { title: 'Séries' },
        { title: 'Documentários' },
        { title: 'Comédia' },
        { title: 'Animação' },
        { title: 'Suspense' }
    ]),
    emptyMessage: 'Nenhum conteudo disponivel no catalogo.',
    errorMessage: 'Erro ao carregar o catalogo. Tente novamente.'
});
