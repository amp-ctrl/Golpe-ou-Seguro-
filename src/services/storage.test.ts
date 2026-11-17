import { Category } from '../data/challenges';
import type { SessionRecord } from './results';
import { describe, expect, it } from 'vitest';
import { StorageService, type StorageBackend } from './storage';

function createBackend() {
  const data = new Map<string, string>();
  const backend: StorageBackend = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => { data.set(key, value); },
    removeItem: (key) => { data.delete(key); },
  };
  return { backend, data };
}

describe('armazenamento das partidas', () => {
  it('persiste apenas questões exibidas e mantém as últimas três partidas após recarregar', () => {
    const { backend } = createBackend();
    const store = new StorageService(backend);
    store.startSeenSession('ch-01');
    store.recordSeenChallenge('ch-02');
    store.recordSeenChallenge('ch-02');
    store.startSeenSession('ch-03');
    store.startSeenSession('ch-04');
    expect(new StorageService(backend).getSeenSessions()).toEqual([{ ids: ['ch-01', 'ch-02'] }, { ids: ['ch-03'] }, { ids: ['ch-04'] }]);
    store.startSeenSession('ch-05');
    expect(store.getSeenSessions()).toEqual([{ ids: ['ch-03'] }, { ids: ['ch-04'] }, { ids: ['ch-05'] }]);
  });

  it('usa memória se armazenamento estiver indisponível, sem perder pontuação nem histórico', () => {
    const unavailable = () => { throw new Error('Indisponível'); };
    const store = new StorageService({ getItem: unavailable, setItem: unavailable, removeItem: unavailable });
    expect(store.getBestScore()).toBe(0);
    expect(store.saveBestScore(80)).toBe(80);
    expect(store.saveBestScore(20)).toBe(80);
    store.startSeenSession('ch-01');
    store.recordSeenChallenge('ch-02');
    expect(store.getSeenSessions()).toEqual([{ ids: ['ch-01', 'ch-02'] }]);
    store.remove('seen_sessions');
    expect(store.getSeenSessions()).toEqual([]);
  });

  it('preserva dados em memória quando a leitura funciona mas a gravação falha por falta de espaço', () => {
    const { backend } = createBackend();
    const original = new StorageService(backend);
    original.saveBestScore(30);
    original.startSeenSession('ch-01');
    const readOnly: StorageBackend = {
      getItem: backend.getItem,
      setItem: () => { throw new Error('QuotaExceededError'); },
      removeItem: () => { throw new Error('Acesso negado'); },
    };
    const store = new StorageService(readOnly);
    expect(store.saveBestScore(90)).toBe(90);
    expect(store.getBestScore()).toBe(90);
    store.startSeenSession('ch-02');
    store.recordSeenChallenge('ch-03');
    expect(store.getSeenSessions()).toEqual([{ ids: ['ch-01'] }, { ids: ['ch-02', 'ch-03'] }]);
    store.remove('seen_sessions');
    expect(store.getSeenSessions()).toEqual([]);
  });

  it('ignora JSON corrompido, schemas desconhecidos e estruturas inválidas', () => {
    const { backend, data } = createBackend();
    const store = new StorageService(backend);
    store.startSeenSession('ch-01');
    const key = [...data.keys()][0];
    data.set(key, '{quebrado');
    expect(store.getSeenSessions()).toEqual([]);
    data.set(key, JSON.stringify({ schemaVersion: 999, data: [{ ids: ['ch-01'] }] }));
    expect(store.getSeenSessions()).toEqual([]);
    store.set('seen_sessions', [{ ids: [42] }, { ids: [] }, { ids: ['x', 'x'] }, null, { ids: ['ch-02'] }]);
    expect(store.getSeenSessions()).toEqual([{ ids: ['ch-02'] }]);
    store.set('best_score', 'oitenta');
    expect(store.getBestScore()).toBe(0);
    store.set('best_score', -1);
    expect(store.getBestScore()).toBe(0);
    expect(store.saveBestScore(Infinity)).toBe(0);
  });
});

function makeResult(id: string): SessionRecord {
  return { id, startedAt: '2026-11-17T12:00:00Z', finishedAt: '2026-11-17T12:05:00Z', size: 10, mode: 'standard', focusCategories: [], answers: [
    { challengeId: 'ch-01', guessedScam: true, isScam: true, category: Category.Delivery, channel: 'whatsapp', points: 10 },
  ] };
}
describe('histórico e estatísticas com schema 2', () => {
  it('mantém dez resultados, estatísticas acumuladas e não duplica uma partida salva novamente', () => {
    const { backend } = createBackend();
    const store = new StorageService(backend);
    for (let id = 0; id < 12; id++) store.saveSession(makeResult(`result-${id}`));
    store.saveSession(makeResult('result-11'));
    const reloaded = new StorageService(backend);
    expect(reloaded.getSessionHistory()).toHaveLength(10);
    expect(reloaded.getSessionHistory()[0].id).toBe('result-2');
    expect(reloaded.getCategoryStats()[Category.Delivery]).toEqual({ answered: 12, correct: 12, missedScams: 0, falseAlarms: 0 });
  });
  it('lê recorde e histórico de exposição do schema 1 e grava dados novos no schema 2', () => {
    const { backend, data } = createBackend();
    data.set('cid_jogo_v1_best_score', JSON.stringify({ schemaVersion: 1, data: 80 }));
    data.set('cid_jogo_v1_seen_sessions', JSON.stringify({ schemaVersion: 1, data: [{ ids: ['ch-01'] }] }));
    const store = new StorageService(backend);
    expect(store.getBestScore()).toBe(80);
    expect(store.getSeenSessions()).toEqual([{ ids: ['ch-01'] }]);
    store.saveBestScore(90); store.saveSession(makeResult('new-result'));
    expect(JSON.parse(data.get('cid_jogo_v1_best_score') ?? '{}').schemaVersion).toBe(2);
    expect(JSON.parse(data.get('cid_jogo_v1_results') ?? '{}').schemaVersion).toBe(2);
  });
  it('rejeita histórico inválido e estatísticas inconsistentes com fallback seguro', () => {
    const { backend } = createBackend();
    const store = new StorageService(backend);
    const invalid = { ...makeResult('invalid'), answers: [{ challengeId: 'x', isScam: 'sim' }] };
    store.set('results', { sessions: [invalid], categoryStats: {} });
    expect(store.getSessionHistory()).toEqual([]);
    store.set('results', { sessions: [], categoryStats: { [Category.Delivery]: { answered: 1, correct: 2, missedScams: 0, falseAlarms: 0 } } });
    expect(store.getCategoryStats()).toEqual({});
    store.saveSession(makeResult('valid'));
    expect(store.getSessionHistory()).toHaveLength(1);
  });
  it('salva resultados em memória quando o navegador recusa armazenamento', () => {
    const unavailable = () => { throw new Error('Indisponível'); };
    const store = new StorageService({ getItem: unavailable, setItem: unavailable, removeItem: unavailable });
    store.saveSession(makeResult('memory'));
    expect(store.getSessionHistory()[0].id).toBe('memory');
    expect(store.getCategoryStats()[Category.Delivery]?.correct).toBe(1);
  });
});
