import type { Redis } from 'ioredis';
import { randomUUID } from 'node:crypto';

/**
 * Chat memory storage.
 *
 * Backed by Redis when `REDIS_URL` is set and reachable, otherwise by an
 * in-process Map. Forcing the in-memory backend is possible with
 * `NISER_MEMORY_BACKEND=memory` (useful in tests and minimal deploys).
 */

export interface ChatMemoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface MemoryFact {
  key: string;
  value: string;
  ts: number;
}

export interface VisitorProfile {
  visitorId: string;
  facts: MemoryFact[];
  interests: string[];
}

export interface ChatMemoryStore {
  readonly backend: 'redis' | 'memory';
  /** Recent messages for a conversation (short-term memory). */
  getMessages(sessionId: string): Promise<ChatMemoryMessage[]>;
  appendMessages(sessionId: string, messages: ChatMemoryMessage[]): Promise<void>;
  replaceMessages(sessionId: string, messages: ChatMemoryMessage[]): Promise<void>;
  clearMessages(sessionId: string): Promise<void>;
  /** Rolling conversation summary. */
  getSummary(sessionId: string): Promise<string | null>;
  setSummary(sessionId: string, summary: string): Promise<void>;
  /** Long-term visitor profile (facts + interests). */
  getProfile(visitorId: string): Promise<VisitorProfile>;
  saveFact(visitorId: string, key: string, value: string): Promise<void>;
  addInterests(visitorId: string, interests: string[]): Promise<void>;
  /** Map a browser fingerprint to a visitor id so returning visitors are recognised. */
  linkFingerprint(fingerprint: string, visitorId: string): Promise<void>;
  getVisitorByFingerprint(fingerprint: string): Promise<string | null>;
}

// ─── Key layout & TTLs ───────────────────────────────────────────────────────

const TTL = {
  session: 60 * 60 * 24 * 7, // 7 days
  profile: 60 * 60 * 24 * 90, // 90 days
  fingerprint: 60 * 60 * 24 * 365, // 1 year
};

const keys = {
  messages: (sessionId: string) => `niser:chat:session:${sessionId}:messages`,
  summary: (sessionId: string) => `niser:chat:session:${sessionId}:summary`,
  facts: (visitorId: string) => `niser:chat:visitor:${visitorId}:facts`,
  interests: (visitorId: string) => `niser:chat:visitor:${visitorId}:interests`,
  fingerprint: (fingerprint: string) => `niser:chat:fingerprint:${fingerprint}`,
};

const MAX_FACTS = 40;
const MAX_INTERESTS = 50;

// ─── Redis backend ───────────────────────────────────────────────────────────

function createRedisStore(client: Redis): ChatMemoryStore {
  const jsonGet = async (key: string): Promise<unknown | null> => {
    const raw = await client.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  };

  const jsonSet = async (key: string, value: unknown, ttlSeconds: number): Promise<void> => {
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  };

  return {
    backend: 'redis',

    async getMessages(sessionId) {
      const raw = await jsonGet(keys.messages(sessionId));
      if (!Array.isArray(raw)) return [];
      return (raw as ChatMemoryMessage[]).filter(
        (message) =>
          message &&
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string',
      );
    },

    async appendMessages(sessionId, messages) {
      if (messages.length === 0) return;
      const current = await this.getMessages(sessionId);
      await jsonSet(keys.messages(sessionId), [...current, ...messages], TTL.session);
    },

    async replaceMessages(sessionId, messages) {
      await jsonSet(keys.messages(sessionId), messages, TTL.session);
    },

    async clearMessages(sessionId) {
      await client.del(keys.messages(sessionId), keys.summary(sessionId));
    },

    async getSummary(sessionId) {
      const raw = await client.get(keys.summary(sessionId));
      return typeof raw === 'string' && raw ? raw : null;
    },

    async setSummary(sessionId, summary) {
      if (!summary) return;
      await client.set(keys.summary(sessionId), summary, 'EX', TTL.session);
    },

    async getProfile(visitorId) {
      const factsRaw = await jsonGet(keys.facts(visitorId));
      const interestsRaw = await jsonGet(keys.interests(visitorId));
      const facts = Array.isArray(factsRaw) ? (factsRaw as MemoryFact[]) : [];
      const interests = Array.isArray(interestsRaw) ? (interestsRaw as string[]) : [];
      return { visitorId, facts: facts.slice(0, MAX_FACTS), interests: interests.slice(0, MAX_INTERESTS) };
    },

    async saveFact(visitorId, key, value) {
      const profile = await this.getProfile(visitorId);
      const existingIndex = profile.facts.findIndex((fact) => fact.key === key);
      const fact = { key, value, ts: Date.now() };
      if (existingIndex >= 0) {
        profile.facts[existingIndex] = fact;
      } else {
        profile.facts.push(fact);
      }
      const trimmed = profile.facts.slice(-MAX_FACTS);
      await jsonSet(keys.facts(visitorId), trimmed, TTL.profile);
    },

    async addInterests(visitorId, interests) {
      if (!interests.length) return;
      const profile = await this.getProfile(visitorId);
      const merged = Array.from(new Set([...profile.interests, ...interests])).slice(-MAX_INTERESTS);
      await jsonSet(keys.interests(visitorId), merged, TTL.profile);
    },

    async linkFingerprint(fingerprint, visitorId) {
      await client.set(keys.fingerprint(fingerprint), visitorId, 'EX', TTL.fingerprint);
    },

    async getVisitorByFingerprint(fingerprint) {
      return client.get(keys.fingerprint(fingerprint));
    },
  };
}

// ─── In-memory backend ───────────────────────────────────────────────────────

type MemoryEntry = { value: unknown; expireAt: number };

/** In-memory store factory. Exported for tests and minimal deploys. */
export function createInMemoryStore(): ChatMemoryStore {
  const store = new Map<string, MemoryEntry>();

  const read = <T>(key: string): T | null => {
    const entry = store.get(key);
    if (!entry) return null;
    if (entry.expireAt <= Date.now()) {
      store.delete(key);
      return null;
    }
    return entry.value as T;
  };

  const write = (key: string, value: unknown, ttlSeconds: number): void => {
    store.set(key, { value, expireAt: Date.now() + ttlSeconds * 1000 });
  };

  return {
    backend: 'memory',

    async getMessages(sessionId) {
      const raw = read<unknown>(keys.messages(sessionId));
      if (!Array.isArray(raw)) return [];
      return (raw as ChatMemoryMessage[]).filter(
        (message) =>
          message &&
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string',
      );
    },

    async appendMessages(sessionId, messages) {
      if (messages.length === 0) return;
      const current = await this.getMessages(sessionId);
      write(keys.messages(sessionId), [...current, ...messages], TTL.session);
    },

    async replaceMessages(sessionId, messages) {
      write(keys.messages(sessionId), messages, TTL.session);
    },

    async clearMessages(sessionId) {
      store.delete(keys.messages(sessionId));
      store.delete(keys.summary(sessionId));
    },

    async getSummary(sessionId) {
      const raw = read<string>(keys.summary(sessionId));
      return raw ?? null;
    },

    async setSummary(sessionId, summary) {
      if (!summary) return;
      write(keys.summary(sessionId), summary, TTL.session);
    },

    async getProfile(visitorId) {
      const facts = read<MemoryFact[]>(keys.facts(visitorId)) ?? [];
      const interests = read<string[]>(keys.interests(visitorId)) ?? [];
      return { visitorId, facts: facts.slice(0, MAX_FACTS), interests: interests.slice(0, MAX_INTERESTS) };
    },

    async saveFact(visitorId, key, value) {
      const profile = await this.getProfile(visitorId);
      const existingIndex = profile.facts.findIndex((fact) => fact.key === key);
      const fact = { key, value, ts: Date.now() };
      if (existingIndex >= 0) {
        profile.facts[existingIndex] = fact;
      } else {
        profile.facts.push(fact);
      }
      write(keys.facts(visitorId), profile.facts.slice(-MAX_FACTS), TTL.profile);
    },

    async addInterests(visitorId, interests) {
      if (!interests.length) return;
      const profile = await this.getProfile(visitorId);
      const merged = Array.from(new Set([...profile.interests, ...interests])).slice(-MAX_INTERESTS);
      write(keys.interests(visitorId), merged, TTL.profile);
    },

    async linkFingerprint(fingerprint, visitorId) {
      write(keys.fingerprint(fingerprint), visitorId, TTL.fingerprint);
    },

    async getVisitorByFingerprint(fingerprint) {
      const raw = read<string>(keys.fingerprint(fingerprint));
      return raw ?? null;
    },
  };
}

// ─── Singleton store ─────────────────────────────────────────────────────────
//
// Route handlers are bundled independently by Next.js, so module-level
// singletons are duplicated per-route and wiped on dev recompiles. Keeping the
// store promise on `globalThis` shares it across routes and survives
// recompiles within the same server process.

const GLOBAL_KEY = '__niser_memory_store__';
const globalForStore = globalThis as { __niser_memory_store__?: Promise<ChatMemoryStore> };

export async function getMemoryStore(): Promise<ChatMemoryStore> {
  if (!globalForStore[GLOBAL_KEY]) {
    globalForStore[GLOBAL_KEY] = createMemoryStore();
  }
  return globalForStore[GLOBAL_KEY] as Promise<ChatMemoryStore>;
}

async function createMemoryStore(): Promise<ChatMemoryStore> {
  if (process.env.NISER_MEMORY_BACKEND === 'memory') {
    return createInMemoryStore();
  }

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const { default: RedisClient } = await import('ioredis');
      const client = new RedisClient(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 2_000,
        enableOfflineQueue: false,
      });
      await client.connect();
      await client.ping();
      return createRedisStore(client);
    } catch (error) {
      console.warn('[memory] Redis unavailable, falling back to in-memory store:', error instanceof Error ? error.message : String(error));
    }
  }

  return createInMemoryStore();
}

export function newSessionId(): string {
  return randomUUID();
}

export function newVisitorId(): string {
  return randomUUID();
}
