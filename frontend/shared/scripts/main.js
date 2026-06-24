const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const STORAGE_KEY = 'netflixThemeMode';

function updateThemeButton(mode) {
  const isLight = mode === 'light';
  themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
  themeToggle.classList.toggle('is-light', isLight);
}

function applyTheme(mode) {
  body.classList.remove('light-mode', 'dark-mode');
  body.classList.add(`${mode}-mode`);
  updateThemeButton(mode);
}

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function toggleTheme() {
  const current = body.classList.contains('light-mode') ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
}

themeToggle.addEventListener('click', toggleTheme);

const initial = getInitialTheme();
applyTheme(initial);

const profileLinks = document.querySelectorAll('.profile-list a');

profileLinks.forEach(link => {
  const profileId = link.dataset.profileId || 'perfil-1';
  link.addEventListener('click', () => {
    const profile = link.closest('.profile');
    const img = profile?.querySelector('img');
    const nameElement = profile?.querySelector('p');
    const name = nameElement?.textContent?.trim();

    if (name && img?.src) {
      localStorage.setItem('perfilAtivoNome', name);
      localStorage.setItem('perfilAtivoImagem', img.src);
    }

    localStorage.setItem('perfilAtivoId', profileId);
  });
});
