import { getYouTubeId, getYouTubeThumbnail, getContentVideoUrl, getRandomMatchScore, getRandomDuration, getRandomAgeBadge, resolvePath } from '../utils/utils.js';
import { createModal, openModal } from './Modal.js';
import { toggleBookmark } from '../services/myList.js';

function updateBookmarkButton(button, isBookmarked) {
    button.classList.toggle('is-bookmarked', isBookmarked);
    button.setAttribute('aria-label', isBookmarked ? 'Remover da minha lista' : 'Adicionar à minha lista');
    button.innerHTML = `<i class="fas fa-${isBookmarked ? 'check' : 'plus'}"></i>`;
}

export function createCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    if (item.progress) {
        card.classList.add('has-progress');
    }

    const videoUrl = getContentVideoUrl(item);
    const videoId = getYouTubeId(videoUrl);
    const fallbackImage = getYouTubeThumbnail(videoUrl);

    const img = document.createElement('img');
    img.src = resolvePath(item.img ?? '');
    img.alt = item.title ? `Capa de ${item.title}` : 'Capa do titulo';
    img.addEventListener('error', () => {
        if (img.src !== fallbackImage) {
            img.src = fallbackImage;
            return;
        }

        card.classList.add('is-missing-image');
    }, { once: false });

    const titleFallback = document.createElement('div');
    titleFallback.className = 'card-title-fallback';
    titleFallback.textContent = item.title || 'Titulo indisponivel';

    const iframe = document.createElement('iframe');
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; encrypted-media";

    card.appendChild(iframe);
    card.appendChild(img);
    card.appendChild(titleFallback);

    const ageBadge = getRandomAgeBadge();

    const details = document.createElement('div');
    details.className = 'card-details';
    details.innerHTML = `
        <div class="details-buttons">
            <div class="left-buttons">
                <button class="btn-icon btn-play-icon" data-action="play"><i class="fas fa-play" style="margin-left:2px;"></i></button>
                <button class="btn-icon btn-my-list" type="button"></button>
                <button class="btn-icon"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="right-buttons">
                <button class="btn-icon btn-modal-trigger"><i class="fas fa-chevron-down"></i></button>
            </div>
        </div>
        <div class="details-info">
            <strong class="details-title">${item.title || 'Sem titulo'}</strong>
            <span class="match-score">${getRandomMatchScore()}% relevante</span>
            <span class="age-badge ${ageBadge.class}">${ageBadge.text}</span>
            <span class="duration">${getRandomDuration(item.progress)}</span>
            <span class="resolution">HD</span>
        </div>
        <div class="details-tags">
            ${(item.genres?.length ? item.genres : ['Empolgante', 'Ficção']).slice(0, 3).map(tag => `<span>${tag}</span>`).join('')}
        </div>
    `;
    card.appendChild(details);


    if (item.progress) {
        const pbContainer = document.createElement('div');
        pbContainer.className = 'progress-bar-container';
        const pbValue = document.createElement('div');
        pbValue.className = 'progress-value';
        pbValue.style.width = `${item.progress}%`;
        pbContainer.appendChild(pbValue);
        card.appendChild(pbContainer);
    }

    let playTimeout;
    card.addEventListener('mouseenter', () => {
        const rect = card.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        
        if (rect.left < 100) {
            card.classList.add('origin-left');
        } else if (rect.right > windowWidth - 100) {
            card.classList.add('origin-right');
        }

        playTimeout = setTimeout(() => {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}`;
            iframe.classList.add('playing');
            img.classList.add('playing-video');
        }, 600);
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(playTimeout);
        iframe.classList.remove('playing');
        img.classList.remove('playing-video');
        iframe.src = "";
        card.classList.remove('origin-left');
        card.classList.remove('origin-right');
    });

    // Add modal trigger listeners
    const modalTriggerBtn = details.querySelector('.btn-modal-trigger');
    const playBtn = details.querySelector('.btn-play-icon');
    const myListBtn = details.querySelector('.btn-my-list');

    const openItemModal = () => {
        const modal = createModal(item);
        openModal(modal);
    };

    if (modalTriggerBtn) {
        modalTriggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openItemModal();
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openItemModal();
        });
    }

    if (myListBtn) {
        updateBookmarkButton(myListBtn, item.isBookmarked);
        myListBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            myListBtn.disabled = true;

            try {
                const isBookmarked = await toggleBookmark(item);
                updateBookmarkButton(myListBtn, isBookmarked);
            } catch (error) {
                console.error('Erro ao atualizar Minha lista:', error);
                alert(error.message || 'Não foi possível atualizar sua lista.');
            } finally {
                myListBtn.disabled = false;
            }
        });
    }

    // Also open modal when clicking on the card image (without entering hover state first on mobile)
    img.addEventListener('click', openItemModal);

    return card;
}
