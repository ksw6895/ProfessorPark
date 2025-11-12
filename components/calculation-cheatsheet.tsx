const cheatsheet = [
  {
    title: "Hydrostatic conversion",
    items: [
      "ΔPₕ (cmH₂O) ≈ 1.007 × Δh(cm) for CSF (ρ = 1007 kg/m³)",
      "1 cmH₂O ≈ 0.7356 mmHg (multiply by 0.7356 to convert)",
      "Sign convention: positive values drive cranial → peritoneal flow",
    ],
  },
  {
    title: "Viscous loss (Poiseuille)",
    items: [
      "ΔPᵥ ≈ 1.87 cmH₂O × (Q / 1 mL·min⁻¹) × (L / 0.80 m) × (0.6 mm / r)⁴",
      "Q = 0.3 mL·min⁻¹ → ΔPᵥ ≈ 0.56 cmH₂O (0.41 mmHg)",
      "Laminar flow confirmed (Re ≪ 2000); resistance scales with length",
    ],
  },
  {
    title: "Clinical interpretation",
    items: [
      "Upright posture adds +45 cmH₂O driving head—> siphon risk",
      "Supine posture introduces −10 cmH₂O, requiring valve opening pressure",
      "Programmable settings alone cannot absorb posture swings",
    ],
  },
];

function CheatsheetCard({ title, items }: (typeof cheatsheet)[number]) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{title}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function CalculationCheatsheet() {
  return (
    <section id="cheatsheet" className="scroll-mt-32">
      <div className="section-wrapper">
        <span className="badge">Q2 · Quantification</span>
        <h2 className="section-title">Calculation cheatsheet</h2>
        <p className="section-subtitle max-w-4xl">
          Keep the governing conversions and assumptions close at hand. These quick references summarise how posture-induced height differences
          translate into pressure heads and how viscous resistance responds to catheter geometry.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cheatsheet.map((card) => (
            <CheatsheetCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
