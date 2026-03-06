'use client';

import { useState } from 'react';
import { useReviewStore } from '@/stores/review-store';
import { ReviewItem } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import {
  Plus,
  Search,
  Trash2,
  ChevronDown,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const STATUS_OPTIONS: (ReviewItem['status'] | 'all')[] = ['all', 'pending', 'in-progress', 'approved', 'rejected'];
const PRIORITY_OPTIONS: (ReviewItem['priority'] | 'all')[] = ['all', 'low', 'medium', 'high', 'critical'];

export default function ReviewDashboard() {
  const { items, filter, addItem, updateItem, removeItem, setFilter, getFilteredItems, getStats } =
    useReviewStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as ReviewItem['priority'],
    tags: '',
  });

  const filteredItems = getFilteredItems();
  const stats = getStats();

  const handleAdd = () => {
    if (!form.title) return;
    addItem({
      title: form.title,
      description: form.description,
      status: 'pending',
      priority: form.priority,
      assignee: null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      videoProjectId: null,
    });
    setForm({ title: '', description: '', priority: 'medium', tags: '' });
    setShowAdd(false);
  };

  const STAT_CARDS = [
    { label: 'Total', value: stats.total, icon: BarChart3, color: 'text-brand-600 bg-brand-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => (
          <div key={stat.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
              <p className="text-xs text-surface-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="input pl-10"
            placeholder="Search reviews..."
          />
        </div>
        <div className="relative">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ status: e.target.value as typeof filter.status })}
            className="input pr-8 appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Status' : s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filter.priority}
            onChange={(e) => setFilter({ priority: e.target.value as typeof filter.priority })}
            className="input pr-8 appearance-none cursor-pointer"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p === 'all' ? 'All Priority' : p}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Review
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="card text-center py-12">
            <AlertCircle className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-700 mb-2">
              {items.length === 0 ? 'No Reviews Yet' : 'No Matching Reviews'}
            </h3>
            <p className="text-sm text-surface-500">
              {items.length === 0 ? 'Create your first review item to get started.' : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="card flex items-start gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium text-surface-900">{item.title}</h3>
                  <StatusBadge value={item.status} />
                  <StatusBadge value={item.priority} variant="priority" />
                </div>
                {item.description && (
                  <p className="text-sm text-surface-600 mb-2 line-clamp-2">{item.description}</p>
                )}
                {item.aiSummary && (
                  <div className="flex items-start gap-1.5 text-xs text-purple-700 bg-purple-50 rounded-lg px-3 py-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    {item.aiSummary}
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-surface-100 text-surface-600">
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-surface-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <select
                  value={item.status}
                  onChange={(e) => updateItem(item.id, { status: e.target.value as ReviewItem['status'] })}
                  className="text-xs border border-surface-200 rounded-lg px-2 py-1.5 bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Review Item">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="Review item title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input min-h-[80px] resize-y"
              placeholder="Describe the item to review..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as ReviewItem['priority'] })}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input"
              placeholder="design, ux, bug"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleAdd} className="btn-primary flex-1" disabled={!form.title}>Create</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
