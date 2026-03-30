const FULL_URL_REGEX = /^(?:[a-z]+:)?\/\//i;
const DATA_URL_PREFIX = 'data:';
export const BASE_PATH = window.location.pathname.includes('/html/') ? '../' : '';

export function resolvePath(resourcePath = '') {
    if (!resourcePath) {
        return '';
    }

    if (FULL_URL_REGEX.test(resourcePath) || resourcePath.startsWith(DATA_URL_PREFIX)) {
        return resourcePath;
    }

    if (resourcePath.startsWith('../') || resourcePath.startsWith('./')) {
        return resourcePath;
    }

    if (resourcePath.startsWith('/')) {
        return `${BASE_PATH}${resourcePath.slice(1)}`;
    }

    if (BASE_PATH && resourcePath.startsWith(BASE_PATH)) {
        return resourcePath;
    }

    return `${BASE_PATH}${resourcePath}`;
}

export function getYouTubeId(url) {
    if (!url) return "7RUA0IOfar8";
    if (url.includes('v=')) {
        return url.split('v=')[1].split('&')[0];
    }
    return url.split('/').pop();
}

export function getRandomMatchScore() {
    return Math.floor(Math.random() * 20 + 80);
}

export function getRandomDuration(hasProgress) {
    return hasProgress ? '10 temporadas' : '2h ' + Math.floor(Math.random() * 59) + 'm';
}

export function getRandomAgeBadge() {
    return Math.random() > 0.5 ? { text: 'A16', class: 'red-accent' } : { text: '16', class: '' };
}
