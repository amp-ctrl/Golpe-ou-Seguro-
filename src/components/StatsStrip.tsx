import type { Challenge } from '../data/challenges';

export function StatsStrip({ challenges }: { challenges: readonly Challenge[] }) {
  const stats = [
    { label: 'questões', value: challenges.length },
    { label: 'canais', value: new Set(challenges.map(({ channel }) => channel)).size },
    { label: 'tipos de golpe', value: new Set(challenges.filter((challenge) => challenge.isScam).map((challenge) => challenge.scamType)).size },
  ];
  return (
    <dl className="bank-stats" aria-label="Conteúdo disponível para treinar">
      {stats.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
