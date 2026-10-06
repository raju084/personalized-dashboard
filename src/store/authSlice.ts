import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types';

const AUTH_STORAGE_KEY = 'dashboard_user_profile_v1';

const initialProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Software Engineer & Tech Enthusiast building modern web experiences.',
  role: 'Senior SDE Intern',
  isAuthenticated: true,
};

const loadInitialProfile = (): UserProfile => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return { ...initialProfile, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load user profile from localStorage:', e);
    }
  }
  return initialProfile;
};

const saveProfileToStorage = (profile: UserProfile) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage:', e);
    }
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialProfile(),
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      Object.assign(state, action.payload);
      saveProfileToStorage(state);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      saveProfileToStorage(state);
    },
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      saveProfileToStorage(state);
    },
  },
});

export const { updateProfile, logout, login } = authSlice.actions;

export default authSlice.reducer;
