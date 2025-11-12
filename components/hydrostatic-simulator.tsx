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
  { label: "Catheter inner radius", value: "0.6 mm" },
  { label: "Fluid density", value: "1,000 kg/m³" },
  { label: "Viscosity", value: "0.0007 Pa·s" },
];

const resources = [
  {
    title: "Hydrostatic dataset (Q2-4)",
    description:
      "Detailed Δh measurements from T7–T10 spinal level down to the umbilicus for a 175 cm adult, including seated transition data.",
  },
  {
    title: "Calculation cheatsheet (Q2-6)",
    description:
      "Step-by-step derivation of ΔP = ρ g Δh with sample conversions (cmH₂O ↔ mmHg) and Poiseuille-based viscous estimates.",
  },
];

const maxMagnitude = Math.max(...postures.map((p) => Math.abs(p.hydrostatic)));

function PostureFigure({ posture }: { posture: (typeof postures)[number] }) {
  const offset = Math.max(-70, Math.min(70, posture.deltaH * 1.2));
  const measurementTop = offset >= 0 ? 92 : 92 + offset;
  const measurementHeight = Math.abs(offset);

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
              className="absolute left-[70%] w-1 rounded-full bg-sky-500/50"
              style={{
                top: `${measurementTop}px`,
                height: `${measurementHeight}px`,
                transition: "top 500ms ease-out, height 500ms ease-out",
              }}
            />
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
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Further reading</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {resources.map((resource) => (
                  <details key={resource.title} className="group rounded-xl border border-slate-200/80 p-4">
                    <summary className="cursor-pointer list-none font-semibold text-primary transition group-open:text-primary">
                      {resource.title}
                    </summary>
                    <p className="mt-2 leading-relaxed text-slate-600">{resource.description}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
