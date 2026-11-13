import React, { useState, useEffect } from 'react';
import { INITIAL_CHALLENGES, type Challenge, type WhatsAppContent, type SmsContent, type EmailContent, type InstagramContent } from './data/challenges';
import { POINTS_PER_CORRECT_ANSWER, POINTS_PER_WRONG_ANSWER } from './config';
import { storage } from './services/storage';
import { WhatsAppMock } from './components/mocks/WhatsAppMock';
import { SmsMock } from './components/mocks/SmsMock';
import { EmailMock } from './components/mocks/EmailMock';
import { InstagramMock } from './components/mocks/InstagramMock';

type Screen = 'start' | 'playing' | 'summary';

interface FeedbackState {
  isCorrect: boolean;
  explanation: string;
  pointsEarned: number;
}

// Algoritmo Fisher-Yates para embaralhar índices
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('start');
  const [bestScore, setBestScore] = useState<number>(0);

  // Deck de desafios embaralhados para não repetir até todos terem sido vistos
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

  // Prepara novo baralho de desafios sem repetição
  const prepareDeck = () => {
    const shuffled = shuffleArray(INITIAL_CHALLENGES);
    setDeck(shuffled);
    setCurrentDeckIndex(0);
  };

  // Inicia o jogo
  const handleStartGame = () => {
    prepareDeck();
    setScore(0);
    setAnsweredCount(0);
    setCorrectCount(0);
    setFeedback(null);
    setScreen('playing');
  };

  // Desafio atual
  const currentChallenge = deck[currentDeckIndex] || INITIAL_CHALLENGES[0];

  // Processa a resposta do usuário
  const handleAnswer = (userGuessedScam: boolean) => {
    if (feedback !== null || !currentChallenge) return;

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

  // Avança para o próximo desafio
  const handleNextChallenge = () => {
    setFeedback(null);
    const nextIndex = currentDeckIndex + 1;

    // Se todos os desafios do baralho foram vistos, reembaralha sem repetições
    if (nextIndex >= deck.length) {
      const reshuffled = shuffleArray(INITIAL_CHALLENGES);
      setDeck(reshuffled);
      setCurrentDeckIndex(0);
    } else {
      setCurrentDeckIndex(nextIndex);
    }
  };

  // Encerra a partida e vai para a tela de resumo
  const handleQuit = () => {
    const updatedBest = storage.saveBestScore(score);
    setBestScore(updatedBest);
    setScreen('summary');
  };

  // Renderiza o mock adequado com base no canal
  const renderMock = (challenge: Challenge) => {
    switch (challenge.channel) {
      case 'whatsapp':
        return <WhatsAppMock content={challenge.content as WhatsAppContent} />;
      case 'sms':
        return <SmsMock content={challenge.content as SmsContent} />;
      case 'email':
        return <EmailMock content={challenge.content as EmailContent} />;
      case 'instagram':
        return <InstagramMock content={challenge.content as InstagramContent} />;
      default:
        return null;
    }
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
                <WhatsAppMock content={INITIAL_CHALLENGES[0].content as WhatsAppContent} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================
          TELA 2: DESAFIO + FEEDBACK (INALTERADA)
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

          {/* Pergunta orientadora compacta */}
          <div className="challenge-prompt">
            <h2>Esta mensagem é um golpe ou é segura?</h2>
            <p>Observe remetente, tom de urgência e links suspeitos.</p>
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
              {renderMock(currentChallenge)}
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
                  <span>É seguro</span>
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
                  <span>Próximo desafio</span>
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
          TELA 3: RESUMO (INALTERADA)
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
            <h1 className="summary-title">Resumo do Treino</h1>
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
