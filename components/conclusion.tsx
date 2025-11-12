const summaryPoints = [
  {
    title: "물리학 (Physics)",
    message:
      "서 있는 자세는 션트를 30–45 cmH₂O의 사이펀으로 변환합니다. 밸브 설정이 아닌 중력(Gravity)이 압력 예산을 지배합니다.",
  },
  {
    title: "정량화 (Quantification)",
    message:
      "0.6mm 카테터 내부의 점성 손실(Viscous loss)은 생리적 유속에서 <1 cmH₂O이며, 이는 중력 헤드를 상쇄하기에 턱없이 부족합니다.",
  },
  {
    title: "해결책 (Solution)",
    message:
      "방향 감응형 밸브(Orientation-responsive valves)는 자세 의존적 저항을 추가하여, 누운 자세의 배액을 방해하지 않으면서 사이펀을 상쇄합니다.",
  },
];

export function ConclusionSection() {
  return (
    <section className="bg-slate-900 text-slate-100">
      <div className="section-wrapper">
        <span className="badge bg-white/10 text-slate-100">결론 (Conclusion)</span>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">의사결정자를 위한 핵심 요약 (Key Takeaways)</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {summaryPoints.map((point) => (
            <div key={point.title} className="rounded-2xl bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">{point.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-200">{point.message}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-4 text-center text-sm text-slate-300">
          <p>
            정수역학(hydrostatics), 인체 자세, 밸브 메커니즘에 근거한 이 증거들은 션트 선택 및 추적 관찰 프로토콜의 가이드가 됩니다. 이 시각 자료들을 수술 중 사진이나 추적 관찰 영상과 함께 사용하여 Vercel 기반의 프레젠테이션을 완성하십시오.
          </p>
          <a
            href="#"
            className="inline-flex items-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-400"
          >
            발표자 노트 다운로드 (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}
