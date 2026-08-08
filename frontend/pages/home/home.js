import api from '../../services/api.js';
import auth from '../../services/auth.js';
import { PROFILE_AVATARS, resolveProfileAvatar } from '../../utils/profileAvatars.js';

const loginScreen = document.getElementById('login-screen');
const profileScreen = document.getElementById('profile-screen');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const themeToggle = document.getElementById('theme-toggle');
const passwordToggle = document.getElementById('toggle-password');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const toggleAuthBtn = document.getElementById('toggle-auth');
const authError = document.getElementById('auth-error');
const logoutBtn = document.getElementById('logout-btn');
const profileModal = document.getElementById('profile-modal');
const profileForm = document.getElementById('profile-form');
const profileModalTitle = document.getElementById('profile-modal-title');
const profileNameInput = document.getElementById('profile-name-input');
const avatarPicker = document.getElementById('avatar-picker');
const profileFormError = document.getElementById('profile-form-error');
const profileCancelBtn = document.getElementById('profile-cancel-btn');
const profileDeleteBtn = document.getElementById('profile-delete-btn');
const profileModalClose = document.getElementById('profile-modal-close');

let isLoginMode = true;
let selectedAvatar = PROFILE_AVATARS[0];
let editingProfileId = null;
const THEME_STORAGE_KEY = 'netflixThemeMode';

function updateThemeButton(mode) {
  const isLight = mode === 'light';
  themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
  themeToggle.classList.toggle('is-light', isLight);
}

function applyTheme(mode) {
  document.body.classList.remove('light-mode', 'dark-mode');
  document.body.classList.add(`${mode}-mode`);
  updateThemeButton(mode);
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-mode');
  const nextTheme = isLight ? 'dark' : 'light';
  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

function togglePasswordVisibility() {
  const isPasswordVisible = passwordInput.type === 'text';
  passwordInput.type = isPasswordVisible ? 'password' : 'text';
  passwordToggle.textContent = isPasswordVisible ? 'Mostrar' : 'Ocultar';
  passwordToggle.setAttribute('aria-label', isPasswordVisible ? 'Mostrar senha' : 'Ocultar senha');
  passwordToggle.setAttribute('aria-pressed', isPasswordVisible ? 'false' : 'true');
  passwordInput.focus();
}

function submitLoginWithEnter(event) {
  if (event.key !== 'Enter' || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  event.preventDefault();
  loginForm.requestSubmit();
}

function setScreenMode(mode) {
  document.body.classList.toggle('auth-screen', mode === 'auth');
  document.body.classList.toggle('profile-selection-screen', mode === 'profiles');
}

function getStoredUser() {
  return auth.getUser();
}

function saveStoredUser(user) {
  auth.saveUser(user);
}

function showLoginScreen() {
  loginScreen.style.display = 'block';
  profileScreen.style.display = 'none';
  setScreenMode('auth');
}

function showProfileScreen() {
  profileScreen.style.display = 'flex';
  loginScreen.style.display = 'none';
  setScreenMode('profiles');
  loadProfiles();
}

function normalizeUserAvatars(user) {
  if (!user?.profiles) {
    return user;
  }

  let changed = false;
  user.profiles = user.profiles.map((profile, index) => {
    const avatar = resolveProfileAvatar(profile, index);

    if (profile.avatar === avatar) {
      return profile;
    }

    changed = true;
    return { ...profile, avatar };
  });

  if (changed) {
    saveStoredUser(user);
  }

  return user;
}

function createProfileCard(profile, index) {
  const avatar = resolveProfileAvatar(profile, index);
  const li = document.createElement('li');
  li.className = 'profile';
  li.innerHTML = `
    <a href="/pages/catalogo/" data-profile-id="${profile._id}" aria-label="Entrar como ${profile.name}">
      <img src="${avatar}" alt="${profile.name}">
    </a>
    <button type="button" class="avatar-edit-btn" aria-label="Trocar imagem de ${profile.name}">Editar</button>
    <p>${profile.name}</p>
  `;

  const image = li.querySelector('img');
  image?.addEventListener('error', () => {
    image.src = resolveProfileAvatar(profile, index);
  }, { once: true });

  li.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    const user = getStoredUser();
    const storedProfile = user?.profiles?.find(p => p._id === profile._id);

    if (storedProfile) {
      storedProfile.avatar = avatar;
      saveStoredUser(user);
    }

    auth.setActiveProfile(profile._id);
    window.location.href = '/pages/catalogo/';
  });

  li.querySelector('.avatar-edit-btn').addEventListener('click', () => {
    openProfileModal({ profile: { ...profile, avatar } });
  });

  return li;
}

function createAddProfileCard() {
  const li = document.createElement('li');
  li.className = 'profile profile-add';
  li.innerHTML = `
    <button type="button" class="add-profile-btn" aria-label="Adicionar perfil">
      <span>+</span>
    </button>
    <p>Adicionar perfil</p>
  `;

  li.querySelector('button').addEventListener('click', () => {
    openProfileModal();
  });

  return li;
}

function loadProfiles() {
  const user = normalizeUserAvatars(getStoredUser());
  if (!user || !user.profiles) return;

  const profilesList = document.getElementById('profiles-list');
  profilesList.innerHTML = '';

  user.profiles.forEach((profile, index) => {
    profilesList.appendChild(createProfileCard(profile, index));
  });

  profilesList.appendChild(createAddProfileCard());
}

function renderAvatarPicker() {
  avatarPicker.innerHTML = '';

  PROFILE_AVATARS.forEach((avatar) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `avatar-option${avatar === selectedAvatar ? ' is-selected' : ''}`;
    button.innerHTML = `<img src="${avatar}" alt="Avatar">`;
    button.addEventListener('click', () => {
      selectedAvatar = avatar;
      renderAvatarPicker();
    });
    avatarPicker.appendChild(button);
  });
}

function openProfileModal({ profile = null } = {}) {
  editingProfileId = profile?._id ?? null;
  selectedAvatar = profile?.avatar ?? PROFILE_AVATARS[0];
  profileModalTitle.textContent = editingProfileId ? 'Editar perfil' : 'Novo perfil';
  profileNameInput.value = profile?.name ?? '';
  profileFormError.textContent = '';

  const user = getStoredUser();
  const canDelete = Boolean(editingProfileId) && (user?.profiles?.length ?? 0) > 1;
  profileDeleteBtn.style.display = canDelete ? 'inline-block' : 'none';

  renderAvatarPicker();
  profileModal.classList.add('is-open');
  profileModal.setAttribute('aria-hidden', 'false');
  profileNameInput.focus();
}

function closeProfileModal() {
  profileModal.classList.remove('is-open');
  profileModal.setAttribute('aria-hidden', 'true');
  editingProfileId = null;
  profileForm.reset();
  profileFormError.textContent = '';
}

function replaceProfile(user, updatedProfile) {
  user.profiles = user.profiles.map((profile) => (
    profile._id === updatedProfile._id ? updatedProfile : profile
  ));
  saveStoredUser(user);
}

function isMissingProfileUpdateRoute(error) {
  return error.message.includes('Cannot PUT') || error.message.includes('Cannot PATCH');
}

function updateProfileLocally(user, profileId, updates) {
  const currentProfile = user?.profiles?.find((profile) => profile._id === profileId);

  if (!currentProfile) {
    throw new Error('Perfil não encontrado neste navegador.');
  }

  const updatedProfile = {
    ...currentProfile,
    ...updates
  };

  replaceProfile(user, updatedProfile);
  return updatedProfile;
}

toggleAuthBtn.addEventListener('click', () => {
  isLoginMode = !isLoginMode;
  authError.textContent = '';
  if (isLoginMode) {
    authTitle.textContent = 'Entre em sua conta';
    authSubmitBtn.textContent = 'Entrar';
    toggleAuthBtn.textContent = 'Criar uma';
  } else {
    authTitle.textContent = 'Crie sua conta';
    authSubmitBtn.textContent = 'Criar';
    toggleAuthBtn.textContent = 'Entrar';
  }
});

themeToggle.addEventListener('click', toggleTheme);
passwordToggle.addEventListener('click', togglePasswordVisibility);
emailInput.addEventListener('keydown', submitLoginWithEnter);
passwordInput.addEventListener('keydown', submitLoginWithEnter);

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.textContent = '';

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    authSubmitBtn.disabled = true;

    if (isLoginMode) {
      await auth.login(email, password);
    } else {
      const username = email.split('@')[0];
      await auth.register(email, password, username);
    }
    showProfileScreen();
  } catch (error) {
    authError.textContent = error.message;
  } finally {
    authSubmitBtn.disabled = false;
  }
});

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  profileFormError.textContent = '';

  const name = profileNameInput.value.trim();

  if (!name) {
    profileFormError.textContent = 'Digite um nome para o perfil.';
    return;
  }

  try {
    const user = getStoredUser();

    if (editingProfileId) {
      let updatedProfile;

      try {
        updatedProfile = await api.updateProfile(editingProfileId, { name, avatar: selectedAvatar });
        replaceProfile(user, updatedProfile);
      } catch (error) {
        if (!isMissingProfileUpdateRoute(error)) {
          throw error;
        }

        console.warn('Backend sem rota de atualização de perfil; aplicando alteração local.', error);
        updatedProfile = updateProfileLocally(user, editingProfileId, { name, avatar: selectedAvatar });
      }

      if (auth.getActiveProfileId() === updatedProfile._id) {
        auth.setActiveProfile(updatedProfile._id);
      }
    } else {
      const newProfile = await api.createProfile(name, selectedAvatar);
      user.profiles.push(newProfile);
      saveStoredUser(user);
    }

    closeProfileModal();
    loadProfiles();
  } catch (error) {
    profileFormError.textContent = error.message;
  }
});

profileDeleteBtn.addEventListener('click', async () => {
  if (!editingProfileId) return;

  const confirmed = window.confirm('Tem certeza que deseja excluir este perfil? Essa ação não pode ser desfeita.');
  if (!confirmed) return;

  try {
    profileDeleteBtn.disabled = true;
    await api.deleteProfile(editingProfileId);

    const user = getStoredUser();
    user.profiles = user.profiles.filter((profile) => profile._id !== editingProfileId);
    saveStoredUser(user);

    if (auth.getActiveProfileId() === editingProfileId) {
      localStorage.removeItem('perfilAtivoId');
      localStorage.removeItem('perfilAtivoNome');
      localStorage.removeItem('perfilAtivoImagem');
    }

    closeProfileModal();
    loadProfiles();
  } catch (error) {
    profileFormError.textContent = error.message;
  } finally {
    profileDeleteBtn.disabled = false;
  }
});

logoutBtn.addEventListener('click', () => {
  auth.logout();
});

profileCancelBtn.addEventListener('click', closeProfileModal);
profileModalClose.addEventListener('click', closeProfileModal);
profileModal.addEventListener('click', (event) => {
  if (event.target === profileModal) {
    closeProfileModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && profileModal.classList.contains('is-open')) {
    closeProfileModal();
  }
});

(async () => {
  applyTheme(getInitialTheme());

  if (auth.isAuthenticated()) {
    try {
      await api.verifyToken();
      showProfileScreen();
    } catch (error) {
      auth.logout();
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
})();
