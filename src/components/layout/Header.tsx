'use client';

import React from 'react';
import { Sun, Moon, Bell, SlidersHorizontal, User, Sparkles, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setTheme } from '@/store/preferencesSlice';
import { clearRealtimeBadge } from '@/store/feedSlice';
import { SearchBar } from '@/components/search/SearchBar';
import { getTranslation } from '@/services/i18n';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onToggleSidebar: () => void;
}

export function Header({ onOpenSettings, onOpenProfile, onToggleSidebar }: HeaderProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);
  const language = useAppSelector((state) => state.preferences.language);
  const user = useAppSelector((state) => state.auth);
  const realtimeNotificationsCount = useAppSelector((state) => state.feed.realtimeNotificationsCount);

  const toggleThemeMode = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Mobile Menu & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
              Pulse
            </h1>
            <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Center Debounced Search Bar */}
      <div className="flex-1 max-w-xl mx-2">
        <SearchBar onOpenSettings={onOpenSettings} />
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Real-time Notifications Bell */}
        <button
          onClick={() => dispatch(clearRealtimeBadge())}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {realtimeNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {realtimeNotificationsCount > 9 ? '9+' : realtimeNotificationsCount}
            </span>
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleThemeMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? getTranslation(language, 'lightTheme') : getTranslation(language, 'darkTheme')}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="hidden sm:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={getTranslation(language, 'settings')}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-indigo-500/50 transition-all"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
