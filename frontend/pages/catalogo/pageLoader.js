import { createCarousel } from '../../components/Carousel.js';
import { getContentImage, getContentVideoUrl } from '../../utils/utils.js';

function hashString(value = '') {
    return Array.from(value).reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
}

function createSeededRandom(seed) {
    let value = Math.abs(hashString(seed)) || 1;

    return () => {
        value = (value * 1664525 + 1013904223) % 4294967296;
        return value / 4294967296;
    };
}

export function shuffleForProfile(items, sectionTitle) {
    const profileId = localStorage.getItem('perfilAtivoId') ?? 'guest';
    const random = createSeededRandom(`${profileId}:${sectionTitle}`);
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
}

function updateActiveProfileUI() {
    const nomePerfil = localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = localStorage.getItem('perfilAtivoImagem');

    if (!nomePerfil || !imagemPerfil) {
        return;
    }

    const kidsLink = document.querySelector('.kids-link');
    const profileIcon = document.querySelector('.profile-icon');

    if (kidsLink) {
        kidsLink.textContent = nomePerfil;
    }

    if (profileIcon) {
        profileIcon.src = imagemPerfil;
    }
}

export function normalizeContentItem(item) {
    if (!item) {
        return null;
    }

    const source = item.contentId ?? item;

    const normalized = {
        ...source,
        progress: item.progress ?? source.progress ?? 0,
        isBookmarked: item.isBookmarked ?? source.isBookmarked ?? false,
        youtube: getContentVideoUrl(source),
        description: source.description ?? `Assista ${source.title ?? 'este titulo'} no catalogo.`,
        genres: source.genres?.length ? source.genres : [source.category].filter(Boolean)
    };

    normalized.img = getContentImage(normalized);

    return normalized;
}

export function renderSections(container, sections, emptyMessage = 'Nenhum conteudo encontrado.') {
    container.innerHTML = '';

    let renderedCount = 0;

    sections.forEach((section) => {
        if (!section?.items?.length) {
            return;
        }

        const mappedItems = section.items
            .map(normalizeContentItem)
            .filter(Boolean);

        if (!mappedItems.length) {
            return;
        }

        const carousel = createCarousel({
            title: section.title,
            items: mappedItems
        });

        container.appendChild(carousel);
        renderedCount += 1;
    });

    if (renderedCount === 0) {
        container.innerHTML = `<p>${emptyMessage}</p>`;
    }
}

export async function loadCategorySections(api, configs) {
    const sections = await Promise.all(
        configs.map(async ({ title, category = title, limit = 10 }) => {
            const items = await api.getContent(category, Math.max(limit * 4, 40));

            return {
                title,
                items: shuffleForProfile(items, title).slice(0, limit)
            };
        })
    );

    return sections.filter((section) => section.items.length > 0);
}

export async function initializePage({ loadSections, emptyMessage, errorMessage }) {
    document.addEventListener('DOMContentLoaded', async () => {
        updateActiveProfileUI();

        const container = document.getElementById('main-content');

        if (!container) {
            return;
        }

        try {
            const sections = await loadSections();
            renderSections(container, sections, emptyMessage);
        } catch (error) {
            console.error('Error loading page content:', error);
            container.innerHTML = `<p>${errorMessage}</p>`;
        }
    });
}
