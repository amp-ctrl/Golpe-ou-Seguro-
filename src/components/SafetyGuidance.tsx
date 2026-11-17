export function SafetyChecklist() {
  return <section className="result-card safety-card"><h2>Checklist antes de clicar</h2><ul className="safety-list">
    <li>Reconheço o pedido e o contexto desta mensagem?</li>
    <li>Confirmei a identidade por um canal que já conhecia?</li>
    <li>Conferi o endereço e quem receberá o pagamento no banco?</li>
    <li>Estão pedindo senha, código, instalação ou uma taxa antecipada?</li>
    <li>Posso pausar e checar antes de agir ou comprar? Cabe no meu orçamento?</li>
  </ul></section>;
}
export function RecoverySteps() {
  return <section className="result-card recovery-card"><h2>Caí num golpe, e agora?</h2><ol className="safety-list">
    <li>Contate imediatamente o banco pelo app, agência ou outro canal oficial que você já conheça.</li>
    <li>Peça o bloqueio de cartões e acessos comprometidos e siga a orientação do banco sobre a proteção da conta.</li>
    <li>Se houve Pix, conteste a transação pelo banco e solicite a análise pelo Mecanismo Especial de Devolução (MED). A devolução não é garantida.</li>
    <li>Guarde comprovantes e mensagens e registre um boletim de ocorrência.</li>
    <li>Troque as senhas expostas em um aparelho confiável, encerre sessões desconhecidas e ative a verificação em duas etapas.</li>
    <li>Se a conta foi clonada ou usada para se passar por você, avise seus contatos por outro canal e inicie a recuperação no serviço.</li>
  </ol></section>;
}
