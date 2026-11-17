import { Category, type ChannelType } from '../data/challenges';
import { CATEGORY_INFO } from '../data/guidance';
import { SESSION_SIZES, type SessionSize } from './sessionBuilder';

export interface AnswerRecord {
  challengeId: string;
  guessedScam: boolean;
  isScam: boolean;
  category: Category;
  channel: ChannelType;
  points: number;
}
export interface SessionRecord {
  id: string;
  startedAt: string;
  finishedAt: string;
  size: SessionSize;
  mode: 'standard' | 'focused';
  focusCategories: Category[];
  answers: AnswerRecord[];
}
export interface CategoryStats { answered: number; correct: number; missedScams: number; falseAlarms: number }
export interface PerformanceRow extends CategoryStats { id: string }
export interface TrainingState { sessions: SessionRecord[]; categoryStats: Partial<Record<Category, CategoryStats>> }
export const emptyStats = (): CategoryStats => ({ answered: 0, correct: 0, missedScams: 0, falseAlarms: 0 });
export const isCorrectAnswer = (answer: AnswerRecord) => answer.guessedScam === answer.isScam;

export function accumulate(stats: CategoryStats, answer: AnswerRecord): CategoryStats {
  return {
    answered: stats.answered + 1,
    correct: stats.correct + Number(isCorrectAnswer(answer)),
    missedScams: stats.missedScams + Number(answer.isScam && !answer.guessedScam),
    falseAlarms: stats.falseAlarms + Number(!answer.isScam && answer.guessedScam),
  };
}

export function analyzeAnswers(answers: readonly AnswerRecord[]) {
  const byChannel = new Map<ChannelType, CategoryStats>();
  const byCategory = new Map<Category, CategoryStats>();
  let total = emptyStats();
  let score = 0;
  for (const answer of answers) {
    total = accumulate(total, answer);
    score += answer.points;
    byChannel.set(answer.channel, accumulate(byChannel.get(answer.channel) ?? emptyStats(), answer));
    byCategory.set(answer.category, accumulate(byCategory.get(answer.category) ?? emptyStats(), answer));
  }
  const weakCategories = [...byCategory.entries()]
    .filter(([, stats]) => stats.correct < stats.answered)
    .sort(([a, left], [b, right]) => (right.answered - right.correct) - (left.answered - left.correct) ||
      (right.answered - right.correct) / right.answered - (left.answered - left.correct) / left.answered ||
      CATEGORY_INFO[a].label.localeCompare(CATEGORY_INFO[b].label, 'pt-BR'))
    .slice(0, 2).map(([category]) => category);
  return {
    ...total, score, accuracy: total.answered ? Math.round(total.correct / total.answered * 100) : null,
    byChannel, byCategory, weakCategories,
  };
}

export function getProfile(correct: number, answered: number) {
  if (!answered) return { title: 'Treino por começar', text: 'Responda algumas mensagens para descobrir o que merece mais atenção.' };
  const accuracy = correct / answered * 100;
  if (accuracy >= 90) return { title: 'Caçador de golpes', text: 'Você distinguiu bem os sinais desta partida. Continue conferindo o contexto e o destino de cada pagamento.' };
  if (accuracy >= 70) return { title: 'Radar ligado', text: 'Você reconheceu boa parte dos sinais. Rever os erros ajuda a perceber detalhes menos óbvios.' };
  if (accuracy >= 40) return { title: 'Desconfiado', text: 'Você já percebe alguns sinais. Agora vale diferenciar pedidos suspeitos de mensagens legítimas com contexto confirmado.' };
  return { title: 'Começando a observar', text: 'Use a revisão para entender cada situação. Uma pausa e uma checagem independente podem mudar sua próxima decisão.' };
}

export function shareResult(session: SessionRecord): string {
  const stats = analyzeAnswers(session.answers);
  return [
    'Consumo Impulsivo e Golpes Digitais — Treine para não cair',
    stats.answered ? `${stats.correct}/${stats.answered} acertos (${stats.accuracy}%) · ${stats.score} pontos.` : 'Partida encerrada sem respostas.',
    `${stats.answered} de ${session.size} questões respondidas.`,
    `Golpes aceitos como seguros: ${stats.missedScams}. Mensagens legítimas marcadas como golpe: ${stats.falseAlarms}.`,
    'Antes de clicar: pausar, conferir o contexto e verificar por outro canal.',
  ].join('\n');
}

const categories = new Set<string>(Object.values(Category));
const channels = new Set<string>(['whatsapp', 'sms', 'email', 'instagram']);
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isCounter = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
export function isCategory(value: unknown): value is Category { return typeof value === 'string' && categories.has(value); }
export function isCategoryStats(value: unknown): value is CategoryStats {
  return isObject(value) && isCounter(value.answered) && isCounter(value.correct) && isCounter(value.missedScams) &&
    isCounter(value.falseAlarms) && value.correct + value.missedScams + value.falseAlarms === value.answered;
}
export function isAnswerRecord(value: unknown): value is AnswerRecord {
  return isObject(value) && typeof value.challengeId === 'string' && value.challengeId.length > 0 &&
    typeof value.guessedScam === 'boolean' && typeof value.isScam === 'boolean' && isCategory(value.category) &&
    typeof value.channel === 'string' && channels.has(value.channel) && typeof value.points === 'number' &&
    Number.isFinite(value.points) && value.points >= 0;
}
export function isSessionRecord(value: unknown): value is SessionRecord {
  if (!isObject(value) || typeof value.id !== 'string' || !value.id || value.id.length > 100 ||
    typeof value.startedAt !== 'string' || !Number.isFinite(Date.parse(value.startedAt)) ||
    typeof value.finishedAt !== 'string' || !Number.isFinite(Date.parse(value.finishedAt)) ||
    Date.parse(value.finishedAt) < Date.parse(value.startedAt) ||
    !SESSION_SIZES.some((size) => size === value.size) || (value.mode !== 'standard' && value.mode !== 'focused') ||
    !Array.isArray(value.focusCategories) || !value.focusCategories.every(isCategory) ||
    !Array.isArray(value.answers) || !value.answers.every(isAnswerRecord)) return false;
  return typeof value.size === 'number' && value.answers.length <= value.size &&
    new Set(value.answers.map((answer) => answer.challengeId)).size === value.answers.length;
}
export function isTrainingState(value: unknown): value is TrainingState {
  return isObject(value) && Array.isArray(value.sessions) && value.sessions.length <= 10 && value.sessions.every(isSessionRecord) &&
    new Set(value.sessions.map((session) => session.id)).size === value.sessions.length &&
    isObject(value.categoryStats) && Object.entries(value.categoryStats).every(([category, stats]) => isCategory(category) && isCategoryStats(stats));
}
