import { HighlightedText, type HighlightProps } from '../HighlightedText';
import React from 'react';
import type { EmailContent } from '../../data/challenges';

interface Props extends HighlightProps {
  content: EmailContent;
}

export const EmailMock: React.FC<Props> = ({ content, highlights, highlightTone }) => {
  return (
    <div className="mock-device-screen mock-email" aria-label="Simulação de cliente de E-mail">
      {/* Barra de Ações do Cliente de E-mail */}
      <div className="email-topbar">
        <svg className="email-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>

        <div className="email-topbar-tools" aria-hidden="true">
          <svg className="email-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
          <svg className="email-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <svg className="email-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
      </div>

      {/* Conteúdo do E-mail */}
      <div className="email-content-area">
        <div className="email-subject-box">
          <h3 className="email-subject-text"><HighlightedText text={content.subject} highlights={highlights} highlightTone={highlightTone} /></h3>
          <span className="email-inbox-tag">Caixa de entrada</span>
        </div>

        <div className="email-sender-card">
          <div className="email-avatar-circle">
            {content.senderName.charAt(0).toUpperCase()}
          </div>
          <div className="email-meta-info">
            <div className="email-sender-line">
              <span className="email-from-name"><HighlightedText text={content.senderName} highlights={highlights} highlightTone={highlightTone} /></span>
              <span className="email-date-text">{content.date}</span>
            </div>
            <div className="email-address-line">
              <span>De: </span>
              <span className="mock-unclickable-text"><HighlightedText text={content.senderEmail} highlights={highlights} highlightTone={highlightTone} /></span>
            </div>
            <div className="email-to-line">
              <span>Para: mim</span>
            </div>
          </div>
        </div>

        <div className="email-body-scroll">
          {content.bodyText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="email-paragraph mock-balloon-text">
              <HighlightedText text={paragraph} highlights={highlights} highlightTone={highlightTone} />
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
