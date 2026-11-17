import type { Challenge } from '../data/challenges';

export function QuestionExplanation({ challenge }: { challenge: Challenge }) {
  const signals = challenge.redFlags.length ? challenge.redFlags : [
    'Contexto da mensagem reconhecido', 'Sem pedido de senha ou código a terceiros',
  ];
  return (
    <div className="question-explanation">
      <p className="explanation-copy">{challenge.explanation}</p>
      <div>
        <h3>{challenge.isScam ? 'Sinais de alerta' : 'Sinais de confiança neste cenário'}</h3>
        <ul className="signal-chips">
          {signals.map((signal) => <li className={`signal-chip ${challenge.isScam ? 'signal-chip--alert' : ''}`} key={signal}>{signal}</li>)}
        </ul>
      </div>
      <div className="verification-block">
        <h3>Como confirmar</h3>
        <p>{challenge.howToVerify}</p>
      </div>
    </div>
  );
}
