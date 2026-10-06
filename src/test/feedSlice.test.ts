import { describe, it, expect } from 'vitest';
import feedReducer, {
  setSearchQuery,
  setActiveContentType,
  reorderItems,
  prependRealtimeItem,
} from '@/store/feedSlice';
import { ContentItem } from '@/types';

describe('feedSlice Reducer & Logic', () => {
  const initialState = {
    items: [
      { id: '1', title: 'Item 1', type: 'news', category: 'technology' } as ContentItem,
      { id: '2', title: 'Item 2', type: 'social', category: 'finance' } as ContentItem,
    ],
    status: 'idle' as const,
    error: null,
    page: 1,
    hasMore: true,
    activeContentType: 'all' as const,
    searchQuery: '',
    selectedCategory: 'all' as const,
    selectedItemForModal: null,
    realtimeNotificationsCount: 0,
  };

  it('should set search query', () => {
    const state = feedReducer(initialState, setSearchQuery('quantum'));
    expect(state.searchQuery).toBe('quantum');
  });

  it('should filter active content type', () => {
    const state = feedReducer(initialState, setActiveContentType('news'));
    expect(state.activeContentType).toBe('news');
  });

  it('should reorder items in state', () => {
    const reordered = [initialState.items[1], initialState.items[0]];
    const state = feedReducer(initialState, reorderItems(reordered));
    expect(state.items[0].id).toBe('2');
    expect(state.items[1].id).toBe('1');
  });

  it('should prepend real-time stream item and increment badge counter', () => {
    const newItem: ContentItem = {
      id: 'realtime-999',
      title: 'Live Post',
      type: 'social',
      category: 'technology',
      description: 'Streamed live',
      author: { name: 'Bot', avatar: '' },
      publishedAt: new Date().toISOString(),
      tags: [],
      sourceName: 'Live',
    };

    const state = feedReducer(initialState, prependRealtimeItem(newItem));
    expect(state.items[0].id).toBe('realtime-999');
    expect(state.realtimeNotificationsCount).toBe(1);
  });
});
