'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Flame,
  Bookmark,
  BarChart3,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Film,
  MessageSquare,
  Sparkles,
  Radio,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getTranslation } from '@/services/i18n';
import { toggleCategory } from '@/store/preferencesSlice';
import { Category } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ isOpen, onCloseMobile, onOpenSettings }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const favoriteCount = useAppSelector((state) => state.favorites.favoriteIds.length);
  const language = preferences.language;

  const navItems = [
    {
      label: getTranslation(language, 'personalizedFeed'),
      href: '/',
      icon: LayoutDashboard,
    },
    {
      label: getTranslation(language, 'trending'),
      href: '/trending',
      icon: Flame,
      badge: 'Hot',
    },
    {
      label: getTranslation(language, 'favorites'),
      href: '/favorites',
      icon: Bookmark,
      count: favoriteCount,
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
  ];

  const allCategories: { id: Category; label: string; color: string }[] = [
    { id: 'technology', label: 'Technology', color: 'bg-blue-500' },
    { id: 'finance', label: 'Finance', color: 'bg-emerald-500' },
    { id: 'sports', label: 'Sports', color: 'bg-amber-500' },
    { id: 'entertainment', label: 'Entertainment', color: 'bg-purple-500' },
    { id: 'science', label: 'Science', color: 'bg-cyan-500' },
    { id: 'health', label: 'Health', color: 'bg-rose-500' },
    { id: 'gaming', label: 'Gaming', color: 'bg-violet-500' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Top Header Logo on Sidebar */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">Pulse Dashboard</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Category Filter Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between px-3">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Favorite Categories
              </span>
              <button
                onClick={onOpenSettings}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="space-y-1">
              {allCategories.map((cat) => {
                const isSelected = preferences.categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => dispatch(toggleCategory(cat.id))}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                      <span>{cat.label}</span>
                    </div>
                    {isSelected && <span className="text-[10px] text-indigo-500 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>{getTranslation(language, 'settings')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
