import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    if (stored && storedUser) {
      try { setAdmin(JSON.parse(storedUser)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    setAdmin(userData);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  const updateAdmin = (data) => {
    const updated = { ...admin, ...data };
    localStorage.setItem('admin_user', JSON.stringify(updated));
    setAdmin(updated);
  };

  const getInitials = () => {
    if (!admin) return '?';
    if (admin.name) {
      return admin.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }
    return admin.email ? admin.email[0].toUpperCase() : '?';
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, updateAdmin, getInitials }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
