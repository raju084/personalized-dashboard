import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences, Category } from '@/types';
import { SupportedLanguage } from '@/services/i18n';

const LOCAL_STORAGE_KEY = 'dashboard_user_preferences_v1';

const initialPreferences: UserPreferences = {
  categories: ['technology', 'finance', 'sports', 'entertainment', 'science', 'health', 'gaming'],
  preferredContentTypes: ['news', 'recommendation', 'social'],
  theme: 'dark',
  viewMode: 'grid',
  enableRealtimeUpdates: true,
  language: 'en',
  displayDensity: 'comfortable',
};

const loadInitialPreferences = (): UserPreferences => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return { ...initialPreferences, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse preferences from localStorage:', e);
    }
  }
  return initialPreferences;
};

const savePreferencesToStorage = (state: UserPreferences) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save preferences to localStorage:', e);
    }
  }
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: loadInitialPreferences(),
  reducers: {
    toggleCategory: (state, action: PayloadAction<Category>) => {
      const cat = action.payload;
      if (state.categories.includes(cat)) {
        if (state.categories.length > 1) {
          state.categories = state.categories.filter((c) => c !== cat);
        }
      } else {
        state.categories.push(cat);
      }
      savePreferencesToStorage(state);
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      savePreferencesToStorage(state);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
      savePreferencesToStorage(state);
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
      savePreferencesToStorage(state);
    },
    setEnableRealtimeUpdates: (state, action: PayloadAction<boolean>) => {
      state.enableRealtimeUpdates = action.payload;
      savePreferencesToStorage(state);
    },
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.language = action.payload;
      savePreferencesToStorage(state);
    },
    setApiKeys: (state, action: PayloadAction<{ newsApiKey?: string; tmdbApiKey?: string }>) => {
      state.newsApiKey = action.payload.newsApiKey;
      state.tmdbApiKey = action.payload.tmdbApiKey;
      savePreferencesToStorage(state);
    },
    resetPreferences: (state) => {
      Object.assign(state, initialPreferences);
      savePreferencesToStorage(state);
    },
  },
});

export const {
  toggleCategory,
  setCategories,
  setTheme,
  setViewMode,
  setEnableRealtimeUpdates,
  setLanguage,
  setApiKeys,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
