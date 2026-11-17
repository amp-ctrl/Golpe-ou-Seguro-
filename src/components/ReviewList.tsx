import { INITIAL_CHALLENGES } from '../data/challenges';
import { CATEGORY_INFO, CHANNEL_LABELS } from '../data/guidance';
import { isCorrectAnswer, type AnswerRecord } from '../services/results';
import { ChallengeMock } from './ChallengeMock';
import { QuestionExplanation } from './QuestionExplanation';

export function ReviewList({ answers }: { answers: readonly AnswerRecord[] }) {
  return (
    <section className="result-review" aria-labelledby="review-title">
      <div className="section-heading"><h2 id="review-title">Revisão completa</h2><p>Abra uma questão para rever a mensagem e o motivo da resposta.</p></div>
      {answers.length ? <div className="review-grid">{answers.map((answer, index) => {
        const challenge = INITIAL_CHALLENGES.find(({ id }) => id === answer.challengeId);
        if (!challenge) return null;
        const correct = isCorrectAnswer(answer);
        return (
          <details className="review-item" key={answer.challengeId} name="question-review">
            <summary>
              <span className="review-item-title"><span>{String(index + 1).padStart(2, '0')} · {CHANNEL_LABELS[answer.channel]}</span><strong>{CATEGORY_INFO[answer.category].label}</strong></span>
              <span className={`review-outcome ${correct ? 'review-outcome--correct' : ''}`}>{correct ? 'Acertou' : 'Rever erro'} <span aria-hidden="true">+</span></span>
            </summary>
            <div className="review-body">
              <p className="review-answers">Sua resposta: <strong>{answer.guessedScam ? 'Golpe' : 'Segura'}</strong> · Resposta certa: <strong>{answer.isScam ? 'Golpe' : 'Segura'}</strong></p>
              <p className="review-context">{challenge.context}</p>
              <div className="review-mock"><ChallengeMock challenge={challenge} showHighlights /></div>
              <QuestionExplanation challenge={challenge} />
            </div>
          </details>
        );
      })}</div> : <p className="empty-message">Nenhuma resposta nesta partida. Comece outro treino para montar sua revisão.</p>}
    </section>
  );
}
