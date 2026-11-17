import type { SeenSession } from './sessionBuilder';

const STORAGE_PREFIX = 'cid_jogo_v1_';
const SCHEMA_VERSION = 1;
interface StorageEnvelope<T> { schemaVersion: number; updatedAt: string; data: T }
export interface StorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Única camada que acessa localStorage. Memória mantém a sessão se o navegador negar acesso. */
export class StorageService {
  private readonly memory = new Map<string, string>();
  private readonly volatileKeys = new Set<string>();
  constructor(private readonly backend?: StorageBackend) {}

  private resolveBackend(): StorageBackend | undefined {
    if (this.backend) return this.backend;
    try { return typeof window === 'undefined' ? undefined : window.localStorage; }
    catch { return undefined; }
  }

  public get<T>(key: string, defaultValue?: T): T | null {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    let raw = this.memory.get(storageKey);
    try {
      const backend = this.resolveBackend();
      if (backend && !this.volatileKeys.has(storageKey)) raw = backend.getItem(storageKey) ?? undefined;
    } catch { /* Navegação privada ou armazenamento indisponível: use a memória. */ }
    try {
      if (!raw) return defaultValue ?? null;
      const envelope: unknown = JSON.parse(raw);
      if (typeof envelope !== 'object' || envelope === null ||
        !('schemaVersion' in envelope) || envelope.schemaVersion !== SCHEMA_VERSION || !('data' in envelope)) {
        return defaultValue ?? null;
      }
      return (envelope.data as T) ?? defaultValue ?? null;
    } catch { return defaultValue ?? null; }
  }

  public set<T>(key: string, value: T): boolean {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    try {
      const envelope: StorageEnvelope<T> = { schemaVersion: SCHEMA_VERSION, updatedAt: new Date().toISOString(), data: value };
      const raw = JSON.stringify(envelope);
      this.memory.set(storageKey, raw);
      this.volatileKeys.add(storageKey);
      const backend = this.resolveBackend();
      if (!backend) return false;
      backend.setItem(storageKey, raw);
      this.volatileKeys.delete(storageKey);
      return true;
    } catch { return false; }
  }

  public remove(key: string): boolean {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    this.memory.delete(storageKey);
    this.volatileKeys.add(storageKey);
    try {
      const backend = this.resolveBackend();
      if (!backend) return false;
      backend.removeItem(storageKey);
      this.volatileKeys.delete(storageKey);
      return true;
    } catch { return false; }
  }

  public getBestScore(): number {
    const score = this.get<unknown>('best_score');
    return typeof score === 'number' && Number.isFinite(score) && score >= 0 ? score : 0;
  }

  public saveBestScore(score: number): number {
    const best = this.getBestScore();
    if (Number.isFinite(score) && score > best) {
      this.set('best_score', score);
      return score;
    }
    return best;
  }

  public getSeenSessions(): SeenSession[] {
    const value = this.get<unknown>('seen_sessions');
    if (!Array.isArray(value)) return [];
    return value.filter((entry: unknown): entry is SeenSession => {
      if (typeof entry !== 'object' || entry === null || !('ids' in entry) || !Array.isArray(entry.ids)) return false;
      return entry.ids.length > 0 && entry.ids.length <= 20 &&
        entry.ids.every((id: unknown) => typeof id === 'string' && id.length > 0) &&
        new Set(entry.ids).size === entry.ids.length;
    }).slice(-3).map(({ ids }) => ({ ids: [...ids] }));
  }

  /** Chamar ao exibir a primeira questão; não salva o baralho ainda não visto. */
  public startSeenSession(firstId: string): void {
    this.set('seen_sessions', [...this.getSeenSessions(), { ids: [firstId] }].slice(-3));
  }

  public recordSeenChallenge(id: string): void {
    const sessions = this.getSeenSessions();
    const current = sessions[sessions.length - 1];
    if (!current) { this.startSeenSession(id); return; }
    if (!current.ids.includes(id) && current.ids.length < 20) {
      current.ids.push(id);
      this.set('seen_sessions', sessions);
    }
  }
}
export const storage = new StorageService();
