'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSelectedItemForModal } from '@/store/feedSlice';
import { toggleFavorite } from '@/store/favoritesSlice';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Heart, Bookmark, Share2, Send, Star, ExternalLink, Play, MessageSquare } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export function ContentModal() {
  const dispatch = useAppDispatch();
  const selectedItem = useAppSelector((state) => state.feed.selectedItemForModal);
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const user = useAppSelector((state) => state.auth);

  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<string[]>([
    'Incredible insights! Thanks for sharing this detailed breakdown.',
    'Very well written and highly relevant to current industry trends.',
  ]);

  if (!selectedItem) return null;

  const isFavorite = favoriteIds.includes(selectedItem.id);

  const handleClose = () => {
    dispatch(setSelectedItemForModal(null));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList([commentText.trim(), ...commentsList]);
    setCommentText('');
    showToast('Comment added successfully!', 'success');
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(selectedItem));
    showToast(
      isFavorite ? 'Removed from favorites' : 'Saved to favorites!',
      isFavorite ? 'warning' : 'success'
    );
  };

  return (
    <Modal isOpen={!!selectedItem} onClose={handleClose} maxWidth="2xl">
      <div className="space-y-6">
        {/* Media Preview (Video / Image / Audio) */}
        {selectedItem.videoUrl ? (
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
            <video
              src={selectedItem.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        ) : selectedItem.imageUrl ? (
          <div className="relative h-64 w-full rounded-xl overflow-hidden">
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.title}
              className="w-full h-full object-cover"
            />
            {selectedItem.audioUrl && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center">
                <audio src={selectedItem.audioUrl} controls autoPlay className="w-4/5" />
              </div>
            )}
          </div>
        ) : null}

        {/* Categories & Metadata Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={selectedItem.category as any}>{selectedItem.category.toUpperCase()}</Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">{selectedItem.sourceName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            {selectedItem.url && (
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Open original source link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
          {selectedItem.title}
        </h2>

        {/* Author details */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <img
            src={selectedItem.author.avatar}
            alt={selectedItem.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {selectedItem.author.name}
            </h4>
            <p className="text-xs text-slate-400">
              {selectedItem.author.handle || 'Content Creator'} • Published{' '}
              {new Date(selectedItem.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-3">
          <p>{selectedItem.description}</p>
          {selectedItem.content && <p>{selectedItem.content}</p>}
        </div>

        {/* Tag Pills */}
        {selectedItem.tags && selectedItem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedItem.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Interactive Comment Section */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span>Discussion & Feedback ({commentsList.length})</span>
          </h3>

          {/* Add comment form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your thoughts..."
              className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="submit" size="sm">
              <Send className="w-4 h-4" />
              <span>Post</span>
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {commentsList.map((comm, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{user.name}</div>
                {comm}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
