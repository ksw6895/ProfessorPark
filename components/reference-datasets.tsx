const spinalDataset = {
  upright: {
    title: "Upright (standing or erect sitting)",
    rows: [
      { level: "T7", deltaH: 15, hydrostatic: 15.11, mmHg: 11.11 },
      { level: "T8", deltaH: 10, hydrostatic: 10.07, mmHg: 7.41 },
      { level: "T9", deltaH: 5, hydrostatic: 5.04, mmHg: 3.70 },
      { level: "T10", deltaH: 0, hydrostatic: 0, mmHg: 0 },
    ],
  },
  sitting: {
    title: "Sitting (90° with thoracolumbar flexion)",
    rows: [
      { level: "T7", deltaH: 12, hydrostatic: 12.09, mmHg: 8.89 },
      { level: "T8", deltaH: 8, hydrostatic: 8.06, mmHg: 5.93 },
      { level: "T9", deltaH: 4, hydrostatic: 4.03, mmHg: 2.96 },
      { level: "T10", deltaH: 0, hydrostatic: 0, mmHg: 0 },
    ],
  },
  supine: {
    title: "Supine (recumbent)",
    rows: [
      { level: "T7", deltaH: -14, hydrostatic: -14.1, mmHg: -10.37 },
      { level: "T8", deltaH: -14, hydrostatic: -14.1, mmHg: -10.37 },
      { level: "T9", deltaH: -13, hydrostatic: -13.1, mmHg: -9.63 },
      { level: "T10", deltaH: -13, hydrostatic: -13.1, mmHg: -9.63 },
    ],
  },
};

type DatasetKey = keyof typeof spinalDataset;

type SpinalRow = (typeof spinalDataset)[DatasetKey]["rows"][number];

type SpinalChartGeometry = {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  zeroX: number;
  chartTop: number;
  chartBottom: number;
  bars: Array<{
    barX: number;
    barWidth: number;
    y: number;
    centerY: number;
    barHeight: number;
    level: string;
    deltaLabel: string;
    hydroLabel: string;
    mmHgLabel: string;
    valueLabelX: number;
    valueTextAnchor: "start" | "end";
    isPositive: boolean;
  }>;
  ticks: Array<{
    value: number;
    x: number;
  }>;
};

function computeSpinalChartGeometry(rows: SpinalRow[]): SpinalChartGeometry {
  const width = 640;
  const margin = { top: 72, right: 48, bottom: 80, left: 164 };
  const barHeight = 24;
  const rowGap = 56;
  const height = margin.top + margin.bottom + (rows.length - 1) * rowGap + barHeight;
  const values = rows.map((row) => row.hydrostatic);
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  const range = maxValue - minValue || 1;
  const chartWidth = width - margin.left - margin.right;
  const zeroX = margin.left + ((0 - minValue) / range) * chartWidth;
  const chartTop = margin.top - 28;
  const chartBottom = height - margin.bottom + 36;

  const bars = rows.map((row, index) => {
    const valueX = margin.left + ((row.hydrostatic - minValue) / range) * chartWidth;
    const barX = Math.min(zeroX, valueX);
    const rawWidth = Math.abs(valueX - zeroX);
    const barWidth = Math.max(rawWidth, 1);
    const y = margin.top + index * rowGap;
    const centerY = y + barHeight / 2;
    const isPositive = row.hydrostatic >= 0;
    const deltaLabel = `Δh ${row.deltaH > 0 ? "+" : ""}${row.deltaH} cm`;
    const hydroLabel = `${row.hydrostatic >= 0 ? "+" : ""}${row.hydrostatic.toFixed(2)} cmH₂O`;
    const mmHgLabel = `${row.mmHg >= 0 ? "+" : ""}${row.mmHg.toFixed(2)} mmHg`;
    const valueLabelX = isPositive ? barX + barWidth + 14 : barX - 14;
    const valueTextAnchor: "start" | "end" = isPositive ? "start" : "end";

    return {
      barX,
      barWidth,
      y,
      centerY,
      barHeight,
      level: row.level,
      deltaLabel,
      hydroLabel,
      mmHgLabel,
      valueLabelX,
      valueTextAnchor,
      isPositive,
    };
  });

  const tickCandidates = new Set<number>([minValue, 0, maxValue]);
  const ticks = Array.from(tickCandidates)
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b)
    .map((value) => {
      const safeValue = Math.abs(value) < 1e-6 ? 0 : value;
      return {
        value: safeValue,
        x: margin.left + ((safeValue - minValue) / range) * chartWidth,
      };
    });

  return {
    width,
    height,
    margin,
    zeroX,
    chartTop,
    chartBottom,
    bars,
    ticks,
  };
}

function DatasetSvgPreview({ datasetKey }: { datasetKey: DatasetKey }) {
  const { title, rows } = spinalDataset[datasetKey];
  const geometry = computeSpinalChartGeometry(rows);
  const peak = rows.reduce((max, row) => (Math.abs(row.hydrostatic) > Math.abs(max.hydrostatic) ? row : max), rows[0]);
  const gradientId = `${datasetKey}-positive`;
  const negativeGradientId = `${datasetKey}-negative`;

  return (
    <figure className="mt-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-950/95 text-slate-100 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.65)]">
      <div className="relative">
        <svg
          role="img"
          aria-labelledby={`${datasetKey}-svg-title`}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-auto w-full"
        >
          <title id={`${datasetKey}-svg-title`}>{`${title} hydrostatic gradient preview`}</title>
          <defs>
            <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id={negativeGradientId} x1="100%" x2="0%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <radialGradient id={`${datasetKey}-glow`} cx="50%" cy="10%" r="70%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.45)" />
              <stop offset="100%" stopColor="rgba(15,23,42,0)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" rx={24} fill="#020617" />
          <rect width="100%" height="100%" rx={24} fill={`url(#${datasetKey}-glow)`} />
          <text
            x={geometry.width / 2}
            y={44}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={22}
            fontWeight={600}
            letterSpacing={-0.5}
          >
            {title}
          </text>
          <text x={geometry.width / 2} y={70} textAnchor="middle" fill="#cbd5e1" fontSize={14}>
            Hydrostatic gradient referenced to the umbilicus
          </text>
          <line
            x1={geometry.margin.left}
            x2={geometry.width - geometry.margin.right}
            y1={geometry.chartTop}
            y2={geometry.chartTop}
            stroke="rgba(148,163,184,0.35)"
            strokeWidth={1}
          />
          <line
            x1={geometry.margin.left}
            x2={geometry.width - geometry.margin.right}
            y1={geometry.chartBottom}
            y2={geometry.chartBottom}
            stroke="rgba(148,163,184,0.15)"
            strokeWidth={1}
          />
          <line
            x1={geometry.zeroX}
            x2={geometry.zeroX}
            y1={geometry.chartTop}
            y2={geometry.chartBottom}
            stroke="rgba(94,234,212,0.65)"
            strokeWidth={1.5}
            strokeDasharray="4 10"
          />
          <text
            x={geometry.zeroX}
            y={geometry.chartTop - 14}
            textAnchor="middle"
            fill="#a5f3eb"
            fontSize={11}
            letterSpacing="0.3em"
          >
            NEUTRAL AXIS
          </text>
          {geometry.bars.map((bar) => (
            <g key={bar.level}>
              <rect
                x={bar.barX}
                y={bar.y}
                width={bar.barWidth}
                height={bar.barHeight}
                rx={12}
                fill={`url(#${bar.isPositive ? gradientId : negativeGradientId})`}
                opacity={bar.level === peak.level ? 1 : 0.8}
              />
              <text
                x={geometry.margin.left - 28}
                y={bar.centerY + 5}
                textAnchor="end"
                fill="#f1f5f9"
                fontSize={15}
                fontWeight={600}
              >
                {bar.level}
              </text>
              <text
                x={geometry.margin.left - 28}
                y={bar.centerY + 22}
                textAnchor="end"
                fill="#94a3b8"
                fontSize={11}
                letterSpacing="0.08em"
              >
                {bar.deltaLabel}
              </text>
              <text
                x={bar.valueLabelX}
                y={bar.centerY - 2}
                textAnchor={bar.valueTextAnchor}
                fill="#ffffff"
                fontSize={14}
                fontWeight={600}
              >
                {bar.hydroLabel}
              </text>
              <text
                x={bar.valueLabelX}
                y={bar.centerY + 14}
                textAnchor={bar.valueTextAnchor}
                fill="#cbd5e1"
                fontSize={11}
              >
                {bar.mmHgLabel}
              </text>
            </g>
          ))}
          {geometry.ticks.map((tick) => (
            <g key={`${datasetKey}-tick-${tick.value}`}>
              <line
                x1={tick.x}
                x2={tick.x}
                y1={geometry.chartBottom}
                y2={geometry.chartBottom + 10}
                stroke="rgba(148,163,184,0.35)"
                strokeWidth={1}
              />
              <text x={tick.x} y={geometry.chartBottom + 28} textAnchor="middle" fill="#94a3b8" fontSize={11}>
                {tick.value.toFixed(2)} cmH₂O
              </text>
            </g>
          ))}
          <g>
            <text
              x={geometry.width - geometry.margin.right}
              y={geometry.chartTop - 18}
              textAnchor="end"
              fill="#94a3b8"
              fontSize={11}
              letterSpacing="0.2em"
            >
              PEAK GRADIENT
            </text>
            <text
              x={geometry.width - geometry.margin.right}
              y={geometry.chartTop - 2}
              textAnchor="end"
              fill="#a5f3fc"
              fontSize={22}
              fontWeight={600}
            >
              {`${peak.hydrostatic >= 0 ? "+" : ""}${peak.hydrostatic.toFixed(2)} cmH₂O`}
            </text>
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_rgba(14,116,144,0.05),_transparent_70%)]" />
      </div>
      <figcaption className="border-t border-white/5 bg-slate-900/80 px-6 py-4 text-sm leading-relaxed text-slate-200">
        Gravity bends the pressure profile around the thoracic spine. Highlighted bars mark the dominant level in this posture,
        and the teal axis shows the zero-crossing where siphoning reverses.
      </figcaption>
    </figure>
  );
}

function DatasetTable({ datasetKey }: { datasetKey: DatasetKey }) {
  const { title, rows } = spinalDataset[datasetKey];
  const peakRow = rows.reduce((max, row) => (row.hydrostatic > max.hydrostatic ? row : max), rows[0]);
  const troughRow = rows.reduce((min, row) => (row.hydrostatic < min.hydrostatic ? row : min), rows[0]);
  const span = peakRow.hydrostatic - troughRow.hydrostatic;

  return (
    <details className="dataset-accordion group p-4">
      <summary className="rounded-lg transition group-open:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
        <div className="flex flex-1 flex-wrap items-center justify-between gap-6">
          <div className="max-w-xs">
            <p className="text-base font-semibold text-primary">{title}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Hydrostatic slices referenced to the umbilicus
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              Peak {peakRow.hydrostatic >= 0 ? "+" : ""}
              {peakRow.hydrostatic.toFixed(2)} cmH₂O @ {peakRow.level}
            </span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-500">Span {span.toFixed(2)} cmH₂O</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[0.65rem] font-bold text-primary transition group-open:rotate-45 group-open:bg-primary group-open:text-white">
              +
            </span>
          </div>
        </div>
      </summary>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-2 text-left">Level</th>
              <th className="px-4 py-2 text-right">Δh (cm)</th>
              <th className="px-4 py-2 text-right">ΔPₕ (cmH₂O)</th>
              <th className="px-4 py-2 text-right">ΔPₕ (mmHg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row) => {
              const isPeak = row.level === peakRow.level;
              const isTrough = row.level === troughRow.level;
              return (
                <tr
                  key={row.level}
                  className={`${
                    isPeak ? "bg-cyan-50 text-slate-800" : isTrough ? "bg-amber-50 text-slate-800" : "text-slate-600"
                  }`}
                >
                  <td className="px-4 py-2 font-semibold text-slate-700">{row.level}</td>
                  <td className="px-4 py-2 text-right">{row.deltaH}</td>
                  <td className="px-4 py-2 text-right font-medium">{row.hydrostatic.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{row.mmHg.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Calibrated for a 175 cm adult with the ventricles aligned to the external auditory meatus. Adjust Δh to re-compute pressures
        using ΔPₕ ≈ 1.007 × Δh.
      </p>
      <DatasetSvgPreview datasetKey={datasetKey} />
    </details>
  );
}

export function ReferenceDatasets() {
  return (
    <section>
      <div className="section-wrapper">
        <span className="badge">Q2 · Quantification</span>
        <h2 className="section-title">Reference datasets for hydrostatic gradients</h2>
        <p className="section-subtitle max-w-4xl">
          Explore the source measurements used throughout the report. Each accordion reveals the tabulated Δh and ΔP values along with a
          responsive SVG preview optimised for presentation capture.
        </p>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <DatasetTable datasetKey="upright" />
          <DatasetTable datasetKey="sitting" />
          <DatasetTable datasetKey="supine" />
        </div>
      </div>
    </section>
  );
}
