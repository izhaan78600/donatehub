import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, userApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('donatehub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('donatehub_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('donatehub_token', token);
    } else {
      localStorage.removeItem('donatehub_token');
      localStorage.removeItem('donatehub_user');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const authData = res.data;
    setToken(authData.token);
    const userData = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
    };
    setUser(userData);
    localStorage.setItem('donatehub_token', authData.token);
    localStorage.setItem('donatehub_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    const authData = res.data;
    setToken(authData.token);
    const userData = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
    };
    setUser(userData);
    localStorage.setItem('donatehub_token', authData.token);
    localStorage.setItem('donatehub_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('donatehub_token');
    localStorage.removeItem('donatehub_user');
  };

  const updateUserState = (newDetails) => {
    const updated = { ...user, ...newDetails };
    setUser(updated);
    localStorage.setItem('donatehub_user', JSON.stringify(updated));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ROLE_ADMIN',
    isUser: user?.role === 'ROLE_USER',
    login,
    register,
    logout,
    updateUserState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
