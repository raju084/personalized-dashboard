'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateProfile, logout, login } from '@/store/authSlice';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { User, Mail, Shield, LogOut, LogIn, Check } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        name,
        email,
        bio,
        avatar: selectedAvatar,
      })
    );
    showToast('Profile updated successfully!', 'success');
    onClose();
  };

  const handleLogoutToggle = () => {
    if (user.isAuthenticated) {
      dispatch(logout());
      showToast('Logged out of account.', 'warning');
    } else {
      dispatch(login({ name: 'Alex Johnson', email: 'alex.johnson@example.com' }));
      showToast('Logged in successfully!', 'success');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile & Account" maxWidth="md">
      <form onSubmit={handleSave} className="space-y-5">
        {/* Avatar Selection */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={selectedAvatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
          />
          <div className="flex gap-2">
            {avatarPresets.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedAvatar(imgUrl)}
                className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                  selectedAvatar === imgUrl ? 'border-indigo-600 scale-110' : 'border-transparent opacity-60'
                }`}
              >
                <img src={imgUrl} alt="Preset" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bio / Headline</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Auth status bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {user.isAuthenticated ? 'Account Active' : 'Logged Out'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogoutToggle}
            className="text-xs text-rose-500 font-semibold hover:underline flex items-center gap-1"
          >
            {user.isAuthenticated ? (
              <>
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" /> Log In
              </>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Save Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}
