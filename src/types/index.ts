export type ContentType = 'news' | 'recommendation' | 'social';

export type Category = 
  | 'technology' 
  | 'finance' 
  | 'sports' 
  | 'entertainment' 
  | 'science' 
  | 'health' 
  | 'gaming';

export interface Author {
  name: string;
  avatar: string;
  handle?: string;
  verified?: boolean;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  category: Category;
  title: string;
  description: string;
  content?: string;
  url?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  author: Author;
  publishedAt: string;
  readTimeOrDuration?: string;
  rating?: number;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  isTrending?: boolean;
  tags: string[];
  sourceName: string;
}

export interface UserPreferences {
  categories: Category[];
  preferredContentTypes: ContentType[];
  theme: 'light' | 'dark' | 'system';
  viewMode: 'grid' | 'list';
  enableRealtimeUpdates: boolean;
  language: 'en' | 'es' | 'fr' | 'de';
  displayDensity: 'comfortable' | 'compact';
  newsApiKey?: string;
  tmdbApiKey?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  isAuthenticated: boolean;
}

export interface SearchState {
  query: string;
  category: Category | 'all';
  type: ContentType | 'all';
}
