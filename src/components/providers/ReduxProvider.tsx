'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from '@/store';
import { realtimeSimulator } from '@/services/websocket';
import { prependRealtimeItem } from '@/store/feedSlice';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { getTranslation } from '@/services/i18n';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);
  const enableRealtime = useAppSelector((state) => state.preferences.enableRealtimeUpdates);
  const language = useAppSelector((state) => state.preferences.language);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize Dark Mode class on document HTML tag
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme, mounted]);

  // Real-time Feed update subscription
  useEffect(() => {
    if (!enableRealtime) {
      realtimeSimulator.stop();
      return;
    }

    const handleRealtimeItem = (item: any) => {
      dispatch(prependRealtimeItem(item));
      showToast(
        `${getTranslation(language, 'realtimeAlert')}: ${item.title}`,
        'info'
      );
    };

    realtimeSimulator.subscribe(handleRealtimeItem);
    realtimeSimulator.start(12000); // Trigger every 12 seconds for active demo experience

    return () => {
      realtimeSimulator.unsubscribe(handleRealtimeItem);
      realtimeSimulator.stop();
    };
  }, [enableRealtime, dispatch, language]);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
}
