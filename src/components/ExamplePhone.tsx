import { useEffect, useRef, type ReactNode } from 'react';

export function ExamplePhone({ children, messageId }: { children: ReactNode; messageId: string }) {
  const screenRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (screenRef.current) screenRef.current.scrollTop = 0;
  }, [messageId]);
  return (
    <div className="device-chassis device-chassis--example">
      <div className="device-status-bar" aria-hidden="true">
        <span className="device-clock">14:32</span>
        <div className="device-camera-notch" />
        <div className="device-indicators">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="16" width="3" height="6" rx="1" /><rect x="7" y="12" width="3" height="10" rx="1" />
            <rect x="12" y="8" width="3" height="14" rx="1" /><rect x="17" y="4" width="3" height="18" rx="1" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0" />
            <path d="M12 20h.01" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="1" y="6" width="18" height="12" rx="2" /><path d="M23 11v2" /><rect x="3" y="8" width="11" height="8" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div ref={screenRef} className="device-screen-content" role="region" aria-label="Mensagem de exemplo; role para ler o conteúdo completo" tabIndex={0}>
        {children}
      </div>
    </div>
  );
}
