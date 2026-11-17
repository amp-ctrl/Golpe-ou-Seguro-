import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_CHALLENGES, type Challenge } from './data/challenges';
import { POINTS_PER_CORRECT_ANSWER, POINTS_PER_WRONG_ANSWER } from './config';
import { storage } from './services/storage';

import { ChallengeMock } from './components/ChallengeMock';
import { buildSession, SESSION_SIZES, type SessionSize } from './services/sessionBuilder';

type Screen = 'start' | 'playing' | 'summary';

interface FeedbackState {
  isCorrect: boolean;
  explanation: string;
  pointsEarned: number;
}

export const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('start');
  const [bestScore, setBestScore] = useState<number>(0);

  const [sessionSize, setSessionSize] = useState<SessionSize>(10);
  const [startError, setStartError] = useState('');
  const promptRef = useRef<HTMLHeadingElement>(null);
  const answerLock = useRef(false);

  // Partida finita, sem reembaralhamento durante o treino.
  const [deck, setDeck] = useState<Challenge[]>([]);
  const [currentDeckIndex, setCurrentDeckIndex] = useState<number>(0);

  // Estatísticas da partida atual
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Estado de feedback do desafio atual
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // Carrega a melhor pontuação inicial do storage
  useEffect(() => {
    setBestScore(storage.getBestScore());
  }, []);

  useEffect(() => {
    if (screen !== 'start') promptRef.current?.focus();
  }, [screen, currentDeckIndex]);
  // Inicia o jogo
  const handleStartGame = () => {
    let session: Challenge[];
    try {
      session = buildSession(INITIAL_CHALLENGES, { size: sessionSize, history: storage.getSeenSessions() });
    } catch (error) {
      setStartError(error instanceof Error ? error.message : 'Não foi possível iniciar o treino.');
      return;
    }
    setStartError('');
    setDeck(session);
    setCurrentDeckIndex(0);
    storage.startSeenSession(session[0].id);
    answerLock.current = false;
    setScore(0);
    setAnsweredCount(0);
    setCorrectCount(0);
    setFeedback(null);
    setScreen('playing');
  };

  // Desafio atual
  const currentChallenge = deck[currentDeckIndex];

  // Processa a resposta do usuário
  const handleAnswer = (userGuessedScam: boolean) => {
    if (answerLock.current || feedback !== null || !currentChallenge) return;
    answerLock.current = true;

    const isCorrect = userGuessedScam === currentChallenge.isScam;
    const pointsEarned = isCorrect ? POINTS_PER_CORRECT_ANSWER : POINTS_PER_WRONG_ANSWER;
    const newScore = score + pointsEarned;

    setScore(newScore);
    setAnsweredCount((prev) => prev + 1);
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    // Salva a melhor pontuação no storage
    const updatedBest = storage.saveBestScore(newScore);
    setBestScore(updatedBest);

    setFeedback({
      isCorrect,
      explanation: currentChallenge.explanation,
      pointsEarned,
    });
  };

  // A última resposta mantém sua explicação; “Ver resumo” conclui a partida.
  const handleNextChallenge = () => {
    if (feedback === null) return;
    if (currentDeckIndex + 1 >= deck.length) {
      handleQuit();
      return;
    }
    const nextIndex = currentDeckIndex + 1;
    storage.recordSeenChallenge(deck[nextIndex].id);
    setCurrentDeckIndex(nextIndex);
    setFeedback(null);
    answerLock.current = false;
  };
  // Encerra a partida e vai para a tela de resumo
  const handleQuit = () => {
    const updatedBest = storage.saveBestScore(score);
    setBestScore(updatedBest);
    setScreen('summary');
  };

  return (
    <div className={`app-container ${screen === 'start' ? 'app-container--start' : ''}`}>
      {/* ===================================================================
          TELA 1: INÍCIO (OPÇÃO A: O PRÓPRIO JOGO COMO PROTAGONISTA)
          =================================================================== */}
      {screen === 'start' && (
        <section className="start-screen" aria-label="Tela Inicial">
          {/* Coluna da Esquerda: Textos e Ação */}
          <div className="start-content-column">
            <div className="start-text-group">
              <h1 className="brand-title">Consumo Impulsivo e Golpes Digitais</h1>
              <p className="brand-slogan">Treine para não cair</p>
              <p className="start-description">
                Analise mensagens que imitam apps do dia a dia e decida se cada uma é um <strong>golpe</strong> ou se é <strong>segura</strong>.
              </p>
            </div>

            <div className="start-action-group">
              <fieldset className="session-size-picker">
                <legend>Questões por partida</legend>
                <div className="session-size-options">
                  {SESSION_SIZES.map((size) => (
                    <label key={size}>
                      <input type="radio" name="session-size" value={size} checked={sessionSize === size} onChange={() => setSessionSize(size)} />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {startError && <p role="alert">{startError}</p>}
              <button
                type="button"
                className="btn-primary btn-start"
                onClick={handleStartGame}
              >
                <span>Começar treino</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <div className="best-score-inline">
                <svg className="score-icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                </svg>
                <span className="best-score-label">Melhor pontuação salva</span>
                <span className="best-score-separator" aria-hidden="true">•</span>
                <span className="best-score-value">{bestScore} pts</span>
              </div>
            </div>
          </div>

          {/* Coluna da Direita (Desktop) / Abaixo (Mobile): Preview Realista do Mock */}
          <div className="start-preview-column" aria-hidden="true">
            <div className="device-chassis device-chassis--preview">
              <div className="device-status-bar">
                <span className="device-clock">14:32</span>
                <div className="device-camera-notch" />
                <div className="device-indicators">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="16" width="3" height="6" rx="1" />
                    <rect x="7" y="12" width="3" height="10" rx="1" />
                    <rect x="12" y="8" width="3" height="14" rx="1" />
                    <rect x="17" y="4" width="3" height="18" rx="1" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="6" width="18" height="12" rx="2" />
                    <line x1="23" y1="11" x2="23" y2="13" />
                    <rect x="3" y="8" width="11" height="8" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="device-screen-content">
                <ChallengeMock challenge={INITIAL_CHALLENGES[0]} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================
          TELA 2: PARTIDA + FEEDBACK
          =================================================================== */}
      {screen === 'playing' && currentChallenge && (
        <section className="challenge-screen" aria-label="Tela do Desafio">
          {/* Barra superior de status estilo régua métrica editorial */}
          <header className="challenge-topbar">
            <div className="stats-ticker">
              <div className="ticker-item">
                <span className="stat-label">Pontos</span>
                <span className="stat-value stat-value--points">{score}</span>
              </div>
              <div className="ticker-divider" aria-hidden="true" />
              <div className="ticker-item">
                <span className="stat-label">Respondidos</span>
                <span className="stat-value">{answeredCount}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-quit"
              onClick={handleQuit}
              aria-label="Encerrar partida e ver resumo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Encerrar</span>
            </button>
          </header>

          <div className="session-progress">
            <p id="session-progress-label" aria-live="polite">Questão {currentDeckIndex + 1} de {deck.length}</p>
            <progress aria-labelledby="session-progress-label" aria-valuetext={`${answeredCount} de ${deck.length} questões respondidas`} value={answeredCount} max={deck.length} />
          </div>
          {/* Pergunta orientadora compacta */}
          <div className="challenge-prompt">
            <h2 ref={promptRef} tabIndex={-1}>Esta mensagem é um golpe ou é segura?</h2>
            <p className="challenge-context">{currentChallenge.context}</p>
          </div>

          {/* Moldura física de Smartphone Simulando Mensagem Real */}
          <div className="device-chassis">
            {/* Barra de Status do Sistema Operacional */}
            <div className="device-status-bar" aria-hidden="true">
              <span className="device-clock">14:32</span>
              <div className="device-camera-notch" />
              <div className="device-indicators">
                {/* Sinal de rede */}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="16" width="3" height="6" rx="1" />
                  <rect x="7" y="12" width="3" height="10" rx="1" />
                  <rect x="12" y="8" width="3" height="14" rx="1" />
                  <rect x="17" y="4" width="3" height="18" rx="1" />
                </svg>
                {/* Wi-Fi */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
                {/* Bateria */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="6" width="18" height="12" rx="2" />
                  <line x1="23" y1="11" x2="23" y2="13" />
                  <rect x="3" y="8" width="11" height="8" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Conteúdo do Mock dentro do Smartphone */}
            <div className="device-screen-content">
              <ChallengeMock challenge={currentChallenge} />
            </div>
          </div>

          {/* Ações Inferiores OU Bloco de Feedback */}
          <div className="challenge-bottom-dock">
            {feedback === null ? (
              <div className="challenge-actions-grid">
                <button
                  type="button"
                  className="btn-choice btn-choice--scam"
                  onClick={() => handleAnswer(true)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>É golpe</span>
                </button>

                <button
                  type="button"
                  className="btn-choice btn-choice--safe"
                  onClick={() => handleAnswer(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  <span>É segura</span>
                </button>
              </div>
            ) : (
              <div
                className={`feedback-card ${feedback.isCorrect ? 'feedback-card--correct' : 'feedback-card--incorrect'}`}
                role="region"
                aria-live="polite"
                aria-label="Feedback da sua resposta"
              >
                <div className="feedback-header">
                  <div className="feedback-title-group">
                    <span className="feedback-icon" aria-hidden="true">
                      {feedback.isCorrect ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </span>
                    <span className="feedback-title">
                      {feedback.isCorrect ? 'Você acertou!' : 'Você errou!'}
                    </span>
                  </div>
                  <span className="feedback-points-tag">
                    {feedback.isCorrect ? `+${feedback.pointsEarned} pts` : '+0 pts'}
                  </span>
                </div>

                <p className="feedback-explanation">
                  {feedback.explanation}
                </p>

                <button
                  type="button"
                  className="btn-next"
                  onClick={handleNextChallenge}
                  autoFocus
                >
                  <span>{currentDeckIndex + 1 === deck.length ? 'Ver resumo' : 'Próximo desafio'}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===================================================================
          TELA 3: RESUMO
          =================================================================== */}
      {screen === 'summary' && (
        <section className="summary-screen" aria-label="Tela de Resumo">
          <header className="summary-header">
            <div className="summary-icon-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h1 className="summary-title" ref={promptRef} tabIndex={-1}>Resumo do Treino</h1>
            <p className="summary-subtitle">Confira seu desempenho nesta rodada</p>
          </header>

          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-card-label">Pontos nesta rodada</span>
              <span className="summary-card-value summary-card-value--highlight">{score}</span>
            </div>

            <div className="summary-card">
              <span className="summary-card-label">Acertos</span>
              <span className="summary-card-value">
                {correctCount} / {answeredCount}
              </span>
            </div>

            <div className="summary-card summary-card--full">
              <span className="summary-card-label">Melhor pontuação histórica</span>
              <div className="summary-record-row">
                <svg className="summary-record-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                </svg>
                <span className="summary-card-value summary-card-value--record">
                  {bestScore} pts
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleStartGame}
          >
            <span>Jogar de novo</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </section>
      )}
    </div>
  );
};

export default App;
