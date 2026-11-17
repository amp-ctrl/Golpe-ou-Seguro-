import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import type { Challenge, ChannelType } from '../data/challenges';
import { selectExamples } from '../services/exampleSelector';
import { ChallengeMock } from './ChallengeMock';
import { ExamplePhone } from './ExamplePhone';

const CHANNEL_LABELS: Record<ChannelType, string> = {
  whatsapp: 'WhatsApp', sms: 'SMS', email: 'E-mail', instagram: 'Instagram',
};
const ROTATION_DELAY = 5000;

export function ExampleCarousel({ challenges }: { challenges: readonly Challenge[] }) {
  const [examples] = useState(() => selectExamples(challenges));
  const [index, setIndex] = useState(0);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const slideId = useId();
  const running = !manuallyPaused && !hovered && !focusWithin && visible && !reducedMotion;
  const current = examples[index];
  const caption = `Exemplo ${index + 1} de ${examples.length} · ${CHANNEL_LABELS[current.channel]}`;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => setReducedMotion(media.matches);
    const onVisibilityChange = () => setVisible(document.visibilityState !== 'hidden');
    media.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      media.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setIndex((previous) => (previous + 1) % examples.length), ROTATION_DELAY);
    return () => window.clearInterval(timer);
  }, [running, examples.length]);

  const move = (direction: number) => setIndex((previous) => (previous + direction + examples.length) % examples.length);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  };

  return (
    <div
      className="example-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Exemplos de mensagens do treino"
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setHovered(false); }}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false); }}
      onKeyDown={handleKeyDown}
    >
      <div className="example-carousel-heading">
        <p className="example-caption">{caption}</p>
        <span className="curiosity-chip">Será que é golpe?</span>
      </div>
      <div
        className="example-swipe-area"
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse') return;
          swipeStart.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start) return;
          const deltaX = event.clientX - start.x;
          const deltaY = event.clientY - start.y;
          if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) move(deltaX < 0 ? 1 : -1);
        }}
        onPointerCancel={() => { swipeStart.current = null; }}
      >
        <ExamplePhone messageId={current.id}>
          <div id={slideId} className="example-live-area" aria-live={running ? 'off' : 'polite'} aria-atomic="true">
            <div key={current.id} className="example-slide" role="group" aria-roledescription="slide" aria-label={caption}>
              <ChallengeMock challenge={current} />
            </div>
          </div>
        </ExamplePhone>
      </div>
      <div className="example-carousel-controls">
        <div className="example-dots" role="group" aria-label="Escolher exemplo">
          {examples.map((example, position) => (
            <button
              key={example.id} type="button" className="example-dot"
              aria-label={`Ir para o exemplo ${position + 1}: ${CHANNEL_LABELS[example.channel]}`}
              aria-current={index === position ? 'true' : undefined}
              aria-controls={slideId} onClick={() => setIndex(position)}
            ><span aria-hidden="true" /></button>
          ))}
        </div>
        <div className="example-navigation">
          <button type="button" className="example-arrow" aria-label="Exemplo anterior" aria-controls={slideId} onClick={() => move(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button
            type="button" className="example-pause" disabled={reducedMotion}
            aria-label={reducedMotion ? 'Rotação automática desativada pela preferência por movimento reduzido' : manuallyPaused ? 'Retomar rotação automática' : 'Pausar rotação automática'}
            onClick={() => setManuallyPaused((paused) => !paused)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              {manuallyPaused || reducedMotion ? <path d="m9 5 11 7-11 7V5Z" /> : <path d="M9 5v14M15 5v14" />}
            </svg>
            <span>{reducedMotion ? 'Rotação desativada' : manuallyPaused ? 'Retomar' : 'Pausar'}</span>
          </button>
          <button type="button" className="example-arrow" aria-label="Próximo exemplo" aria-controls={slideId} onClick={() => move(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
        </div>
        <p className="example-help">Use as setas ou deslize para explorar.</p>
      </div>
    </div>
  );
}
