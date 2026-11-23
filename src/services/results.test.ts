import { describe, expect, it } from 'vitest';
import { Category, INITIAL_CHALLENGES } from '../data/challenges';
import { analyzeAnswers, getProfile, isCorrectAnswer, shareResult, type AnswerRecord, type SessionRecord } from './results';

const answers: AnswerRecord[] = ['ch-01', 'ch-02', 'ch-07', 'ch-08'].map((id, index) => {
  const q = INITIAL_CHALLENGES.find((item) => item.id === id);
  if (!q) throw new Error('Fixture ausente');
  const guessedScam = index % 2 === 0;
  return { challengeId: id, guessedScam, isScam: q.isScam, category: q.category, channel: q.channel, points: guessedScam === q.isScam ? 10 : 0 };
});
const session: SessionRecord = { id: 'test-result', startedAt: '2026-11-17T12:00:00Z', finishedAt: '2026-11-17T12:05:00Z', size: 10, mode: 'standard', focusCategories: [], answers };

describe('análise do resultado', () => {
  it('distingue os dois erros e reconcilia placar, canais, categorias e pontos fracos', () => {
    const result = analyzeAnswers(answers);
    expect(result).toMatchObject({ answered: 4, correct: 2, missedScams: 1, falseAlarms: 1, score: 20, accuracy: 50 });
    expect(result.byCategory.get(Category.Delivery)).toMatchObject({ answered: 2, correct: 2 });
    expect(result.byChannel.get('sms')).toMatchObject({ answered: 2, correct: 0, missedScams: 1, falseAlarms: 1 });
    expect(result.weakCategories).toEqual([Category.Bank, Category.Account]);
    expect([...result.byChannel.values()].reduce((sum, row) => sum + row.answered, 0)).toBe(result.answered);
    expect([...result.byCategory.values()].reduce((sum, row) => sum + row.correct, 0)).toBe(result.correct);
  });
  it('trata partida vazia e partida perfeita sem inventar percentual ou pontos fracos', () => {
    expect(analyzeAnswers([])).toMatchObject({ accuracy: null, score: 0, weakCategories: [] });
    const correct = answers.filter(isCorrectAnswer);
    expect(analyzeAnswers(correct)).toMatchObject({ accuracy: 100, weakCategories: [] });
    expect(getProfile(0, 0).title).toBe('Treino por começar');
  });
  it('classifica os limites dos perfis sem confundir porcentagem arredondada com a faixa real', () => {
    expect(getProfile(39, 100).title).toBe('Começando a observar');
    expect(getProfile(40, 100).title).toBe('Desconfiado');
    expect(getProfile(69, 100).title).toBe('Desconfiado');
    expect(getProfile(70, 100).title).toBe('Radar ligado');
    expect(getProfile(89, 100).title).toBe('Radar ligado');
    expect(getProfile(90, 100).title).toBe('Caçador de golpes');
  });
  it('compartilha apenas os dados reais da partida, inclusive se incompleta ou vazia', () => {
    expect(shareResult(session)).toContain('2/4 acertos (50%) · 20 pontos.');
    expect(shareResult(session)).toContain('4 questões respondidas de 10.');
    expect(shareResult(session)).toContain('Golpes aceitos como seguros: 1.');
    expect(shareResult(session)).toContain('\n');
    const empty = shareResult({ ...session, answers: [] });
    expect(empty).toContain('sem respostas');
    expect(empty).not.toMatch(/NaN|Infinity|0%/);
  });
});
