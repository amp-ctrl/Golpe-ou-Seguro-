import { useEffect, useRef, useState } from 'react';
import { GuideScreen } from './components/GuideScreen';
import { LearningNavigation } from './components/LearningNavigation';
import { INITIAL_CHALLENGES, type Category, type Challenge } from './data/challenges';
import { POINTS_PER_CORRECT_ANSWER, POINTS_PER_WRONG_ANSWER } from './config';
import { storage } from './services/storage';
import { buildSession, type SessionSize } from './services/sessionBuilder';
import { type AnswerRecord, type SessionRecord } from './services/results';
import { StartScreen } from './components/StartScreen';
import { PlayingScreen } from './components/PlayingScreen';
import { ResultScreen } from './components/ResultScreen';

type Screen = 'start' | 'playing' | 'summary' | 'guide';
interface ActiveSession { id: string; startedAt: string; deck: Challenge[]; focusCategories: Category[] }

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const previousScreen = useRef(screen);
  useEffect(() => {
    if (previousScreen.current !== screen) {
      if (screen === 'start' || screen === 'guide') {
        window.scrollTo(0, 0);
        document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
      }
      previousScreen.current = screen;
    }
  }, [screen]);
  const navigate = (area: 'simulator' | 'guide') => { setError(''); setScreen(area === 'guide' ? 'guide' : 'start'); };
  const [bestScore, setBestScore] = useState(() => storage.getBestScore());
  const [sessionSize, setSessionSize] = useState<SessionSize>(10);
  const [error, setError] = useState('');
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [finished, setFinished] = useState<SessionRecord | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const answerLock = useRef(false);
  const finishLock = useRef(false);
  const score = answers.reduce((sum, answer) => sum + answer.points, 0);

  const start = (focusCategories: Category[] = []) => {
    try {
      const deck = buildSession(INITIAL_CHALLENGES, { size: sessionSize, history: storage.getSeenSessions(), focusCategories });
      setSession({ id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, startedAt: new Date().toISOString(), deck, focusCategories });
      setAnswers([]); setIndex(0); setError(''); setFinished(null);
      answerLock.current = false; finishLock.current = false;
      storage.startSeenSession(deck[0].id);
      setScreen('playing');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Não foi possível iniciar o treino.'); }
  };
  const current = session?.deck[index];
  const answer = (guessedScam: boolean) => {
    if (!current || answerLock.current || answers[index]) return;
    answerLock.current = true;
    const points = guessedScam === current.isScam ? POINTS_PER_CORRECT_ANSWER : POINTS_PER_WRONG_ANSWER;
    setAnswers((previous) => [...previous, { challengeId: current.id, guessedScam, isScam: current.isScam, channel: current.channel, category: current.category, points }]);
    setBestScore(storage.saveBestScore(score + points));
  };
  const finish = () => {
    if (!session || finishLock.current) return;
    finishLock.current = true;
    const record: SessionRecord = {
      id: session.id, startedAt: session.startedAt, finishedAt: new Date().toISOString(), size: sessionSize,
      mode: session.focusCategories.length ? 'focused' : 'standard', focusCategories: session.focusCategories, answers,
    };
    storage.saveSession(record);
    setBestScore(storage.saveBestScore(score));
    setFinished(record); setScreen('summary');
  };
  const next = () => {
    if (!session || !answers[index]) return;
    if (index + 1 === session.deck.length) { finish(); return; }
    storage.recordSeenChallenge(session.deck[index + 1].id);
    setIndex(index + 1); answerLock.current = false;
  };
  return (
    <div className={`app-container app-container--${screen}`}>
      {(screen === 'start' || screen === 'guide') && <LearningNavigation active={screen === 'guide' ? 'guide' : 'simulator'} onNavigate={navigate} />}
      {screen === 'guide' && <GuideScreen />}
      {screen === 'start' && <StartScreen bestScore={bestScore} sessionSize={sessionSize} onSessionSizeChange={setSessionSize} onStart={() => start()} onGuide={() => navigate('guide')} error={error} />}
      {screen === 'playing' && session && current && <PlayingScreen challenge={current} index={index} size={session.deck.length} answeredCount={answers.length} score={score} answer={answers[index]} focused={session.focusCategories.length > 0} focusCount={session.deck.filter((item) => session.focusCategories.includes(item.category)).length} onAnswer={answer} onNext={next} onQuit={finish} />}
      {screen === 'summary' && finished && <ResultScreen session={finished} bestScore={bestScore} lifetimeStats={storage.getCategoryStats()} onRestart={() => start()} onFocused={(categories) => start(categories)} onHome={() => { setError(''); setScreen('start'); }} error={error} />}
    </div>
  );
}
