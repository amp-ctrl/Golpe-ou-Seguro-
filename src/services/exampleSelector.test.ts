import { describe, expect, it } from 'vitest';
import { INITIAL_CHALLENGES } from '../data/challenges';
import { selectExamples } from './exampleSelector';

describe('exemplos da home', () => {
  it('sorteia cinco questões distintas, cobre os quatro canais e mistura as duas respostas', () => {
    const snapshot = JSON.stringify(INITIAL_CHALLENGES);
    const selections = new Set<string>();
    for (let seed = 1; seed <= 200; seed++) {
      let state = seed;
      const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
      const examples = selectExamples(INITIAL_CHALLENGES, random);
      expect(examples).toHaveLength(5);
      expect(new Set(examples.map(({ id }) => id)).size).toBe(5);
      expect(new Set(examples.map(({ channel }) => channel)).size).toBe(4);
      expect(examples.filter(({ isScam }) => isScam).length).toBeGreaterThanOrEqual(2);
      expect(examples.filter(({ isScam }) => isScam).length).toBeLessThanOrEqual(3);
      for (const example of examples) expect(INITIAL_CHALLENGES).toContain(example);
      selections.add(examples.map(({ id }) => id).join(','));
    }
    expect(selections.size).toBeGreaterThan(180);
    expect(JSON.stringify(INITIAL_CHALLENGES)).toBe(snapshot);
  });
});
