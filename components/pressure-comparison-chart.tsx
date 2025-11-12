type PressureComparisonChartProps = {
  hydrostatic: number; // (Standing: +45.33)
  viscous: number; // (Standing: 0.56)
};

export function PressureComparisonChart({ hydrostatic, viscous }: PressureComparisonChartProps) {
  // (45.33 / 0.56 ≈ 80.9)
  const ratio = hydrostatic / (viscous || 1e-6);
  // (45.33 - 0.56 = 44.77)
  const netPressure = hydrostatic - viscous;

  // 시각화를 위한 스케일링
  const maxVisualHeight = 200; // 픽셀
  const hydrostaticHeight = maxVisualHeight;
  const viscousHeight = Math.max(2, (viscous / hydrostatic) * maxVisualHeight); // 최소 2px로 보여줌

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/40 bg-slate-950 text-slate-100 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.75)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_rgba(15,118,110,0.12),_transparent_70%)]" />
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200/70">Standing Posture (서 있는 자세)</p>
            <h4 className="mt-2 text-2xl font-semibold text-white">Δh = +45&nbsp;cm</h4>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              환자가 서 있을 때, 중력 수두(정수압)는 카테터의 점성 저항보다
              {/* (Q2answer.md "두 자릿수 이상 작습니다") */}
              <span className="font-bold text-white"> 약 {ratio.toFixed(0)}배</span> 더 강력한 구동력을 생성합니다.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs uppercase tracking-[0.3em]">
            <p className="text-slate-300">Net Driving Pressure (실효 구동력)</p>
            <p className="mt-2 text-3xl font-semibold text-teal-100">{netPressure.toFixed(1)} cmH₂O</p>
            <p className="mt-1 text-[0.7rem] text-slate-400">중력 구동력 − 점성 손실</p>
          </div>
        </div>

        {/* --- 새로운 시각화 영역: 수직 압력계 --- */}
        <div className="mt-10 flex items-end justify-center gap-8 rounded-2xl border border-white/10 bg-white/5 p-6 pt-8">
          {/* 1. Hydrostatic Head Bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex w-20 flex-col items-center">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-sky-400 to-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                style={{ height: `${hydrostaticHeight}px` }}
              />
              <div className="absolute -top-6 rounded-md bg-slate-800 px-2 py-1 text-sm font-semibold text-white">
                {hydrostatic.toFixed(2)} <span className="text-xs text-slate-300">cmH₂O</span>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-sky-200">정수압 구동력 (Δρgh)</p>
            <p className="max-w-[200px] text-center text-xs text-slate-400">자세로 인해 발생하는 중력 수두</p>
          </div>

          {/* 2. Viscous Loss Bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex w-20 flex-col items-center">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-emerald-400 to-lime-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                style={{ height: `${viscousHeight}px` }}
              />
              <div className="absolute -top-6 rounded-md bg-slate-800 px-2 py-1 text-sm font-semibold text-white">
                {viscous.toFixed(2)} <span className="text-xs text-slate-300">cmH₂O</span>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-emerald-200">점성 저항 (Poiseuille)</p>
            <p className="max-w-[200px] text-center text-xs text-slate-400">카테터 마찰 손실 (Q=0.3 mL/min)</p>
          </div>
        </div>
        {/* --- --- */}

        <div className="mt-10 grid gap-4 sm:grid-cols-[minmax(0,1fr),auto]">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm leading-relaxed text-slate-200">
            <p className="font-semibold text-teal-100">임상적 해석 (Clinical interpretation)</p>
            <p className="mt-2">
              밸브 설정값을 아무리 정밀하게 조절해도, +{hydrostatic.toFixed(0)} cmH₂O에 달하는 자세 변화 충격을 흡수할 수 없습니다.
              중력 보상(Anti-siphon) 기술 없이는 자세 변화 즉시 과배액이 발생합니다.
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-5 text-right">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">정수압 ÷ 점성 저항</p>
            <p className="mt-2 text-4xl font-semibold text-cyan-200">{ratio.toFixed(1)}×</p>
            <p className="mt-1 text-[0.7rem] text-slate-400">자세(방향)가 압력 예산을 지배함</p>
          </div>
        </div>
      </div>
    </div>
  );
}
