type PressureComparisonChartProps = {
  hydrostatic: number;
  viscous: number;
};

export function PressureComparisonChart({ hydrostatic, viscous }: PressureComparisonChartProps) {
  const bars = [
    {
      label: "정수압 헤드 (Hydrostatic head, Δρgh)",
      value: hydrostatic,
      accent: "bg-cyan-400",
      gradient: "from-sky-400 via-sky-500 to-cyan-300",
      description: "환자가 일어설 때 생성되는 중력 기둥",
    },
    {
      label: "점성 손실 (Viscous loss, Poiseuille)",
      value: viscous,
      accent: "bg-emerald-400",
      gradient: "from-emerald-400 via-emerald-500 to-lime-300",
      description: "0.3 mL·min⁻¹ 유속에서 카테터 마찰로 인한 에너지 손실",
    },
  ];

  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);
  const ratio = hydrostatic / (viscous || 1e-6);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/40 bg-slate-950 text-slate-100 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.75)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_rgba(15,118,110,0.12),_transparent_70%)]" />
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200/70">선 자세 (Standing Posture)</p>
            <h4 className="mt-2 text-2xl font-semibold text-white">Δh = +45&nbsp;cm</h4>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              환자가 앉거나 일어설 때, 정수압 기둥은 수십 cmH₂O의 구동 압력을 주입합니다. 이는 카테터의 점성 저항(viscous drag)보다 50배 이상 큽니다.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs uppercase tracking-[0.3em]">
            <p className="text-slate-300">순수 구동 압력 (Net Driving Pressure)</p>
            <p className="mt-2 text-3xl font-semibold text-teal-100">{(hydrostatic - viscous).toFixed(1)} cmH₂O</p>
            <p className="mt-1 text-[0.7rem] text-slate-400">중력 - 마찰 손실</p>
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {bars.map((bar) => {
            const width = (bar.value / maxValue) * 100;
            return (
              <div key={bar.label} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.4)] ${bar.accent}`} />
                    <div>
                      <p className="text-sm font-semibold text-white">{bar.label}</p>
                      <p className="text-[0.75rem] text-slate-400">{bar.description}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-teal-100">{bar.value.toFixed(2)} cmH₂O</p>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${bar.gradient} shadow-[0_0_30px_rgba(14,165,233,0.35)]`}
                    style={{ width: `${width}%`, transition: "width 600ms ease-out" }}
                  />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-[minmax(0,1fr),auto]">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm leading-relaxed text-slate-200">
            <p className="font-semibold text-teal-100">임상적 해석 (Clinical Interpretation)</p>
            <p className="mt-2">
              완벽하게 조율된 밸브라도 +{hydrostatic.toFixed(0)} cmH₂O의 급격한 변화를 흡수할 수 없습니다. 중력 보상 기술 없이는, 자세 변화가 즉시 복강을 향한 과도한 흐름을 유발합니다.
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-5 text-right">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">정수압 ÷ 점성 저항</p>
            <p className="mt-2 text-4xl font-semibold text-cyan-200">{ratio.toFixed(1)}×</p>
            <p className="mt-1 text-[0.7rem] text-slate-400">자세가 전체 압력 예산을 지배함</p>
          </div>
        </div>
      </div>
    </div>
  );
}
