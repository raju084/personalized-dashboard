import { ContentItem, Category, UserPreferences } from '@/types';
import { INITIAL_MOCK_ITEMS } from './mockData';

export async function fetchPersonalizedContent(
  preferences: UserPreferences,
  page: number = 1,
  pageSize: number = 8,
  searchQuery: string = ''
): Promise<{ items: ContentItem[]; hasMore: boolean; total: number }> {
  // Simulate network latency (250ms) for realistic UX & skeleton loading
  await new Promise((resolve) => setTimeout(resolve, 300));

  let itemsPool = [...INITIAL_MOCK_ITEMS];

  // If user provided a custom NewsAPI key in settings, attempt real fetch and merge
  if (preferences.newsApiKey) {
    try {
      const activeCategory = preferences.categories[0] || 'general';
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${activeCategory}&apiKey=${preferences.newsApiKey}&pageSize=5`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles)) {
          const liveNewsItems: ContentItem[] = data.articles.map((art: any, index: number) => ({
            id: `live-news-${index}-${Date.now()}`,
            type: 'news' as const,
            category: (preferences.categories[0] || 'technology') as Category,
            title: art.title || 'Breaking News',
            description: art.description || 'No description available.',
            content: art.content || art.description || '',
            url: art.url,
            imageUrl: art.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
            author: {
              name: art.author || art.source?.name || 'News Desk',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            },
            publishedAt: art.publishedAt || new Date().toISOString(),
            readTimeOrDuration: '3 min read',
            tags: ['LiveNews', preferences.categories[0] || 'General'],
            sourceName: art.source?.name || 'Live News API',
          }));
          itemsPool = [...liveNewsItems, ...itemsPool];
        }
      }
    } catch (e) {
      console.warn('NewsAPI fetch error (falling back to mock):', e);
    }
  }

  // 1. Filter by preferred categories
  let filtered = itemsPool;
  if (preferences.categories && preferences.categories.length > 0) {
    filtered = filtered.filter((item) => preferences.categories.includes(item.category));
  }

  // 2. Filter by search query if any
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        item.author.name.toLowerCase().includes(q)
    );
  }

  // 3. Handle Pagination
  const startIndex = 0;
  const endIndex = page * pageSize;
  const paginatedItems = filtered.slice(startIndex, endIndex);
  const hasMore = endIndex < filtered.length;

  return {
    items: paginatedItems,
    hasMore,
    total: filtered.length,
  };
}
