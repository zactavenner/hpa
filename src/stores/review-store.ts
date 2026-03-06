'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReviewItem } from '@/types';

interface ReviewState {
  items: ReviewItem[];
  filter: {
    status: ReviewItem['status'] | 'all';
    priority: ReviewItem['priority'] | 'all';
    search: string;
  };
  addItem: (item: Omit<ReviewItem, 'id' | 'createdAt' | 'updatedAt' | 'aiSummary' | 'comments'>) => void;
  updateItem: (id: string, updates: Partial<ReviewItem>) => void;
  removeItem: (id: string) => void;
  setFilter: (filter: Partial<ReviewState['filter']>) => void;
  getFilteredItems: () => ReviewItem[];
  getStats: () => Record<string, number>;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      items: [],
      filter: { status: 'all', priority: 'all', search: '' },

      addItem: (item) => {
        const newItem: ReviewItem = {
          ...item,
          id: crypto.randomUUID(),
          aiSummary: null,
          comments: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({ items: [newItem, ...get().items] });
      },

      updateItem: (id, updates) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: Date.now() } : i
          ),
        });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      setFilter: (filter) => {
        set({ filter: { ...get().filter, ...filter } });
      },

      getFilteredItems: () => {
        const { items, filter } = get();
        return items.filter((item) => {
          if (filter.status !== 'all' && item.status !== filter.status) return false;
          if (filter.priority !== 'all' && item.priority !== filter.priority) return false;
          if (filter.search) {
            const q = filter.search.toLowerCase();
            return (
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              item.tags.some((t) => t.toLowerCase().includes(q))
            );
          }
          return true;
        });
      },

      getStats: () => {
        const { items } = get();
        return {
          total: items.length,
          pending: items.filter((i) => i.status === 'pending').length,
          'in-progress': items.filter((i) => i.status === 'in-progress').length,
          approved: items.filter((i) => i.status === 'approved').length,
          rejected: items.filter((i) => i.status === 'rejected').length,
        };
      },
    }),
    { name: 'hpa-reviews' }
  )
);
