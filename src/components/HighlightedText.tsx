import { splitHighlights } from '../services/highlights';
export interface HighlightProps { highlights?: readonly string[]; highlightTone?: 'alert' | 'neutral' }
interface Props extends HighlightProps { text: string }
export function HighlightedText({ text, highlights = [], highlightTone = 'neutral' }: Props) {
  if (!highlights.length) return <>{text}</>;
  return <>{splitHighlights(text, highlights).map((part, index) => part.highlighted ?
    <mark className={`message-highlight message-highlight--${highlightTone}`} key={index}>{part.text}</mark> : part.text)}</>;
}
