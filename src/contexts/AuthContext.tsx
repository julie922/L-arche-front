import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface AuthUser {
  id: string;
  email?: string;
  role: string;
  nom: string;
  prenom?: string;
  ville?: string;
  avatar_url?: string;
  est_gardien: boolean;
  identite_verifiee: boolean;
  charte_acceptee: boolean;
}

interface SigninResponse {
  session: {
    access_token: string;
    refresh_token: string;
  };
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      Promise.resolve().then(() => setIsLoading(false));
      return;
    }
    api.get<AuthUser>('/users/me')
      .then(me => setUser(me))
      .catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const data = await api.post<SigninResponse>('/auth/signin', { email, password });
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token);
    const me = await api.get<AuthUser>('/users/me');
    setUser(me);
    return me;
  };

  const logout = async () => {
    const userId = user?.id;
    try {
      if (userId) await api.post('/auth/signout', { user_id: userId });
    } catch { /* ignore */ }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const reloadUser = async () => {
    const me = await api.get<AuthUser>('/users/me');
    setUser(me);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        logout,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
