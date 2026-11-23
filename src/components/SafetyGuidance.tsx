export function SafetyChecklist() {
  return <section className="result-card safety-card"><h2>Checklist antes de clicar</h2><ul className="safety-list">
    <li>Reconheço o pedido e o contexto?</li>
    <li>Confirmei quem enviou por um canal conhecido?</li>
    <li>Conferi o endereço e o recebedor do pagamento?</li>
    <li>Pedem senha, código, instalação ou taxa antecipada?</li>
    <li>A compra é necessária e cabe no meu orçamento?</li>
  </ul></section>;
}
export function RecoverySteps() {
  return <section className="result-card recovery-card"><h2>Caí num golpe, e agora?</h2><ol className="safety-list">
    <li>Avise o banco pelo canal oficial e peça o bloqueio dos cartões ou acessos expostos.</li>
    <li>Se houve Pix, solicite análise pelo MED; a devolução não é garantida.</li>
    <li>Guarde mensagens e comprovantes e registre um boletim de ocorrência.</li>
    <li>Troque as senhas expostas em um aparelho confiável.</li>
    <li>Encerre sessões desconhecidas e ative a verificação em duas etapas.</li>
    <li>Recupere a conta pelo serviço oficial e avise seus contatos se alguém se passar por você.</li>
  </ol></section>;
}
