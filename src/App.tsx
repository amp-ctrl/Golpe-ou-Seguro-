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
    <div className="app-container">
      {/* ===================================================================
          TELA 1: INÍCIO
          =================================================================== */}
      {screen === 'start' && (
        <section className="start-screen" aria-label="Tela Inicial">
          <div className="brand-badge">
            <span className="brand-icon" aria-hidden="true">🛡️</span>
            <span>Simulador Educativo</span>
          </div>

          <div>
            <h1 className="brand-title">Consumo Impulsivo e Golpes Digitais</h1>
            <p className="brand-slogan">Treine para não cair</p>
          </div>

          <p className="start-description">
            Analise mensagens que imitam apps do dia a dia e decida se cada uma é um <strong>golpe</strong> ou se é <strong>segura</strong>.
          </p>

          <div className="best-score-card">
            <span className="best-score-label">
              <span aria-hidden="true">🏆</span>
              <span>Melhor pontuação salva</span>
            </span>
            <span className="best-score-value">{bestScore} pts</span>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleStartGame}
          >
            Começar treino
          </button>
        </section>
      )}

      {/* ===================================================================
          TELA 2: DESAFIO + FEEDBACK
          =================================================================== */}
      {screen === 'playing' && currentChallenge && (
        <section className="challenge-screen" aria-label="Tela do Desafio">
          {/* Barra superior de status */}
          <div className="challenge-topbar">
            <div className="stats-group">
              <div className="stat-item">
                <span className="stat-label">Pontos</span>
                <span className="stat-value stat-value--points">{score}</span>
              </div>
              <div className="stat-item">
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
              Encerrar
            </button>
          </div>

          {/* Pergunta orientadora */}
          <div className="challenge-prompt">
            <h2>Esta mensagem é um golpe ou é segura?</h2>
            <p>Observe remetente, tom de urgência e links suspeitos.</p>
          </div>

          {/* Mock Realista da Mensagem (permanece visível durante o feedback) */}
          <div className="mock-container">
            {renderMock(currentChallenge)}
          </div>

          {/* Botões de Ação OU Área de Feedback */}
          {feedback === null ? (
            <div className="challenge-actions-grid">
              <button
                type="button"
                className="btn-choice btn-choice--scam"
                onClick={() => handleAnswer(true)}
              >
                <span aria-hidden="true">⚠️</span>
                <span>É golpe</span>
              </button>

              <button
                type="button"
                className="btn-choice btn-choice--safe"
                onClick={() => handleAnswer(false)}
              >
                <span aria-hidden="true">🛡️</span>
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
                    {feedback.isCorrect ? '✅' : '❌'}
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
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* ===================================================================
          TELA 3: RESUMO
          =================================================================== */}
      {screen === 'summary' && (
        <section className="summary-screen" aria-label="Tela de Resumo">
          <div className="summary-header">
            <span className="summary-badge-icon" aria-hidden="true">📊</span>
            <h1 className="summary-title">Resumo do Treino</h1>
            <p className="summary-subtitle">Confira seu desempenho nesta rodada</p>
          </div>

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
              <span className="summary-card-value summary-card-value--record">
                🏆 {bestScore} pts
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleStartGame}
          >
            Jogar de novo
          </button>
        </section>
      )}
    </div>
  );
};

export default App;

