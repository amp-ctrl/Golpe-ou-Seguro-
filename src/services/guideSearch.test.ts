import { describe, expect, it } from 'vitest';
import { INITIAL_CHALLENGES, ScamType } from '../data/challenges';
import { GUIA_GOLPES } from '../data/guiaGolpes';
import { filterGuideCategories } from './guideSearch';

const categories = GUIA_GOLPES.categories;
const articles = categories.flatMap((category) => category.scams);
const ids = (query: string) => filterGuideCategories(categories, 'all', query).flatMap(({ scams }) => scams.map(({ id }) => id));

describe('cobertura do guia educativo', () => {
  it('contempla os 24 tipos declarados e todos os tipos contados na tela inicial', () => {
    const covered = new Set(articles.flatMap((scam) => scam.techniques));
    const simulatorTypes = new Set(INITIAL_CHALLENGES.filter((challenge) => challenge.isScam).map((challenge) => challenge.scamType));
    expect(simulatorTypes.size).toBe(24);
    expect([...covered].sort()).toEqual(Object.values(ScamType).sort());
    for (const type of simulatorTypes) expect(covered.has(type), type).toBe(true);
  });

  it('mantém identificação única e fontes válidas em cada artigo', () => {
    expect(new Set(articles.map(({ id }) => id)).size).toBe(articles.length);
    const references = new Set(GUIA_GOLPES.sources.map(({ url }) => url));
    for (const article of articles) {
      expect(article.sources.length, article.id).toBeGreaterThan(0);
      for (const source of article.sources) {
        expect(new URL(source.url).protocol).toBe('https:');
        expect(references.has(source.url), article.id).toBe(true);
      }
    }
  });
});

describe('busca do guia', () => {
  it('ignora acentos, caixa, pontuação e espaços em branco na busca por nome', () => {
    expect(ids('  EMPRESTIMO  ')).toContain('falso-emprestimo');
    expect(ids('empréstimo')).toEqual(ids('EMPRESTIMO'));
    expect(ids('2FA')).toContain('codigo-verificacao-2fa');
    expect(ids('e-mail')).toEqual(ids('email'));
    expect(ids('   ')).toHaveLength(articles.length);
  });

  it('localiza os canais apresentados e palavras do conteúdo de leitura', () => {
    expect(ids('Instagram')).toContain('loja-falsa-instagram');
    expect(ids('telefone')).toContain('falsa-central-bancaria');
    expect(ids('SMS')).toContain('smishing-correios-entregas');
    expect(ids('cronômetro')).toContain('promocao-irreal-site-clonado');
    expect(ids('segundo fator')).toContain('codigo-verificacao-2fa');
  });

  it('combina categoria e todos os termos, sem alterar os dados originais', () => {
    const before = JSON.stringify(categories);
    const matches = filterGuideCategories(categories, 'financeiros-e-pix', 'falso comprovante');
    expect(matches).toHaveLength(1);
    expect(matches[0].scams.map(({ id }) => id)).toContain('falso-comprovante-pix');
    expect(matches.every(({ category }) => category.id === 'financeiros-e-pix')).toBe(true);
    expect(filterGuideCategories(categories, 'invasao-de-contas-e-identidade', 'ingresso')).toEqual([]);
    expect(ids('zzzxxyy')).toEqual([]);
    expect(JSON.stringify(categories)).toBe(before);
  });
});
