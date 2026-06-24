import { getYouTubeId, getContentVideoUrl, getRandomMatchScore, getRandomDuration, getRandomAgeBadge } from '../../utils/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get item data from localStorage
    const itemData = localStorage.getItem('currentPlayingItem');

    if (!itemData) {
        document.querySelector('.player-title').textContent = 'Nenhum item selecionado';
        return;
    }

    const item = JSON.parse(itemData);

    // Update page title
    document.title = `${item.title} - Netflix`;

    // Set header title
    const headerTitle = document.querySelector('.player-title');
    headerTitle.textContent = item.title || 'Sem título';

    // Set video player
    const videoUrl = getContentVideoUrl(item);
    const videoId = getYouTubeId(videoUrl);
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1`;

    // Set content info
    const contentTitle = document.querySelector('.content-title');
    contentTitle.textContent = item.title || 'Sem título';

    // Set meta info
    const matchScore = document.querySelector('.match-score');
    matchScore.textContent = `${getRandomMatchScore()}% relevante`;

    const ageBadge = getRandomAgeBadge();
    const ageBadgeElement = document.querySelector('.age-badge');
    ageBadgeElement.textContent = ageBadge.text;
    ageBadgeElement.className = `age-badge ${ageBadge.class}`;

    const duration = document.querySelector('.duration');
    duration.textContent = getRandomDuration(item.progress || 0);

    // Set tags
    const infoTags = document.querySelector('.info-tags');
    const tags = item.genres?.length ? item.genres : ['Empolgante', 'Ação', 'Ficção'];
    infoTags.innerHTML = tags.slice(0, 3).map(tag => `<span>${tag}</span>`).join('');

    // Set description
    const description = document.querySelector('.content-description');
    description.textContent = item.description || 'Uma incrível produção que você não pode perder. Assista agora e descubra uma experiência de entretenimento incomparável.';

    // Apply theme
    const savedTheme = localStorage.getItem('netflixThemeMode');
    if (savedTheme) {
        document.body.classList.add(`${savedTheme}-mode`);
    } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.add(isDark ? 'dark-mode' : 'light-mode');
    }

    // Back button
    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', () => {
        window.history.back();
    });

    // Action buttons
    const likeBtn = document.querySelector('.btn-like');
    const dislikeBtn = document.querySelector('.btn-dislike');
    const shareBtn = document.querySelector('.btn-share');

    likeBtn?.addEventListener('click', () => {
        likeBtn.classList.toggle('active');
        alert('Você marcou como gostei!');
    });

    dislikeBtn?.addEventListener('click', () => {
        dislikeBtn.classList.toggle('active');
        alert('Você marcou como não gostei!');
    });

    shareBtn?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: item.title,
                text: `Veja ${item.title} na Netflix!`,
                url: window.location.href,
            }).catch(err => console.log('Erro ao compartilhar:', err));
        } else {
            alert('Copiar link: ' + window.location.href);
            navigator.clipboard.writeText(window.location.href);
        }
    });

    // Clear the stored item when user leaves
    window.addEventListener('beforeunload', () => {
        localStorage.removeItem('currentPlayingItem');
    });
});
