'use client';

import React, { useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
  LayoutGrid,
  List,
  RefreshCw,
  Sparkles,
  Newspaper,
  Film,
  MessageSquare,
  SlidersHorizontal,
  ArrowUpRight,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchFeedContent,
  reorderItems,
  setActiveContentType,
  setSelectedCategory,
} from '@/store/feedSlice';
import { setViewMode } from '@/store/preferencesSlice';
import { ContentCard } from './ContentCard';
import { ContentItem, ContentType, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { getTranslation } from '@/services/i18n';

interface ContentFeedProps {
  onOpenSettings?: () => void;
}

export function ContentFeed({ onOpenSettings }: ContentFeedProps) {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const feed = useAppSelector((state) => state.feed);
  const language = preferences.language;

  useEffect(() => {
    dispatch(
      fetchFeedContent({
        preferences,
        page: 1,
        searchQuery: feed.searchQuery,
      })
    );
  }, [dispatch, preferences.categories, preferences.newsApiKey]);

  // Filter items based on active ContentType and selectedCategory
  const filteredItems = feed.items.filter((item) => {
    const matchesType =
      feed.activeContentType === 'all' || item.type === feed.activeContentType;
    const matchesCategory =
      feed.selectedCategory === 'all' || item.category === feed.selectedCategory;
    return matchesType && matchesCategory;
  });

  const handleReorder = (newOrder: ContentItem[]) => {
    dispatch(reorderItems(newOrder));
  };

  const handleLoadMore = () => {
    if (feed.hasMore && feed.status !== 'loading') {
      dispatch(
        fetchFeedContent({
          preferences,
          page: feed.page + 1,
          searchQuery: feed.searchQuery,
        })
      );
    }
  };

  const contentTypeTabs: { id: ContentType | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: getTranslation(language, 'allTypes'), icon: Sparkles },
    { id: 'news', label: getTranslation(language, 'news'), icon: Newspaper },
    { id: 'recommendation', label: getTranslation(language, 'recommendations'), icon: Film },
    { id: 'social', label: getTranslation(language, 'social'), icon: MessageSquare },
  ];

  const categoryPills: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: getTranslation(language, 'allCategories') },
    { id: 'technology', label: 'Technology' },
    { id: 'finance', label: 'Finance' },
    { id: 'sports', label: 'Sports' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'science', label: 'Science' },
    { id: 'health', label: 'Health' },
    { id: 'gaming', label: 'Gaming' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls: Content Type Tabs & Grid/List View Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3 rounded-2xl">
        {/* Content Type Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {contentTypeTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = feed.activeContentType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch(setActiveContentType(tab.id))}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle (Grid vs List) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => dispatch(setViewMode('grid'))}
            className={`p-1.5 rounded-lg transition-colors ${
              preferences.viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(setViewMode('list'))}
            className={`p-1.5 rounded-lg transition-colors ${
              preferences.viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary Category Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categoryPills.map((cat) => {
          const isActive = feed.selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => dispatch(setSelectedCategory(cat.id))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton Grid */}
      {feed.status === 'loading' && feed.items.length === 0 && (
        <div
          className={`grid gap-6 ${
            preferences.viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty Feed State */}
      {feed.status !== 'loading' && filteredItems.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {getTranslation(language, 'emptyFeedTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              {getTranslation(language, 'emptyFeedSubtitle')}
            </p>
          </div>
          {onOpenSettings && (
            <Button variant="outline" size="sm" onClick={onOpenSettings} className="mx-auto">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Adjust Settings</span>
            </Button>
          )}
        </div>
      )}

      {/* Interactive Reorderable Content Cards Grid / List */}
      {filteredItems.length > 0 && (
        <Reorder.Group
          axis="y"
          values={filteredItems}
          onReorder={handleReorder}
          className={`grid gap-6 ${
            preferences.viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {filteredItems.map((item) => (
            <Reorder.Item key={item.id} value={item} className="focus:outline-none">
              <ContentCard item={item} viewMode={preferences.viewMode} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Infinite Scroll / Pagination Controls */}
      {feed.hasMore && (
        <div className="pt-6 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            isLoading={feed.status === 'loading'}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${feed.status === 'loading' ? 'animate-spin' : ''}`} />
            <span>Load More Articles</span>
          </Button>
        </div>
      )}
    </div>
  );
}
