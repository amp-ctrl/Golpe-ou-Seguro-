import React from 'react';
import type { WhatsAppContent } from '../../data/challenges';

interface Props {
  content: WhatsAppContent;
}

export const WhatsAppMock: React.FC<Props> = ({ content }) => {
  return (
    <div className="mock-card mock-whatsapp" aria-label="Simulação de mensagem do WhatsApp">
      {/* Barra superior de conversa */}
      <div className="mock-header mock-whatsapp-header">
        <div className="mock-avatar mock-whatsapp-avatar">
          <span>{content.avatarText}</span>
        </div>
        <div className="mock-sender-info">
          <div className="mock-sender-name">
            {content.isGroup ? content.groupName : content.senderName}
          </div>
          {content.senderStatus && (
            <div className="mock-sender-status">{content.senderStatus}</div>
          )}
        </div>
      </div>

      {/* Área da conversa com balão */}
      <div className="mock-body mock-whatsapp-body">
        <div className="mock-balloon mock-whatsapp-balloon">
          {content.isGroup && (
            <div className="mock-balloon-sender">{content.senderName}</div>
          )}
          <p className="mock-balloon-text">{content.messageText}</p>
          <div className="mock-balloon-meta">
            <span className="mock-balloon-time">{content.time}</span>
            <span className="mock-balloon-ticks" aria-hidden="true">✓✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
