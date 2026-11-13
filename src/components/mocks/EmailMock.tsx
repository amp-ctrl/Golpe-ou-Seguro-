import React from 'react';
import type { EmailContent } from '../../data/challenges';

interface Props {
  content: EmailContent;
}

export const EmailMock: React.FC<Props> = ({ content }) => {
  return (
    <div className="mock-card mock-email" aria-label="Simulação de cliente de E-mail">
      {/* Cabeçalho do e-mail */}
      <div className="mock-email-header">
        <div className="mock-email-subject-line">
          <span className="mock-email-tag" aria-hidden="true">✉️</span>
          <h3 className="mock-email-subject">{content.subject}</h3>
        </div>

        <div className="mock-email-sender-row">
          <div className="mock-avatar mock-email-avatar">
            {content.senderName.charAt(0).toUpperCase()}
          </div>
          <div className="mock-email-meta">
            <div className="mock-email-from-name">{content.senderName}</div>
            <div className="mock-email-from-address">
              De: &lt;<span className="mock-unclickable-text">{content.senderEmail}</span>&gt;
            </div>
            <div className="mock-email-date">{content.date}</div>
          </div>
        </div>
      </div>

      {/* Corpo do e-mail */}
      <div className="mock-body mock-email-body">
        <div className="mock-email-content-text">
          {content.bodyText.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
