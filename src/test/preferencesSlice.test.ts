import { describe, it, expect } from 'vitest';
import preferencesReducer, {
  toggleCategory,
  setTheme,
  setViewMode,
  setLanguage,
} from '@/store/preferencesSlice';

describe('preferencesSlice Reducer', () => {
  const initialState = {
    categories: ['technology', 'finance'] as any[],
    preferredContentTypes: ['news'] as any[],
    theme: 'dark' as const,
    viewMode: 'grid' as const,
    enableRealtimeUpdates: true,
    language: 'en' as const,
    displayDensity: 'comfortable' as const,
  };

  it('should toggle categories correctly', () => {
    // Toggling existing category removes it
    let state = preferencesReducer(initialState, toggleCategory('finance'));
    expect(state.categories).toEqual(['technology']);

    // Toggling new category adds it
    state = preferencesReducer(state, toggleCategory('sports'));
    expect(state.categories).toEqual(['technology', 'sports']);
  });

  it('should update theme preference', () => {
    const state = preferencesReducer(initialState, setTheme('light'));
    expect(state.theme).toBe('light');
  });

  it('should update view mode preference (grid/list)', () => {
    const state = preferencesReducer(initialState, setViewMode('list'));
    expect(state.viewMode).toBe('list');
  });

  it('should update language preference', () => {
    const state = preferencesReducer(initialState, setLanguage('es'));
    expect(state.language).toBe('es');
  });
});
