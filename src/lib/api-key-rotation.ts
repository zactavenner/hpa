import { ApiKey, ApiKeyRotationConfig } from '@/types';

const DEFAULT_CONFIG: ApiKeyRotationConfig = {
  strategy: 'round-robin',
  maxKeys: 5,
  cooldownMs: 60_000,
  retryOnRateLimit: true,
};

let rotationIndex = 0;

export function getNextKey(
  keys: ApiKey[],
  config: ApiKeyRotationConfig = DEFAULT_CONFIG
): ApiKey | null {
  const activeKeys = keys.filter(
    (k) =>
      k.isActive &&
      k.rateLimitRemaining > 0 &&
      (!k.rateLimitReset || Date.now() >= k.rateLimitReset)
  );

  if (activeKeys.length === 0) {
    // Check if any keys have passed their cooldown
    const cooledDown = keys.filter(
      (k) => k.isActive && k.rateLimitReset && Date.now() >= k.rateLimitReset
    );
    if (cooledDown.length > 0) return cooledDown[0];
    return null;
  }

  switch (config.strategy) {
    case 'round-robin': {
      const key = activeKeys[rotationIndex % activeKeys.length];
      rotationIndex = (rotationIndex + 1) % activeKeys.length;
      return key;
    }
    case 'least-used': {
      return activeKeys.reduce((a, b) =>
        a.usageCount <= b.usageCount ? a : b
      );
    }
    case 'random': {
      return activeKeys[Math.floor(Math.random() * activeKeys.length)];
    }
    default:
      return activeKeys[0];
  }
}

export function updateKeyAfterUse(key: ApiKey): ApiKey {
  return {
    ...key,
    usageCount: key.usageCount + 1,
    lastUsed: Date.now(),
    rateLimitRemaining: Math.max(0, key.rateLimitRemaining - 1),
  };
}

export function updateKeyRateLimit(
  key: ApiKey,
  remaining: number,
  resetAt: number
): ApiKey {
  return {
    ...key,
    rateLimitRemaining: remaining,
    rateLimitReset: resetAt,
  };
}

export function createDefaultKey(
  name: string,
  apiKey: string,
  provider: ApiKey['provider']
): ApiKey {
  return {
    id: crypto.randomUUID(),
    name,
    key: apiKey,
    provider,
    isActive: true,
    usageCount: 0,
    lastUsed: null,
    rateLimit: 60,
    rateLimitRemaining: 60,
    rateLimitReset: null,
    createdAt: Date.now(),
  };
}

export function maskKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return key.slice(0, 4) + '••••••••' + key.slice(-4);
}

export { DEFAULT_CONFIG };
