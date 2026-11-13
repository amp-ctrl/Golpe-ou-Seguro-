// RASCUNHO: conteúdo aguardando revisão do time

export type ChannelType = 'whatsapp' | 'sms' | 'email' | 'instagram';

export interface WhatsAppContent {
  senderName: string;
  senderStatus?: string;
  isGroup?: boolean;
  groupName?: string;
  avatarText: string;
  messageText: string;
  time: string;
}

export interface SmsContent {
  sender: string;
  messageText: string;
  time: string;
}

export interface EmailContent {
  senderName: string;
  senderEmail: string;
  subject: string;
  bodyText: string;
  date: string;
}

export interface InstagramContent {
  username: string;
  accountName: string;
  isVerified: boolean;
  followersText: string;
  createdTime: string;
  promoBadge?: string;
  caption: string;
  commentsText: string;
}

export type ChallengeContent =
  | { channel: 'whatsapp'; content: WhatsAppContent }
  | { channel: 'sms'; content: SmsContent }
  | { channel: 'email'; content: EmailContent }
  | { channel: 'instagram'; content: InstagramContent };

export interface Challenge {
  id: string;
  channel: ChannelType;
  isScam: boolean;
  content: WhatsAppContent | SmsContent | EmailContent | InstagramContent;
  explanation: string;
}

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-01',
    channel: 'whatsapp',
    isScam: true,
    content: {
      senderName: '+55 (11) 97412-3088',
      senderStatus: 'Conta Comercial Não Verificada',
      avatarText: '📦',
      messageText: 'Aviso de Encomenda: Seu pedido pendente foi retido na fiscalização central. Para liberação imediata, regularize a taxa postal no valor de R$ 7,90 através do link: taxa-entrega-express.online/pagar',
      time: '14:28',
    } as WhatsAppContent,
    explanation: 'Transportadoras oficiais e Correios não cobram taxas de liberação via WhatsApp usando números de celular desconhecidos nem links externos suspeitos.',
  },
  {
    id: 'ch-02',
    channel: 'sms',
    isScam: true,
    content: {
      sender: 'BancoAzul-Alerta',
      messageText: 'BancoAzul: Compra aprovada de R$ 1.249,90 nas Lojas Eletro. Caso nao reconheca esta transacao, cancele imediatamente acessando: bancoazul-seguranca.top',
      time: 'Hoje 11:42',
    } as SmsContent,
    explanation: 'Golpistas usam mensagens com tom de pânico e links terminados em extensões estranhas como ".top" para capturar suas senhas bancárias.',
  },
  {
    id: 'ch-03',
    channel: 'instagram',
    isScam: true,
    content: {
      username: 'tenismax_oficial_br',
      accountName: 'TênisMax Oficial',
      isVerified: false,
      followersText: '12 seguidores • Perfil criado há 3 dias',
      createdTime: 'Publicado há 1 hora',
      promoBadge: '🔥 OFERTA RELÂMPAGO - 85% OFF',
      caption: 'LIQUIDAÇÃO DE ESTOQUE! Tênis esportivo edição especial por apenas R$ 79,90! 🏃‍♂️💨 Últimas 7 unidades no estoque, promoção válida só hoje! Compre pelo link na nossa bio: oferta-tenismax.shop',
      commentsText: 'Comentários desativados nesta publicação',
    } as InstagramContent,
    explanation: 'Perfis recém-criados, sem selo de verificação, com poucos seguidores e preços absurdamente baixos usam a falsa sensação de urgência para aplicar golpes.',
  },
  {
    id: 'ch-04',
    channel: 'email',
    isScam: true,
    content: {
      senderName: 'Central de Atendimento ao Consumidor',
      senderEmail: 'suporte@reembolso-loja.net',
      subject: 'Reembolso disponível no valor de R$ 340,00',
      bodyText: 'Prezado(a) cliente,\n\nIdentificamos uma cobrança indevida em sua última fatura e o valor de R$ 340,00 está disponível para estorno imediato.\n\nPara validar a devolução em sua conta corrente, confirme o número completo do cartão, data de validade e o código CVV no prazo improrrogável de até 24 horas acessando: portal-estorno-seguro.net\n\nCaso não confirme, o valor será cancelado.',
      date: 'Hoje, 09:15',
    } as EmailContent,
    explanation: 'Lojas e instituições sérias nunca pedem código de segurança (CVV) ou dados sigilosos de cartão por e-mail para efetuar reembolsos.',
  },
  {
    id: 'ch-05',
    channel: 'whatsapp',
    isScam: true,
    content: {
      senderName: '+55 (21) 96521-8844',
      senderStatus: 'visto por último hoje às 15:10',
      avatarText: '👤',
      messageText: 'Oi mãe, salve meu novo número aí! Meu celular antigo quebrou a tela e perdi tudo provisoriamente. Preciso pagar uma conta urgente hoje antes das 16h, você consegue fazer um Pix de R$ 800 pra mim? Mais tarde te ligo e te explico certinho.',
      time: '15:12',
    } as WhatsAppContent,
    explanation: 'É o clássico golpe do número novo: criminosos fingem ser parentes pedindo dinheiro urgente. Sempre ligue no número antigo ou confirme pessoalmente antes de transferir.',
  },
  {
    id: 'ch-06',
    channel: 'whatsapp',
    isScam: true,
    content: {
      senderName: 'Grupo: Promoções & Cupons VIP 🔥',
      isGroup: true,
      groupName: 'Promoções & Cupons VIP 🔥',
      avatarText: '🎁',
      messageText: '🚨 BÔNUS EXCLUSIVO! Cupom de 90% OFF para compras no ZapFome hoje! Válido apenas para quem atualizar o app pela versão promocional: zapfome-cupom90-atualizado.apk (baixe o arquivo e instale no seu celular antes que acabe)',
      time: '16:05',
    } as WhatsAppContent,
    explanation: 'Instalar arquivos ".apk" enviados por mensagens instala programas maliciosos que podem clonar seu aparelho e roubar credenciais bancárias.',
  },
  {
    id: 'ch-07',
    channel: 'sms',
    isScam: false,
    content: {
      sender: 'BancoAzul',
      messageText: 'BancoAzul: Seu codigo de verificacao de acesso e 482913. Valido por 5 minutos. Nao compartilhe este codigo com ninguem, nem mesmo com funcionários do banco.',
      time: 'Agora',
    } as SmsContent,
    explanation: 'Esta mensagem é legítima: foi gerada durante a tentativa de login do usuário, não contém links externos e reforça a regra de segurança de não repassar o código.',
  },
  {
    id: 'ch-08',
    channel: 'email',
    isScam: false,
    content: {
      senderName: 'Loja Exemplo',
      senderEmail: 'noreply@lojaexemplo.com.br',
      subject: 'Pedido #84920 confirmado com sucesso!',
      bodyText: 'Olá! Recebemos a confirmação do pagamento do seu pedido #84920.\n\nItens: 1x Camiseta Algodão Básica Preta\nPrevisão de entrega: até 5 dias úteis.\n\nPara sua segurança, não solicitamos senhas ou confirmação de dados financeiros por e-mail. Você pode acompanhar todas as etapas da entrega diretamente pelo aplicativo oficial da Loja Exemplo.',
      date: 'Ontem, 16:40',
    } as EmailContent,
    explanation: 'O e-mail vem de domínio institucional reconhecido, não solicita dados sensíveis e orienta o cliente a consultar o status no aplicativo oficial.',
  },
  {
    id: 'ch-09',
    channel: 'instagram',
    isScam: false,
    content: {
      username: 'lojaexemplomoda',
      accountName: 'Loja Exemplo Moda',
      isVerified: true,
      followersText: '245 mil seguidores • Perfil verificado',
      createdTime: 'Publicado há 3 horas',
      promoBadge: '🏷️ CUPOM DE BOAS-VINDAS',
      caption: 'Quer renovar o guarda-roupa? Ganhe 15% de desconto na sua primeira compra utilizando o cupom BEMVINDO15 na tela de finalização do nosso app oficial! Baixe diretamente na Google Play ou App Store. Válido até o fim do mês.',
      commentsText: 'Ver todos os 38 comentários',
    } as InstagramContent,
    explanation: 'Conta verificada, com audiência consolidada e transparência: a promoção exige apenas aplicar um cupom de desconto dentro do aplicativo oficial.',
  },
  {
    id: 'ch-10',
    channel: 'sms',
    isScam: false,
    content: {
      sender: 'BancoAzul',
      messageText: 'BancoAzul: Sua fatura com vencimento em 15/11 ja esta fechada. Para consultar o valor detalhado e o codigo de barras, acesse o app BancoAzul.',
      time: 'Ontem 14:02',
    } as SmsContent,
    explanation: 'Notificação puramente informativa, sem nenhum link suspeito, direcionando o cliente para consultar os dados com segurança dentro do app oficial do banco.',
  },
];
