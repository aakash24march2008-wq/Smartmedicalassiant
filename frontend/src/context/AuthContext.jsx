import { createContext, useContext, useState, useEffect } from 'react';
import { auth, firebaseSignOut, onAuthStateChanged } from '../firebase';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('mediai_token');
    const storedUser = localStorage.getItem('mediai_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Email/password login (standard)
  const login = (userData, jwtToken, remember = true) => {
    setUser(userData);
    setToken(jwtToken);
    const store = remember ? localStorage : sessionStorage;
    store.setItem('mediai_token', jwtToken);
    store.setItem('mediai_user', JSON.stringify(userData));
  };

  // OAuth login — called after Firebase popup succeeds
  const loginWithOAuth = async (firebaseUser, provider) => {
    const idToken = await firebaseUser.getIdToken();
    try {
      let res;
      if (provider === 'google') {
        res = await api.loginWithGoogle({ id_token: idToken });
      } else {
        res = await api.loginWithGitHub({ id_token: idToken });
      }
      const { access_token, user: userData } = res.data;
      login(userData, access_token, true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'OAuth login failed.' };
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase if signed in via OAuth
      if (auth.currentUser) {
        await firebaseSignOut();
      }
    } catch (e) { /* ignore */ }
    setUser(null);
    setToken(null);
    localStorage.removeItem('mediai_token');
    localStorage.removeItem('mediai_user');
    sessionStorage.removeItem('mediai_token');
    sessionStorage.removeItem('mediai_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginWithOAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
