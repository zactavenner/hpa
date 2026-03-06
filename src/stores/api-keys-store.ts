'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiKey, ApiKeyRotationConfig } from '@/types';
import {
  createDefaultKey,
  getNextKey,
  updateKeyAfterUse,
  updateKeyRateLimit,
  DEFAULT_CONFIG,
} from '@/lib/api-key-rotation';

interface ApiKeysState {
  keys: ApiKey[];
  config: ApiKeyRotationConfig;
  addKey: (name: string, key: string, provider: ApiKey['provider']) => boolean;
  removeKey: (id: string) => void;
  toggleKey: (id: string) => void;
  getActiveKey: () => ApiKey | null;
  markKeyUsed: (id: string) => void;
  setRateLimit: (id: string, remaining: number, resetAt: number) => void;
  updateConfig: (updates: Partial<ApiKeyRotationConfig>) => void;
  getKeyStats: () => { total: number; active: number; rateLimited: number };
}

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set, get) => ({
      keys: [],
      config: DEFAULT_CONFIG,

      addKey: (name, key, provider) => {
        const { keys } = get();
        if (keys.length >= 5) return false;
        if (keys.some((k) => k.key === key)) return false;
        const newKey = createDefaultKey(name, key, provider);
        set({ keys: [...keys, newKey] });
        return true;
      },

      removeKey: (id) => {
        set({ keys: get().keys.filter((k) => k.id !== id) });
      },

      toggleKey: (id) => {
        set({
          keys: get().keys.map((k) =>
            k.id === id ? { ...k, isActive: !k.isActive } : k
          ),
        });
      },

      getActiveKey: () => {
        const { keys, config } = get();
        return getNextKey(keys, config);
      },

      markKeyUsed: (id) => {
        set({
          keys: get().keys.map((k) =>
            k.id === id ? updateKeyAfterUse(k) : k
          ),
        });
      },

      setRateLimit: (id, remaining, resetAt) => {
        set({
          keys: get().keys.map((k) =>
            k.id === id ? updateKeyRateLimit(k, remaining, resetAt) : k
          ),
        });
      },

      updateConfig: (updates) => {
        set({ config: { ...get().config, ...updates } });
      },

      getKeyStats: () => {
        const { keys } = get();
        return {
          total: keys.length,
          active: keys.filter((k) => k.isActive).length,
          rateLimited: keys.filter((k) => k.rateLimitRemaining === 0).length,
        };
      },
    }),
    { name: 'hpa-api-keys' }
  )
);
