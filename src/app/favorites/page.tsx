'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ContentCard } from '@/components/feed/ContentCard';
import { ContentModal } from '@/components/feed/ContentModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { UserProfileModal } from '@/components/auth/UserProfileModal';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearFavorites } from '@/store/favoritesSlice';
import { Bookmark, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const favoriteItems = useAppSelector((state) => state.favorites.favoriteItems);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Bookmark className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  Favorites Collection
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Saved articles, recommendations, and posts bookmarked for offline reading.
                </p>
              </div>
            </div>

            {favoriteItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(clearFavorites())}
                className="text-rose-500 hover:text-rose-600 border-rose-200 dark:border-rose-900/50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Favorites</span>
              </Button>
            )}
          </div>

          {favoriteItems.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-500 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Favorites Saved Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the bookmark icon on any content card in your feed to save it here for quick access.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
            >
              {favoriteItems.map((item) => (
                <ContentCard key={item.id} item={item} viewMode={viewMode} />
              ))}
            </div>
          )}
        </main>
      </div>

      <ContentModal />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
