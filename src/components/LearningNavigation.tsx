interface Props {
  active: 'simulator' | 'guide';
  onNavigate: (area: 'simulator' | 'guide') => void;
}

export function LearningNavigation({ active, onNavigate }: Props) {
  return (
    <header className="learning-header">
      <p className="learning-brand">Consumo consciente.<br /><span>Segurança digital.</span></p>
      <nav className="learning-navigation" aria-label="Áreas do projeto">
        <button type="button" aria-current={active === 'simulator' ? 'page' : undefined} onClick={() => onNavigate('simulator')}>Simulador</button>
        <button type="button" aria-current={active === 'guide' ? 'page' : undefined} onClick={() => onNavigate('guide')}>Guia de golpes</button>
      </nav>
    </header>
  );
}
