import { getYouTubeId, getRandomMatchScore, getRandomDuration, getRandomAgeBadge } from '../utils.js';

export function createModal(item) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const ageBadge = getRandomAgeBadge();
    const matchScore = getRandomMatchScore();

    const bannerImg = document.createElement('img');
    bannerImg.src = item.img ?? '';
    bannerImg.alt = item.title || 'Movie';
    bannerImg.className = 'modal-banner';

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
        <button class="btn-add"><i class="fas fa-plus"></i></button>
        <button class="btn-like"><i class="fas fa-thumbs-up"></i></button>
        <button class="btn-share"><i class="fas fa-share"></i></button>
    `;

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
    tagContainer.innerHTML = `
        <span>Empolgante</span>
        <span>Ação</span>
        <span>Ficção</span>
    `;

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
