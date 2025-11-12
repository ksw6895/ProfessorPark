"use client";

import { useMemo, useState } from "react";
import { Brain, Database } from "lucide-react";

import { hydrostaticPostures } from "./hydrostatic-posture-data";

const assumptions = [
  { label: "CSF Production (Q)", value: "0.3 mL/min" },
  { label: "Catheter Radius (r)", value: "0.6 mm (ID 1.2 mm)" },
  { label: "Catheter Length (L)", value: "0.80 m" },
  { label: "Fluid Density (ρ)", value: "1,007 kg/m³" },
  { label: "Fluid Viscosity (μ)", value: "0.0007 Pa·s" },
];

const CSF_DENSITY_FACTOR = 1.007;
const VISCOUS_LOSS = 0.56;
const MIN_DELTA_H = -20;
const MAX_DELTA_H = 60;

const maxMagnitude = Math.max(...hydrostaticPostures.map((posture) => Math.abs(posture.hydrostatic)));

function PostureFigure({ deltaH }: { deltaH: number }) {
  const offset = Math.max(-70, Math.min(70, deltaH * 1.2));
  const measurementTop = offset >= 0 ? 92 : 92 + offset;
  const measurementHeight = Math.abs(offset);
  const measurementMid = measurementTop + measurementHeight / 2;
  const measurementColor = deltaH >= 0 ? "bg-sky-400/60" : "bg-amber-400/70";
  const measurementNarrative = deltaH >= 0 ? "Gravity Assists (Siphon)" : "Gravity Resists";
  const deltaLabel = `${deltaH > 0 ? "+" : ""}${deltaH.toFixed(0)} cm`;

  return (
    <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_70%)]" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          <span>Orientation</span>
          <span className="font-semibold text-sky-300">Live Simulation</span>
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative h-full w-28 sm:w-32 md:w-36">
            <div className="absolute left-1/2 top-8 h-[200px] w-px -translate-x-1/2 bg-slate-700/50" />
            <div className="absolute left-1/2 top-[92px] flex -translate-x-1/2 flex-col items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Ventricles</span>
            </div>
            <div
              className="absolute left-1/2 top-[92px] flex -translate-x-1/2 flex-col items-center gap-2"
              style={{ transform: `translateY(${offset}px)`, transition: "transform 200ms ease-out" }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Peritoneum</span>
              <Database className="h-5 w-5 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.45)]" />
            </div>
            <div
              className={`absolute left-[70%] w-1 rounded-full ${measurementColor}`}
              style={{
                top: `${measurementTop}px`,
                height: `${measurementHeight}px`,
                transition: "top 200ms ease-out, height 200ms ease-out",
              }}
            />
            <div
              className="absolute left-[70%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{ top: `${measurementMid}px`, transition: "top 200ms ease-out" }}
            >
              <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-100 shadow-[0_6px_18px_rgba(15,23,42,0.45)]">
                Δh {deltaLabel}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-300">{measurementNarrative}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HydrostaticSimulator() {
  const [manualDeltaH, setManualDeltaH] = useState<number>(hydrostaticPostures[2].deltaH);
  const [activePresetId, setActivePresetId] = useState<string>(hydrostaticPostures[2].id);

  const derivedData = useMemo(() => {
    const h = manualDeltaH;
    const hydrostatic = h * CSF_DENSITY_FACTOR;
    const viscous = h >= 0 ? -VISCOUS_LOSS : VISCOUS_LOSS;
    const effective = hydrostatic + viscous;
    const direction = h >= 0 ? "Cranial → Peritoneal (Siphon)" : "Peritoneal → Cranial (Resistance)";

    let headline = "";
    if (h > 40) {
      headline = `At ${h.toFixed(0)} cm, a powerful siphon effect (${hydrostatic.toFixed(1)} cmH₂O) demands gravitational compensation.`;
    } else if (h > 15) {
      headline = `A ${h.toFixed(0)} cm drop provides a strong gravitational assist, increasing overdrainage risk.`;
    } else if (h > -5) {
      headline = `Near-neutral ${h.toFixed(0)} cm head; drainage is primarily valve-dependent.`;
    } else {
      headline = `A ${Math.abs(h).toFixed(0)} cm 'uphill' gradient means gravity opposes drainage, requiring ${Math.abs(effective).toFixed(1)} cmH₂O to overcome.`;
    }

    return {
      hydrostatic,
      viscous,
      effective,
      direction,
      headline,
    };
  }, [manualDeltaH]);

  return (
    <section id="simulator" className="scroll-mt-32">
      <div className="section-wrapper">
        <span className="badge">Q2 · Quantification</span>
        <h2 className="section-title">Hydrostatic head overwhelms viscous resistance</h2>
        <p className="section-subtitle max-w-4xl">
          Based on a 0.6mm radius catheter and physiologic CSF flow (0.3 mL/min), viscous friction loss is only {VISCOUS_LOSS} cmH₂O.
          In contrast, changing posture swings the driving pressure from −10 cmH₂O to +45 cmH₂O.
          Use the slider below to explore this relationship interactively.
        </p>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-16">
          <div className="card flex-1 space-y-8">
            <div className="grid gap-6 md:grid-cols-[1.1fr,1fr]">
              <div className="rounded-2xl bg-slate-900/90 p-4">
                <PostureFigure deltaH={manualDeltaH} />
                <div className="relative mt-6 pt-4">
                  <label
                    htmlFor="deltaH-slider"
                    className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    <span>Adjust Distal Position (Δh)</span>
                    <span className="text-sky-300">{manualDeltaH.toFixed(0)} cm</span>
                  </label>
                  <input
                    id="deltaH-slider"
                    type="range"
                    min={MIN_DELTA_H}
                    max={MAX_DELTA_H}
                    step={1}
                    value={manualDeltaH}
                    onChange={(event) => {
                      setManualDeltaH(Number(event.target.value));
                      setActivePresetId("custom");
                    }}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-sky-500"
                  />
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>Supine-like ({MIN_DELTA_H} cm)</span>
                    <span>Erect-like ({MAX_DELTA_H} cm)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Simulation Assumptions</p>
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
              {hydrostaticPostures.map((posture) => (
                <button
                  key={posture.id}
                  type="button"
                  onClick={() => {
                    setManualDeltaH(posture.deltaH);
                    setActivePresetId(posture.id);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    activePresetId === posture.id ? "bg-primary text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {posture.label}
                </button>
              ))}
            </div>
            <div className="space-y-6">
              <p className="text-lg font-semibold text-primary">{derivedData.headline}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{manualDeltaH.toFixed(0)}&nbsp;cm</p>
                  <p className="metric-label">Δh (Ventricles − Peritoneum)</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{derivedData.hydrostatic.toFixed(2)}&nbsp;cmH₂O</p>
                  <p className="metric-label">Hydrostatic Head (Δρgh)</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{derivedData.viscous > 0 ? "+" : ""}{derivedData.viscous.toFixed(2)}&nbsp;cmH₂O</p>
                  <p className="metric-label">Viscous Loss (Poiseuille)</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{derivedData.effective.toFixed(2)}&nbsp;cmH₂O</p>
                  <p className="metric-label">Effective Driving Pressure (Net)</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Flow Direction: {derivedData.direction}</p>
            </div>
          </div>
          <div className="card flex-1 bg-slate-900 text-slate-100">
            <h3 className="text-lg font-semibold">Pressure Profile by Posture</h3>
            <p className="mt-2 text-sm text-slate-300">
              Hydrostatic pressure dwarfs viscous loss ({VISCOUS_LOSS} cmH₂O). Left of center (negative) resists drainage; right (positive) promotes it.
            </p>
            <div className="mt-8 space-y-6">
              {hydrostaticPostures.map((posture) => {
                const width = Math.abs((posture.hydrostatic / maxMagnitude) * 100);
                const isNegative = posture.hydrostatic < 0;
                return (
                  <div key={posture.id} className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs uppercase tracking-wide text-slate-400">
                      <span className="min-w-0 shrink">{posture.label}</span>
                      <span className="min-w-0 shrink">{posture.hydrostatic.toFixed(2)} cmH₂O</span>
                    </div>
                    <div className="relative h-6 overflow-hidden rounded-md bg-slate-700/60">
                      <div className="absolute left-1/2 top-0 h-full w-px bg-white/30" />
                      <div
                        className={`absolute top-0 h-full ${
                          isNegative ? "right-1/2 origin-right" : "left-1/2 origin-left"
                        } ${
                          posture.id === activePresetId
                            ? isNegative
                              ? "bg-amber-400"
                              : "bg-sky-400"
                            : isNegative
                            ? "bg-amber-700"
                            : "bg-sky-700"
                        }`}
                        style={{ width: `calc(${width / 2}% - 1px)` }}
                      />
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-black ${
                          isNegative ? "right-[52%]" : "left-[52%]"
                        }`}
                      >
                        {posture.hydrostatic.toFixed(0)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="rounded-xl bg-slate-800/80 p-4 text-xs text-slate-300">
                <span className="font-bold text-amber-300">LEFT (NEGATIVE)</span>: Resists Drainage (Uphill)
                <br />
                <span className="font-bold text-sky-300">RIGHT (POSITIVE)</span>: Promotes Drainage (Downhill/Siphon)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

