const STEPS = ['Leia a mensagem', 'Decida se é golpe ou segura', 'Aprenda o porquê'];

export function HowItWorks() {
  return (
    <section className="how-it-works" aria-labelledby="how-it-works-title">
      <h2 id="how-it-works-title">Como funciona</h2>
      <ol className="how-it-works-steps">
        {STEPS.map((step, index) => (
          <li key={step}>
            <span className="step-number" aria-hidden="true">0{index + 1}</span>
            <span>{step}</span>
            {index < STEPS.length - 1 && <span className="step-arrow" aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
