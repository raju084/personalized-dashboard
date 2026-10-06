import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, ContentType, Category, UserPreferences } from '@/types';
import { fetchPersonalizedContent } from '@/services/api';

interface FeedState {
  items: ContentItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  hasMore: boolean;
  activeContentType: ContentType | 'all';
  searchQuery: string;
  selectedCategory: Category | 'all';
  selectedItemForModal: ContentItem | null;
  realtimeNotificationsCount: number;
}

const initialState: FeedState = {
  items: [],
  status: 'idle',
  error: null,
  page: 1,
  hasMore: true,
  activeContentType: 'all',
  searchQuery: '',
  selectedCategory: 'all',
  selectedItemForModal: null,
  realtimeNotificationsCount: 0,
};

export const fetchFeedContent = createAsyncThunk(
  'feed/fetchFeedContent',
  async (
    {
      preferences,
      page = 1,
      searchQuery = '',
    }: {
      preferences: UserPreferences;
      page?: number;
      searchQuery?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchPersonalizedContent(preferences, page, 8, searchQuery);
      return { ...data, page };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch personalized content');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveContentType: (state, action: PayloadAction<ContentType | 'all'>) => {
      state.activeContentType = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | 'all'>) => {
      state.selectedCategory = action.payload;
    },
    reorderItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
    },
    prependRealtimeItem: (state, action: PayloadAction<ContentItem>) => {
      // Avoid duplicate IDs
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.unshift(action.payload);
        state.realtimeNotificationsCount += 1;
      }
    },
    clearRealtimeBadge: (state) => {
      state.realtimeNotificationsCount = 0;
    },
    setSelectedItemForModal: (state, action: PayloadAction<ContentItem | null>) => {
      state.selectedItemForModal = action.payload;
    },
    resetFeedPage: (state) => {
      state.page = 1;
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedContent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFeedContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.page === 1) {
          state.items = action.payload.items;
        } else {
          // Append new items avoiding duplicates
          const existingIds = new Set(state.items.map((i) => i.id));
          const newItems = action.payload.items.filter((i) => !existingIds.has(i.id));
          state.items = [...state.items, ...newItems];
        }
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page;
      })
      .addCase(fetchFeedContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Error loading content';
      });
  },
});

export const {
  setSearchQuery,
  setActiveContentType,
  setSelectedCategory,
  reorderItems,
  prependRealtimeItem,
  clearRealtimeBadge,
  setSelectedItemForModal,
  resetFeedPage,
} = feedSlice.actions;

export default feedSlice.reducer;
