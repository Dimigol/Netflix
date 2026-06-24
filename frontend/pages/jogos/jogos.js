import api from '../../services/api.js';
import { initializePage, loadCategorySections } from '../catalogo/pageLoader.js';

initializePage({
    loadSections: () => loadCategorySections(api, [
        { title: 'Aventura' },
        { title: 'Ação' },
        { title: 'Ficção Científica' },
        { title: 'Animação' }
    ]),
    emptyMessage: 'Nenhum titulo com cara de jogo encontrado agora.',
    errorMessage: 'Erro ao carregar a pagina de jogos. Tente novamente.'
});
