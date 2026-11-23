/**
 * Consumo impulsivo e golpes digitais — catálogo para leitura educacional.
 * Dados estáticos, sem dependências dos desafios ou dos serviços de treino.
 * As categorias são grupos editoriais: um golpe pode combinar várias técnicas.
 * Listas de passos seguem a ordem da abordagem; alertas isolados não provam fraude.
 * readonly protege o contrato de consumo no TypeScript, sem congelamento em runtime.
 */
export type GuideChannel =
  | 'email' | 'sms' | 'whatsapp' | 'instagram' | 'social'
  | 'phone' | 'website' | 'marketplace' | 'app' | 'telegram';

export type PsychologicalTrigger =
  | 'urgencia' | 'medo' | 'escassez' | 'impulso-de-compra'
  | 'vantagem-financeira' | 'autoridade' | 'confianca'
  | 'curiosidade' | 'reciprocidade' | 'prova-social'
  | 'necessidade-de-renda' | 'recuperacao-de-perdas';

export type GuideCategoryId =
  | 'phishing-e-engenharia-social'
  | 'consumo-impulsivo-e-ecommerce-falso'
  | 'financeiros-e-pix'
  | 'invasao-de-contas-e-identidade'
  | 'falsa-central-e-suporte'
  | 'falsos-investimentos-e-renda-extra';

export type ReadingList<T = string> = readonly [T, ...T[]];

export type GuideTechnique = "captura-de-senha" | "premio-com-taxa" | "aplicativo-malicioso" | "loja-falsa" | "taxa-de-encomenda" | "numero-novo" | "pix-errado" | "beneficiario-trocado" | "emprestimo-com-taxa" | "comprovante-falso" | "roubo-de-codigo" | "perfil-clonado" | "falsa-central" | "acesso-remoto" | "retorno-garantido" | "vaga-com-taxa" | "link-encurtado" | "tributo-falso" | "golpe-do-romance" | "ingresso-falso" | "sinal-antecipado" | "falso-influenciador" | "limpa-nome-falso" | "qr-code-adulterado";

export interface EducationalScam {
  readonly id: string;
  readonly name: string;
  /** Técnicas cobertas no artigo; permite conferir a abrangência editorial. */
  readonly techniques: ReadingList<GuideTechnique>;
  readonly sources: ReadingList<GuideSource>;
  readonly channels: ReadingList<GuideChannel>;
  readonly description: string;
  readonly approachSteps: ReadingList;
  readonly triggers: ReadingList<PsychologicalTrigger>;
  readonly triggerExplanation: string;
  readonly redFlags: ReadingList;
  readonly prevention: ReadingList;
  readonly recovery: ReadingList;
}

export interface ScamGuideCategory {
  readonly id: GuideCategoryId;
  readonly title: string;
  readonly summary: string;
  readonly channels: ReadingList<GuideChannel>;
  readonly triggers: ReadingList<PsychologicalTrigger>;
  readonly triggerExplanation: string;
  /** O vínculo de cada golpe à categoria é dado por este agrupamento. */
  readonly scams: ReadingList<EducationalScam>;
}

export interface GuideSource {
  readonly title: string;
  readonly organization: string;
  readonly url: string;
}

export interface ScamGuide {
  readonly projectTitle: string;
  readonly title: string;
  readonly reviewedAt: string;
  readonly introduction: string;
  readonly readingNotes: ReadingList;
  readonly categories: ReadingList<ScamGuideCategory>;
  readonly sources: ReadingList<GuideSource>;
}

export const GUIDE_CHANNEL_LABELS: Readonly<Record<GuideChannel, string>> = {
  email: 'E-mail', sms: 'SMS', whatsapp: 'WhatsApp', instagram: 'Instagram',
  social: 'Outras redes sociais', phone: 'Ligação telefônica', website: 'Sites',
  marketplace: 'Marketplaces e classificados', app: 'Aplicativos', telegram: 'Telegram',
};

export const GUIDE_CHANNEL_SHORT_LABELS: Readonly<Record<GuideChannel, string>> = {
  ...GUIDE_CHANNEL_LABELS, social: 'Redes sociais', phone: 'Telefone', marketplace: 'Classificados',
};

export const GUIDE_TRIGGER_LABELS: Readonly<Record<PsychologicalTrigger, string>> = {
  urgencia: 'Urgência', medo: 'Medo', escassez: 'Escassez',
  'impulso-de-compra': 'Impulso de compra',
  'vantagem-financeira': 'Promessa de vantagem financeira',
  autoridade: 'Autoridade', confianca: 'Confiança', curiosidade: 'Curiosidade',
  reciprocidade: 'Reciprocidade', 'prova-social': 'Prova social',
  'necessidade-de-renda': 'Necessidade de renda',
  'recuperacao-de-perdas': 'Tentativa de recuperar perdas',
};

export const GUIDE_SOURCES = {
  "phishing": {
    "title": "Phishing e outros golpes",
    "organization": "CERT.br",
    "url": "https://cartilha.cert.br/fasciculos/phishing-golpes/fasciculo-phishing-golpes-alta.pdf"
  },
  "authentication": {
    "title": "Autenticação",
    "organization": "CERT.br",
    "url": "https://cartilha.cert.br/fasciculos/autenticacao/fasciculo-autenticacao.pdf"
  },
  "commerce": {
    "title": "Fascículos de segurança: comércio, contas e resposta a golpes",
    "organization": "CERT.br",
    "url": "https://cartilha.cert.br/fasciculos/"
  },
  "pix": {
    "title": "Segurança no Pix",
    "organization": "Banco Central do Brasil",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/pix-seguranca"
  },
  "bankRecovery": {
    "title": "O que fazer em caso de golpe, fraude ou crime",
    "organization": "Banco Central do Brasil",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-fazer-em-caso-de-golpe-fraude-ou-um-crime"
  },
  "bankScams": {
    "title": "Alertas e orientações sobre golpes financeiros",
    "organization": "Banco Central do Brasil",
    "url": "https://www.bcb.gov.br/golpes"
  },
  "wrongPix": {
    "title": "Golpe do Pix errado",
    "organization": "Febraban",
    "url": "https://portal.febraban.org.br/DetalheAntifraude/1/pt-br/"
  },
  "delivery": {
    "title": "Mensagens falsas sobre encomendas",
    "organization": "Correios",
    "url": "https://www.correios.com.br/central-de-informacoes/boletim-aos-clientes/mensagens-falsas-sobre-encomendas"
  },
  "deliverySecurity": {
    "title": "Segurança",
    "organization": "Correios",
    "url": "https://www.correios.com.br/falecomoscorreios/seguranca/seguranca"
  },
  "investments": {
    "title": "Ofertas e atuações irregulares",
    "organization": "Comissão de Valores Mobiliários",
    "url": "https://www.gov.br/cvm/pt-br/assuntos/protecao/alertas/ofertas-atuacoes-irregulares"
  },
  "pyramid": {
    "title": "Pirâmides financeiras e esquemas Ponzi",
    "organization": "Portal do Investidor / CVM",
    "url": "https://www.gov.br/investidor/pt-br/investir/cuidados-ao-investir/evitando-problemas/principais-fraudes-e-esquemas-irregulares/piramides-financeiras-e-esquemas-ponzi"
  },
  "tasks": {
    "title": "Cartilha de segurança: golpe da tarefa e outras fraudes",
    "organization": "CAIXA",
    "url": "https://www.caixa.gov.br/Downloads/seguranca/Cartilha-seguranca.pdf"
  },
  "sim": {
    "title": "Como agir em caso de clonagem do aparelho celular",
    "organization": "CTIR Gov",
    "url": "https://www.gov.br/ctir/pt-br/centrais-de-conteudo/publicacoes/recomendacoes-pdf/2019/recomendacao_2019_05_como_agir_em_caso_de_clonagem_do_aparelho_celular.pdf"
  },
  "tax": {
    "title": "É golpe? Golpes mais comuns",
    "organization": "Receita Federal",
    "url": "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/e-golpe/e-golpe-quais-sao-os-golpes-mais-comuns"
  },
  "typology": {
    "title": "Cartilha de tipologia de fraudes e golpes",
    "organization": "Ministério da Justiça e Segurança Pública / Febraban",
    "url": "https://www.gov.br/mj/pt-br/assuntos/alianca-nacional-de-combate-a-fraudes-bancarias-digitais/glossario_final_iniciativa_1-8_v10.pdf"
  }
} as const satisfies Readonly<Record<string, GuideSource>>;

/** Textos curtos da navegação; o conteúdo completo permanece em cada categoria. */
export const GUIDE_CATEGORY_PREVIEWS: Readonly<Record<GuideCategoryId, { readonly title: string; readonly summary: string }>> = {
  "phishing-e-engenharia-social": {
    "title": "Phishing",
    "summary": "Mensagens e páginas falsas usam confiança ou urgência para obter seus dados."
  },
  "consumo-impulsivo-e-ecommerce-falso": {
    "title": "Compras falsas",
    "summary": "Ofertas irresistíveis e lojas inventadas transformam o impulso de compra em prejuízo."
  },
  "financeiros-e-pix": {
    "title": "Pix e bancos",
    "summary": "Pedidos de dinheiro e cobranças manipuladas desviam pagamentos para outras contas."
  },
  "invasao-de-contas-e-identidade": {
    "title": "Invasão de conta",
    "summary": "Códigos, perfis e linhas telefônicas são usados para agir em seu nome."
  },
  "falsa-central-e-suporte": {
    "title": "Falsa central",
    "summary": "Um falso atendente cria um problema para pedir acesso, códigos ou transferências."
  },
  "falsos-investimentos-e-renda-extra": {
    "title": "Renda extra",
    "summary": "Promessas de ganhos fáceis escondem depósitos obrigatórios e saldos fictícios."
  }
};

export const GUIDE_QUICK_TIPS = [
  {
    "title": "Faça uma pausa",
    "text": "Urgência é um sinal para conferir, não para correr."
  },
  {
    "title": "Confirme por fora",
    "text": "Abra o canal oficial e verifique quem está do outro lado."
  },
  {
    "title": "Proteja seu dinheiro",
    "text": "Confira o recebedor. Nunca compartilhe senhas ou códigos."
  }
] as const;

export const GUIA_GOLPES: ScamGuide = {
  projectTitle: 'Consumo impulsivo e golpes digitais',
  title: 'Guia de golpes digitais',
  reviewedAt: '2026-11-23',
  introduction: 'Entenda como abordagens fraudulentas usam emoções, hábitos de compra e confiança para induzir pagamentos ou obter acesso a contas. Conhecer o roteiro ajuda a fazer uma pausa e verificar antes de agir.',
  readingNotes: [
    'Uma promoção legítima também pode estimular consumo impulsivo. Antes de comprar, avalie necessidade, orçamento, preço final e tempo para decidir.',
    'Fotos, selos, seguidores, dados pessoais corretos e cadeado HTTPS não garantem a identidade de quem está do outro lado.',
    'As categorias organizam a leitura e podem se sobrepor: uma falsa entrega pode começar por phishing e terminar em pagamento fraudulento.',
    'Após um golpe, interrompa o contato, preserve mensagens, endereços, comprovantes e protocolos e registre um boletim de ocorrência. Não se culpe: essas abordagens são planejadas para manipular decisões.',
    'Se houve pagamento, avise imediatamente a instituição pelo canal oficial. Para Pix com suspeita de fraude, solicite análise pelo MED; ele não garante devolução e não substitui a resolução de um simples desacordo comercial.',
    'Não pague pessoas que prometem recuperar dinheiro mediante nova taxa. Use os canais oficiais do banco, da plataforma e das autoridades.',
  ],
  categories: [
    {
      id: 'phishing-e-engenharia-social',
      title: 'Phishing e engenharia social',
      summary: 'O criminoso imita uma organização ou pessoa para induzir a vítima a clicar, informar credenciais, baixar arquivos ou pagar. Phishing usa mensagens e páginas enganosas; engenharia social é a manipulação da confiança que também aparece em ligações e conversas.',
      channels: ['email', 'sms', 'whatsapp', 'social', 'website', 'phone'],
      triggers: ['urgencia', 'medo', 'autoridade', 'curiosidade', 'vantagem-financeira'],
      triggerExplanation: 'A ameaça de bloqueio ou a promessa de benefício reduz o tempo dedicado à conferência e faz a aparência institucional parecer suficiente.',
      scams: [
        {
          "id": "golpe-do-romance",
          "name": "Golpe do romance e falso relacionamento",
          "channels": [
            "social",
            "instagram",
            "whatsapp",
            "app"
          ],
          "techniques": [
            "golpe-do-romance"
          ],
          "description": "Uma identidade falsa constrói vínculo afetivo para obter dinheiro, documentos ou acesso a contas.",
          "approachSteps": [
            "O contato demonstra atenção intensa e cria intimidade à distância.",
            "Surge emergência, viagem ou investimento que dependeria de ajuda financeira.",
            "Após a primeira transferência, novas histórias e promessas mantêm pedidos sucessivos."
          ],
          "triggers": [
            "confianca",
            "reciprocidade",
            "medo"
          ],
          "triggerExplanation": "O vínculo afetivo e o receio de abandonar alguém em dificuldade substituem a verificação independente.",
          "redFlags": [
            "Pedidos de dinheiro acompanhados de sigilo.",
            "Histórias recorrentes que impedem encontros ou confirmação de identidade.",
            "Pressão emocional para transferir a terceiros ou investir em plataforma indicada."
          ],
          "prevention": [
            "Não envie dinheiro ou documentos com base apenas em vínculo on-line.",
            "Converse com alguém de confiança antes de uma decisão financeira.",
            "Confirme identidade e histórias por meios independentes; imagem ou vídeo pode ser manipulado."
          ],
          "recovery": [
            "Interrompa os pagamentos e peça ao banco análise das transferências fraudulentas.",
            "Preserve provas, denuncie o perfil e registre ocorrência; busque apoio de pessoas de confiança. Você não tem culpa pela ação do golpista."
          ]
        ,
          "sources": [GUIDE_SOURCES.phishing, GUIDE_SOURCES.typology]
        },
        {
          "id": "falso-tributo",
          "name": "Falso tributo e regularização de CPF",
          "channels": [
            "email",
            "sms",
            "whatsapp",
            "website"
          ],
          "techniques": [
            "tributo-falso"
          ],
          "description": "Um aviso imita órgão público para cobrar guia falsa ou capturar dados sob ameaça de restrição cadastral.",
          "approachSteps": [
            "A mensagem anuncia imposto atrasado, CPF irregular ou dívida urgente.",
            "Uma página com símbolos oficiais emite cobrança e pede dados pessoais.",
            "O pagamento é destinado ao fraudador e não regulariza eventual pendência verdadeira."
          ],
          "triggers": [
            "autoridade",
            "medo",
            "urgencia"
          ],
          "triggerExplanation": "O medo de uma sanção e a aparência de documento oficial fazem a cobrança parecer obrigatória.",
          "redFlags": [
            "Ameaça de bloqueio imediato recebida por mensagem inesperada.",
            "Guia que não aparece na consulta oficial.",
            "Recebedor incompatível com o órgão e cobrança sem identificação verificável."
          ],
          "prevention": [
            "Consulte a situação no portal oficial do órgão, sem seguir o link da mensagem.",
            "Emita guias apenas no ambiente oficial e compare os dados no banco.",
            "Não use CPF correto e logotipo como prova da origem do aviso."
          ],
          "recovery": [
            "Informe o pagamento fraudulento ao banco e consulte a pendência real no órgão responsável.",
            "Guarde a guia falsa e a conversa, registre ocorrência e proteja as credenciais caso as tenha informado."
          ]
        ,
          "sources": [GUIDE_SOURCES.tax, GUIDE_SOURCES.phishing]
        },
        {
          "id": "link-encurtado",
          "name": "Link encurtado com destino oculto",
          "channels": [
            "sms",
            "whatsapp",
            "email",
            "social"
          ],
          "techniques": [
            "link-encurtado"
          ],
          "description": "Um endereço curto esconde a página final e é usado como isca para cadastro falso, pagamento ou download. Encurtadores também têm usos legítimos; o risco depende da origem e do destino.",
          "approachSteps": [
            "Uma mensagem promete informação, promoção ou resolução urgente por um link curto.",
            "O redirecionamento leva a uma página diferente daquela que a vítima esperava.",
            "A página pede credenciais, pagamento ou instalação, aproveitando a confiança atribuída à mensagem inicial."
          ],
          "triggers": [
            "curiosidade",
            "urgencia",
            "vantagem-financeira"
          ],
          "triggerExplanation": "A promessa de descobrir algo ou aproveitar uma oferta leva ao clique antes de conferir o contexto.",
          "redFlags": [
            "Destino que não pode ser identificado na mensagem.",
            "Página final com domínio diferente do serviço esperado.",
            "Login ou download exigido sem relação com o assunto anunciado."
          ],
          "prevention": [
            "Consulte a informação no aplicativo ou endereço oficial acessado por conta própria.",
            "Confirme mensagens inesperadas com o remetente por outro canal.",
            "Não informe credenciais nem instale arquivos só porque recebeu um link conhecido."
          ],
          "recovery": [
            "Feche a página e verifique se informou dados, baixou ou executou algo; apenas clicar não significa necessariamente invasão.",
            "Troque credenciais expostas em dispositivo confiável e avise o banco se houve pagamento ou exposição de dados financeiros."
          ]
        ,
          "sources": [GUIDE_SOURCES.phishing, GUIDE_SOURCES.authentication]
        },
        {
          id: 'phishing-atualizacao-cadastral',
          techniques: ["captura-de-senha"],
          sources: [GUIDE_SOURCES.phishing, GUIDE_SOURCES.authentication],
          name: 'Phishing de atualização cadastral',
          channels: ['email', 'sms', 'whatsapp', 'website'],
          description: 'Uma mensagem simula banco, loja ou órgão público para capturar dados em uma página falsa de atualização.',
          approachSteps: [
            'Chega um aviso de cadastro vencido, benefício suspenso ou conta prestes a ser bloqueada.',
            'O link abre uma página que copia a identidade visual da instituição e solicita dados, senha ou código.',
            'Os dados enviados são usados para tentar acessar contas, assumir a identidade da vítima ou iniciar outras fraudes.',
          ],
          triggers: ['medo', 'urgencia', 'autoridade'],
          triggerExplanation: 'O receio de perder acesso faz a vítima preencher o formulário antes de confirmar a origem.',
          redFlags: ['Prazo curto com ameaça de bloqueio.', 'Domínio diferente do endereço conhecido, mesmo com logotipo e HTTPS.', 'Solicitação inesperada de senha completa ou código de acesso.'],
          prevention: ['Abra o aplicativo ou digite o endereço conhecido por conta própria.', 'Confira se a pendência aparece na conta autenticada.', 'Use senhas exclusivas e autenticação em duas etapas.'],
          recovery: ['Em aparelho confiável, altere as senhas expostas e repetidas, revise dados de recuperação e encerre sessões desconhecidas.', 'Se enviou dados bancários ou códigos, contate o banco imediatamente para proteger acessos e contestar operações; preserve a mensagem e registre a ocorrência.'],
        },
        {
          id: 'premio-brinde-falso',
          techniques: ["premio-com-taxa"],
          sources: [GUIDE_SOURCES.phishing, GUIDE_SOURCES.commerce],
          name: 'Falso prêmio, brinde ou cupom',
          channels: ['email', 'whatsapp', 'instagram', 'website'],
          description: 'Um suposto benefício gratuito serve de isca para cobrar taxas ou coletar informações pessoais e financeiras.',
          approachSteps: [
            'A vítima recebe um aviso de sorteio, cupom exclusivo ou brinde atribuído a uma marca conhecida.',
            'Uma página pede cadastro, compartilhamento da oferta ou pagamento de frete para resgatar o benefício.',
            'O prêmio não chega e os dados ou pagamentos ficam com o fraudador.',
          ],
          triggers: ['vantagem-financeira', 'escassez', 'reciprocidade'],
          triggerExplanation: 'A sensação de ganhar algo e de precisar retribuir uma pequena taxa faz a pessoa deixar de avaliar o custo real.',
          redFlags: ['Prêmio de sorteio do qual você não participou.', 'Cobrança ou cartão exigido para liberar benefício inesperado.', 'Contador regressivo e obrigação de encaminhar a contatos.'],
          prevention: ['Verifique campanha e regulamento no canal oficial da marca.', 'Não forneça dados de cartão para validar um prêmio desconhecido.', 'Faça uma pausa e confira se a oferta exige gastos que você não planejou.'],
          recovery: ['Se informou cartão, solicite bloqueio e análise de cobranças ao emissor; se pagou por Pix, informe a fraude ao banco.', 'Guarde anúncio e recibos, denuncie a página e avise quem recebeu o encaminhamento.'],
        },
        {
          id: 'link-anexo-aplicativo-malicioso',
          techniques: ["aplicativo-malicioso"],
          sources: [GUIDE_SOURCES.phishing, GUIDE_SOURCES.authentication],
          name: 'Link malicioso, anexo ou falso aplicativo',
          channels: ['email', 'sms', 'whatsapp', 'social', 'website'],
          description: 'Uma isca de foto, documento, fatura ou desconto induz a abrir conteúdo que pode roubar credenciais ou instalar software malicioso.',
          approachSteps: [
            'A mensagem anuncia um documento importante, conteúdo curioso ou cupom que exige um aplicativo especial.',
            'O link solicita login ou oferece arquivo e permissões que não combinam com a finalidade anunciada.',
            'Se a vítima fornece credenciais ou executa conteúdo malicioso, suas contas ou o aparelho podem ser comprometidos.',
          ],
          triggers: ['curiosidade', 'urgencia', 'impulso-de-compra'],
          triggerExplanation: 'A curiosidade ou o desejo de aproveitar um desconto leva a ignorar a origem do arquivo.',
          redFlags: ['Arquivo executável ou APK enviado como se fosse documento ou cupom.', 'Permissões de acessibilidade, leitura de mensagens ou controle do aparelho sem necessidade.', 'Pedido para desativar proteção ou instalar por fora da loja oficial.'],
          prevention: ['Confirme anexos inesperados com o remetente por outro canal.', 'Obtenha aplicativos pela loja oficial e confira desenvolvedor e permissões.', 'Mantenha sistema e aplicativos atualizados; HTTPS não torna um download confiável.'],
          recovery: ['Se instalou algo suspeito, desconecte o aparelho da rede e use outro dispositivo confiável para avisar o banco e proteger contas.', 'Revogue acessos e permissões indevidas e procure suporte confiável para remover a ameaça; se só abriu a página, feche-a e avalie o que informou, baixou ou autorizou.'],
        },
      ],
    },
    {
      id: 'consumo-impulsivo-e-ecommerce-falso',
      title: 'Fraudes de consumo impulsivo e e-commerce falso',
      summary: 'Anúncios, lojas e avisos de entrega falsos exploram a vontade de comprar e o receio de perder uma oportunidade. A oferta pode imitar uma marca conhecida, retirar a negociação da plataforma e direcionar dinheiro a terceiros.',
      channels: ['instagram', 'social', 'website', 'marketplace', 'whatsapp', 'sms', 'email'],
      triggers: ['impulso-de-compra', 'escassez', 'urgencia', 'prova-social', 'vantagem-financeira'],
      triggerExplanation: 'Descontos extremos, contagens regressivas e depoimentos fabricados fazem a compra parecer uma oportunidade que não pode esperar.',
      scams: [
        {
          "id": "falso-influenciador",
          "name": "Falso influenciador e publicidade fraudulenta",
          "channels": [
            "instagram",
            "social",
            "whatsapp",
            "website"
          ],
          "techniques": [
            "falso-influenciador"
          ],
          "description": "Um perfil imitado, conta invadida ou vídeo manipulado usa a reputação de uma pessoa para divulgar venda ou ganho falso.",
          "approachSteps": [
            "A vítima vê uma recomendação aparentemente feita por alguém conhecido ou famoso.",
            "A publicação direciona para oferta, sorteio pago ou investimento com prazo curto.",
            "O pagamento ocorre fora de canais verificáveis e o benefício anunciado não é entregue."
          ],
          "triggers": [
            "prova-social",
            "confianca",
            "impulso-de-compra"
          ],
          "triggerExplanation": "A familiaridade com o divulgador faz a promessa parecer verificada, mesmo quando a conta ou o conteúdo foi manipulado.",
          "redFlags": [
            "Mudança brusca de assunto e promessa de ganho extraordinário.",
            "Conta semelhante à original com endereço ou histórico diferente.",
            "Transferência a terceiro acompanhada de prova baseada só em depoimentos."
          ],
          "prevention": [
            "Verifique a campanha também nos canais oficiais da marca, fora da publicação.",
            "Pesquise vendedor e produto independentemente da pessoa que aparece no anúncio.",
            "Faça uma pausa antes de comprar; conta conhecida e selo não garantem a oferta."
          ],
          "recovery": [
            "Informe banco ou emissor sobre o pagamento e preserve anúncio e endereço de destino.",
            "Denuncie perfil ou publicação e avise o titular verdadeiro por um canal oficial."
          ]
        ,
          "sources": [GUIDE_SOURCES.phishing, GUIDE_SOURCES.commerce]
        },
        {
          "id": "sinal-antecipado",
          "name": "Sinal antecipado em classificados e falso intermediário",
          "channels": [
            "marketplace",
            "whatsapp",
            "social",
            "website"
          ],
          "techniques": [
            "sinal-antecipado"
          ],
          "description": "Um anúncio ou intermediário cobra reserva de imóvel, veículo ou produto que não pode entregar, às vezes usando um bem real de outra pessoa.",
          "approachSteps": [
            "Uma oferta abaixo do mercado atrai o interessado em fechar negócio.",
            "O suposto vendedor ou intermediário pede sinal para reservar e limita a comunicação entre as partes.",
            "Após o pagamento, desaparece ou o proprietário verdadeiro informa que não recebeu e não autorizou o acordo."
          ],
          "triggers": [
            "escassez",
            "vantagem-financeira",
            "impulso-de-compra"
          ],
          "triggerExplanation": "A competição com supostos interessados incentiva o adiantamento sem comprovar propriedade e legitimidade.",
          "redFlags": [
            "Sinal antes de visita, inspeção ou verificação documental.",
            "Orientação para esconder preço ou negociação do proprietário.",
            "Recebedor sem vínculo confirmado com o vendedor."
          ],
          "prevention": [
            "Confirme identidade, propriedade e condições diretamente com todas as partes.",
            "Verifique o bem e a documentação antes de assumir compromisso financeiro.",
            "Não saia da plataforma nem aceite sigilo imposto por um intermediário desconhecido."
          ],
          "recovery": [
            "Acione banco e plataforma rapidamente e guarde comprovantes, identificação e anúncio.",
            "Registre ocorrência e avise o proprietário verdadeiro caso seus dados ou imagens tenham sido usados."
          ]
        ,
          "sources": [GUIDE_SOURCES.commerce, GUIDE_SOURCES.typology]
        },
        {
          "id": "ingresso-falso",
          "name": "Ingresso falso e revenda irregular",
          "channels": [
            "instagram",
            "social",
            "whatsapp",
            "marketplace"
          ],
          "techniques": [
            "ingresso-falso"
          ],
          "description": "O vendedor oferece ingresso inexistente, duplicado ou sem transferência válida para receber antes da descoberta da fraude.",
          "approachSteps": [
            "O anúncio explora um evento esgotado e promete entrada disponível por pouco tempo.",
            "O vendedor mostra print ou PDF e exige pagamento rápido fora do canal autorizado.",
            "O ingresso não é transferido ou o mesmo código já foi vendido e usado por outra pessoa."
          ],
          "triggers": [
            "escassez",
            "impulso-de-compra",
            "urgencia"
          ],
          "triggerExplanation": "O desejo de participar do evento faz a última oportunidade parecer mais importante que a validação do ingresso.",
          "redFlags": [
            "Print apresentado como única prova de titularidade.",
            "Recusa da transferência pelo procedimento do organizador.",
            "Pedido de sinal ou Pix imediato a pessoa não verificada."
          ],
          "prevention": [
            "Consulte as regras de revenda e transferência diretamente com o organizador.",
            "Use canais autorizados e confirme titularidade antes de pagar.",
            "Defina limite de gasto e evite decidir pela pressão de evento esgotado."
          ],
          "recovery": [
            "Avise banco e plataforma sobre a suspeita e preserve anúncio, conversas e arquivo recebido.",
            "Procure o organizador para verificar o ingresso e registre ocorrência, sem repassar o ingresso suspeito a outra pessoa."
          ]
        ,
          "sources": [GUIDE_SOURCES.commerce, GUIDE_SOURCES.phishing]
        },
        {
          id: 'loja-falsa-instagram',
          techniques: ["loja-falsa"],
          sources: [GUIDE_SOURCES.commerce, GUIDE_SOURCES.bankRecovery],
          name: 'Loja falsa no Instagram e nas redes sociais',
          channels: ['instagram', 'social', 'whatsapp', 'website'],
          description: 'Um perfil ou site simula uma loja para receber pedidos sem entregar o produto anunciado.',
          approachSteps: [
            'Anúncios e publicações exibem produtos desejados, avaliações e preços atraentes.',
            'A conversa é levada para mensagem privada ou site próprio e o vendedor pressiona por pagamento imediato.',
            'Após receber, o perfil bloqueia a vítima, desaparece ou envia rastreio sem relação com a compra.',
          ],
          triggers: ['impulso-de-compra', 'prova-social', 'escassez'],
          triggerExplanation: 'Seguidores e comentários aparentam aprovação coletiva; o estoque supostamente baixo acelera a compra.',
          redFlags: ['Preço muito abaixo de outras lojas e pressa para pagar.', 'Recebedor sem relação explicada com a empresa.', 'Comentários limitados, histórico incoerente ou fotos copiadas.'],
          prevention: ['Pesquise reputação fora do anúncio e verifique dados e contatos da empresa; CNPJ existente pode ter sido copiado.', 'Compare o preço final e defina um tempo de espera antes de comprar.', 'Prefira meios com mecanismos de contestação e confira o recebedor; nenhum meio elimina o risco.'],
          recovery: ['Guarde anúncio, conversa e pedido; acione banco ou emissor do cartão para analisar a fraude e as possibilidades de contestação.', 'Denuncie perfil e anúncio, registre ocorrência e procure Procon ou consumidor.gov.br quando houver fornecedor identificável.'],
        },
        {
          id: 'promocao-irreal-site-clonado',
          techniques: ["loja-falsa"],
          sources: [GUIDE_SOURCES.commerce, GUIDE_SOURCES.phishing],
          name: 'Promoção irreal em site clonado',
          channels: ['website', 'instagram', 'social', 'email', 'marketplace'],
          description: 'Uma página copia uma loja ou campanha para vender produtos com descontos inventados e capturar pagamentos ou dados.',
          approachSteps: [
            'Um anúncio patrocinado ou mensagem divulga liquidação excepcional de uma marca.',
            'O endereço parecido com o original leva a uma cópia da loja, com cronômetro e avisos de últimas unidades.',
            'O checkout recebe o pagamento ou dados do cartão sem gerar uma compra na loja verdadeira.',
          ],
          triggers: ['vantagem-financeira', 'urgencia', 'escassez', 'impulso-de-compra'],
          triggerExplanation: 'O medo de perder o desconto transforma a comparação de preços em corrida para finalizar.',
          redFlags: ['Desconto desproporcional em quase todos os produtos.', 'Endereço com palavras extras ou letras diferentes do domínio oficial.', 'Contagem regressiva que recomeça e desconto condicionado a Pix imediato.'],
          prevention: ['Entre na loja pelo endereço que já conhece e confira se a campanha existe.', 'Compare preço, frete e orçamento sem usar o cronômetro como prazo pessoal.', 'Não trate patrocínio, cadeado ou aparência profissional como validação da loja.'],
          recovery: ['Se digitou cartão em página falsa, contate o emissor para proteger o cartão e acompanhar cobranças.', 'Se pagou, comunique a fraude ao banco ou intermediador, preserve o endereço da página e denuncie o anúncio.'],
        },
        {
          id: 'smishing-correios-entregas',
          techniques: ["taxa-de-encomenda"],
          sources: [GUIDE_SOURCES.delivery, GUIDE_SOURCES.deliverySecurity],
          name: 'Smishing dos Correios, falso rastreio e taxa de entrega',
          channels: ['sms', 'whatsapp', 'email', 'website'],
          description: 'Um aviso falso de encomenda retida ou endereço incorreto cobra uma suposta taxa e pode coletar dados.',
          approachSteps: [
            'A mensagem afirma que uma entrega depende de regularização urgente, às vezes com dados de um pedido real.',
            'O link abre rastreio falso e pede pagamento pequeno ou confirmação de endereço e cartão.',
            'A cobrança é recebida por fraudadores e os dados podem alimentar novos golpes.',
          ],
          triggers: ['medo', 'urgencia', 'confianca'],
          triggerExplanation: 'O receio de perder uma compra já paga faz uma pequena taxa parecer um problema fácil de resolver.',
          redFlags: ['Link de pagamento recebido por SMS ou conversa inesperada.', 'Ameaça de devolução da encomenda em poucas horas.', 'Pendência que não aparece no rastreio consultado independentemente.'],
          prevention: ['Consulte a encomenda no aplicativo ou site oficial acessado por conta própria.', 'Confira transportadora e código na compra original; dados corretos na mensagem não autenticam o contato.', 'Para encomendas dos Correios, confira eventuais pagamentos nos canais oficiais, sem seguir o link recebido.'],
          recovery: ['Se pagou, comunique o golpe ao banco imediatamente; se informou cartão, peça proteção ao emissor.', 'Preserve SMS, página e comprovante, denuncie a mensagem e consulte a situação real da entrega no canal oficial.'],
        },
      ],
    },
    {
      id: 'financeiros-e-pix',
      title: 'Golpes financeiros e Pix',
      summary: 'O fraudador induz transferências, altera cobranças ou simula pagamentos. A rapidez do Pix e a aparência de documentos oficiais são usadas para apressar o pagamento e dificultar a conferência do recebedor, do extrato e da origem da solicitação.',
      channels: ['whatsapp', 'phone', 'email', 'sms', 'website', 'marketplace'],
      triggers: ['urgencia', 'confianca', 'medo', 'vantagem-financeira', 'necessidade-de-renda'],
      triggerExplanation: 'Ajudar alguém próximo, evitar uma dívida ou conseguir crédito vira motivo para pagar antes de confirmar.',
      scams: [
        {
          "id": "beneficiario-trocado",
          "name": "Beneficiário trocado em cobrança",
          "channels": [
            "email",
            "whatsapp",
            "website",
            "phone"
          ],
          "techniques": [
            "beneficiario-trocado"
          ],
          "description": "O criminoso altera instruções de pagamento de uma compra, serviço ou dívida para substituir quem receberá o valor.",
          "approachSteps": [
            "Uma mensagem se apresenta como atualização da cobrança ou da conta bancária do fornecedor.",
            "O fraudador envia novos dados preservando detalhes reais da negociação.",
            "O pagamento vai a terceiro e o fornecedor verdadeiro continua sem recebê-lo."
          ],
          "triggers": [
            "confianca",
            "autoridade",
            "urgencia"
          ],
          "triggerExplanation": "Conhecer os detalhes da negociação faz uma mudança de conta parecer rotina administrativa.",
          "redFlags": [
            "Mudança de beneficiário comunicada apenas por mensagem.",
            "Pedido para ignorar os dados da cobrança anterior.",
            "Conta sem relação confirmada com o contrato ou fornecedor."
          ],
          "prevention": [
            "Confirme alterações por um contato antigo do fornecedor, não pelo número enviado no aviso.",
            "Compare os dados no banco com o contrato ou pedido original.",
            "Interrompa o pagamento diante de divergência até obter confirmação independente."
          ],
          "recovery": [
            "Avise imediatamente banco e fornecedor e preserve as duas versões da cobrança.",
            "Peça análise da operação pelo meio de pagamento utilizado e registre ocorrência; nem todo pagamento é Pix ou permite MED."
          ]
        ,
          "sources": [GUIDE_SOURCES.bankScams, GUIDE_SOURCES.bankRecovery]
        },
        {
          "id": "qr-code-adulterado",
          "name": "Código QR adulterado e Pix copia e cola trocado",
          "channels": [
            "website",
            "email",
            "whatsapp",
            "marketplace"
          ],
          "techniques": [
            "qr-code-adulterado"
          ],
          "description": "O código de uma cobrança é substituído para direcionar o pagamento a outro destinatário.",
          "approachSteps": [
            "O fraudador apresenta página, mensagem ou cobrança visualmente familiar.",
            "O código QR ou texto Pix copia e cola aponta para uma conta controlada por ele.",
            "A vítima confirma sem conferir o recebedor exibido pelo banco e paga a pessoa errada."
          ],
          "triggers": [
            "confianca",
            "urgencia"
          ],
          "triggerExplanation": "A praticidade de escanear faz a pessoa confiar no documento em vez de ler os dados da transação.",
          "redFlags": [
            "Destinatário divergente do vendedor ou credor confirmado.",
            "Código substituído por mensagem após a negociação.",
            "Cobrança recebida fora do ambiente original sem justificativa verificável."
          ],
          "prevention": [
            "Compare recebedor, CPF/CNPJ e valor na tela final do aplicativo.",
            "Gere a cobrança no ambiente oficial e confirme divergências antes de pagar.",
            "Não use aparência do QR Code como garantia de autenticidade."
          ],
          "recovery": [
            "Comunique a fraude ao banco e solicite análise pelo MED se houve Pix.",
            "Guarde cobrança original, código recebido e comprovante e avise a plataforma ou credor imitado."
          ]
        ,
          "sources": [GUIDE_SOURCES.pix, GUIDE_SOURCES.bankScams]
        },
        {
          "id": "limpa-nome-falso",
          "name": "Falsa renegociação e golpe do limpa nome",
          "channels": [
            "whatsapp",
            "phone",
            "email",
            "website"
          ],
          "techniques": [
            "limpa-nome-falso"
          ],
          "description": "Um falso agente oferece acordo de dívida ou exclusão de restrição em troca de cobrança que não chega ao credor.",
          "approachSteps": [
            "O contato promete um desconto excepcional para quitar uma dívida real ou inventada.",
            "Apresenta boleto ou chave de pagamento e exige taxa para liberar o acordo.",
            "A vítima paga, mas o credor não reconhece a quitação e podem surgir novas taxas."
          ],
          "triggers": [
            "medo",
            "vantagem-financeira",
            "urgencia"
          ],
          "triggerExplanation": "A preocupação com a dívida e o alívio prometido incentivam aceitar um acordo sem consultar o credor.",
          "redFlags": [
            "Taxa para desbloquear desconto ou retirar restrição sem acordo verificável.",
            "Beneficiário sem vínculo com o credor confirmado.",
            "Acordo que não aparece no canal oficial."
          ],
          "prevention": [
            "Confirme dívida e proposta diretamente com o credor ou plataforma oficial de negociação.",
            "Confira beneficiário, valor e condições antes de pagar.",
            "Não entregue códigos de login a supostos negociadores."
          ],
          "recovery": [
            "Avise banco e credor verdadeiro, sem presumir que a dívida foi quitada.",
            "Preserve proposta e comprovante, registre ocorrência e conteste o uso indevido dos seus dados."
          ]
        ,
          "sources": [GUIDE_SOURCES.bankScams, GUIDE_SOURCES.phishing]
        },
        {
          id: 'falso-parente-whatsapp',
          techniques: ["numero-novo"],
          sources: [GUIDE_SOURCES.phishing, GUIDE_SOURCES.bankRecovery],
          name: 'Falso parente no WhatsApp',
          channels: ['whatsapp', 'phone', 'social'],
          description: 'Alguém usa foto conhecida, número novo ou conta invadida para pedir dinheiro em nome de um familiar.',
          approachSteps: [
            'A mensagem diz que o celular mudou ou apresenta uma emergência pessoal.',
            'O suposto parente pede Pix para ele ou para um terceiro e evita confirmação independente.',
            'Após o pagamento, surgem novas necessidades ou o contato desaparece.',
          ],
          triggers: ['confianca', 'urgencia', 'medo'],
          triggerExplanation: 'A preocupação com um familiar faz a vítima agir para ajudar antes de checar a identidade.',
          redFlags: ['Número novo acompanhado de pedido urgente de dinheiro.', 'Desculpas para não confirmar a história por outro meio.', 'Recebedor desconhecido ou pedidos sucessivos.'],
          prevention: ['Ligue para o número antigo ou procure o familiar por outro contato conhecido.', 'Confirme o pedido e o recebedor antes de transferir; foto e áudio não bastam.', 'Combine formas de confirmação com a família sem divulgar dados pessoais em redes.'],
          recovery: ['Informe a fraude ao banco e peça análise pelo MED se houve Pix, sem esperar resposta do golpista.', 'Avise o familiar por outro canal, denuncie a conta e preserve a conversa e o comprovante para a ocorrência.'],
        },
        {
          id: 'pix-errado-falsa-devolucao-med',
          techniques: ["pix-errado"],
          sources: [GUIDE_SOURCES.pix, GUIDE_SOURCES.wrongPix],
          name: 'Falsa devolução ou golpe do Pix errado/MED',
          channels: ['whatsapp', 'phone', 'sms'],
          description: 'O contato alega ter enviado um Pix por engano e exige transferência para outra conta; pode haver um Pix real ou apenas um comprovante falso.',
          approachSteps: [
            'A vítima recebe um pedido urgente de devolução acompanhado de comprovante.',
            'O solicitante fornece uma chave diferente da origem, em vez de usar a devolução vinculada à transação.',
            'Se a vítima faz outro Pix, cria uma operação separada; uma contestação do crédito original pode aumentar o prejuízo.',
          ],
          triggers: ['reciprocidade', 'urgencia', 'medo'],
          triggerExplanation: 'A vontade de corrigir um erro e a ameaça de denúncia pressionam uma devolução sem conferência.',
          redFlags: ['Pedido para devolver a chave de terceiro.', 'Comprovante sem crédito correspondente no extrato.', 'Ameaça ou suposto atendente exigindo Pix para liberar MED.'],
          prevention: ['Confira o crédito no próprio aplicativo, sem confiar no comprovante enviado.', 'Se confirmar que recebeu por engano, use a função de devolver da transação original; diante de dúvida, consulte seu banco.', 'Não faça novo Pix nem pague taxa para ativar MED a pedido de um contato.'],
          recovery: ['Avise o banco se realizou transferência separada e apresente tanto o crédito original quanto o novo pagamento para análise.', 'Se houver contestação ou bloqueio, responda pelo canal oficial com os comprovantes; não negocie nova transferência com o solicitante.'],
        },
        {
          id: 'falso-boleto',
          techniques: ["beneficiario-trocado"],
          sources: [GUIDE_SOURCES.bankScams, GUIDE_SOURCES.bankRecovery],
          name: 'Falso boleto',
          channels: ['email', 'whatsapp', 'website', 'phone'],
          description: 'Um boleto falso ou adulterado direciona o pagamento a quem não é o credor da compra, conta ou dívida.',
          approachSteps: [
            'O fraudador envia segunda via, acordo com desconto ou documento visualmente parecido com o esperado.',
            'A vítima usa o código de barras ou QR Code, cujo destinatário foi trocado.',
            'O dinheiro vai ao fraudador e a obrigação verdadeira pode continuar pendente.',
          ],
          triggers: ['urgencia', 'medo', 'vantagem-financeira'],
          triggerExplanation: 'Evitar juros ou aproveitar desconto reduz a atenção ao beneficiário mostrado no banco.',
          redFlags: ['Beneficiário ou CPF/CNPJ sem relação confirmada com a cobrança.', 'Troca inesperada dos dados de pagamento por mensagem.', 'Desconto excepcional condicionado a pagamento imediato.'],
          prevention: ['Emita a cobrança pelo canal conhecido do credor.', 'Compare beneficiário, CPF/CNPJ, valor e vencimento na tela antes de confirmar.', 'Se usar QR Code, confira o recebedor do Pix: a aparência de boleto não valida o destinatário.'],
          recovery: ['Comunique imediatamente o banco e o credor verdadeiro para verificar o pagamento e tentar recuperação.', 'Guarde boleto e recibo e registre ocorrência; MED se aplica ao Pix, não ao pagamento convencional de boleto.'],
        },
        {
          id: 'falso-emprestimo',
          techniques: ["emprestimo-com-taxa"],
          sources: [GUIDE_SOURCES.bankScams, GUIDE_SOURCES.bankRecovery],
          name: 'Falso empréstimo com taxa antecipada',
          channels: ['whatsapp', 'phone', 'website', 'social'],
          description: 'Uma falsa oferta de crédito exige depósito prévio para liberar um empréstimo que não será concedido.',
          approachSteps: [
            'A oferta promete aprovação fácil, inclusive para quem tem restrições, e pede documentos.',
            'O atendente envia contrato e cobra seguro, cadastro, imposto ou desbloqueio antes da liberação.',
            'Após o pagamento, inventa novas taxas ou deixa de responder sem conceder o crédito.',
          ],
          triggers: ['necessidade-de-renda', 'vantagem-financeira', 'urgencia', 'autoridade'],
          triggerExplanation: 'A necessidade de resolver uma dificuldade financeira torna a taxa uma aparente etapa para conseguir alívio.',
          redFlags: ['Depósito exigido para liberar crédito prometido.', 'Transferência para pessoa ou empresa sem vínculo confirmado.', 'Pressão para assinar e enviar documentos sem verificar a instituição.'],
          prevention: ['Confira a instituição no Banco Central e contate-a por canal obtido independentemente.', 'Não deposite dinheiro para desbloquear empréstimo.', 'Leia custos e condições do contrato; logotipo, CNPJ e documento assinado não bastam para validar o contato.'],
          recovery: ['Avise o banco sobre o pagamento e preserve proposta, contrato e comprovantes.', 'Se enviou documentos, monitore contas e empréstimos em seu nome e conteste registros desconhecidos junto às instituições.'],
        },
        {
          id: 'falso-comprovante-pix',
          techniques: ["comprovante-falso"],
          sources: [GUIDE_SOURCES.pix, GUIDE_SOURCES.bankRecovery],
          name: 'Golpe do falso comprovante Pix',
          channels: ['whatsapp', 'marketplace', 'email', 'social'],
          description: 'O comprador apresenta imagem adulterada ou agendamento como se fosse pagamento concluído para receber produto ou dinheiro.',
          approachSteps: [
            'Alguém negocia um produto e envia um comprovante que parece confirmar o Pix.',
            'Alega atraso no sistema e pressiona pela entrega; em outra variação, diz ter pago a mais e pede diferença.',
            'A vítima entrega o bem ou devolve um valor sem existir crédito efetivamente recebido.',
          ],
          triggers: ['urgencia', 'confianca', 'reciprocidade'],
          triggerExplanation: 'A vontade de concluir a venda ou corrigir um suposto excesso substitui a conferência do extrato.',
          redFlags: ['Comprovante de agendamento ou imagem sem crédito correspondente.', 'Pressa para retirar o produto antes da confirmação.', 'Pedido de devolução de diferença apoiado apenas em um print.'],
          prevention: ['Confirme o crédito disponível no seu próprio aplicativo antes de entregar.', 'Não use notificações, e-mails ou imagens do comprador como prova suficiente.', 'Se houver pagamento real a devolver, use a devolução vinculada à operação e consulte o banco em caso de dúvida.'],
          recovery: ['Se entregou o bem, preserve anúncio, conversa e dados de retirada e registre ocorrência.', 'Se transferiu uma falsa diferença, contate o banco para contestar o Pix por fraude e informe a plataforma de venda.'],
        },
      ],
    },
    {
      id: 'invasao-de-contas-e-identidade',
      title: 'Invasão de contas e roubo de identidade',
      summary: 'Criminosos capturam credenciais, controlam uma linha telefônica ou copiam dados públicos para agir em nome de outra pessoa. Perfil imitado não significa necessariamente conta invadida: as formas de recuperação dependem do acesso comprometido.',
      channels: ['whatsapp', 'sms', 'phone', 'email', 'instagram', 'social'],
      triggers: ['confianca', 'autoridade', 'medo', 'urgencia'],
      triggerExplanation: 'Pedidos que parecem vir de pessoas conhecidas ou de serviços de segurança incentivam a entrega de códigos e dados.',
      scams: [
        {
          id: 'codigo-verificacao-2fa',
          techniques: ["roubo-de-codigo"],
          sources: [GUIDE_SOURCES.authentication, GUIDE_SOURCES.phishing],
          name: 'Golpe do código de verificação (2FA)',
          channels: ['whatsapp', 'sms', 'phone', 'email'],
          description: 'O fraudador pede um código de registro, recuperação ou segundo fator para concluir um acesso que ele iniciou.',
          approachSteps: [
            'O criminoso tenta entrar ou redefinir o acesso usando o número ou e-mail da vítima.',
            'Ele se passa por suporte ou conhecido e pede o código recebido, dizendo corrigir um erro ou confirmar cadastro.',
            'Com o código, tenta concluir o acesso, alterar dados de recuperação e usar a conta contra os contatos da vítima.',
          ],
          triggers: ['autoridade', 'confianca', 'urgencia'],
          triggerExplanation: 'A justificativa de manutenção transforma uma credencial secreta em aparente informação administrativa.',
          redFlags: ['Pedido de código por ligação ou conversa.', 'Código de login recebido sem solicitação sua.', 'Pedido para aprovar acesso desconhecido ou escanear QR Code para vincular dispositivo.'],
          prevention: ['Use códigos somente no acesso que você iniciou no serviço oficial.', 'Ative segundo fator e, quando disponível, chave de acesso ou chave de segurança.', 'Revise dispositivos vinculados e nunca aprove solicitações de login inesperadas.'],
          recovery: ['Use a recuperação oficial, encerre sessões desconhecidas e revise senha e dados de recuperação em aparelho confiável.', 'Avise contatos por outro meio se a conta estiver sendo usada para pedir dinheiro; preserve alertas e denuncie o comprometimento.'],
        },
        {
          id: 'sim-swap',
          techniques: ["roubo-de-codigo"],
          sources: [GUIDE_SOURCES.sim, GUIDE_SOURCES.authentication],
          name: 'Clonagem de chip e sequestro da linha (SIM swap)',
          channels: ['phone', 'sms', 'whatsapp'],
          description: 'A linha é transferida indevidamente para chip ou eSIM sob controle criminoso; não exige copiar fisicamente o chip original.',
          approachSteps: [
            'O criminoso obtém dados e tenta se passar pelo titular diante da operadora.',
            'Uma troca de chip ou portabilidade indevida tira a linha do aparelho da vítima.',
            'O controle de chamadas e SMS pode facilitar recuperação de contas e interceptação de códigos enviados à linha.',
          ],
          triggers: ['autoridade', 'medo', 'urgencia'],
          triggerExplanation: 'Uma falsa atualização da operadora pode obter dados; em alguns casos a vítima só percebe a fraude ao perder sinal.',
          redFlags: ['Perda inesperada e persistente do serviço sem causa conhecida.', 'Avisos de troca de chip ou portabilidade não solicitada.', 'Redefinições de senha e acessos desconhecidos próximos à perda da linha.'],
          prevention: ['Proteja a conta da operadora e não forneça códigos a supostos atendentes.', 'Prefira autenticador ou chave de segurança a SMS quando o serviço permitir.', 'Mantenha formas de recuperação independentes da linha; PIN do chip não impede sozinho a transferência na operadora.'],
          recovery: ['Contate imediatamente a operadora por outro telefone ou atendimento oficial para bloquear a transferência e recuperar a linha, guardando protocolo.', 'Por aparelho confiável, avise o banco, proteja primeiro o e-mail e revise contas vinculadas ao número; registre a ocorrência.'],
        },
        {
          id: 'perfil-falso-identidade',
          techniques: ["perfil-clonado"],
          sources: [GUIDE_SOURCES.phishing, GUIDE_SOURCES.authentication],
          name: 'Perfil falso e uso indevido de identidade',
          channels: ['instagram', 'social', 'whatsapp', 'email'],
          description: 'Fotos, nomes e outros dados são copiados para criar uma identidade convincente, mesmo sem invadir a conta verdadeira.',
          approachSteps: [
            'O fraudador copia informações públicas de uma pessoa ou marca.',
            'O novo perfil adiciona contatos e oferece produtos, pede ajuda ou solicita documentos.',
            'Quem confia no nome e na foto envia dinheiro ou informações ao impostor.',
          ],
          triggers: ['confianca', 'prova-social', 'urgencia'],
          triggerExplanation: 'Reconhecer uma imagem familiar faz a pessoa atribuir confiança a um canal que nunca confirmou.',
          redFlags: ['Segundo perfil com pedido inesperado de dinheiro.', 'Nome de usuário parecido e histórico incompatível.', 'Recusa de confirmação por um contato conhecido fora da conversa.'],
          prevention: ['Confirme pedidos sensíveis por um canal já conhecido.', 'Limite exposição pública de documentos, telefone e rotina.', 'Revise privacidade e não trate foto, seguidores ou selo como prova isolada de identidade.'],
          recovery: ['Denuncie a imitação na plataforma e avise contatos por um canal legítimo, preservando links e capturas.', 'Se houve acesso real à sua conta, recupere-a e revise sessões; se enviou dinheiro ao perfil, informe a fraude ao banco.'],
        },
      ],
    },
    {
      id: 'falsa-central-e-suporte',
      title: 'Falsa central de atendimento e suporte técnico',
      summary: 'O criminoso se apresenta como funcionário para criar um problema e vender uma solução perigosa: transferência, entrega de credenciais ou acesso remoto. Número exibido e conhecimento de dados pessoais não autenticam uma ligação.',
      channels: ['phone', 'whatsapp', 'sms', 'email', 'website', 'app'],
      triggers: ['autoridade', 'medo', 'urgencia', 'confianca'],
      triggerExplanation: 'A suposta autoridade técnica ou bancária usa o medo de uma perda para obter obediência imediata.',
      scams: [
        {
          id: 'falsa-central-bancaria',
          techniques: ["falsa-central"],
          sources: [GUIDE_SOURCES.bankScams, GUIDE_SOURCES.bankRecovery],
          name: 'Falsa central bancária e falso gerente',
          channels: ['phone', 'sms', 'whatsapp'],
          description: 'Um falso funcionário anuncia compra suspeita ou conta invadida e orienta operações que favorecem o fraudador.',
          approachSteps: [
            'Um alerta ou ligação informa uma movimentação alarmante e oferece cancelamento imediato.',
            'O suposto atendente cita dados pessoais e pede sigilo, códigos ou transferência para uma conta dita segura.',
            'A vítima autoriza pagamentos ou entrega acesso acreditando proteger o próprio dinheiro.',
          ],
          triggers: ['medo', 'autoridade', 'urgencia'],
          triggerExplanation: 'O susto cria dependência de quem oferece resolver o problema naquele instante.',
          redFlags: ['Pedido de Pix para proteger saldo ou cancelar fraude.', 'Exigência de senha, código ou sigilo até de familiares.', 'Orientação para ignorar avisos de segurança do aplicativo.'],
          prevention: ['Encerre o contato e procure o banco pelo aplicativo, agência ou número obtido no cartão.', 'Confira as movimentações por conta própria antes de seguir instruções.', 'Não transfira para uma suposta conta segura nem entregue códigos a atendentes.'],
          recovery: ['Contate imediatamente o banco pelo canal oficial para bloquear acessos e contestar operações; solicite análise pelo MED para Pix fraudulento.', 'Guarde registros da chamada e comprovantes e registre ocorrência; não retome a negociação com quem ligou.'],
        },
        {
          id: 'falso-suporte-acesso-remoto',
          techniques: ["acesso-remoto"],
          sources: [GUIDE_SOURCES.phishing, GUIDE_SOURCES.authentication],
          name: 'Falso suporte técnico e aplicativos de acesso remoto',
          channels: ['phone', 'whatsapp', 'website', 'email', 'app'],
          description: 'Um falso técnico induz a instalação de ferramenta remota ou aplicativo malicioso para observar ou controlar o aparelho.',
          approachSteps: [
            'O contato ou um aviso na tela alega vírus, erro de compra ou falha no banco.',
            'O falso técnico pede instalação, compartilhamento de tela ou permissões de controle e acessibilidade.',
            'Com a sessão ativa, tenta obter códigos, operar contas ou induzir pagamentos.',
          ],
          triggers: ['medo', 'autoridade', 'urgencia'],
          triggerExplanation: 'O receio de perder dados faz a vítima entregar controle a quem se apresenta como especialista.',
          redFlags: ['Suporte não solicitado pedindo controle do celular.', 'Solicitação para abrir banco durante compartilhamento de tela.', 'Instalação por link ou permissão incompatível com o atendimento.'],
          prevention: ['Inicie o atendimento no canal oficial e confirme o motivo e os limites de qualquer acesso.', 'Não abra aplicativos financeiros nem exponha códigos em sessões remotas.', 'Não instale ferramentas ou conceda acessibilidade por orientação de contato inesperado.'],
          recovery: ['Encerre o acesso e desconecte o aparelho; use outro dispositivo confiável para avisar banco e bloquear acessos expostos.', 'Remova permissões e ferramentas suspeitas, revise sessões e senhas e procure suporte confiável para verificar o aparelho, preservando provas.'],
        },
      ],
    },
    {
      id: 'falsos-investimentos-e-renda-extra',
      title: 'Falsos investimentos e renda extra',
      summary: 'Ofertas prometem ganhos fáceis e usam pequenos pagamentos ou saldos fictícios como prova. A vítima é incentivada a depositar mais, recrutar pessoas ou pagar para sacar um dinheiro que pode não existir.',
      channels: ['instagram', 'social', 'whatsapp', 'telegram', 'website', 'app'],
      triggers: ['vantagem-financeira', 'prova-social', 'necessidade-de-renda', 'recuperacao-de-perdas', 'escassez'],
      triggerExplanation: 'A expectativa de melhorar de vida se combina com depoimentos e com a pressão para recuperar o que já foi investido.',
      scams: [
        {
          "id": "vaga-com-taxa",
          "name": "Falsa vaga de emprego com taxa",
          "channels": [
            "whatsapp",
            "email",
            "social",
            "website"
          ],
          "techniques": [
            "vaga-com-taxa"
          ],
          "description": "Um falso recrutador promete contratação e condiciona a vaga a pagamento por curso, exame, equipamento ou cadastro sem vínculo real com a empresa.",
          "approachSteps": [
            "Uma oferta atraente chega sem processo seletivo verificável.",
            "O recrutador anuncia aprovação rápida e encaminha um fornecedor ou cobrança obrigatória.",
            "Depois do pagamento, a contratação não acontece e os documentos enviados podem ser usados indevidamente."
          ],
          "triggers": [
            "necessidade-de-renda",
            "autoridade",
            "urgencia"
          ],
          "triggerExplanation": "O receio de perder uma oportunidade de trabalho transforma a taxa em aparente investimento necessário.",
          "redFlags": [
            "Garantia de contratação após pagar a pessoa indicada.",
            "Recrutador sem vínculo confirmado e comunicação fora dos canais da empresa.",
            "Documentos e dados bancários exigidos muito cedo sem justificativa."
          ],
          "prevention": [
            "Confirme a vaga e o recrutador no canal oficial da empresa.",
            "Não pague para liberar uma contratação prometida.",
            "Envie documentos apenas após verificar quem solicita e a finalidade."
          ],
          "recovery": [
            "Interrompa o contato, informe o banco sobre pagamentos e denuncie o anúncio à plataforma e à empresa imitada.",
            "Guarde conversas e documentos enviados, registre ocorrência e monitore possíveis contas ou contratos em seu nome."
          ]
        ,
          "sources": [GUIDE_SOURCES.phishing, GUIDE_SOURCES.commerce]
        },
        {
          id: 'piramide-ponzi-falso-investimento',
          techniques: ["retorno-garantido"],
          sources: [GUIDE_SOURCES.investments, GUIDE_SOURCES.pyramid],
          name: 'Pirâmides, esquemas Ponzi e falsos investimentos',
          channels: ['social', 'instagram', 'whatsapp', 'telegram', 'website'],
          description: 'O esquema apresenta ganhos sem atividade econômica sustentável; pirâmides dependem do recrutamento e esquemas Ponzi pagam participantes antigos com dinheiro de novos.',
          approachSteps: [
            'A oferta promete retorno alto e previsível, às vezes usando criptoativos ou robôs como justificativa.',
            'Pagamentos iniciais e depoimentos levam a aumentar aportes e convidar conhecidos.',
            'Com menos entradas, saques param e aparecem novas exigências para liberar o saldo.',
          ],
          triggers: ['vantagem-financeira', 'prova-social', 'escassez', 'recuperacao-de-perdas'],
          triggerExplanation: 'Ganhos exibidos por outras pessoas e aportes já realizados estimulam novos depósitos.',
          redFlags: ['Retorno elevado garantido sem explicação consistente dos riscos.', 'Receita dependente de novos participantes e bônus por recrutamento.', 'Saque bloqueado com cobrança adicional para suposto imposto ou regularização.'],
          prevention: ['Entenda de onde vem o rendimento e recuse decidir sob pressão.', 'Confira registros e alertas da CVM quando a oferta envolver valores mobiliários; CNPJ sozinho não autoriza uma oferta.', 'Confirme a identidade por canais independentes e não use pagamentos iniciais como garantia de segurança.'],
          recovery: ['Interrompa aportes e não pague para liberar saque; preserve proposta, extratos e identificação dos envolvidos.', 'Avise a instituição de pagamento e registre ocorrência; encaminhe denúncia à CVM quando houver oferta de valores mobiliários e avise pessoas que você indicou.'],
        },
        {
          id: 'tarefa-renda-extra',
          techniques: ["vaga-com-taxa"],
          sources: [GUIDE_SOURCES.tasks, GUIDE_SOURCES.phishing],
          name: 'Golpe da tarefa e da renda extra',
          channels: ['whatsapp', 'telegram', 'social', 'website', 'app'],
          description: 'Uma falsa oportunidade remunera tarefas simples no início e depois exige depósitos crescentes para continuar ou sacar.',
          approachSteps: [
            'Um recrutador oferece dinheiro por curtir vídeos, avaliar produtos ou simular pedidos.',
            'Pequenos pagamentos criam confiança e um grupo exibe supostos resultados de participantes.',
            'Surgem tarefas pré-pagas e saldo bloqueado; cada tentativa de sacar exige novo depósito.',
          ],
          triggers: ['necessidade-de-renda', 'reciprocidade', 'prova-social', 'recuperacao-de-perdas'],
          triggerExplanation: 'O pagamento inicial dá credibilidade e o desejo de recuperar o depósito prende a vítima às próximas tarefas.',
          redFlags: ['Pagamento exigido para trabalhar ou liberar remuneração.', 'Promessa de renda alta por tarefas triviais sem contratação verificável.', 'Saldo que depende de completar missões pagas e convites para grupos fechados.'],
          prevention: ['Confira a vaga diretamente com a empresa por canal independente.', 'Não deposite para desbloquear salário, comissão ou tarefa.', 'Não interprete pequenos pagamentos como comprovação de emprego legítimo.'],
          recovery: ['Pare os depósitos mesmo que o painel mostre saldo; contate o banco para analisar a fraude e eventual MED.', 'Guarde conversas, links e comprovantes e denuncie grupos e perfis; se enviou documentos, acompanhe possíveis usos indevidos.'],
        },
        {
          id: 'falsa-plataforma-apostas',
          techniques: ["retorno-garantido"],
          sources: [GUIDE_SOURCES.phishing, GUIDE_SOURCES.bankRecovery],
          name: 'Falsas plataformas de apostas e robôs de ganho garantido',
          channels: ['instagram', 'social', 'telegram', 'whatsapp', 'website', 'app'],
          description: 'Uma plataforma falsa ou um falso especialista simula ganhos com apostas e cobra depósitos ou taxas para liberar saques.',
          approachSteps: [
            'Anúncios e influenciadores prometem método infalível, sinais ou multiplicação rápida do depósito.',
            'Um painel mostra lucros e incentiva valores maiores ou novas apostas para desbloquear benefícios.',
            'Ao tentar sacar, a vítima recebe cobranças adicionais ou perde o acesso à plataforma.',
          ],
          triggers: ['vantagem-financeira', 'prova-social', 'impulso-de-compra', 'recuperacao-de-perdas'],
          triggerExplanation: 'Ganhos aparentes e a vontade de recuperar perdas estimulam depósitos sucessivos sem reavaliar o risco.',
          redFlags: ['Lucro garantido ou promessa de eliminar o risco das apostas.', 'Cobrança fora da plataforma para liberar saque.', 'Depoimentos como única prova e identidade ou autorização do operador não verificável.'],
          prevention: ['Não trate apostas como fonte garantida de renda ou forma de recuperar perdas.', 'Confira a identidade e a autorização aplicável do operador em fonte oficial independente; autorização não garante lucro.', 'Não instale aplicativos por links de grupos nem deposite para validar ganhos exibidos.'],
          recovery: ['Interrompa pagamentos, preserve o histórico e contate a instituição financeira para analisar as operações suspeitas.', 'Denuncie anúncio e plataforma e registre ocorrência; se os depósitos estiverem difíceis de interromper, procure apoio de alguém de confiança e de serviços de saúde.'],
        },
      ],
    },
  ],
  sources: [GUIDE_SOURCES.phishing, GUIDE_SOURCES.authentication, GUIDE_SOURCES.commerce, GUIDE_SOURCES.pix, GUIDE_SOURCES.bankRecovery, GUIDE_SOURCES.bankScams, GUIDE_SOURCES.wrongPix, GUIDE_SOURCES.delivery, GUIDE_SOURCES.deliverySecurity, GUIDE_SOURCES.investments, GUIDE_SOURCES.pyramid, GUIDE_SOURCES.tasks, GUIDE_SOURCES.sim, GUIDE_SOURCES.tax, GUIDE_SOURCES.typology],
};
