export interface TextSegment { text: string; highlighted: boolean }
/** Correspondência literal, sensível a maiúsculas; nunca interpreta a mensagem como HTML. */
export function splitHighlights(text: string, highlights: readonly string[]): TextSegment[] {
  const needles = [...new Set(highlights.filter(Boolean))];
  const segments: TextSegment[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    let next = -1;
    let match = '';
    for (const needle of needles) {
      const position = text.indexOf(needle, cursor);
      if (position !== -1 && (next === -1 || position < next || (position === next && needle.length > match.length))) {
        next = position;
        match = needle;
      }
    }
    if (next === -1) { segments.push({ text: text.slice(cursor), highlighted: false }); break; }
    if (next > cursor) segments.push({ text: text.slice(cursor, next), highlighted: false });
    segments.push({ text: match, highlighted: true });
    cursor = next + match.length;
  }
  return segments;
}
