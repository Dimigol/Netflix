import api from '../../services/api.js';
import { initializePage, loadCategorySections } from '../catalogo/pageLoader.js';

initializePage({
    loadSections: () => loadCategorySections(api, [
        { title: 'Épicos' },
        { title: 'Drama' },
        { title: 'Romance' },
        { title: 'Ficção Científica' },
        { title: 'Ação' },
        { title: 'Aventura' }
    ]),
    emptyMessage: 'Nenhum filme encontrado no momento.',
    errorMessage: 'Erro ao carregar a pagina de filmes. Tente novamente.'
});
