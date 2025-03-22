import React, { createContext, useState, useEffect } from 'react';
import { checkAuthStatus, login as loginApi, logout as logoutApi } from './auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true // Состояние загрузки, чтобы показать индикатор загрузки
  });

  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated, user } = await checkAuthStatus();
      setAuthState({ isAuthenticated, user, loading: false });
    };

    verifyAuth();
  }, []);

  const login = async (username, password) => {
    const result = await loginApi(username, password);
    if (result.success) {
      const { isAuthenticated, user } = await checkAuthStatus();
      setAuthState({ isAuthenticated, user, loading: false });
    }
    return result;
  };

  const logout = async () => {
    const success = await logoutApi();
    if (success) {
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    }
    return success;
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};