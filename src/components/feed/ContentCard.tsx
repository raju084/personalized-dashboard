'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GripVertical,
  Bookmark,
  BookmarkCheck,
  Heart,
  MessageCircle,
  Share2,
  Play,
  ExternalLink,
  BookOpen,
  Star,
  Check,
} from 'lucide-react';
import { ContentItem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleFavorite } from '@/store/favoritesSlice';
import { setSelectedItemForModal } from '@/store/feedSlice';
import { getTranslation } from '@/services/i18n';
import { showToast } from '@/components/ui/Toast';

interface ContentCardProps {
  item: ContentItem;
  viewMode?: 'grid' | 'list';
  dragHandleProps?: any;
}

export function ContentCard({ item, viewMode = 'grid', dragHandleProps }: ContentCardProps) {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const language = useAppSelector((state) => state.preferences.language);
  const isFavorite = favoriteIds.includes(item.id);

  const [likesCount, setLikesCount] = useState(item.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
    showToast(
      isFavorite ? 'Removed from favorites' : 'Saved to favorites!',
      isFavorite ? 'warning' : 'success'
    );
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.url || window.location.href);
      setCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openModal = () => {
    dispatch(setSelectedItemForModal(item));
  };

  const isList = viewMode === 'list';

  return (
    <div
      onClick={openModal}
      className={`group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex ${
        isList ? 'flex-col sm:flex-row' : 'flex-col'
      }`}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 left-3 z-20 p-1.5 rounded-lg bg-slate-900/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        title={getTranslation(language, 'reorderFeed')}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Favorite Bookmark Button */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all ${
          isFavorite
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
            : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
        }`}
        title={getTranslation(language, isFavorite ? 'saved' : 'saveFavorite')}
      >
        {isFavorite ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      </button>

      {/* Card Image / Media Preview */}
      {item.imageUrl && (
        <div
          className={`relative overflow-hidden ${
            isList ? 'sm:w-64 h-48 sm:h-auto shrink-0' : 'w-full h-48'
          }`}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Category Badge overlay */}
          <div className="absolute bottom-3 left-3">
            <Badge variant={item.category as any}>{item.category.toUpperCase()}</Badge>
          </div>

          {/* Rating or Duration overlay */}
          {item.rating && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-xs font-bold backdrop-blur-md">
              <Star className="w-3 h-3 fill-current" />
              <span>{item.rating}</span>
            </div>
          )}
        </div>
      )}

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {item.author.name}
              </span>
              {item.author.handle && (
                <span className="text-[11px] text-slate-400 font-normal">
                  {item.author.handle}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">{item.sourceName}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Action Buttons & Tags */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          {/* Social Stats / CTA */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {item.type === 'social' ? (
              <>
                <button
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1 transition-colors ${
                    hasLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </button>
                <div className="flex items-center gap-1 hover:text-indigo-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>{item.commentsCount || 0}</span>
                </div>
              </>
            ) : item.type === 'recommendation' ? (
              <Button size="sm" variant="primary" onClick={openModal}>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{getTranslation(language, 'playNow')}</span>
              </Button>
            ) : (
              <Button size="sm" variant="secondary" onClick={openModal}>
                <BookOpen className="w-3.5 h-3.5" />
                <span>{getTranslation(language, 'readMore')}</span>
              </Button>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Share"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
