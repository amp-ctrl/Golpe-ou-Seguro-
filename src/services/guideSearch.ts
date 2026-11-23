import {
  GUIDE_CHANNEL_LABELS, GUIDE_TRIGGER_LABELS,
  type EducationalScam, type GuideCategoryId, type ScamGuideCategory,
} from '../data/guiaGolpes';

export type GuideCategoryFilter = 'all' | GuideCategoryId;
export interface GuideCategoryMatches {
  category: ScamGuideCategory;
  scams: readonly EducationalScam[];
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR').replace(/e[\s-]?mail/g, 'email')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

export function filterGuideCategories(
  categories: readonly ScamGuideCategory[],
  categoryId: GuideCategoryFilter,
  query: string,
): GuideCategoryMatches[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return categories
    .filter((category) => categoryId === 'all' || category.id === categoryId)
    .map((category) => ({
      category,
      scams: category.scams.filter((scam) => {
        const searchable = normalize([
          category.title, category.summary, scam.name, scam.description,
          ...scam.channels.flatMap((channel) => [
            channel, GUIDE_CHANNEL_LABELS[channel],
            ...(channel === 'phone' ? ['telefone', 'telefonema'] : []),
          ]),
          ...scam.approachSteps, ...scam.triggers.map((trigger) => GUIDE_TRIGGER_LABELS[trigger]),
          scam.triggerExplanation, ...scam.redFlags, ...scam.prevention, ...scam.recovery,
        ].join(' '));
        return terms.every((term) => searchable.includes(term));
      }),
    }))
    .filter(({ scams }) => scams.length > 0);
}
