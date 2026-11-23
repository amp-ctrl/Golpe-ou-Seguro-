import { INITIAL_CHALLENGES } from '../data/challenges';
import type { SessionSize } from '../services/sessionBuilder';
import { ExampleCarousel } from './ExampleCarousel';
import { HowItWorks } from './HowItWorks';
import { SessionSizePicker } from './SessionSizePicker';
import { StatsStrip } from './StatsStrip';

interface Props {
  bestScore: number;
  sessionSize: SessionSize;
  onSessionSizeChange: (size: SessionSize) => void;
  onStart: () => void;
  onGuide: () => void;
  error: string;
}

export function StartScreen({ bestScore, sessionSize, onSessionSizeChange, onStart, onGuide, error }: Props) {
  return (
    <main className="start-screen" aria-labelledby="start-title">
      <div className="start-content-column">
        <header className="start-intro">
          <p className="start-eyebrow"><span aria-hidden="true" /> Educação digital na prática</p>
          <h1 className="brand-title" id="start-title" tabIndex={-1}>Consumo impulsivo e golpes digitais</h1>
          <p className="brand-slogan">Treine para não cair</p>
          <p className="start-description">
            Analise mensagens que imitam apps do dia a dia e decida se cada uma é um <strong>golpe</strong> ou se é <strong>segura</strong>.
          </p>
        </header>
        <div className="start-action-group">
          <SessionSizePicker value={sessionSize} onChange={onSessionSizeChange} />
          {error && <p role="alert">{error}</p>}
          <div className="start-launch-actions">
            <button type="button" className="btn-primary btn-start" onClick={onStart}>
              <span>Começar treino</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
            <button type="button" className="btn-guide" onClick={onGuide}>Guia de golpes</button>
          </div>
          <p className="best-score-inline"><span>Melhor pontuação salva</span><strong>{bestScore} <span>pts</span></strong></p>
        </div>
        <div className="start-learning">
          <HowItWorks />
          <StatsStrip challenges={INITIAL_CHALLENGES} />
        </div>
      </div>
      <ExampleCarousel challenges={INITIAL_CHALLENGES} />
    </main>
  );
}
