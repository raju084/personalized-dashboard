'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'tech' | 'finance' | 'sports' | 'entertainment' | 'science' | 'health' | 'gaming';
  className?: string;
  onClick?: () => void;
}

export function Badge({ children, variant = 'primary', className, onClick }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all select-none';

  const categoryStyles: Record<string, string> = {
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
    secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400',
    technology: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    sports: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    science: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800',
    health: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    gaming: 'bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 border border-violet-200 dark:border-violet-800',
  };

  const styleClass = categoryStyles[variant] || categoryStyles.primary;

  return (
    <span
      onClick={onClick}
      className={twMerge(
        clsx(
          baseStyles,
          styleClass,
          onClick && 'cursor-pointer hover:opacity-80 active:scale-95',
          className
        )
      )}
    >
      {children}
    </span>
  );
}
