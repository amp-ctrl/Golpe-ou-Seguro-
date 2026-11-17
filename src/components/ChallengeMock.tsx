import type { Challenge } from '../data/challenges';
import { WhatsAppMock } from './mocks/WhatsAppMock';
import { SmsMock } from './mocks/SmsMock';
import { EmailMock } from './mocks/EmailMock';
import { InstagramMock } from './mocks/InstagramMock';

export function ChallengeMock({ challenge }: { challenge: Challenge }) {
  switch (challenge.channel) {
    case 'whatsapp': return <WhatsAppMock content={challenge.content} />;
    case 'sms': return <SmsMock content={challenge.content} />;
    case 'email': return <EmailMock content={challenge.content} />;
    case 'instagram': return <InstagramMock content={challenge.content} />;
  }
}
