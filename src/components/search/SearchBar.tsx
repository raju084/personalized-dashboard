'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSearchQuery, fetchFeedContent, resetFeedPage } from '@/store/feedSlice';
import { getTranslation } from '@/services/i18n';
import { Category, ContentType } from '@/types';

export function SearchBar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const language = preferences.language;
  const currentQuery = useAppSelector((state) => state.feed.searchQuery);

  const [inputVal, setInputVal] = useState(currentQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce logic (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputVal !== currentQuery) {
        dispatch(setSearchQuery(inputVal));
        dispatch(resetFeedPage());
        dispatch(fetchFeedContent({ preferences, page: 1, searchQuery: inputVal }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputVal, currentQuery, dispatch, preferences]);

  const handleClear = () => {
    setInputVal('');
    dispatch(setSearchQuery(''));
    dispatch(resetFeedPage());
    dispatch(fetchFeedContent({ preferences, page: 1, searchQuery: '' }));
  };

  return (
    <div className="relative w-full max-w-xl">
      <div
        className={`relative flex items-center w-full rounded-2xl transition-all duration-200 ${
          isFocused
            ? 'ring-2 ring-indigo-500/50 bg-white dark:bg-slate-900 shadow-lg shadow-indigo-500/10'
            : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800'
        } border border-slate-200/80 dark:border-slate-700/60`}
      >
        <Search className="w-4 h-4 ml-4 text-slate-400 dark:text-slate-500 shrink-0" />
        <input
          id="dashboard-search-input"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={getTranslation(language, 'searchPlaceholder')}
          className="w-full py-2.5 px-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        {inputVal && (
          <button
            onClick={handleClear}
            className="p-1 mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-2 mr-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-xl transition-colors shrink-0"
            title="Filters & Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
