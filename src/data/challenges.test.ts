import { describe, expect, it } from 'vitest';
import { Category, INITIAL_CHALLENGES, ScamType } from './challenges';

describe('banco de questões', () => {
  it('mantém as dez questões migradas e a distribuição editorial das 60', () => {
    expect(INITIAL_CHALLENGES).toHaveLength(60);
    expect(new Set(INITIAL_CHALLENGES.map(({ id }) => id)).size).toBe(60);
    for (let id = 1; id <= 10; id++) expect(INITIAL_CHALLENGES.some((q) => q.id === `ch-${String(id).padStart(2, '0')}`)).toBe(true);
    expect(INITIAL_CHALLENGES.filter((q) => q.isScam)).toHaveLength(35);
    for (const channel of ['whatsapp', 'sms', 'email', 'instagram']) {
      expect(INITIAL_CHALLENGES.filter((q) => q.channel === channel)).toHaveLength(15);
    }
    expect([1, 2, 3].map((level) => INITIAL_CHALLENGES.filter((q) => q.difficulty === level).length)).toEqual([18, 24, 18]);
    expect(new Set(INITIAL_CHALLENGES.map((q) => q.category))).toEqual(new Set(Object.values(Category)));
    expect(new Set(INITIAL_CHALLENGES.filter((q) => q.isScam).map((q) => q.scamType))).toEqual(new Set(Object.values(ScamType)));
  });

  it('tem contexto, verificação, explicações de 2–4 frases e destaques exatos', () => {
    for (const q of INITIAL_CHALLENGES) {
      expect(q.context.length, q.id).toBeGreaterThan(20);
      expect(q.howToVerify.length, q.id).toBeGreaterThan(20);
      const sentences = q.explanation.split(/(?<=[.!?])\s+/);
      expect(sentences.length, q.id).toBeGreaterThanOrEqual(2);
      expect(sentences.length, q.id).toBeLessThanOrEqual(4);
      if (q.isScam) {
        expect(q.scamType, q.id).toBeTruthy();
        expect(q.redFlags.length, q.id).toBeGreaterThanOrEqual(2);
        expect(q.redFlags.length, q.id).toBeLessThanOrEqual(4);
      } else expect(q.redFlags, q.id).toEqual([]);
      const visible = Object.values(q.content).filter((value) => typeof value === 'string').join('\n');
      for (const highlight of q.highlights ?? []) expect(visible.includes(highlight), `${q.id}: ${highlight}`).toBe(true);
    }
  });

  it('usa somente endereços reservados .example e nomes de arquivos fictícios', () => {
    const addresses = JSON.stringify(INITIAL_CHALLENGES).match(/(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[a-z0-9/-]*)?/gi) ?? [];
    expect(addresses.length).toBeGreaterThan(20);
    for (const address of addresses) expect(/\.example(?:\/|$)|\.(?:apk|exe)$/.test(address), address).toBe(true);
    expect(JSON.stringify(INITIAL_CHALLENGES)).not.toMatch(/\+55|\(\d{2}\)\s*\d{4,5}/);
  });
});
