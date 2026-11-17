import { HighlightedText, type HighlightProps } from '../HighlightedText';
import React from 'react';
import type { InstagramContent } from '../../data/challenges';

interface Props extends HighlightProps {
  content: InstagramContent;
}

export const InstagramMock: React.FC<Props> = ({ content, highlights, highlightTone }) => {
  return (
    <div className="mock-device-screen mock-instagram" aria-label="Simulação de publicação no Instagram">
      {/* Cabeçalho do Perfil Instagram */}
      <div className="ig-header">
        <div className="ig-header-user">
          <div className="ig-avatar-ring">
            <div className="ig-avatar">
              {content.accountName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ig-user-meta">
            <div className="ig-username-line">
              <span className="ig-username"><HighlightedText text={content.username} highlights={highlights} highlightTone={highlightTone} /></span>
            </div>
            <span className="ig-followers-text">{content.followersText}</span>
          </div>
        </div>

        <div className="ig-more-dots" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="6" cy="12" r="1" />
            <circle cx="18" cy="12" r="1" />
          </svg>
        </div>
      </div>

      {/* Área da Imagem / Post Visual */}
      <div className="ig-post-visual">
        {content.promoBadge && (
          <div className="ig-promo-ribbon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <span>{content.promoBadge}</span>
          </div>
        )}

        <div className="ig-visual-placeholder">
          <svg className="ig-product-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="ig-product-brand">{content.accountName}</span>
        </div>
      </div>

      {/* Barra de Ações (Curtir, Comentar, Compartilhar) */}
      <div className="ig-actions-row" aria-hidden="true">
        <div className="ig-actions-left">
          <svg className="ig-action-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <svg className="ig-action-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <svg className="ig-action-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>

        <svg className="ig-action-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      {/* Legenda e Comentários */}
      <div className="ig-caption-block">
        <p className="ig-caption-text">
          <strong className="ig-caption-author"><HighlightedText text={content.username} highlights={highlights} highlightTone={highlightTone} /></strong>{' '}
          <span className="mock-balloon-text"><HighlightedText text={content.caption} highlights={highlights} highlightTone={highlightTone} /></span>
        </p>

        <span className="ig-comments-link">{content.commentsText}</span>
        <span className="ig-time-stamp">{content.createdTime}</span>
      </div>
    </div>
  );
};
