import { useEffect, useRef, useState } from 'react';
import { formatCount } from '../services/text';
import type { Category } from '../data/challenges';
import { CATEGORY_INFO, CHANNEL_LABELS } from '../data/guidance';
import { analyzeAnswers, getProfile, shareResult, type CategoryStats, type SessionRecord } from '../services/results';
import { PerformanceBars } from './PerformanceBars';
import { ReviewList } from './ReviewList';
import { RecoverySteps, SafetyChecklist } from './SafetyGuidance';

interface Props {
  session: SessionRecord;
  bestScore: number;
  lifetimeStats: Partial<Record<Category, CategoryStats>>;
  onRestart: () => void;
  onFocused: (categories: Category[]) => void;
  onHome: () => void;
  error: string;
}
const CATEGORY_LABELS = Object.fromEntries(Object.entries(CATEGORY_INFO).map(([key, value]) => [key, value.label]));

export function ResultScreen({ session, bestScore, lifetimeStats, onRestart, onFocused, onHome, error }: Props) {
  const stats = analyzeAnswers(session.answers);
  const profile = getProfile(stats.correct, stats.answered);
  const [copyStatus, setCopyStatus] = useState('');
  const [manualCopy, setManualCopy] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLTextAreaElement>(null);
  const shareText = shareResult(session);
  useEffect(() => { headingRef.current?.focus(); }, [session.id]);
  useEffect(() => { if (manualCopy) { copyRef.current?.focus(); copyRef.current?.select(); } }, [manualCopy]);
  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Área de transferência indisponível');
      await navigator.clipboard.writeText(shareText);
      setManualCopy(false); setCopyStatus('Resultado copiado.');
    } catch { setManualCopy(true); setCopyStatus('Selecione e copie o texto abaixo.'); }
  };
  return (
    <main className="result-screen" aria-labelledby="result-title">
      <header className="result-header">
        <div><p className="result-eyebrow">Resumo da partida</p><h1 id="result-title" tabIndex={-1} ref={headingRef}>Resultado do treino</h1><p>{formatCount(stats.answered, 'questão respondida', 'questões respondidas')} de {session.size}{stats.answered < session.size ? ' · encerrado antes do fim' : ' · partida concluída'}</p></div>
        <button type="button" className="button-secondary" onClick={onHome}>Voltar ao início</button>
      </header>
      <div className="result-overview">
        <section className="result-card score-card" aria-label="Placar e perfil">
          <p className="card-eyebrow">Pontuação da partida</p>
          <div className="score-line"><strong className="final-score">{stats.score}</strong><span>{stats.score === 1 ? 'ponto' : 'pontos'}</span><div className="accuracy"><strong>{stats.accuracy === null ? '—' : `${stats.accuracy}%`}</strong><span>de acerto</span></div></div>
          <p className="score-detail">{formatCount(stats.correct, 'acerto', 'acertos')} em {formatCount(stats.answered, 'resposta', 'respostas')} · melhor pontuação: {bestScore} pts</p>
          <div className="profile-block"><p className="card-eyebrow">Seu perfil nesta partida</p><h2>{profile.title}</h2><p>{profile.text}</p></div>
          <div className="result-actions">
            <button type="button" className="btn-primary" onClick={onRestart}>Jogar de novo <span aria-hidden="true">→</span></button>
            <button type="button" className="button-secondary focused-training" disabled={!stats.weakCategories.length} onClick={() => onFocused(stats.weakCategories)}>Treinar só meus pontos fracos</button>
            <p className="focus-explainer">{stats.weakCategories.length ? 'O próximo treino prioriza os temas em que você errou.' : 'Nenhum erro nesta partida.'}</p>
            <button type="button" className="button-secondary copy-result" onClick={() => void copy()}>Copiar meu resultado</button>
            {copyStatus && <p role="status" className="copy-status">{copyStatus}</p>}
            {manualCopy && <textarea className="share-fallback" ref={copyRef} readOnly value={shareText} rows={7} aria-label="Texto do resultado para copiar" onFocus={(event) => event.currentTarget.select()} />}
            {error && <p role="alert">{error}</p>}
          </div>
        </section>
        <div className="result-insights">
          <section className="error-indicators" aria-label="Dois tipos de erro">
            <div className="result-card error-indicator"><strong>{stats.missedScams}</strong><h2>Golpes em que você caiu</h2><p>Confira os sinais antes de enviar dinheiro ou dados.</p></div>
            <div className="result-card error-indicator"><strong>{stats.falseAlarms}</strong><h2>Mensagens legítimas marcadas como golpe</h2><p>Confirme a origem antes de descartar a mensagem.</p></div>
          </section>
          <section className="result-card weak-spots" aria-labelledby="weak-title"><h2 id="weak-title">Seus pontos fracos</h2>
            {stats.weakCategories.length ? <ul>{stats.weakCategories.map((category) => {
              const current = stats.byCategory.get(category);
              const lifetime = lifetimeStats[category];
              const errors = current ? current.answered - current.correct : 0;
              return <li key={category}><h3>{CATEGORY_INFO[category].label} <span>{formatCount(errors, 'erro', 'erros')}</span></h3><p>{CATEGORY_INFO[category].tip}</p>{lifetime && <p className="lifetime-note">Histórico acumulado: {lifetime.correct}/{lifetime.answered} {lifetime.correct === 1 ? 'acerto' : 'acertos'} neste tema.</p>}</li>;
            })}</ul> : <p className="empty-message">{stats.answered ? 'Nenhum erro nesta partida.' : 'Responda às questões para identificar seus pontos de atenção.'}</p>}
          </section>
        </div>
      </div>
      <div className="result-performance-grid">
        <PerformanceBars title="Desempenho por canal" labels={CHANNEL_LABELS} rows={[...stats.byChannel].map(([id, value]) => ({ id, ...value }))} />
        <PerformanceBars title="Desempenho por categoria" labels={CATEGORY_LABELS} className="category-performance" rows={[...stats.byCategory].map(([id, value]) => ({ id, ...value }))} />
      </div>
      <ReviewList answers={session.answers} />
      <div className="result-safety-grid"><SafetyChecklist /><RecoverySteps /></div>
    </main>
  );
}
