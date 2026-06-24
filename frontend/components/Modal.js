import { getYouTubeThumbnail, getContentVideoUrl, getRandomMatchScore, getRandomDuration, getRandomAgeBadge, resolvePath } from '../utils/utils.js';
import { toggleBookmark } from '../services/myList.js';

function updateBookmarkButton(button, isBookmarked) {
    button.classList.toggle('is-bookmarked', isBookmarked);
    button.setAttribute('aria-label', isBookmarked ? 'Remover da minha lista' : 'Adicionar à minha lista');
    button.innerHTML = `<i class="fas fa-${isBookmarked ? 'check' : 'plus'}"></i>`;
}

export function createModal(item) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const ageBadge = getRandomAgeBadge();
    const matchScore = getRandomMatchScore();
    const videoUrl = getContentVideoUrl(item);

    const bannerImg = document.createElement('img');
    bannerImg.src = resolvePath(item.img ?? '');
    bannerImg.alt = item.title || 'Movie';
    bannerImg.className = 'modal-banner';
    bannerImg.addEventListener('error', () => {
        bannerImg.src = getYouTubeThumbnail(videoUrl);
    }, { once: true });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.setAttribute('aria-label', 'Fechar modal');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';

    const infoContainer = document.createElement('div');
    infoContainer.className = 'modal-info';

    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = item.title || 'Sem título';

    const actionButtons = document.createElement('div');
    actionButtons.className = 'modal-actions';
    actionButtons.innerHTML = `
        <button class="btn-play"><i class="fas fa-play"></i> Assistir</button>
        <button class="btn-add" type="button"></button>
        <button class="btn-like"><i class="fas fa-thumbs-up"></i></button>
        <button class="btn-share"><i class="fas fa-share"></i></button>
    `;

    // Add event listener to watch button
    const playBtn = actionButtons.querySelector('.btn-play');
    const addBtn = actionButtons.querySelector('.btn-add');

    if (addBtn) {
        updateBookmarkButton(addBtn, item.isBookmarked);
        addBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            addBtn.disabled = true;

            try {
                const isBookmarked = await toggleBookmark(item);
                updateBookmarkButton(addBtn, isBookmarked);
            } catch (error) {
                console.error('Erro ao atualizar Minha lista:', error);
                alert(error.message || 'Não foi possível atualizar sua lista.');
            } finally {
                addBtn.disabled = false;
            }
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Store item data in localStorage
            localStorage.setItem('currentPlayingItem', JSON.stringify({ ...item, youtube: videoUrl }));
            // Redirect to player page
            window.location.href = '/pages/player/';
        });
    }

    const metaInfo = document.createElement('div');
    metaInfo.className = 'modal-meta';
    metaInfo.innerHTML = `
        <span class="match-score">${matchScore}% relevante</span>
        <span class="age-badge ${ageBadge.class}">${ageBadge.text}</span>
        <span class="duration">${getRandomDuration(item.progress)}</span>
        <span class="resolution">HD</span>
    `;

    const tagContainer = document.createElement('div');
    tagContainer.className = 'modal-tags';
    tagContainer.innerHTML = (item.genres?.length ? item.genres : ['Empolgante', 'Ação', 'Ficção'])
        .slice(0, 3)
        .map(tag => `<span>${tag}</span>`)
        .join('');

    const description = document.createElement('p');
    description.className = 'modal-description';
    description.textContent = item.description || 'Uma incrível produção que você não pode perder. Assista agora e descubra uma experiência de entretenimento incomparável.';

    infoContainer.appendChild(title);
    infoContainer.appendChild(actionButtons);
    infoContainer.appendChild(metaInfo);
    infoContainer.appendChild(tagContainer);
    infoContainer.appendChild(description);

    modalContent.appendChild(bannerImg);
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(infoContainer);

    modal.appendChild(modalContent);

    closeBtn.addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            closeModal(modal);
        }
    });

    return modal;
}

export function openModal(modal) {
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

export function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 300);
}
