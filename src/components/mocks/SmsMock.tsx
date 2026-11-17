import { HighlightedText, type HighlightProps } from '../HighlightedText';
import React from 'react';
import type { SmsContent } from '../../data/challenges';

interface Props extends HighlightProps {
  content: SmsContent;
}

export const SmsMock: React.FC<Props> = ({ content, highlights, highlightTone }) => {
  return (
    <div className="mock-device-screen mock-sms" aria-label="Simulação de mensagem de SMS">
      {/* Cabeçalho do App de SMS */}
      <div className="sms-topbar">
        <svg className="sms-icon-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>

        <div className="sms-sender-block">
          <div className="sms-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="sms-sender-title">{content.sender}</span>
        </div>

        <div className="sms-topbar-actions" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </div>
      </div>

      {/* Corpo da conversa SMS */}
      <div className="sms-chat-area">
        <div className="sms-timestamp-tag">
          <span>{content.time}</span>
        </div>

        <div className="sms-bubble">
          <p className="sms-text mock-balloon-text"><HighlightedText text={content.messageText} highlights={highlights} highlightTone={highlightTone} /></p>
        </div>

        <div className="sms-delivery-note">
          <span>SMS • Operadora Móvel</span>
        </div>
      </div>
    </div>
  );
};
