import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  GUIA_GOLPES, GUIDE_CATEGORY_PREVIEWS, GUIDE_QUICK_TIPS,
  GUIDE_CHANNEL_LABELS, GUIDE_CHANNEL_SHORT_LABELS, GUIDE_TRIGGER_LABELS,
  type EducationalScam, type GuideCategoryId,
} from '../data/guiaGolpes';
import { filterGuideCategories, type GuideCategoryFilter } from '../services/guideSearch';

const PAGE_SIZE = 6;
const FIRST_CATEGORY = GUIA_GOLPES.categories[0].id;
const ICON_PATHS: Record<GuideCategoryId, string> = {
  'phishing-e-engenharia-social': 'M4 5h16v14H4z M4 6l8 6 8-6 M9 15h6',
  'consumo-impulsivo-e-ecommerce-falso': 'M5 8h14l1 12H4L5 8z M8 8V6a4 4 0 0 1 8 0v2',
  'financeiros-e-pix': 'M3 9l9-6 9 6H3z M5 12v6 M10 12v6 M14 12v6 M19 12v6 M3 21h18',
  'invasao-de-contas-e-identidade': 'M6 10h12v11H6z M8 10V7a4 4 0 0 1 8 0v3 M12 14v3',
  'falsa-central-e-suporte': 'M4 13v-2a8 8 0 0 1 16 0v2 M4 12h3v6H4z M17 12h3v6h-3z M19 18v2h-7',
  'falsos-investimentos-e-renda-extra': 'M4 20V4 M4 20h16 M8 15l4-5 4 2 4-7 M16 5h4v4',
};

function GuideIcon({ categoryId }: { categoryId: GuideCategoryId }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON_PATHS[categoryId]} /></svg>;
}

function ReadingList({ items, ordered = false }: { items: readonly string[]; ordered?: boolean }) {
  const List = ordered ? 'ol' : 'ul';
  return <List className={ordered ? 'guide-steps' : 'guide-bullets'}>{items.map((item) => <li key={item}>{item}</li>)}</List>;
}

function ScamModal({ scam, categoryId, onClose }: {
  scam: EducationalScam; categoryId: GuideCategoryId; onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} className="guide-modal" aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}>
      <div className="guide-modal-topbar">
        <span>{GUIDE_CATEGORY_PREVIEWS[categoryId].title}</span>
        <button type="button" className="guide-modal-close" onClick={onClose} aria-label="Fechar leitura" autoFocus>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
        </button>
      </div>
      <div className="guide-modal-content">
        <header className="guide-modal-heading">
          <span className="guide-modal-icon"><GuideIcon categoryId={categoryId} /></span>
          <h2 id={titleId}>{scam.name}</h2>
          <p>{scam.description}</p>
          <ul className="guide-badges" aria-label="Canais">{scam.channels.map((channel) => <li key={channel}>{GUIDE_CHANNEL_LABELS[channel]}</li>)}</ul>
        </header>
        <section className="guide-modal-section"><h3>Como funciona</h3><ReadingList items={scam.approachSteps} ordered /></section>
        <section className="guide-modal-section"><h3>Gatilho usado</h3>
          <ul className="guide-tags">{scam.triggers.map((trigger) => <li key={trigger}>{GUIDE_TRIGGER_LABELS[trigger]}</li>)}</ul>
          <p>{scam.triggerExplanation}</p>
        </section>
        <section className="guide-modal-section"><h3>Sinais de alerta</h3><ReadingList items={scam.redFlags} /></section>
        <section className="guide-modal-section"><h3>Como se proteger / o que fazer</h3>
          <div className="guide-protection-columns">
            <div><h4>Para se prevenir</h4><ReadingList items={scam.prevention} /></div>
            <div><h4>Se já aconteceu</h4><ReadingList items={scam.recovery} /></div>
          </div>
        </section>
        <footer className="guide-modal-sources"><p>Fontes de referência</p><ul>{scam.sources.map((source) =>
          <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.organization} · {source.title}<span className="sr-only"> (abre em nova aba)</span></a></li>)}</ul>
        </footer>
      </div>
    </dialog>, document.body,
  );
}

function ScamCard({ scam, categoryId, number, onOpen }: {
  scam: EducationalScam; categoryId: GuideCategoryId; number: number; onOpen: () => void;
}) {
  const titleId = useId();
  const summary = scam.description.split(/(?<=[.!?])\s+/)[0];
  return <article className="guide-scam-card">
    <div className="guide-card-topline"><span className="guide-card-icon"><GuideIcon categoryId={categoryId} /></span><span className="guide-card-number">{String(number).padStart(2, '0')}</span></div>
    <ul className="guide-badges" aria-label="Canais principais">{scam.channels.slice(0, 2).map((channel) => <li key={channel}>{GUIDE_CHANNEL_SHORT_LABELS[channel]}</li>)}</ul>
    <h3 id={titleId}>{scam.name}</h3>
    <p className="guide-card-description">{summary}</p>
    <button type="button" className="guide-card-open" aria-labelledby={titleId} aria-haspopup="dialog" onClick={onOpen} />
  </article>;
}

export function GuideScreen() {
  const [categoryId, setCategoryId] = useState<GuideCategoryFilter>(FIRST_CATEGORY);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<{ scam: EducationalScam; categoryId: GuideCategoryId } | null>(null);
  const searchId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const searching = query.trim().length > 0;
  const effectiveCategory = searching ? 'all' : categoryId;
  const matches = filterGuideCategories(GUIA_GOLPES.categories, effectiveCategory, query);
  const articles = matches.flatMap(({ category, scams }) => scams.map((scam) => ({ scam, categoryId: category.id })));
  const pageCount = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = articles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const category = GUIA_GOLPES.categories.find(({ id }) => id === effectiveCategory);
  const preview = category ? GUIDE_CATEGORY_PREVIEWS[category.id] : null;
  const chooseCategory = (id: GuideCategoryFilter) => { setCategoryId(id); setQuery(''); setPage(1); };
  const changePage = (next: number) => {
    setPage(next);
    headingRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    headingRef.current?.focus({ preventScroll: true });
  };

  return <main className="guide-screen" aria-labelledby="guide-title">
    <header className="guide-intro">
      <p className="start-eyebrow"><span aria-hidden="true" /> Conhecer para se proteger</p>
      <h1 id="guide-title" tabIndex={-1}>Guia de golpes</h1>
      <p className="guide-lead">Reconheça os sinais. Entenda a abordagem. Saiba como se proteger.</p>
    </header>

    <section className="guide-controls" aria-label="Encontre um golpe">
      <div className="guide-search">
        <label htmlFor={searchId} className="sr-only">Buscar em todas as categorias</label>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
        <input id={searchId} type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }}
          placeholder="Buscar golpe, canal ou palavra-chave" aria-controls="guide-results" />
      </div>
      <div className="guide-filter-options" role="group" aria-label="Categorias de golpes">
        <button type="button" aria-pressed={effectiveCategory === 'all'} onClick={() => chooseCategory('all')}>Todos</button>
        {GUIA_GOLPES.categories.map(({ id }) => <button type="button" key={id} aria-pressed={effectiveCategory === id} onClick={() => chooseCategory(id)}>{GUIDE_CATEGORY_PREVIEWS[id].title}</button>)}
      </div>
    </section>

    <section id="guide-results" className="guide-results" aria-labelledby="guide-category-title">
      <header className="guide-category-heading">
        <div>
          <h2 ref={headingRef} id="guide-category-title" tabIndex={-1}>{searching ? 'Resultados da busca' : preview?.title ?? 'Todos os golpes'}</h2>
          <p className="guide-category-summary">{searching ? 'Busca em todas as categorias, por nome, canal e conteúdo.' : preview?.summary ?? 'Explore as modalidades e escolha um golpe para conhecer os detalhes.'}</p>
          {category && <ul className="guide-tags" aria-label="Gatilhos principais">{category.triggers.slice(0, 3).map((trigger) => <li key={trigger}>{GUIDE_TRIGGER_LABELS[trigger]}</li>)}</ul>}
        </div>
        <p className="guide-result-count" role="status" aria-live="polite" aria-atomic="true">{articles.length} {articles.length === 1 ? 'golpe encontrado' : 'golpes encontrados'}<span className="sr-only">{searching ? ' em todas as categorias para ' + query : ''}. Página {currentPage} de {pageCount}.</span></p>
      </header>

      {articles.length === 0 ? <div className="guide-empty"><p>Nenhum golpe encontrado. Tente outro nome, canal ou palavra.</p><button type="button" onClick={() => { setQuery(''); setPage(1); }}>Limpar busca</button></div> :
        <div className="guide-cards">{visible.map(({ scam, categoryId: articleCategory }, index) =>
          <ScamCard key={scam.id} scam={scam} categoryId={articleCategory} number={(currentPage - 1) * PAGE_SIZE + index + 1} onOpen={() => setSelected({ scam, categoryId: articleCategory })} />)}</div>}

      {pageCount > 1 && <nav className="guide-pagination" aria-label="Páginas de golpes">
        <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Anterior</button>
        <span>Página {currentPage} de {pageCount}</span>
        <button type="button" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>Próxima</button>
      </nav>}
    </section>

    <footer className="guide-quick-tips" aria-label="Dicas rápidas de segurança">
      {GUIDE_QUICK_TIPS.map((tip, index) => <div key={tip.title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{tip.title}</h2><p>{tip.text}</p></div>)}
    </footer>
    {selected && <ScamModal scam={selected.scam} categoryId={selected.categoryId} onClose={() => setSelected(null)} />}
  </main>;
}
