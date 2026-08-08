const API_BASE_CANDIDATES = [
  typeof window !== 'undefined' && window.__API_BASE__,
  'http://127.0.0.1:5001/api',
  'http://localhost:5001/api',
  'http://127.0.0.1:5000/api',
  'http://localhost:5000/api',
  typeof window !== 'undefined' && window.location?.protocol.startsWith('http')
    ? `${window.location.origin}/api`
    : null
].filter(Boolean);

let resolvedApiBase = null;

let authToken = localStorage.getItem('authToken');

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let errorMessage = 'API request failed';

    if (contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {
        // Ignore JSON parsing issues for error responses.
      }
    } else {
      try {
        const text = await response.text();
        const preMatch = text.match(/<pre>(.*?)<\/pre>/is);
        const cleanText = (preMatch?.[1] || text)
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        errorMessage = cleanText || errorMessage;
      } catch {
        // Ignore body parsing issues for error responses.
      }
    }

    throw new Error(errorMessage);
  }

  if (!contentType.includes('application/json')) {
    throw new Error('Backend respondeu com conteúdo inesperado. Verifique se a API correta está ativa.');
  }

  return response.json();
}

export const api = {
  setToken(token) {
    authToken = token;
    localStorage.setItem('authToken', token);
  },

  getToken() {
    return authToken;
  },

  clearToken() {
    authToken = null;
    localStorage.removeItem('authToken');
  },

  getAuthHeader() {
    if (!authToken) {
      return {};
    }

    const activeProfileId = localStorage.getItem('perfilAtivoId');

    return {
      Authorization: `Bearer ${authToken}`,
      ...(activeProfileId ? { 'X-Profile-Id': activeProfileId } : {})
    };
  },

  async resolveBase() {
    if (resolvedApiBase) {
      return resolvedApiBase;
    }

    const candidates = API_BASE_CANDIDATES.length ? API_BASE_CANDIDATES : ['http://127.0.0.1:5001/api'];

    for (const baseUrl of candidates) {
      try {
        const response = await fetch(`${baseUrl}/health`);
        const contentType = response.headers.get('content-type') || '';

        if (response.ok && contentType.includes('application/json')) {
          resolvedApiBase = baseUrl;
          return baseUrl;
        }
      } catch {
        // Try the next candidate.
      }
    }

    throw new Error('Não foi possível conectar ao backend. Verifique se o servidor está rodando.');
  },

  async request(endpoint, options = {}) {
    const baseUrl = resolvedApiBase || await this.resolveBase();
    const requestOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers
      }
    };

    try {
      return await fetchJson(`${baseUrl}${endpoint}`, requestOptions);
    } catch (error) {
      const isNetworkError = error instanceof TypeError || (error instanceof Error && error.message.includes('Failed to fetch'));

      if (isNetworkError) {
        resolvedApiBase = null;
        const remainingBases = API_BASE_CANDIDATES.filter(base => base !== baseUrl);

        for (const fallbackBase of remainingBases) {
          try {
            const response = await fetch(`${fallbackBase}/health`);
            const contentType = response.headers.get('content-type') || '';

            if (!response.ok || !contentType.includes('application/json')) {
              continue;
            }

            resolvedApiBase = fallbackBase;
            return await fetchJson(`${fallbackBase}${endpoint}`, requestOptions);
          } catch {
            // Keep trying fallbacks.
          }
        }

        throw new Error('Não foi possível conectar ao backend. Verifique se o servidor está rodando na porta correta.');
      }

      throw error;
    }
  },

  // Auth endpoints
  register(email, password, username) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username })
    });
  },

  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  verifyToken() {
    return this.request('/auth/verify', { method: 'POST' });
  },

  // Content endpoints
  getContent(category = null, limit = 50, page = 1) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit);
    params.append('page', page);
    return this.request(`/content?${params}`);
  },

  getContentById(id) {
    return this.request(`/content/${id}`);
  },

  searchContent(query) {
    return this.request(`/content/search?q=${encodeURIComponent(query)}`);
  },

  getRecommendations() {
    return this.request('/content/recommendations');
  },

  // User endpoints
  createProfile(name, avatar) {
    return this.request('/user/profile', {
      method: 'POST',
      body: JSON.stringify({ name, avatar })
    });
  },

  updateProfile(profileId, updates) {
    return this.request(`/user/profile/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  getProfile() {
    return this.request('/user/profile');
  },

  deleteProfile(profileId) {
    return this.request(`/user/profile/${profileId}`, { method: 'DELETE' });
  },

  saveWatchProgress(contentId, progress) {
    return this.request('/user/watchhistory', {
      method: 'POST',
      body: JSON.stringify({ contentId, progress })
    });
  },

  getWatchHistory() {
    return this.request('/user/watchhistory');
  },

  updateBookmark(contentId, isBookmarked) {
    return this.request(`/user/watchhistory/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify({ isBookmarked })
    });
  },

  getMyList() {
    return this.request('/user/mylist');
  }
};

export default api;
