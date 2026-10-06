'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setCategories,
  setTheme,
  setLanguage,
  setEnableRealtimeUpdates,
  setApiKeys,
  resetPreferences,
} from '@/store/preferencesSlice';
import { SupportedLanguage, getTranslation } from '@/services/i18n';
import { Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { Sliders, Sun, Moon, Key, Radio, Languages, RotateCcw, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const language = preferences.language;

  const [selectedCats, setSelectedCats] = useState<Category[]>(preferences.categories);
  const [newsKey, setNewsKey] = useState(preferences.newsApiKey || '');
  const [tmdbKey, setTmdbKey] = useState(preferences.tmdbApiKey || '');

  const availableCategories: { id: Category; label: string }[] = [
    { id: 'technology', label: 'Technology' },
    { id: 'finance', label: 'Finance' },
    { id: 'sports', label: 'Sports' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'science', label: 'Science' },
    { id: 'health', label: 'Health' },
    { id: 'gaming', label: 'Gaming' },
  ];

  const languages: { id: SupportedLanguage; label: string }[] = [
    { id: 'en', label: 'English 🇺🇸' },
    { id: 'es', label: 'Español 🇪🇸' },
    { id: 'fr', label: 'Français 🇫🇷' },
    { id: 'de', label: 'Deutsch 🇩🇪' },
  ];

  const handleToggleCat = (catId: Category) => {
    if (selectedCats.includes(catId)) {
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter((c) => c !== catId));
      }
    } else {
      setSelectedCats([...selectedCats, catId]);
    }
  };

  const handleSave = () => {
    dispatch(setCategories(selectedCats));
    dispatch(setApiKeys({ newsApiKey: newsKey.trim(), tmdbApiKey: tmdbKey.trim() }));
    showToast(getTranslation(language, 'preferencesSaved'), 'success');
    onClose();
  };

  const handleReset = () => {
    dispatch(resetPreferences());
    setSelectedCats(['technology', 'finance', 'sports', 'entertainment', 'science', 'health', 'gaming']);
    setNewsKey('');
    setTmdbKey('');
    showToast('Preferences reset to default.', 'info');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTranslation(language, 'settings')} maxWidth="xl">
      <div className="space-y-6">
        {/* 1. Category Preferences */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>Content Category Preferences</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const isChecked = selectedCats.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleToggleCat(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isChecked
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Language Selection */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-500" />
            <span>Internationalization (Language)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => dispatch(setLanguage(lang.id))}
                className={`px-3 py-2 rounded-xl text-xs font-medium text-center border transition-all ${
                  preferences.language === lang.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Real-time Stream Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Real-Time Updates (WebSocket Stream)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Periodically fetch live breaking news and social posts into feed.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={preferences.enableRealtimeUpdates}
            onChange={(e) => dispatch(setEnableRealtimeUpdates(e.target.checked))}
            className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
          />
        </div>

        {/* 4. Custom API Keys */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-500" />
            <span>Optional API Keys (Live NewsAPI / TMDB)</span>
          </label>
          <div className="space-y-2">
            <input
              type="password"
              value={newsKey}
              onChange={(e) => setNewsKey(e.target.value)}
              placeholder="Enter NewsAPI Key (Optional)"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
