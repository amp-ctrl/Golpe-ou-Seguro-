/**
 * Camada única de armazenamento local (localStorage)
 * Nenhuma outra parte da aplicação acessa localStorage diretamente.
 */

const STORAGE_PREFIX = 'cid_jogo_v1_';
const SCHEMA_VERSION = 1;

interface StorageEnvelope<T> {
  schemaVersion: number;
  updatedAt: string;
  data: T;
}

class StorageService {
  private prefix: string;
  private schemaVersion: number;

  constructor(prefix = STORAGE_PREFIX, schemaVersion = SCHEMA_VERSION) {
    this.prefix = prefix;
    this.schemaVersion = schemaVersion;
  }

  private formatKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = `${this.prefix}__test__`;
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) {
      return defaultValue ?? null;
    }

    try {
      const raw = window.localStorage.getItem(this.formatKey(key));
      if (!raw) {
        return defaultValue ?? null;
      }

      const envelope: StorageEnvelope<T> = JSON.parse(raw);
      if (!envelope || typeof envelope !== 'object' || typeof envelope.schemaVersion !== 'number') {
        return defaultValue ?? null;
      }

      return envelope.data ?? (defaultValue ?? null);
    } catch (error) {
      console.warn(`[Storage] Falha ao recuperar chave "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  public set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const envelope: StorageEnvelope<T> = {
        schemaVersion: this.schemaVersion,
        updatedAt: new Date().toISOString(),
        data: value,
      };
      window.localStorage.setItem(this.formatKey(key), JSON.stringify(envelope));
      return true;
    } catch (error) {
      console.warn(`[Storage] Falha ao salvar chave "${key}":`, error);
      return false;
    }
  }

  public remove(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      window.localStorage.removeItem(this.formatKey(key));
      return true;
    } catch (error) {
      console.warn(`[Storage] Falha ao remover chave "${key}":`, error);
      return false;
    }
  }

  /**
   * Obtém a melhor pontuação salva
   */
  public getBestScore(): number {
    const score = this.get<number>('best_score', 0);
    return typeof score === 'number' ? score : 0;
  }

  /**
   * Atualiza a melhor pontuação se o score atual for maior
   */
  public saveBestScore(score: number): number {
    const currentBest = this.getBestScore();
    if (score > currentBest) {
      this.set<number>('best_score', score);
      return score;
    }
    return currentBest;
  }
}

export const storage = new StorageService();
