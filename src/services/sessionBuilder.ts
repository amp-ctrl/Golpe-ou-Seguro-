import type { Challenge } from '../data/challenges';

export const SESSION_SIZES = [10, 15, 20] as const;
export type SessionSize = (typeof SESSION_SIZES)[number];
/** Mais antiga primeiro; cada lista contém apenas questões efetivamente exibidas. */
export interface SeenSession { ids: string[] }
export interface SessionOptions {
  size?: SessionSize;
  history?: readonly SeenSession[];
  seed?: number | string;
}

function seededRandom(seed: number | string): () => number {
  let state = 2166136261;
  for (const character of String(seed)) {
    state = Math.imul(state ^ character.charCodeAt(0), 16777619);
  }
  return () => {
    state += 0x6D2B79F5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sorteio sem I/O e sem mutar entradas; o seed torna o resultado reproduzível.
 * Curva explícita: ~30% nível 1, ~40% nível 2, restante nível 3.
 * Busca com retrocesso mantém TODAS as restrições, sem fallback que as relaxe.
 * Históricos afetam pesos, não proíbem rever uma questão em outra partida.
 */
export function buildSession(pool: readonly Challenge[], options: SessionOptions = {}): Challenge[] {
  const { size = 10, history = [], seed } = options;
  if (!SESSION_SIZES.includes(size)) throw new Error('Tamanho de partida inválido. Use 10, 15 ou 20.');
  if (new Set(pool.map(({ id }) => id)).size !== pool.length) {
    throw new Error('O banco contém IDs repetidos.');
  }
  if (pool.length < size) throw new Error('Questões insuficientes para montar a partida.');

  const random = seededRandom(seed ?? Math.floor(Math.random() * 4294967296));
  const recent = history.slice(-3);
  const byId = new Map(pool.map((challenge) => [challenge.id, challenge]));
  const firstIds = new Set(recent.map(({ ids }) => ids[0]));
  const latest = recent[recent.length - 1]?.ids;
  const lastFirst = latest?.[0] ? byId.get(latest[0]) : undefined;
  const lastId = latest?.[latest.length - 1];
  const lastQuestion = lastId ? byId.get(lastId) : undefined;
  const frequency = new Map<string, number>();
  for (const session of recent) {
    for (const id of new Set(session.ids)) frequency.set(id, (frequency.get(id) ?? 0) + 1);
  }
  const minimumScams = Math.ceil(size * 0.4);
  const maximumScams = Math.floor(size * 0.6);
  const targetScams = minimumScams + Math.floor(random() * (maximumScams - minimumScams + 1));
  const easyCount = Math.round(size * 0.3);
  const mediumEnd = easyCount + Math.round(size * 0.4);
  const difficultyAt = (index: number) => index < easyCount ? 1 : index < mediumEnd ? 2 : 3;
  const chosen: Challenge[] = [];
  const used = new Set<string>();
  let visited = 0;
  const samePair = (a: Challenge, b: Challenge | undefined) =>
    b !== undefined && a.channel === b.channel && a.category === b.category;

  const search = (scamCount: number): boolean => {
    if (++visited > 100_000) return false;
    const index = chosen.length;
    if (index === size) return scamCount === targetScams;
    const scamsLeft = targetScams - scamCount;
    const safeLeft = size - index - scamsLeft;
    let trailing = 0;
    const lastAnswer = chosen[index - 1]?.isScam;
    for (let i = index - 1; i >= 0 && chosen[i].isScam === lastAnswer; i--) trailing++;
    // Reservar separadores evita chegar ao fim com quatro respostas iguais obrigatórias.
    if (scamsLeft > 3 * (safeLeft + 1) - (lastAnswer === true ? trailing : 0) ||
        safeLeft > 3 * (scamsLeft + 1) - (lastAnswer === false ? trailing : 0)) return false;
    // Poda por dificuldade e resposta: evita explorar caminhos que não podem
    // completar a cota de golpes com as questões restantes de cada nível.
    let minimumRemaining = 0;
    let maximumRemaining = 0;
    for (const level of [1, 2, 3]) {
      let slots = 0;
      for (let position = index; position < size; position++) {
        if (difficultyAt(position) === level) slots++;
      }
      const available = pool.filter((q) => !used.has(q.id) && q.difficulty === level);
      const scams = available.filter((q) => q.isScam).length;
      const safe = available.length - scams;
      if (available.length < slots) return false;
      minimumRemaining += Math.max(0, slots - safe);
      maximumRemaining += Math.min(slots, scams);
    }
    if (scamCount + minimumRemaining > targetScams || scamCount + maximumRemaining < targetScams) return false;
    const previous = chosen[index - 1];
    const candidates = pool.filter((candidate) => {
      if (used.has(candidate.id) || candidate.difficulty !== difficultyAt(index)) return false;
      const nextScams = scamCount + Number(candidate.isScam);
      if (nextScams > targetScams || nextScams + size - index - 1 < targetScams) return false;
      if (index === 0) {
        // Também protege a fronteira de uma partida para a próxima, inclusive se encerrada antes.
        return !firstIds.has(candidate.id) && candidate.id !== lastId &&
          !samePair(candidate, lastFirst) && !samePair(candidate, lastQuestion);
      }
      if (candidate.category === previous.category) return false;
      if (index >= 2 && candidate.channel === previous.channel && candidate.channel === chosen[index - 2].channel) return false;
      if (index >= 3 && [previous, chosen[index - 2], chosen[index - 3]].every((item) => item.isScam === candidate.isScam)) return false;
      return true;
    }).map((challenge) => {
      const timesSeen = frequency.get(challenge.id) ?? 0;
      // Corrida exponencial: peso 1 para inéditas, 1/4, 1/9 e 1/16 para já vistas.
      const weight = 1 / (1 + timesSeen) ** 2;
      return { challenge, priority: -Math.log(Math.max(random(), Number.EPSILON)) / weight };
    }).sort((a, b) => a.priority - b.priority);

    for (const { challenge } of candidates) {
      chosen.push(challenge);
      used.add(challenge.id);
      if (search(scamCount + Number(challenge.isScam))) return true;
      used.delete(challenge.id);
      chosen.pop();
      if (visited > 100_000) break;
    }
    return false;
  };

  if (!search(0)) {
    throw new Error('Não foi possível montar uma partida com todas as regras. Revise a diversidade do banco.');
  }
  return [...chosen];
}
