import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { INITIAL_CHALLENGES } from '../data/challenges';
import { shareResult, type AnswerRecord, type SessionRecord } from '../services/results';
import { ResultScreen } from './ResultScreen';

const samples = ['ch-01', 'ch-08'].map((id) => {
  const challenge = INITIAL_CHALLENGES.find((item) => item.id === id);
  if (!challenge) throw new Error('Questão ausente');
  return challenge;
});
function sessionFor(count: number, correct = false): SessionRecord {
  const answers: AnswerRecord[] = samples.slice(0, count).map((challenge) => ({
    challengeId: challenge.id, guessedScam: correct ? challenge.isScam : !challenge.isScam,
    isScam: challenge.isScam, channel: challenge.channel, category: challenge.category,
    points: correct ? 10 : 0,
  }));
  return { id: 'copy-review', startedAt: '2026-11-23T12:00:00Z', finishedAt: '2026-11-23T12:01:00Z', size: 10, mode: 'standard', focusCategories: [], answers };
}
function render(session: SessionRecord): string {
  const markup = renderToStaticMarkup(<ResultScreen session={session} bestScore={20} lifetimeStats={{}} onRestart={() => {}} onFocused={() => {}} onHome={() => {}} error="" />);
  return markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}
describe('concordância nos resultados', () => {
  it('trata zero, uma e duas respostas na interface e no texto para compartilhar', () => {
    for (const [count, text] of [[0, '0 questões respondidas de 10'], [1, '1 questão respondida de 10'], [2, '2 questões respondidas de 10']] as const) {
      const session = sessionFor(count);
      expect(render(session)).toContain(text);
      expect(shareResult(session)).toContain(text + '.');
    }
  });
  it('usa erro e erros conforme a contagem da categoria', () => {
    expect(render(sessionFor(1))).toContain('1 erro');
    expect(render(sessionFor(2))).toContain('2 erros');
    expect(render(sessionFor(1))).not.toContain('1 erros');
    expect(render(sessionFor(2))).not.toContain('erro(s)');
  });
  it('usa acerto e resposta no singular, na interface e no compartilhamento', () => {
    const session = sessionFor(1, true);
    expect(render(session)).toContain('1 acerto em 1 resposta');
    expect(render(session)).not.toContain('1 acertos');
    expect(shareResult(session)).toContain('1/1 acerto (100%)');
  });
});
