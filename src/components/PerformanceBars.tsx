import type { PerformanceRow } from '../services/results';

export function PerformanceBars({ rows, labels, title, className = '' }: { rows: PerformanceRow[]; labels: Record<string, string>; title: string; className?: string }) {
  return (
    <section className={`result-card performance-card ${className}`} aria-label={title}>
      <h2>{title}</h2>
      <p className="section-description">Acertos entre as mensagens respondidas nesta partida.</p>
      {rows.length ? <ul className="performance-bars">{rows.map((row) => {
        const accuracy = Math.round(row.correct / row.answered * 100);
        return (
          <li key={row.id}>
            <div className="bar-label"><span>{labels[row.id] ?? row.id}</span><span>{row.correct}/{row.answered} <strong>{accuracy}%</strong></span></div>
            <div className="performance-track" aria-hidden="true"><span style={{ width: `${accuracy}%` }} /></div>
          </li>
        );
      })}</ul> : <p className="empty-message">Responda uma questão para gerar este indicador.</p>}
    </section>
  );
}
