import { describe, expect, it } from 'vitest';
import { INITIAL_CHALLENGES, type Challenge } from '../data/challenges';
import { buildSession, SESSION_SIZES, type SeenSession, type SessionSize } from './sessionBuilder';

function assertRules(session: Challenge[], size: SessionSize, history: SeenSession[]) {
  expect(session).toHaveLength(size);
  expect(new Set(session.map((q) => q.id)).size).toBe(size);
  const ratio = session.filter((q) => q.isScam).length / size;
  expect(ratio).toBeGreaterThanOrEqual(0.4);
  expect(ratio).toBeLessThanOrEqual(0.6);
  expect(session[0].difficulty).toBeLessThanOrEqual(2);
  expect(session[size - 1].difficulty).toBe(3);
  expect(session.slice(0, Math.floor(size / 3)).reduce((sum, q) => sum + q.difficulty, 0))
    .toBeLessThan(session.slice(-Math.floor(size / 3)).reduce((sum, q) => sum + q.difficulty, 0));
  session.forEach((q, i) => {
    if (i > 0) {
      expect(q.category).not.toBe(session[i - 1].category);
      expect(q.difficulty).toBeGreaterThanOrEqual(session[i - 1].difficulty);
    }
    if (i >= 2) expect(session.slice(i - 2, i + 1).every((item) => item.channel === q.channel)).toBe(false);
    if (i >= 3) expect(session.slice(i - 3, i + 1).every((item) => item.isScam === q.isScam)).toBe(false);
  });
  const recent = history.slice(-3);
  expect(recent.some(({ ids }) => ids[0] === session[0].id)).toBe(false);
  const latest = recent[recent.length - 1]?.ids;
  if (latest) {
    expect(session[0].id).not.toBe(latest[latest.length - 1]);
    for (const id of [latest[0], latest[latest.length - 1]]) {
      const previous = INITIAL_CHALLENGES.find((q) => q.id === id);
      if (previous) expect(session[0].channel === previous.channel && session[0].category === previous.category).toBe(false);
    }
  }
}

describe('buildSession', () => {
  for (const size of SESSION_SIZES) {
    it(`respeita todas as regras em 1.000 partidas de ${size}, inclusive partidas encerradas antes`, () => {
      let history: SeenSession[] = [];
      for (let seed = 0; seed < 1000; seed++) {
        let session: Challenge[];
        try { session = buildSession(INITIAL_CHALLENGES, { size, seed, history }); }
        catch (error) { throw new Error(`Falha no tamanho ${size}, seed ${seed}: ${String(error)}`); }
        assertRules(session, size, history);
        const displayed = seed % 4 === 0 ? session.slice(0, seed % size + 1) : session;
        history = [...history, { ids: displayed.map((q) => q.id) }].slice(-3);
      }
    }, 30_000);
  }

  it('usa 10 por padrão e reproduz a partida com seed e histórico iguais, sem mutá-los', () => {
    const history = [{ ids: ['ch-01', 'ch-02'] }];
    const snapshot = JSON.stringify({ pool: INITIAL_CHALLENGES, history });
    const first = buildSession(INITIAL_CHALLENGES, { seed: 'treino', history });
    expect(first).toHaveLength(10);
    expect(first).toEqual(buildSession(INITIAL_CHALLENGES, { seed: 'treino', history }));
    expect(JSON.stringify({ pool: INITIAL_CHALLENGES, history })).toBe(snapshot);
    expect(first).not.toEqual(buildSession(INITIAL_CHALLENGES, { seed: 'outro', history }));
  });

  it('desconsidera histórico mais antigo que três partidas e tolera IDs removidos do banco', () => {
    const recent = [{ ids: ['ch-01'] }, { ids: ['removida'] }, { ids: ['ch-02'] }];
    expect(buildSession(INITIAL_CHALLENGES, { seed: 42, history: [{ ids: ['ch-03'] }, ...recent] }))
      .toEqual(buildSession(INITIAL_CHALLENGES, { seed: 42, history: recent }));
  });

  it('seleciona menos questões já vistas em amostra de 300 seeds', () => {
    const seen = INITIAL_CHALLENGES.filter((_, index) => index % 3 === 0).map((q) => q.id);
    const seenSet = new Set(seen);
    const history = [{ ids: seen }, { ids: seen }, { ids: seen }];
    let weighted = 0;
    let baseline = 0;
    for (let seed = 0; seed < 300; seed++) {
      weighted += buildSession(INITIAL_CHALLENGES, { seed, history }).filter((q) => seenSet.has(q.id)).length;
      baseline += buildSession(INITIAL_CHALLENGES, { seed }).filter((q) => seenSet.has(q.id)).length;
    }
    expect(weighted).toBeLessThan(baseline * 0.6);
  });

  it('recusa banco impossível ou IDs duplicados em vez de violar as regras', () => {
    expect(() => buildSession(INITIAL_CHALLENGES.slice(0, 5))).toThrow(/insuficientes/);
    expect(() => buildSession([...INITIAL_CHALLENGES, INITIAL_CHALLENGES[0]])).toThrow(/repetidos/);
    expect(() => buildSession(INITIAL_CHALLENGES.filter((q) => q.isScam))).toThrow(/todas as regras/);
  });
});
