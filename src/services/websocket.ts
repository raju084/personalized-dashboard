import { ContentItem } from '@/types';
import { REALTIME_NEW_ITEMS_POOL } from './mockData';

type Listener = (item: ContentItem) => void;

class RealtimeFeedSimulator {
  private listeners: Listener[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private poolIndex = 0;

  public subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: Listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  public start(intervalMs: number = 15000) {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      if (this.listeners.length === 0) return;

      const template = REALTIME_NEW_ITEMS_POOL[this.poolIndex % REALTIME_NEW_ITEMS_POOL.length];
      this.poolIndex++;

      const newItem: ContentItem = {
        id: `realtime-${Date.now()}`,
        type: template.type || 'social',
        category: template.category || 'technology',
        title: template.title || 'Breaking Update',
        description: template.description || 'Just in from live feed...',
        imageUrl: template.imageUrl,
        videoUrl: template.videoUrl,
        audioUrl: template.audioUrl,
        author: template.author || {
          name: 'Live Stream Bot',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        },
        publishedAt: new Date().toISOString(),
        readTimeOrDuration: template.readTimeOrDuration || '1 min read',
        likesCount: template.likesCount || 10,
        commentsCount: template.commentsCount || 2,
        sharesCount: template.sharesCount || 5,
        rating: template.rating,
        tags: template.tags || ['Live'],
        sourceName: template.sourceName || 'Real-time Stream',
      };

      this.listeners.forEach((listener) => listener(newItem));
    }, intervalMs);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const realtimeSimulator = new RealtimeFeedSimulator();
