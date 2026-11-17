import { HighlightedText, type HighlightProps } from '../HighlightedText';
import React from 'react';
import type { WhatsAppContent } from '../../data/challenges';

interface Props extends HighlightProps {
  content: WhatsAppContent;
}

export const WhatsAppMock: React.FC<Props> = ({ content, highlights, highlightTone }) => {
  return (
    <div className="mock-device-screen mock-whatsapp" aria-label="Simulação de mensagem do WhatsApp">
      {/* Barra do App WhatsApp */}
      <div className="wa-topbar">
        <div className="wa-topbar-left">
          <svg className="wa-icon-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <div className="wa-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="wa-contact-info">
            <span className="wa-contact-name">
              {content.isGroup ? content.groupName : content.senderName}
            </span>
            {content.senderStatus && (
              <span className="wa-contact-status">{content.senderStatus}</span>
            )}
          </div>
        </div>

        <div className="wa-topbar-actions" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </div>
      </div>

      {/* Área da conversa com balão de mensagem */}
      <div className="wa-chat-area">
        <div className="wa-date-divider">
          <span>HOJE</span>
        </div>

        <div className="wa-balloon">
          {content.isGroup && (
            <span className="wa-balloon-author"><HighlightedText text={content.senderName} highlights={highlights} highlightTone={highlightTone} /></span>
          )}
          <p className="wa-balloon-text mock-balloon-text"><HighlightedText text={content.messageText} highlights={highlights} highlightTone={highlightTone} /></p>
          <div className="wa-balloon-meta">
            <span className="wa-balloon-time">{content.time}</span>
            <svg className="wa-checks" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 6l4 4L14 1" />
              <path d="M5 6l4 4L18 1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
