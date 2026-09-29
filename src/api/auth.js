const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'costiq_token';
const USER_KEY = 'costiq_user';

export const getStoredAuth = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch (e) {
    return { token: null, user: null };
  }
};

export const setStoredAuth = (token, user) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

export const clearStoredAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Storage clear error:", e);
  }
};

export const login = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      setStoredAuth(data.token, data.user);
      return { success: true, user: data.user, token: data.token };
    }

    const errData = await res.json().catch(() => ({ error: 'Login failed' }));
    return { success: false, error: errData.error || 'Invalid credentials' };
  } catch (err) {
    // Offline / Demo fallback
    if (email === 'admin@costiq.io' && password === 'costiq123') {
      const demoUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@costiq.io',
        role: 'Lead FinOps Architect',
        department: 'FinOps & Cloud Governance'
      };
      const mockToken = 'mock_jwt_token_admin_2026';
      setStoredAuth(mockToken, demoUser);
      return { success: true, user: demoUser, token: mockToken };
    } else if (email === 'engineer@costiq.io' && password === 'costiq123') {
      const demoUser = {
        id: 2,
        name: 'Cloud Engineer',
        email: 'engineer@costiq.io',
        role: 'Cloud Infrastructure Engineer',
        department: 'Platform Engineering'
      };
      const mockToken = 'mock_jwt_token_engineer_2026';
      setStoredAuth(mockToken, demoUser);
      return { success: true, user: demoUser, token: mockToken };
    }
    return { success: false, error: 'Could not connect to authentication server' };
  }
};

export const register = async (name, email, password, role, department) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, department }),
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      setStoredAuth(data.token, data.user);
      return { success: true, user: data.user, token: data.token };
    }

    const errData = await res.json().catch(() => ({ error: 'Registration failed' }));
    return { success: false, error: errData.error || 'Registration failed' };
  } catch (err) {
    return { success: false, error: 'Network error during registration' };
  }
};

export const getCurrentUser = async () => {
  const { token, user } = getStoredAuth();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      setStoredAuth(token, data.user);
      return data.user;
    }
  } catch (e) {
    // If backend offline, retain cached user
  }

  return user;
};

export const logout = async () => {
  const { token } = getStoredAuth();
  if (token) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }
  clearStoredAuth();
  return true;
};
