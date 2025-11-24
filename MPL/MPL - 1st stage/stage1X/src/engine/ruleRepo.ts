// src/engine/ruleRepo.ts
export type RuleCommit = {
  id: string;
  at: number;
  hash: string;
  message: string;
  byteSize: number;
  source: string;
};

const STORAGE_KEY = 'mpl.ruleRepo.v1';

function nowId() {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 6);
  return `${t}-${r}`;
}

export function fnv1a(str: string): string {
  let h = 0x811c9dc5 >>> 0;
  for (let i=0;i<str.length;i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

function load(): RuleCommit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr as RuleCommit[];
  } catch {}
  return [];
}

function save(arr: RuleCommit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export const ruleRepo = {
  list(): RuleCommit[] {
    const arr = load();
    return arr.sort((a,b) => b.at - a.at);
  },
  get(id: string): RuleCommit | undefined {
    return load().find(c => c.id === id);
  },
  commit(message: string, source: string): RuleCommit {
    const arr = load();
    const c: RuleCommit = {
      id: nowId(),
      at: Date.now(),
      hash: fnv1a(source),
      message: message || '(no message)',
      byteSize: source.length,
      source
    };
    arr.push(c);
    save(arr);
    return c;
  },
  delete(id: string) {
    const arr = load().filter(c => c.id !== id);
    save(arr);
  },
  clearAll() { save([]); }
};