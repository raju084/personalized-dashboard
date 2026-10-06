import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import preferencesReducer from './preferencesSlice';
import feedReducer from './feedSlice';
import favoritesReducer from './favoritesSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    feed: feedReducer,
    favorites: favoritesReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
