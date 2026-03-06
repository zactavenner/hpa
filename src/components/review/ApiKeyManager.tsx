'use client';

import { useState } from 'react';
import { useApiKeysStore } from '@/stores/api-keys-store';
import { maskKey } from '@/lib/api-key-rotation';
import { ApiKey } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Shield,
  Activity,
} from 'lucide-react';

export default function ApiKeyManager() {
  const { keys, config, addKey, removeKey, toggleKey, updateConfig } = useApiKeysStore();
  const [showAdd, setShowAdd] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: '', key: '', provider: 'openai' as ApiKey['provider'] });

  const handleAdd = () => {
    if (!form.name || !form.key) return;
    const success = addKey(form.name, form.key, form.provider);
    if (success) {
      setForm({ name: '', key: '', provider: 'openai' });
      setShowAdd(false);
    }
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-900">API Key Management</h2>
          <p className="text-sm text-surface-500 mt-1">
            Manage up to 5 API keys with automatic rotation
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          disabled={keys.length >= 5}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Key ({keys.length}/5)
        </button>
      </div>

      {/* Rotation Strategy */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw className="w-4 h-4 text-brand-600" />
          <h3 className="font-medium text-surface-900">Rotation Strategy</h3>
        </div>
        <div className="flex gap-2">
          {(['round-robin', 'least-used', 'random'] as const).map((strategy) => (
            <button
              key={strategy}
              onClick={() => updateConfig({ strategy })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                config.strategy === strategy
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {strategy.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Key List */}
      <div className="space-y-3">
        {keys.length === 0 ? (
          <div className="card text-center py-12">
            <Shield className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-700 mb-2">No API Keys Added</h3>
            <p className="text-sm text-surface-500 mb-4">
              Add up to 5 API keys for automatic rotation and rate limit management
            </p>
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              Add Your First Key
            </button>
          </div>
        ) : (
          keys.map((key) => (
            <div key={key.id} className="card flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                key.isActive ? (key.rateLimitRemaining > 0 ? 'bg-green-500' : 'bg-orange-500 animate-pulse-soft') : 'bg-surface-300'
              }`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-surface-900">{key.name}</span>
                  <StatusBadge value={key.isActive ? (key.rateLimitRemaining > 0 ? 'active' : 'rate-limited') : 'inactive'} />
                  <span className="text-xs text-surface-400 px-2 py-0.5 rounded bg-surface-100">{key.provider}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-surface-500">
                  <span className="font-mono">
                    {visibleKeys.has(key.id) ? key.key : maskKey(key.key)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {key.usageCount} uses
                  </span>
                  <span>
                    Rate: {key.rateLimitRemaining}/{key.rateLimit}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleVisibility(key.id)}
                  className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 transition-colors"
                  title={visibleKeys.has(key.id) ? 'Hide key' : 'Show key'}
                >
                  {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleKey(key.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    key.isActive ? 'hover:bg-green-50 text-green-600' : 'hover:bg-surface-100 text-surface-400'
                  }`}
                  title={key.isActive ? 'Disable key' : 'Enable key'}
                >
                  <Shield className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeKey(key.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-colors"
                  title="Remove key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Key Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add API Key">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Key Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="e.g., Production Key 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">API Key</label>
            <input
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              className="input font-mono"
              placeholder="sk-..."
              type="password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Provider</label>
            <select
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value as ApiKey['provider'] })}
              className="input"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google AI</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleAdd} className="btn-primary flex-1" disabled={!form.name || !form.key}>
              Add Key
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
