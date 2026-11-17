import type { Challenge } from '../data/challenges';
import type { HighlightProps } from './HighlightedText';
import { WhatsAppMock } from './mocks/WhatsAppMock';
import { SmsMock } from './mocks/SmsMock';
import { EmailMock } from './mocks/EmailMock';
import { InstagramMock } from './mocks/InstagramMock';

export function ChallengeMock({ challenge, showHighlights = false }: { challenge: Challenge; showHighlights?: boolean }) {
  const highlightProps: HighlightProps = {
    highlights: showHighlights ? challenge.highlights : undefined,
    highlightTone: challenge.isScam ? 'alert' : 'neutral',
  };
  switch (challenge.channel) {
    case 'whatsapp': return <WhatsAppMock content={challenge.content} {...highlightProps} />;
    case 'sms': return <SmsMock content={challenge.content} {...highlightProps} />;
    case 'email': return <EmailMock content={challenge.content} {...highlightProps} />;
    case 'instagram': return <InstagramMock content={challenge.content} {...highlightProps} />;
  }
}
