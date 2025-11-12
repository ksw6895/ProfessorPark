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

function generateDatasetSvg(datasetKey: DatasetKey) {
  const { title, rows } = spinalDataset[datasetKey];
  const geometry = computeSpinalChartGeometry(rows);
  const { width, height, zeroX, chartTop, chartBottom, bars, ticks } = geometry;

  const fontStack = "'Inter', 'Pretendard', 'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  const barsMarkup = bars
    .map(
      (bar) => `
      <g>
        <rect x="${bar.barX.toFixed(2)}" y="${bar.y.toFixed(2)}" width="${bar.barWidth.toFixed(
        2,
      )}" height="${bar.barHeight}" rx="6" fill="${bar.isPositive ? "#38bdf8" : "#f97316"}" />
        <text x="${geometry.margin.left - 24}" y="${(bar.centerY + 5).toFixed(2)}" font-size="16" font-family="${fontStack}" text-anchor="end" fill="#0f172a">${bar.level}</text>
        <text x="${geometry.margin.left - 24}" y="${(bar.centerY + 21).toFixed(2)}" font-size="12" font-family="${fontStack}" text-anchor="end" fill="#475569">${bar.deltaLabel}</text>
        <text x="${bar.valueLabelX.toFixed(2)}" y="${(bar.centerY - 2).toFixed(2)}" font-size="14" font-family="${fontStack}" text-anchor="${bar.valueTextAnchor}" font-weight="600" fill="#0f172a">${bar.hydroLabel}</text>
        <text x="${bar.valueLabelX.toFixed(2)}" y="${(bar.centerY + 14).toFixed(2)}" font-size="12" font-family="${fontStack}" text-anchor="${bar.valueTextAnchor}" fill="#475569">${bar.mmHgLabel}</text>
      </g>
    `,
    )
    .join("\n");

  const tickMarkup = ticks
    .map(
      (tick) => `
      <g>
        <line x1="${tick.x.toFixed(2)}" x2="${tick.x.toFixed(2)}" y1="${chartBottom}" y2="${chartBottom + 8}" stroke="#94a3b8" stroke-width="1" />
        <text x="${tick.x.toFixed(2)}" y="${chartBottom + 28}" font-size="12" font-family="${fontStack}" text-anchor="middle" fill="#475569">${tick.value.toFixed(2)} cmH₂O</text>
      </g>
    `,
    )
    .join("\n");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title-${datasetKey} desc-${datasetKey}">
  <title id="title-${datasetKey}">${title} · Hydrostatic gradient</title>
  <desc id="desc-${datasetKey}">Hydrostatic profile relative to the umbilicus derived from the spinal dataset rows.</desc>
  <rect width="100%" height="100%" rx="18" fill="#ffffff" />
  <g>
    <text x="${width / 2}" y="40" font-size="20" font-family="${fontStack}" text-anchor="middle" font-weight="600" fill="#0f172a">${title}</text>
    <text x="${width / 2}" y="64" font-size="14" font-family="${fontStack}" text-anchor="middle" fill="#475569">Hydrostatic gradient relative to the umbilicus</text>
    <line x1="${geometry.margin.left}" x2="${width - geometry.margin.right}" y1="${chartTop}" y2="${chartTop}" stroke="#cbd5f5" stroke-width="1" />
    <line x1="${geometry.margin.left}" x2="${width - geometry.margin.right}" y1="${chartBottom}" y2="${chartBottom}" stroke="#e2e8f0" stroke-width="1" />
    <line x1="${zeroX.toFixed(2)}" x2="${zeroX.toFixed(2)}" y1="${chartTop}" y2="${chartBottom}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="6 6" />
    <text x="${zeroX.toFixed(2)}" y="${chartTop - 12}" font-size="12" font-family="${fontStack}" text-anchor="middle" fill="#475569">0 cmH₂O</text>
  </g>
  ${barsMarkup}
  ${tickMarkup}
</svg>`;

  return svg;
}

function downloadCsv(datasetKey: DatasetKey) {
  const { title, rows } = spinalDataset[datasetKey];
  const headers = ["Level", "Δh (cm)", "ΔPₕ (cmH₂O)", "ΔPₕ (mmHg)"];
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      [row.level, row.deltaH.toString(), row.hydrostatic.toFixed(2), row.mmHg.toFixed(2)].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-dataset.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadSvg(datasetKey: DatasetKey) {
  const svgContent = generateDatasetSvg(datasetKey);
  const { title } = spinalDataset[datasetKey];
  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-profile.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function DatasetSvgPreview({ datasetKey }: { datasetKey: DatasetKey }) {
  const { title, rows } = spinalDataset[datasetKey];
  const geometry = computeSpinalChartGeometry(rows);

  return (
    <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4">
      <svg
        role="img"
        aria-labelledby={`${datasetKey}-svg-title`}
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
      >
        <title id={`${datasetKey}-svg-title`}>{`${title} hydrostatic gradient preview`}</title>
        <rect width="100%" height="100%" rx={18} fill="#ffffff" />
        <text
          x={geometry.width / 2}
          y={40}
          textAnchor="middle"
          className="fill-slate-900 text-[20px] font-semibold"
        >
          {title}
        </text>
        <text x={geometry.width / 2} y={64} textAnchor="middle" className="fill-slate-500 text-sm">
          Hydrostatic gradient relative to the umbilicus
        </text>
        <line
          x1={geometry.margin.left}
          x2={geometry.width - geometry.margin.right}
          y1={geometry.chartTop}
          y2={geometry.chartTop}
          stroke="#cbd5f5"
          strokeWidth={1}
        />
        <line
          x1={geometry.margin.left}
          x2={geometry.width - geometry.margin.right}
          y1={geometry.chartBottom}
          y2={geometry.chartBottom}
          stroke="#e2e8f0"
          strokeWidth={1}
        />
        <line
          x1={geometry.zeroX}
          x2={geometry.zeroX}
          y1={geometry.chartTop}
          y2={geometry.chartBottom}
          stroke="#94a3b8"
          strokeWidth={1}
          strokeDasharray="6 6"
        />
        <text x={geometry.zeroX} y={geometry.chartTop - 12} textAnchor="middle" className="fill-slate-500 text-xs">
          0 cmH₂O
        </text>
        {geometry.bars.map((bar) => (
          <g key={bar.level}>
            <rect
              x={bar.barX}
              y={bar.y}
              width={bar.barWidth}
              height={bar.barHeight}
              rx={6}
              fill={bar.isPositive ? "#38bdf8" : "#f97316"}
            />
            <text
              x={geometry.margin.left - 24}
              y={bar.centerY + 5}
              textAnchor="end"
              className="fill-slate-900 text-base font-medium"
            >
              {bar.level}
            </text>
            <text
              x={geometry.margin.left - 24}
              y={bar.centerY + 21}
              textAnchor="end"
              className="fill-slate-500 text-xs"
            >
              {bar.deltaLabel}
            </text>
            <text
              x={bar.valueLabelX}
              y={bar.centerY - 2}
              textAnchor={bar.valueTextAnchor}
              className="fill-slate-900 text-sm font-semibold"
            >
              {bar.hydroLabel}
            </text>
            <text
              x={bar.valueLabelX}
              y={bar.centerY + 14}
              textAnchor={bar.valueTextAnchor}
              className="fill-slate-500 text-xs"
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
              y2={geometry.chartBottom + 8}
              stroke="#94a3b8"
              strokeWidth={1}
            />
            <text x={tick.x} y={geometry.chartBottom + 26} textAnchor="middle" className="fill-slate-500 text-xs">
              {tick.value.toFixed(2)} cmH₂O
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-3 text-xs text-slate-500">
        Use this vector profile directly in slides: the SVG preserves crisp text annotations for Δh, cmH₂O, and mmHg.
      </p>
    </div>
  );
}

function DatasetTable({ datasetKey }: { datasetKey: DatasetKey }) {
  const { title, rows } = spinalDataset[datasetKey];

  return (
    <details className="dataset-accordion group p-4">
      <summary className="rounded-lg transition group-open:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
        <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-primary">{title}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              ΔP referenced to the umbilicus
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                downloadCsv(datasetKey);
              }}
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-white"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                downloadSvg(datasetKey);
              }}
              className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
            >
              SVG
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-primary transition group-open:rotate-45 group-open:bg-primary group-open:text-white">
              +
            </span>
          </div>
        </div>
      </summary>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 text-left">Level</th>
              <th className="px-3 py-2 text-right">Δh (cm)</th>
              <th className="px-3 py-2 text-right">ΔPₕ (cmH₂O)</th>
              <th className="px-3 py-2 text-right">ΔPₕ (mmHg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.level} className="bg-white">
                <td className="px-3 py-2 font-medium text-slate-700">{row.level}</td>
                <td className="px-3 py-2 text-right text-slate-600">{row.deltaH}</td>
                <td className="px-3 py-2 text-right text-slate-600">{row.hydrostatic.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-slate-600">{row.mmHg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Values reference a 175 cm adult with ventricles aligned to the external auditory meatus and the umbilicus at T10. Adjust Δh to re-compute pressures using ΔPₕ ≈ 1.007 × Δh.
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
                Export the exact Δh and ΔP values cited in the report. Choose CSV for spreadsheets or SVG to drop the annotated gradient chart straight into slides.
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
