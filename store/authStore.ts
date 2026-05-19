import { create } from 'zustand';
import type { User } from '../types';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
  checkAdminAuth: () => void;
}

type TokenPayload = {
  userId?: number;
  nationalId?: string;
  role?: 'USER' | 'ADMIN' | 'SUB_ADMIN' | 'user' | 'admin' | 'sub_admin';
  permissions?: string[];
  exp?: number;
};

const mapAdminRole = (role?: string) => {
  const normalized = role?.toUpperCase();
  return normalized === 'SUB_ADMIN' ? 'sub_admin' : 'admin';
};

const mapAdminPermissions = (permissions: unknown): string[] => {
  if (!Array.isArray(permissions)) return [];
  return permissions.filter((permission): permission is string => typeof permission === 'string');
};

// Note: token validation delegated to backend `/auth/me` endpoint.

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, token) => {
    sessionStorage.setItem('token', token);
    try {
      // also set a non-httpOnly cookie so middleware can read it (backend should set httpOnly cookie for real security)
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
    } catch (e) {
      // ignore server-side
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    sessionStorage.removeItem('token');
    try {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (e) { }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const token = sessionStorage.getItem('token');

    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      // axios instance will attach Authorization header from sessionStorage via interceptor
      const res = await api.get('/auth/me');

      if (res?.data?.success && res.data.user) {
        set({ user: res.data.user as User, token, isAuthenticated: true, isLoading: false });
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
  checkAdminAuth: async () => {
    set({ isLoading: true });
    const token = sessionStorage.getItem('token');

    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const res = await api.get('/admin/me');

      if (res?.data?.success && res.data.admin) {
        const admin = res.data.admin;

        const role = mapAdminRole(admin.role);
        const adminPermissions = mapAdminPermissions(admin.permissions);

        // إنشاء كائن User كامل بقيم افتراضية
        const userLike: User = {
          id: admin.id,
          nationalId: admin.email || '',
          firstName: admin.username || admin.fullName || 'Admin',
          fatherName: '',
          motherName: '',
          nisba: '',
          grandfatherName: '',
          dateOfBirth: new Date().toISOString(),
          placeOfBirth: '',
          nationality: 'سوري',
          governorate: '',
          registrationPlace: '',
          registrationNumber: '',
          registrationDate: new Date().toISOString(),
          gender: 'MALE',
          religion: 'MUSLIM',
          maritalStatus: 'SINGLE',
          role,
          adminPermissions,
          isAlive: true,
          personalPhoto: "",
          idFrontPhoto: "",
          idBackPhoto: "",
        };

        set({
          user: userLike,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        sessionStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Admin auth check error:', error);
      sessionStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
