'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ContentCard } from '@/components/feed/ContentCard';
import { ContentModal } from '@/components/feed/ContentModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { UserProfileModal } from '@/components/auth/UserProfileModal';
import { useAppSelector } from '@/store';
import { Flame, Sparkles } from 'lucide-react';

export default function TrendingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const items = useAppSelector((state) => state.feed.items);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);

  // Filter trending items or fallback to top items
  const trendingItems = items.filter((item) => item.isTrending || (item.likesCount && item.likesCount > 500));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                Trending Section
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Top viral stories, breaking movies, and social posts across all categories.
              </p>
            </div>
          </div>

          <div
            className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {trendingItems.map((item) => (
              <ContentCard key={item.id} item={item} viewMode={viewMode} />
            ))}
          </div>
        </main>
      </div>

      <ContentModal />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
