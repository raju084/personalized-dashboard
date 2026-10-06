'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { UserProfileModal } from '@/components/auth/UserProfileModal';
import { useAppSelector } from '@/store';
import { BarChart3, TrendingUp, Eye, Heart, MessageSquare, Zap, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const items = useAppSelector((state) => state.feed.items);
  const preferences = useAppSelector((state) => state.preferences);

  // Calculate statistics
  const totalItems = items.length;
  const newsCount = items.filter((i) => i.type === 'news').length;
  const recCount = items.filter((i) => i.type === 'recommendation').length;
  const socialCount = items.filter((i) => i.type === 'social').length;
  const totalLikes = items.reduce((acc, i) => acc + (i.likesCount || 0), 0);

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
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                Content Analytics & Insights
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Live metrics, category distribution, and engagement stats.
              </p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Total Streamed Items</span>
                <Eye className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalItems}</div>
              <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14% vs yesterday
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Total Engagement (Likes)</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalLikes.toLocaleString()}</div>
              <div className="text-[11px] text-indigo-500 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> High engagement rate
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Active Categories</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{preferences.categories.length}</div>
              <div className="text-[11px] text-slate-400 font-medium">Selected in settings</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Feed Stream Status</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-2xl font-black text-emerald-500">
                {preferences.enableRealtimeUpdates ? 'LIVE' : 'PAUSED'}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">WebSocket Simulator</div>
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Content Type Breakdown</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>News Articles ({newsCount})</span>
                  <span>{totalItems ? Math.round((newsCount / totalItems) * 100) : 0}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${totalItems ? (newsCount / totalItems) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Recommendations ({recCount})</span>
                  <span>{totalItems ? Math.round((recCount / totalItems) * 100) : 0}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${totalItems ? (recCount / totalItems) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Social Media Posts ({socialCount})</span>
                  <span>{totalItems ? Math.round((socialCount / totalItems) * 100) : 0}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${totalItems ? (socialCount / totalItems) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
