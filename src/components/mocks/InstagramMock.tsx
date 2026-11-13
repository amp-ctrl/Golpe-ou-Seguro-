import React from 'react';
import type { InstagramContent } from '../../data/challenges';

interface Props {
  content: InstagramContent;
}

export const InstagramMock: React.FC<Props> = ({ content }) => {
  return (
    <div className="mock-card mock-instagram" aria-label="Simulação de publicação no Instagram">
      {/* Cabeçalho do perfil */}
      <div className="mock-header mock-instagram-header">
        <div className="mock-instagram-avatar-ring">
          <div className="mock-avatar mock-instagram-avatar">
            {content.accountName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="mock-sender-info">
          <div className="mock-instagram-username-row">
            <span className="mock-instagram-username">{content.username}</span>
            {content.isVerified ? (
              <span className="mock-instagram-badge mock-instagram-badge--verified" title="Perfil Verificado" aria-label="Perfil verificado">
                ✓
              </span>
            ) : (
              <span className="mock-instagram-badge mock-instagram-badge--unverified" title="Não Verificado" aria-label="Não verificado">
                ⚠️ Não verificado
              </span>
            )}
          </div>
          <div className="mock-instagram-followers-text">{content.followersText}</div>
        </div>
      </div>

      {/* Cartão de imagem / visual da publicação */}
      <div className="mock-instagram-visual-box">
        {content.promoBadge && (
          <div className="mock-instagram-promo-banner">{content.promoBadge}</div>
        )}
        <div className="mock-instagram-visual-preview">
          <span className="mock-instagram-visual-icon" aria-hidden="true">🛍️</span>
          <span className="mock-instagram-visual-text">{content.accountName}</span>
        </div>
      </div>

      {/* Barra de ações e legenda */}
      <div className="mock-body mock-instagram-body">
        <div className="mock-instagram-actions" aria-hidden="true">
          <span>❤️</span>
          <span>💬</span>
          <span>↗️</span>
        </div>

        <div className="mock-instagram-caption">
          <span className="mock-instagram-caption-author">{content.username}</span>{' '}
          <span className="mock-balloon-text">{content.caption}</span>
        </div>

        <div className="mock-instagram-comments-preview">
          {content.commentsText}
        </div>
        <div className="mock-instagram-time">{content.createdTime}</div>
      </div>
    </div>
  );
};
