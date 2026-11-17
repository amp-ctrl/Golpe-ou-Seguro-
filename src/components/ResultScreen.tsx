import { useEffect, useRef, useState } from 'react';
import type { Category } from '../data/challenges';
import { CATEGORY_INFO, CHANNEL_LABELS } from '../data/guidance';
import { analyzeAnswers, getProfile, shareResult, type CategoryStats, type SessionRecord } from '../services/results';
import { PerformanceBars } from './PerformanceBars';
import { ReviewList } from './ReviewList';
import { RecoverySteps, SafetyChecklist } from './SafetyGuidance';

interface Props {
  session: SessionRecord;
  bestScore: number;
  history: SessionRecord[];
  lifetimeStats: Partial<Record<Category, CategoryStats>>;
  onRestart: () => void;
  onFocused: (categories: Category[]) => void;
  onHome: () => void;
  error: string;
}
const CATEGORY_LABELS = Object.fromEntries(Object.entries(CATEGORY_INFO).map(([key, value]) => [key, value.label]));
const formatDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });

export function ResultScreen({ session, bestScore, history, lifetimeStats, onRestart, onFocused, onHome, error }: Props) {
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
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard indisponível');
      await navigator.clipboard.writeText(shareText);
      setManualCopy(false); setCopyStatus('Resultado copiado.');
    } catch { setManualCopy(true); setCopyStatus('Selecione e copie o texto abaixo.'); }
  };
  return (
    <main className="result-screen" aria-labelledby="result-title">
      <header className="result-header">
        <div><p className="result-eyebrow">Seu treino, em perspectiva</p><h1 id="result-title" tabIndex={-1} ref={headingRef}>Resultado do treino</h1><p>{stats.answered} de {session.size} questões respondidas{stats.answered < session.size ? ' · encerrado antes do fim' : ' · partida concluída'}</p></div>
        <button type="button" className="button-secondary" onClick={onHome}>Voltar ao início</button>
      </header>
      <div className="result-overview">
        <section className="result-card score-card" aria-label="Placar e perfil">
          <p className="card-eyebrow">Pontuação da partida</p>
          <div className="score-line"><strong className="final-score">{stats.score}</strong><span>pontos</span><div className="accuracy"><strong>{stats.accuracy === null ? '—' : `${stats.accuracy}%`}</strong><span>de acerto</span></div></div>
          <p className="score-detail">{stats.correct} acertos em {stats.answered} respostas · melhor pontuação: {bestScore} pts</p>
          <div className="profile-block"><p className="card-eyebrow">Seu perfil nesta partida</p><h2>{profile.title}</h2><p>{profile.text}</p></div>
          <div className="result-actions">
            <button type="button" className="btn-primary" onClick={onRestart}>Jogar de novo <span aria-hidden="true">→</span></button>
            <button type="button" className="button-secondary focused-training" disabled={!stats.weakCategories.length} onClick={() => onFocused(stats.weakCategories)}>Treinar só meus pontos fracos</button>
            <p className="focus-explainer">{stats.weakCategories.length ? 'O treino prioriza os temas em que você errou. Outros temas entram quando necessário para manter a variedade e o equilíbrio entre golpe e segura.' : 'Sem erros nesta partida. Jogue de novo para continuar praticando.'}</p>
            <button type="button" className="button-secondary copy-result" onClick={() => void copy()}>Copiar meu resultado</button>
            {copyStatus && <p role="status" className="copy-status">{copyStatus}</p>}
            {manualCopy && <textarea className="share-fallback" ref={copyRef} readOnly value={shareText} rows={7} aria-label="Texto do resultado para copiar" onFocus={(event) => event.currentTarget.select()} />}
            {error && <p role="alert">{error}</p>}
          </div>
        </section>
        <div className="result-insights">
          <section className="error-indicators" aria-label="Dois tipos de erro">
            <div className="result-card error-indicator"><strong>{stats.missedScams}</strong><h2>Golpes em que você caiu</h2><p>Você marcou Segura em um golpe. Fora do treino, isso pode expor dinheiro, dados ou contas.</p></div>
            <div className="result-card error-indicator"><strong>{stats.falseAlarms}</strong><h2>Mensagens legítimas que você achou golpe</h2><p>Você marcou Golpe em uma mensagem legítima. Desconfiança sem checagem pode fazer você perder avisos e serviços úteis.</p></div>
          </section>
          <section className="result-card weak-spots" aria-labelledby="weak-title"><h2 id="weak-title">Seus pontos fracos</h2>
            {stats.weakCategories.length ? <ul>{stats.weakCategories.map((category) => {
              const current = stats.byCategory.get(category);
              const lifetime = lifetimeStats[category];
              return <li key={category}><h3>{CATEGORY_INFO[category].label} <span>{current ? current.answered - current.correct : 0} erro(s)</span></h3><p>{CATEGORY_INFO[category].tip}</p>{lifetime && <p className="lifetime-note">Histórico acumulado: {lifetime.correct}/{lifetime.answered} acertos neste tema.</p>}</li>;
            })}</ul> : <p className="empty-message">{stats.answered ? 'Nenhum erro nesta partida. Continue conferindo cada contexto, mesmo quando a mensagem parece familiar.' : 'Seus pontos de atenção aparecerão depois de responder às questões.'}</p>}
          </section>
          <details className="recent-results"><summary>Últimas partidas salvas ({history.length})</summary><ol>{history.slice().reverse().map((record) => {
            const previous = analyzeAnswers(record.answers);
            return <li key={record.id}><time dateTime={record.finishedAt}>{formatDate.format(new Date(record.finishedAt))}</time><span>{previous.correct}/{previous.answered} acertos · {previous.score} pts{record.mode === 'focused' ? ' · focado' : ''}</span></li>;
          })}</ol></details>
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
