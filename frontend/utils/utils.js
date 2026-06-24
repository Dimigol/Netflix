const FULL_URL_REGEX = /^(?:[a-z]+:)?\/\//i;
const DATA_URL_PREFIX = 'data:';
const FALLBACK_YOUTUBE_ID = '7RUA0IOfar8';

export function resolvePath(resourcePath = '') {
    if (!resourcePath) {
        return '';
    }

    if (FULL_URL_REGEX.test(resourcePath) || resourcePath.startsWith(DATA_URL_PREFIX)) {
        return resourcePath;
    }

    if (resourcePath.startsWith('../') || resourcePath.startsWith('./') || resourcePath.startsWith('/')) {
        return resourcePath;
    }

    return `/${resourcePath.replace(/^\/+/, '')}`;
}

export function getYouTubeId(url) {
    if (!url) {
        return FALLBACK_YOUTUBE_ID;
    }

    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.searchParams.has('v')) {
            return parsedUrl.searchParams.get('v') || FALLBACK_YOUTUBE_ID;
        }

        const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
        return pathParts.at(-1) || FALLBACK_YOUTUBE_ID;
    } catch {
        return FALLBACK_YOUTUBE_ID;
    }
}

export function getYouTubeThumbnail(url) {
    const videoId = getYouTubeId(url);
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function getContentVideoUrl(item = {}) {
    return item.youtube || item.youtubeUrl || '';
}

export function getContentImage(item = {}) {
    return item.img || item.image || getYouTubeThumbnail(getContentVideoUrl(item));
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
