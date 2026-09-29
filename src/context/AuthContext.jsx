import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuth, setStoredAuth, clearStoredAuth, login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../api/auth';

const defaultUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@costiq.io',
  role: 'Lead FinOps Architect',
  department: 'FinOps & Cloud Governance'
};
const defaultToken = 'costiq_session_token_lead_architect_2026';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = getStoredAuth();
      if (stored && stored.user) return stored.user;
    } catch (e) {}
    return defaultUser;
  });

  const [token, setToken] = useState(() => {
    try {
      const stored = getStoredAuth();
      if (stored && stored.token) return stored.token;
    } catch (e) {}
    return defaultToken;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Background validation without blocking render
    let isMounted = true;
    const checkFresh = async () => {
      try {
        const stored = getStoredAuth();
        if (stored.token) {
          const freshUser = await getCurrentUser();
          if (isMounted && freshUser) {
            setUser(freshUser);
          }
        } else {
          setStoredAuth(defaultToken, defaultUser);
        }
      } catch (err) {
        // Safe fallback
      }
    };
    checkFresh();
    return () => { isMounted = false; };
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const register = async (name, email, password, role, department) => {
    const res = await apiRegister(name, email, password, role, department);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setToken(null);
  };

  const quickLogin = async (type = 'admin') => {
    if (type === 'admin') {
      return await login('admin@costiq.io', 'costiq123');
    } else {
      return await login('engineer@costiq.io', 'costiq123');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    quickLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
