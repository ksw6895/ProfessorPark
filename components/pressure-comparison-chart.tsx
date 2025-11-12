type PressureComparisonChartProps = {
  hydrostatic: number;
  viscous: number;
};

export function PressureComparisonChart({ hydrostatic, viscous }: PressureComparisonChartProps) {
  const bars = [
    {
      label: "Hydrostatic (Δρgh)",
      value: hydrostatic,
      color: "from-sky-400 to-sky-600",
      annotation: `${hydrostatic.toFixed(2)} cmH₂O`,
    },
    {
      label: "Viscous loss",
      value: viscous,
      color: "from-emerald-400 to-emerald-500",
      annotation: `${viscous.toFixed(2)} cmH₂O`,
    },
  ];

  const maxValue = Math.max(...bars.map((bar) => bar.value)) || 1;
  const ratio = hydrostatic / (viscous || 1e-6);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Standing posture (Δh = +45 cm)</h4>
      <p className="mt-2 text-sm text-slate-500">
        Hydrostatic pressure dwarfs viscous resistance by more than an order of magnitude.
      </p>
      <div className="mt-6 space-y-5">
        {bars.map((bar) => {
          const width = (bar.value / maxValue) * 100;
          return (
            <div key={bar.label} className="space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                <span>{bar.label}</span>
                <span className="font-semibold text-primary">{bar.annotation}</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${bar.color}`}
                  style={{ width: `${width}%`, transition: "width 600ms ease-out" }}
                />
                <div className="absolute inset-y-0 left-0 right-0">
                  <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300/60" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-semibold text-primary">
          Hydrostatic head ÷ viscous loss ≈ {ratio.toFixed(1)}×
        </p>
        <p className="mt-1 leading-relaxed">
          Even with identical catheter geometry, gravity injects {hydrostatic.toFixed(0)} cmH₂O in standing patients while
          Poiseuille friction removes only {viscous.toFixed(2)} cmH₂O. Orientation controls are therefore mandatory.
        </p>
      </div>
    </div>
  );
}
