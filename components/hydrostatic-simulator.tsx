"use client";

import { useState } from "react";

import { PressureComparisonChart } from "./pressure-comparison-chart";

const postures = [
  {
    id: "supine",
    label: "Supine",
    deltaH: -10,
    hydrostatic: -10.07,
    viscous: 0.56,
    effective: -10.63,
    direction: "Abdomen → Cranial (gravity resists drainage)",
    headline: "Recumbent patients need extra driving pressure; gravity creates a −10 cm head.",
  },
  {
    id: "sitting",
    label: "Sitting",
    deltaH: 30,
    hydrostatic: 30.22,
    viscous: -0.56,
    effective: 29.66,
    direction: "Cranial → Abdomen (gravity assists flow)",
    headline: "Sitting introduces ~30 cmH₂O of downhill pressure—already an order of magnitude above viscous losses.",
  },
  {
    id: "standing",
    label: "Standing",
    deltaH: 45,
    hydrostatic: 45.33,
    viscous: -0.56,
    effective: 44.77,
    direction: "Cranial → Abdomen (gravity dominates)",
    headline: "Upright posture pushes nearly 45 cmH₂O through the shunt, overwhelming any programmable setting.",
  },
];

const assumptions = [
  { label: "CSF production", value: "0.3 mL/min" },
  { label: "Catheter inner radius", value: "0.6 mm (ID 1.2 mm)" },
  { label: "Catheter length", value: "0.80 m" },
  { label: "Fluid density", value: "1,007 kg/m³" },
  { label: "Dynamic viscosity", value: "0.0007 Pa·s" },
];

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
      { level: "T7", deltaH: -14, hydrostatic: -14.10, mmHg: -10.37 },
      { level: "T8", deltaH: -14, hydrostatic: -14.10, mmHg: -10.37 },
      { level: "T9", deltaH: -13, hydrostatic: -13.10, mmHg: -9.63 },
      { level: "T10", deltaH: -13, hydrostatic: -13.10, mmHg: -9.63 },
    ],
  },
};

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

const maxMagnitude = Math.max(...postures.map((p) => Math.abs(p.hydrostatic)));

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
            className="fill-white text-[22px] font-semibold tracking-tight"
          >
            {title}
          </text>
          <text
            x={geometry.width / 2}
            y={70}
            textAnchor="middle"
            className="fill-slate-300 text-sm"
          >
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
            className="fill-teal-200 text-[11px] uppercase tracking-[0.3em]"
          >
            Neutral axis
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
                className="fill-slate-100 text-[15px] font-semibold"
              >
                {bar.level}
              </text>
              <text
                x={geometry.margin.left - 28}
                y={bar.centerY + 22}
                textAnchor="end"
                className="fill-slate-400 text-[11px] tracking-wide"
              >
                {bar.deltaLabel}
              </text>
              <text
                x={bar.valueLabelX}
                y={bar.centerY - 2}
                textAnchor={bar.valueTextAnchor}
                className="fill-white text-sm font-semibold"
              >
                {bar.hydroLabel}
              </text>
              <text
                x={bar.valueLabelX}
                y={bar.centerY + 14}
                textAnchor={bar.valueTextAnchor}
                className="fill-slate-300 text-[11px]"
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
              <text
                x={tick.x}
                y={geometry.chartBottom + 28}
                textAnchor="middle"
                className="fill-slate-400 text-[11px]"
              >
                {tick.value.toFixed(2)} cmH₂O
              </text>
            </g>
          ))}
          <g>
            <text
              x={geometry.width - geometry.margin.right}
              y={geometry.chartTop - 18}
              textAnchor="end"
              className="fill-slate-300 text-[11px] uppercase tracking-[0.2em]"
            >
              Peak gradient
            </text>
            <text
              x={geometry.width - geometry.margin.right}
              y={geometry.chartTop - 2}
              textAnchor="end"
              className="fill-cyan-200 text-[22px] font-semibold"
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
              Peak {peakRow.hydrostatic >= 0 ? '+' : ''}{peakRow.hydrostatic.toFixed(2)} cmH₂O @ {peakRow.level}
            </span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-500">
              Span {span.toFixed(2)} cmH₂O
            </span>
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
                    isPeak
                      ? 'bg-cyan-50 text-slate-800'
                      : isTrough
                      ? 'bg-amber-50 text-slate-800'
                      : 'text-slate-600'
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
        Calibrated for a 175 cm adult with the ventricles aligned to the external auditory meatus. Adjust Δh to re-compute pressures using ΔPₕ ≈ 1.007 × Δh.
      </p>
      <DatasetSvgPreview datasetKey={datasetKey} />
    </details>
  );
}

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

function PostureFigure({ posture }: { posture: (typeof postures)[number] }) {
  const offset = Math.max(-70, Math.min(70, posture.deltaH * 1.2));
  const measurementTop = offset >= 0 ? 92 : 92 + offset;
  const measurementHeight = Math.abs(offset);
  const measurementMid = measurementTop + measurementHeight / 2;
  const measurementColor = posture.deltaH >= 0 ? "bg-sky-400/60" : "bg-amber-400/70";
  const measurementNarrative = posture.deltaH >= 0 ? "Gravity assists" : "Gravity resists";
  const deltaLabel = `${posture.deltaH > 0 ? "+" : ""}${posture.deltaH} cm`;

  return (
    <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_70%)]" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          <span>Orientation</span>
          <span className="font-semibold text-sky-300">{posture.label}</span>
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative h-full w-24">
            <div className="absolute left-1/2 top-8 h-[200px] w-px -translate-x-1/2 bg-slate-700/50" />
            <div
              className="absolute left-1/2 top-[92px] flex -translate-x-1/2 flex-col items-center gap-2"
              style={{ transform: `translateY(${offset}px)`, transition: "transform 500ms ease-out" }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Peritoneum</span>
              <div className="h-4 w-4 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.45)]" />
            </div>
            <div className="absolute left-1/2 top-[92px] flex -translate-x-1/2 flex-col items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Ventricles</span>
            </div>
            <div
              className={`absolute left-[70%] w-1 rounded-full ${measurementColor}`}
              style={{
                top: `${measurementTop}px`,
                height: `${measurementHeight}px`,
                transition: "top 500ms ease-out, height 500ms ease-out",
              }}
            />
            <div
              className="absolute left-[70%] h-2 w-2 -translate-x-1/2 rounded-full bg-white/80"
              style={{
                top: `${measurementTop - 1}px`,
                transition: "top 500ms ease-out",
              }}
            />
            <div
              className="absolute left-[70%] h-2 w-2 -translate-x-1/2 rounded-full bg-white/80"
              style={{
                top: `${measurementTop + measurementHeight - 1}px`,
                transition: "top 500ms ease-out",
              }}
            />
            <div
              className="absolute left-[70%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{
                top: `${measurementMid}px`,
                transition: "top 500ms ease-out",
              }}
            >
              <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-100 shadow-[0_6px_18px_rgba(15,23,42,0.45)]">
                Δh {deltaLabel}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-300">{measurementNarrative}</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 text-xs text-slate-300">
          Δh = <span className="font-semibold text-white">{posture.deltaH} cm</span> · Hydrostatic drive =
          <span className="font-semibold text-white"> {posture.hydrostatic.toFixed(2)} cmH₂O</span>
        </div>
      </div>
    </div>
  );
}

export function HydrostaticSimulator() {
  const [selected, setSelected] = useState(postures[2]);

  return (
    <section>
      <div className="section-wrapper">
        <span className="badge">Q2 · Quantification</span>
        <h2 className="section-title">Hydrostatic head dwarfs viscous losses</h2>
        <p className="section-subtitle max-w-4xl">
          Using a 0.6&nbsp;mm radius catheter and a physiologic CSF production rate (0.3&nbsp;mL/min), viscous friction extracts
          barely 0.56&nbsp;cmH₂O. Posture-induced height differences swing the driving pressure from −10 to +45&nbsp;cmH₂O,
          explaining why overdrainage erupts as soon as patients sit or stand.
        </p>
        <div className="flex flex-col gap-10 xl:flex-row">
          <div className="card flex-1 space-y-8">
            <div className="grid gap-6 md:grid-cols-[1.1fr,1fr]">
              <div className="rounded-2xl bg-slate-900/90 p-4">
                <PostureFigure posture={selected} />
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Simulation assumptions</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {assumptions.map((item) => (
                    <li key={item.label} className="flex items-center justify-between rounded-xl bg-slate-100/60 px-4 py-2">
                      <span className="font-medium text-primary">{item.label}</span>
                      <span>{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {postures.map((posture) => (
                <button
                  key={posture.id}
                  type="button"
                  onClick={() => setSelected(posture)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    selected.id === posture.id
                      ? "bg-primary text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {posture.label}
                </button>
              ))}
            </div>
            <div className="space-y-6">
              <p className="text-lg font-semibold text-primary">{selected.headline}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.deltaH}&nbsp;cm</p>
                  <p className="metric-label">Δh (ventricle − abdomen)</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.hydrostatic.toFixed(2)}&nbsp;cmH₂O</p>
                  <p className="metric-label">Hydrostatic drive</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.viscous > 0 ? "+" : ""}{selected.viscous.toFixed(2)}&nbsp;cmH₂O</p>
                  <p className="metric-label">Viscous loss</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.effective.toFixed(2)}&nbsp;cmH₂O</p>
                  <p className="metric-label">Net driving pressure</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Flow direction: {selected.direction}</p>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="card bg-slate-900 text-slate-100">
              <h3 className="text-lg font-semibold">Posture vs. driving pressure</h3>
              <p className="mt-2 text-sm text-slate-300">
                Hydrostatic gains outstrip viscous losses by more than ×50. Raising valve opening pressure alone cannot neutralise
                this gradient.
              </p>
              <div className="mt-8 space-y-6">
                {postures.map((posture) => {
                  const width = Math.abs((posture.hydrostatic / maxMagnitude) * 100);
                  const isNegative = posture.hydrostatic < 0;
                  return (
                    <div key={posture.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                        <span>{posture.label}</span>
                        <span>{posture.hydrostatic.toFixed(2)} cmH₂O</span>
                      </div>
                      <div className="relative h-3 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className={`absolute top-0 h-full rounded-full ${
                            isNegative ? "right-1/2 origin-right" : "left-1/2 origin-left"
                          } ${posture.id === selected.id ? "bg-sky-400" : "bg-sky-700"}`}
                          style={{ width: `${width / 2}%` }}
                        />
                        <div className="absolute left-1/2 top-0 h-full w-px bg-white/30" />
                      </div>
                    </div>
                  );
                })}
                <div className="rounded-xl bg-slate-800/80 p-4 text-xs text-slate-300">
                  Zero at center. Bars to the right of zero accelerate drainage; those to the left indicate uphill flow that resists
                  movement.
                </div>
              </div>
            </div>
            <PressureComparisonChart hydrostatic={postures[2].hydrostatic} viscous={Math.abs(postures[2].viscous)} />
            <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hydrostatic reference datasets</p>
              <p className="mt-2 text-sm text-slate-600">
                Explore the exact Δh and ΔP values cited in the report with high-fidelity visuals. Each dataset now embeds a cinematic vector preview you can capture directly for slides—no downloads required.
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <DatasetTable datasetKey="upright" />
                <DatasetTable datasetKey="sitting" />
                <DatasetTable datasetKey="supine" />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Calculation cheatsheet</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {cheatsheet.map((card) => (
                  <CheatsheetCard key={card.title} {...card} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
