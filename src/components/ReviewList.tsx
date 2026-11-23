import { useRef } from 'react';
import { INITIAL_CHALLENGES, type Challenge } from '../data/challenges';
import { CATEGORY_INFO, CHANNEL_LABELS } from '../data/guidance';
import { isCorrectAnswer, type AnswerRecord } from '../services/results';
import { ChallengeMock } from './ChallengeMock';
import { QuestionExplanation } from './QuestionExplanation';

function ReviewItem({ answer, challenge, index }: { answer: AnswerRecord; challenge: Challenge; index: number }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const correct = isCorrectAnswer(answer);
  const close = () => {
    if (detailsRef.current) detailsRef.current.open = false;
    summaryRef.current?.focus({ preventScroll: true });
  };
  return <details ref={detailsRef} className="review-item" name="question-review">
    <summary ref={summaryRef}>
      <span className="review-item-title"><span>{String(index + 1).padStart(2, '0')} · {CHANNEL_LABELS[answer.channel]}</span><strong>{CATEGORY_INFO[answer.category].label}</strong></span>
      <span className={`review-outcome ${correct ? 'review-outcome--correct' : ''}`}>{correct ? 'Acertou' : 'Rever erro'}</span>
      <span className="review-toggle" aria-hidden="true">+</span>
    </summary>
    <button type="button" className="review-close" aria-label={`Fechar revisão da questão ${index + 1}`} onClick={close}>
      Fechar <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
    </button>
    <div className="review-body">
      <div className="review-message-column">
        <div className="review-mock"><ChallengeMock challenge={challenge} /></div>
        <p className="review-context"><span>Contexto</span>{challenge.context}</p>
      </div>
      <div className={`review-analysis ${challenge.isScam ? 'review-analysis--scam' : 'review-analysis--safe'}`}>
        <header className="review-analysis-header">
          <span className={`review-status ${challenge.isScam ? 'review-status--scam' : 'review-status--safe'}`}>{challenge.isScam ? 'Golpe' : 'Segura'}</span>
          <p>Você marcou: <strong>{answer.guessedScam ? 'golpe' : 'segura'}</strong></p>
        </header>
        <QuestionExplanation challenge={challenge} variant="review" />
      </div>
    </div>
  </details>;
}

export function ReviewList({ answers }: { answers: readonly AnswerRecord[] }) {
  return <section className="result-review" aria-labelledby="review-title">
    <div className="section-heading"><h2 id="review-title">Revisão completa</h2><p>Confira os sinais de cada mensagem.</p></div>
    {answers.length ? <div className="review-grid">{answers.map((answer, index) => {
      const challenge = INITIAL_CHALLENGES.find(({ id }) => id === answer.challengeId);
      return challenge ? <ReviewItem key={answer.challengeId} answer={answer} challenge={challenge} index={index} /> : null;
    })}</div> : <p className="empty-message">Responda às questões para ver a revisão.</p>}
  </section>;
}
