import api from '../../services/api.js';
import { initializePage, shuffleForProfile } from '../catalogo/pageLoader.js';

function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
}

async function loadTrendingSections() {
    const items = await api.getContent(null, 300);
    const dayKey = getTodayKey();
    const trendingItems = shuffleForProfile(items, `Bombando:${dayKey}`);
    const highRatedItems = items
        .filter(item => Number(item.rating) >= 8)
        .sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));

    return [
        {
            title: 'Top 10 de hoje',
            items: trendingItems.slice(0, 10)
        },
        {
            title: 'Todo mundo esta assistindo',
            items: shuffleForProfile(items, `Todo mundo esta assistindo:${dayKey}`).slice(10, 20)
        },
        {
            title: 'Mais bem avaliados',
            items: shuffleForProfile(highRatedItems, `Mais bem avaliados:${dayKey}`).slice(0, 10)
        }
    ];
}

initializePage({
    loadSections: loadTrendingSections,
    emptyMessage: 'Nada bombando por enquanto.',
    errorMessage: 'Erro ao carregar a pagina bombando. Tente novamente.'
});
