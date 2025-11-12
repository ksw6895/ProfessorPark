type PressureComparisonChartProps = {
  hydrostatic: number;
  viscous: number;
};

export function PressureComparisonChart({ hydrostatic, viscous }: PressureComparisonChartProps) {
  const bars = [
    {
      label: "Hydrostatic (Δρgh)",
      value: hydrostatic,
      color: "bg-sky-500",
      annotation: `${hydrostatic.toFixed(2)} cmH₂O`,
    },
    {
      label: "Viscous loss",
      value: viscous,
      color: "bg-emerald-400",
      annotation: `${viscous.toFixed(2)} cmH₂O`,
    },
  ];

  const maxValue = Math.max(...bars.map((bar) => bar.value));

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Standing posture (Δh = +45 cm)</h4>
      <p className="mt-2 text-sm text-slate-500">
        Hydrostatic pressure dwarfs viscous resistance by more than an order of magnitude.
      </p>
      <div className="mt-8 flex h-64 items-end justify-around gap-6">
        {bars.map((bar) => {
          const height = (bar.value / maxValue) * 100;
          return (
            <div key={bar.label} className="flex w-1/2 flex-col items-center">
              <div className="flex h-full w-full max-w-[120px] flex-col justify-end rounded-2xl bg-slate-100 p-2">
                <div className="relative flex-1 overflow-hidden rounded-xl bg-slate-200">
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${bar.color}`}
                    style={{ height: `${height}%`, transition: "height 600ms ease-out" }}
                  />
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-600">{bar.label}</p>
              <p className="text-sm text-primary">{bar.annotation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
