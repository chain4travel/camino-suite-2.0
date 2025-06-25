'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AUTH_TOKEN_KEY = 'isAuthenticated';

const cookieOptions = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check initial auth state
  useEffect(() => {
    setCookie(AUTH_TOKEN_KEY, 'access_token', cookieOptions);
    const token = getCookie(AUTH_TOKEN_KEY);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    setCookie(AUTH_TOKEN_KEY, token, cookieOptions);
    setIsAuthenticated(true);
  };

  const logout = () => {
    deleteCookie(AUTH_TOKEN_KEY, cookieOptions);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 