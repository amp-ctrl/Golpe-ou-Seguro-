import type { Challenge } from '../data/challenges';

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

/** Cinco questões distintas: cobre os quatro canais e repete um, com 2–3 golpes. */
export function selectExamples(pool: readonly Challenge[], random = Math.random): Challenge[] {
  if (pool.length < 5 || new Set(pool.map(({ id }) => id)).size !== pool.length) {
    throw new Error('O carrossel precisa de pelo menos cinco questões com IDs distintos.');
  }
  const randomized = shuffle(pool, random);
  const channels = shuffle([...new Set(pool.map(({ channel }) => channel))], random).slice(0, 5);
  const examples: Challenge[] = [];
  for (const channel of channels) {
    const challenge = randomized.find((item) => item.channel === channel);
    if (challenge) examples.push(challenge);
  }
  for (const challenge of randomized) {
    if (examples.length === 5) break;
    if (!examples.some(({ id }) => id === challenge.id)) examples.push(challenge);
  }

  const targetScams = random() < 0.5 ? 2 : 3;
  let scamCount = examples.filter(({ isScam }) => isScam).length;
  for (let index = 0; index < examples.length && scamCount !== targetScams; index++) {
    const needScam = scamCount < targetScams;
    if (examples[index].isScam === needScam) continue;
    const replacement = randomized.find((item) =>
      item.channel === examples[index].channel && item.isScam === needScam &&
      !examples.some(({ id }) => id === item.id));
    if (replacement) {
      examples[index] = replacement;
      scamCount += needScam ? 1 : -1;
    }
  }
  if (scamCount !== targetScams) throw new Error('O banco precisa de golpes e mensagens legítimas nos canais dos exemplos.');
  return shuffle(examples, random);
}
