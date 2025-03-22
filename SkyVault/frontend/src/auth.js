import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Адрес вашего Django-сервера
  withCredentials: true // Убедитесь, что куки отправляются с запросами
});

export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/api/auth/status/');
    return {
      isAuthenticated: response.data.isAuthenticated,
      user: response.data.user || null
    };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { isAuthenticated: false, user: null };
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/login/', { username, password });
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, message: error.response?.data?.error || 'Login failed' };
  }
};

export const logout = async () => {
  try {
    await api.post('/api/logout/');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
};