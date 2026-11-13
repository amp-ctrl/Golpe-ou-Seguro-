import React from 'react';
import type { SmsContent } from '../../data/challenges';

interface Props {
  content: SmsContent;
}

export const SmsMock: React.FC<Props> = ({ content }) => {
  return (
    <div className="mock-card mock-sms" aria-label="Simulação de mensagem de SMS">
      {/* Topo do app de SMS */}
      <div className="mock-header mock-sms-header">
        <div className="mock-sms-sender-badge">
          <span className="mock-sms-icon" aria-hidden="true">💬</span>
          <span className="mock-sms-sender">{content.sender}</span>
        </div>
      </div>

      {/* Corpo da mensagem */}
      <div className="mock-body mock-sms-body">
        <div className="mock-sms-timestamp">{content.time}</div>
        <div className="mock-balloon mock-sms-balloon">
          <p className="mock-balloon-text">{content.messageText}</p>
        </div>
      </div>
    </div>
  );
};
