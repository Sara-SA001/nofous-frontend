import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

type TokenPayload = {
  userId?: number;
  nationalId?: string;
  role?: 'user' | 'admin';
  exp?: number;
};

const getTokenPayload = (token: string): TokenPayload | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

const validateToken = async (token: string): Promise<TokenPayload | null> => {
  const payload = getTokenPayload(token);
  if (!payload) return null;

  const currentTime = Date.now() / 1000;
  if (payload.exp && payload.exp < currentTime) {
    return null;
  }

  return payload;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, token) => {
    sessionStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    sessionStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const payload = await validateToken(token);

      if (payload) {
        const user =
          get().user ??
          ({
            id: payload.userId ?? 0,
            nationalId: payload.nationalId ?? '',
            firstName: payload.role === 'admin' ? 'Admin' : '',
            role: payload.role ?? 'user',
          } as User);

        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        sessionStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      sessionStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
