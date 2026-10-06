import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/types';

const FAVORITES_STORAGE_KEY = 'dashboard_favorites_items_v1';

interface FavoritesState {
  favoriteIds: string[];
  favoriteItems: ContentItem[];
}

const loadInitialFavorites = (): FavoritesState => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          favoriteIds: parsed.favoriteIds || [],
          favoriteItems: parsed.favoriteItems || [],
        };
      }
    } catch (e) {
      console.warn('Failed to load favorites from localStorage:', e);
    }
  }
  return { favoriteIds: [], favoriteItems: [] };
};

const saveFavoritesToStorage = (state: FavoritesState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage:', e);
    }
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: loadInitialFavorites(),
  reducers: {
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      const index = state.favoriteIds.indexOf(item.id);
      if (index >= 0) {
        state.favoriteIds.splice(index, 1);
        state.favoriteItems = state.favoriteItems.filter((i) => i.id !== item.id);
      } else {
        state.favoriteIds.push(item.id);
        state.favoriteItems.unshift(item);
      }
      saveFavoritesToStorage(state);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.favoriteIds = state.favoriteIds.filter((i) => i !== id);
      state.favoriteItems = state.favoriteItems.filter((i) => i.id !== id);
      saveFavoritesToStorage(state);
    },
    clearFavorites: (state) => {
      state.favoriteIds = [];
      state.favoriteItems = [];
      saveFavoritesToStorage(state);
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
