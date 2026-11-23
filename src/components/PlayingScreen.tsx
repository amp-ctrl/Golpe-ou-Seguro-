import { useEffect, useRef } from 'react';
import type { Challenge } from '../data/challenges';
import { CATEGORY_INFO, CHANNEL_LABELS } from '../data/guidance';
import { isCorrectAnswer, type AnswerRecord } from '../services/results';
import { ChallengeMock } from './ChallengeMock';
import { ExamplePhone } from './ExamplePhone';
import { QuestionExplanation } from './QuestionExplanation';

interface Props {
  challenge: Challenge;
  index: number;
  size: number;
  answeredCount: number;
  score: number;
  answer?: AnswerRecord;
  focused: boolean;
  focusCount: number;
  onAnswer: (isScam: boolean) => void;
  onNext: () => void;
  onQuit: () => void;
}
export function PlayingScreen({ challenge, index, size, answeredCount, score, answer, focused, focusCount, onAnswer, onNext, onQuit }: Props) {
  const questionRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { questionRef.current?.focus(); }, [challenge.id]);
  useEffect(() => { if (answer) feedbackRef.current?.focus(); }, [answer]);

  return (
    <main className="playing-screen" aria-label="Treino de mensagens">
      <header className="playing-topbar">
        <p className="playing-score"><span>Pontos</span> <strong>{score}</strong></p>
        <span className={`playing-mode ${focused ? 'playing-mode--focused' : ''}`}>{focused ? `Treino focado · ${focusCount} de ${size} questões nos temas escolhidos` : 'Uma pausa antes do clique'}</span>
        <button type="button" className="button-secondary quit-training" onClick={onQuit}>Encerrar</button>
      </header>
      <div className="session-progress">
        <p id="session-progress-label" aria-live="polite">Questão {index + 1} de {size}</p>
        <progress aria-labelledby="session-progress-label" aria-valuetext={`Questões respondidas: ${answeredCount} de ${size}`} value={answeredCount} max={size} />
      </div>
      <div className="playing-stage">
        <div className="playing-context">
          <p className="question-meta">{CHANNEL_LABELS[challenge.channel]} <span aria-hidden="true">/</span> {CATEGORY_INFO[challenge.category].label}</p>
          <h1 ref={questionRef} tabIndex={-1}>Esta mensagem é um golpe ou é segura?</h1>
          <p className="context-copy">{challenge.context}</p>
        </div>
        <div className="playing-phone">
          <ExamplePhone messageId={challenge.id} variant="game">
            <ChallengeMock challenge={challenge} showHighlights={Boolean(answer)} />
          </ExamplePhone>
        </div>
        <div className="playing-response">
          {answer ? (
            <section className={`answer-feedback ${isCorrectAnswer(answer) ? 'answer-feedback--correct' : 'answer-feedback--incorrect'}`} aria-label="Explicação da resposta" aria-live="polite">
              <div className="answer-feedback-heading">
                <h2 ref={feedbackRef} tabIndex={-1}>{isCorrectAnswer(answer) ? 'Você acertou!' : 'Você errou.'}</h2>
                <span>+{answer.points} pts</span>
              </div>
              <p className="answer-verdict">Resposta certa: <strong>{challenge.isScam ? 'É golpe' : 'É segura'}</strong></p>
              <QuestionExplanation challenge={challenge} />
              <button type="button" className="btn-primary next-question" onClick={onNext}>{index + 1 === size ? 'Ver resultado' : 'Próximo desafio'} <span aria-hidden="true">→</span></button>
            </section>
          ) : (
            <div className="decision-area">
              <p>Leia a mensagem e considere o contexto antes de decidir.</p>
              <div className="challenge-actions-grid">
                <button type="button" className="btn-choice btn-choice--scam" onClick={() => onAnswer(true)}>É golpe</button>
                <button type="button" className="btn-choice btn-choice--safe" onClick={() => onAnswer(false)}>É segura</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
