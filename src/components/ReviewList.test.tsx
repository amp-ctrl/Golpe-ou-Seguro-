import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { INITIAL_CHALLENGES } from '../data/challenges';
import type { AnswerRecord } from '../services/results';
import { ReviewList } from './ReviewList';

function renderReview(id: string, guessedScam: boolean): string {
  const challenge = INITIAL_CHALLENGES.find((item) => item.id === id);
  if (!challenge) throw new Error('Questão ausente');
  const answer: AnswerRecord = { challengeId: id, guessedScam, isScam: challenge.isScam, category: challenge.category, channel: challenge.channel, points: guessedScam === challenge.isScam ? 10 : 0 };
  return renderToStaticMarkup(<ReviewList answers={[answer]} />);
}

describe('revisão das mensagens', () => {
  it('mantém a publicação legítima intacta, sem marcações na mensagem', () => {
    const markup = renderReview('ch-60', false);
    expect(markup).toContain('Não cobramos frete');
    expect(markup).not.toContain('<mark');
    expect(markup).not.toContain('Sinais de confiança neste cenário');
    expect(markup).toContain('O que observar');
    expect(markup).toContain('Como agir');
  });

  it('apresenta o veredito real mesmo quando a pessoa escolheu a resposta oposta', () => {
    expect(renderReview('ch-60', true)).toContain('review-status--safe');
    expect(renderReview('ch-01', false)).toContain('review-status--scam');
    expect(renderReview('ch-60', true)).toContain('Rever erro');
    expect(renderReview('ch-01', true)).toContain('Acertou');
  });

  it('oferece explicação curta em todas as questões e sinais específicos nas legítimas', () => {
    for (const challenge of INITIAL_CHALLENGES) {
      expect(challenge.reviewSummary.length, challenge.id).toBeGreaterThan(0);
      if (!challenge.isScam) expect(challenge.observedSignals?.length, challenge.id).toBeGreaterThanOrEqual(2);
      expect(renderReview(challenge.id, challenge.isScam), challenge.id).not.toContain('Contexto da mensagem reconhecido');
    }
  });
});
