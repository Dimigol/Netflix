import api from './api.js';

export const auth = {
  isAuthenticated() {
    return !!api.getToken();
  },

  async register(email, password, username) {
    try {
      const response = await api.register(email, password, username);
      api.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await api.login(email, password);
      api.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    api.clearToken();
    localStorage.removeItem('user');
    localStorage.removeItem('perfilAtivoId');
    localStorage.removeItem('perfilAtivoNome');
    localStorage.removeItem('perfilAtivoImagem');
    window.location.href = '/';
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setActiveProfile(profileId) {
    const user = this.getUser();
    if (user) {
      const profile = user.profiles.find(p => p._id === profileId);
      if (profile) {
        localStorage.setItem('perfilAtivoId', profileId);
        localStorage.setItem('perfilAtivoNome', profile.name);
        localStorage.setItem('perfilAtivoImagem', profile.avatar);
      }
    }
  },

  getActiveProfileId() {
    return localStorage.getItem('perfilAtivoId');
  },

  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export default auth;
