import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { INITIAL_CHALLENGES } from '../data/challenges';
import { splitHighlights } from '../services/highlights';
import { ChallengeMock } from './ChallengeMock';
import { HighlightedText } from './HighlightedText';

describe('destaques das mensagens', () => {
  it('preserva o texto e destaca repetições, priorizando o trecho mais longo em sobreposições', () => {
    const text = 'Confira banco.example e banco.example com calma.';
    const parts = splitHighlights(text, ['banco', 'banco.example', '', 'banco.example']);
    expect(parts.map((part) => part.text).join('')).toBe(text);
    expect(parts.filter((part) => part.highlighted).map((part) => part.text)).toEqual(['banco.example', 'banco.example']);
    expect(splitHighlights('', ['link'])).toEqual([]);
    expect(splitHighlights('Sem correspondência', ['outra'])).toEqual([{ text: 'Sem correspondência', highlighted: false }]);
  });
  it('nunca interpreta conteúdo da mensagem como HTML', () => {
    const html = renderToStaticMarkup(<HighlightedText text={'<script>alert("x")</script>'} highlights={['alert']} />);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<mark');
  });
  it('só revela destaques após responder e usa apresentação neutra nas legítimas, em todos os canais', () => {
    for (const challenge of INITIAL_CHALLENGES) {
      const before = renderToStaticMarkup(<ChallengeMock challenge={challenge} />);
      expect(before, challenge.id).not.toContain('<mark');
      expect(before, challenge.id).not.toContain('Não verificado');
      const after = renderToStaticMarkup(<ChallengeMock challenge={challenge} showHighlights />);
      expect(after, challenge.id).toContain('<mark');
      expect(after, challenge.id).toContain(challenge.isScam ? 'message-highlight--alert' : 'message-highlight--neutral');
      if (!challenge.isScam) expect(after, challenge.id).not.toContain('message-highlight--alert');
    }
  });
});
