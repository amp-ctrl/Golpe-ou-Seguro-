import { Category, type ChannelType } from './challenges';

export const CHANNEL_LABELS: Record<ChannelType, string> = {
  whatsapp: 'WhatsApp', sms: 'SMS', email: 'E-mail', instagram: 'Instagram',
};
export const CATEGORY_INFO: Record<Category, { label: string; tip: string }> = {
  [Category.Delivery]: { label: 'Encomendas', tip: 'Consulte o rastreio na compra original antes de pagar uma taxa ou alterar o endereço.' },
  [Category.Bank]: { label: 'Banco', tip: 'Abra o app do banco por conta própria para conferir compras, faturas e atendimentos.' },
  [Category.Pix]: { label: 'Pix', tip: 'Confira o extrato e o recebedor. Para um Pix recebido por engano, use a devolução da própria transação.' },
  [Category.Identity]: { label: 'Identidade', tip: 'Confirme pedidos de dinheiro por um contato antigo ou por conversa presencial, mesmo que a foto seja conhecida.' },
  [Category.Account]: { label: 'Contas e senhas', tip: 'Use códigos apenas no acesso que você iniciou e nunca os repasse a terceiros.' },
  [Category.Support]: { label: 'Suporte', tip: 'Retome o chamado pelo canal que você conhece antes de instalar ferramentas ou permitir acesso remoto.' },
  [Category.Job]: { label: 'Emprego', tip: 'Confira a vaga no canal da empresa e não pague para liberar uma contratação prometida.' },
  [Category.Investment]: { label: 'Investimentos', tip: 'Desconfie de retorno garantido. Confira riscos, custos e a identidade de quem oferece o produto.' },
  [Category.Romance]: { label: 'Relacionamentos', tip: 'Não deixe um vínculo afetivo substituir a verificação da identidade e do destino de um pedido de dinheiro.' },
  [Category.Prize]: { label: 'Prêmios', tip: 'Confira sua participação e o regulamento por um canal conhecido antes de aceitar cobranças por um prêmio.' },
  [Category.Documents]: { label: 'Documentos e tributos', tip: 'Consulte a pendência no canal do órgão responsável antes de emitir ou pagar uma guia.' },
  [Category.Debt]: { label: 'Renegociação', tip: 'Confirme a dívida e as condições diretamente com o credor antes de pagar uma taxa ou acordo.' },
  [Category.Shopping]: { label: 'Compras', tip: 'Confira loja, recebedor e preço final. Uma oferta legítima também merece uma pausa para avaliar o orçamento.' },
  [Category.Ticket]: { label: 'Ingressos', tip: 'Use a transferência autorizada pelo evento; um print não confirma a titularidade do ingresso.' },
  [Category.Marketplace]: { label: 'Classificados', tip: 'Verifique o bem, a documentação e o vendedor antes de pagar um sinal.' },
  [Category.Credit]: { label: 'Empréstimos', tip: 'Confira instituição e contrato. Não deposite dinheiro para desbloquear um empréstimo prometido.' },
  [Category.Payment]: { label: 'Pagamentos', tip: 'Compare beneficiário, valor e vencimento no banco com o contrato, boleto ou pedido original.' },
};
