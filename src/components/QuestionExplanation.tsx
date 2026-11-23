import type { Challenge } from '../data/challenges';

export function QuestionExplanation({ challenge, variant = 'training' }: { challenge: Challenge; variant?: 'training' | 'review' }) {
  const review = variant === 'review';
  const signals = challenge.isScam ? challenge.redFlags : challenge.observedSignals ?? [];
  return (
    <div className={`question-explanation${review ? ' question-explanation--review' : ''}`}>
      <p className="explanation-copy">{review ? challenge.reviewSummary : challenge.explanation}</p>
      {signals.length > 0 && <section>
        <h3>O que observar</h3>
        <ul className={review ? 'observed-signals' : 'signal-chips'}>
          {signals.map((signal) => <li className={review ? undefined : `signal-chip ${challenge.isScam ? 'signal-chip--alert' : ''}`} key={signal}>{signal}</li>)}
        </ul>
      </section>}
      <section className={review ? 'review-action' : 'verification-block'}>
        <h3>Como agir</h3>
        <p>{challenge.howToVerify}</p>
      </section>
    </div>
  );
}
