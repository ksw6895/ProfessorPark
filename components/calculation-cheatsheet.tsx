const cheatsheet = [
  {
    title: "정수압 변환 (Hydrostatic)",
    items: [
      "ΔPₕ (cmH₂O) ≈ 1.007 × Δh(cm) for CSF (ρ = 1007 kg/m³)",
      "1 cmH₂O ≈ 0.7356 mmHg (multiply by 0.7356 to convert)",
      "부호 규약: 양수(+)는 두개(cranial) → 복강(peritoneal) 흐름을 의미",
    ],
  },
  {
    title: "점성 손실 (Viscous loss, Poiseuille)",
    items: [
      "ΔPᵥ ≈ 1.87 cmH₂O × (Q / 1 mL·min⁻¹) × (L / 0.80 m) × (0.6 mm / r)⁴",
      "Q = 0.3 mL·min⁻¹ → ΔPᵥ ≈ 0.56 cmH₂O (0.41 mmHg)",
      "층류(Laminar flow) 확인 (Re ≪ 2000); 저항은 길이에 비례",
    ],
  },
  {
    title: "임상적 해석 (Clinical Interpretation)",
    items: [
      "선 자세(Upright)는 +45 cmH₂O의 구동 헤드를 추가 → 사이펀 위험",
      "누운 자세(Supine)는 −10 cmH₂O를 유발, 밸브 개방압(opening pressure) 필요",
      "프로그래머블 설정만으로는 자세 변화(posture swings)를 감당할 수 없음",
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
    <section>
      <div className="section-wrapper">
        <span className="badge">Q2 · 정량화 (Quantification)</span>
        <h2 className="section-title">계산 치트시트 (Calculation Cheatsheet)</h2>
        <p className="section-subtitle max-w-4xl">
          주요 변환 공식과 가정을 가까이에 두십시오. 이 빠른 참조 자료는 자세로 인한 높이 차이가 어떻게 압력 헤드로 변환되는지, 그리고 점성 저항이 카테터 기하학에 어떻게 반응하는지 요약합니다.
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
