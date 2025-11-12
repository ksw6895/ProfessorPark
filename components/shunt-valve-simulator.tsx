"use client";

import { useState } from "react";

const valves = [
  {
    id: "standard",
    name: "Standard differential-pressure valve",
    supine: {
      resistance: "Base opening ≈ 10 cmH₂O",
      behavior: "Flows normally while the pressure drop is modest.",
      outcome: "Stable in horizontal posture.",
      badge: "success",
    },
    erect: {
      resistance: "Same opening pressure",
      behavior: "Hydrostatic head (~45 cmH₂O) adds to ventricular pressure → unchecked siphon.",
      outcome: "Severe overdrainage",
      badge: "danger",
    },
    insight:
      "Classic valves cannot sense orientation. Upright, the siphon adds tens of cmH₂O, so the valve stays wide open and patients overdrain.",
  },
  {
    id: "programmable",
    name: "Programmable valve",
    supine: {
      resistance: "High programmed opening",
      behavior: "Raising the set point protects against gravity, but now supine drainage becomes sluggish.",
      outcome: "Underdrainage risk",
      badge: "danger",
    },
    erect: {
      resistance: "High programmed opening",
      behavior: "Higher baseline pressure partially offsets gravity, yet residual head still drives flow.",
      outcome: "Only partial control",
      badge: "danger",
    },
    insight:
      "Adjustable thresholds help fine-tune CSF volume but cannot self-compensate for posture. Clinicians still face a trade-off between upright safety and recumbent adequacy.",
  },
  {
    id: "gravitational",
    name: "Gravitational / anti-siphon valve (ASD)",
    supine: {
      resistance: "Base resistance ≈ 10 cmH₂O",
      behavior: "Orientation sensor stays horizontal, so only the nominal resistance engages. CSF outflow matches physiologic production.",
      outcome: "Stable drainage",
      badge: "success",
    },
    erect: {
      resistance: "Base 10 + gravity module 20 ≈ 30 cmH₂O",
      behavior: "Ball-in-cage element falls and closes a bypass, injecting additional resistance that cancels the siphon head.",
      outcome: "Balanced flow",
      badge: "success",
    },
    insight:
      "By adding posture-dependent resistance, gravitational valves neutralise the extra 30–45 cmH₂O generated when patients stand—without penalising supine flow.",
  },
];

const badgeStyle: Record<string, string> = {
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
};

export function ShuntValveSimulator() {
  const [active, setActive] = useState(valves[2]);

  return (
    <section className="bg-white">
      <div className="section-wrapper">
        <span className="badge">Q3 · Engineering response</span>
        <h2 className="section-title">Why gravitational valves tame the siphon</h2>
        <p className="section-subtitle max-w-4xl">
          Compare how different valve architectures behave when posture changes. Only gravity-compensating designs add
          resistance precisely when the patient stands, counterbalancing the Δρgh surge while preserving supine drainage.
        </p>
        <div className="mb-10 rounded-2xl border border-slate-200/70 bg-white p-6 text-sm text-slate-600">
          <p className="font-semibold uppercase tracking-wide text-primary">How to read this module</p>
          <p className="mt-3 leading-relaxed">
            Each tab summarises the valve&apos;s control logic and shows posture-specific flow states. Follow the badges—green means
            controlled drainage, red signals residual siphon risk. Use this storyboard in multidisciplinary conferences to align
            neurosurgeons, residents, and biomedical engineers.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
          <div className="card space-y-4">
            <div className="flex flex-wrap gap-2">
              {valves.map((valve) => (
                <button
                  key={valve.id}
                  type="button"
                  onClick={() => setActive(valve)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    active.id === valve.id
                      ? "bg-primary text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {valve.name}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-600">{active.insight}</p>
          </div>
          <div className="card grid gap-8 bg-slate-900 text-slate-100 md:grid-cols-2">
            {["supine", "erect"].map((posture) => {
              const data = active[posture as "supine" | "erect"];
              return (
                <div key={posture} className="space-y-4">
                  <p className="text-lg font-semibold capitalize">{posture}</p>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    badgeStyle[data.badge]
                  }`}>
                    {data.outcome}
                  </span>
                  <div className="h-40 rounded-2xl bg-slate-800/80 p-4">
                    <div className="flex h-full items-center justify-around">
                      <div className="flex flex-col items-center">
                        <div className="h-28 w-10 rounded-full bg-slate-700">
                          <div className="h-full w-full rounded-b-full bg-sky-500/80" />
                        </div>
                        <span className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">Ventricle</span>
                      </div>
                      <div className={`relative h-32 w-20 ${posture === "erect" ? "rotate-90" : ""} transition-transform duration-500`}>
                        <div className="absolute inset-0 rounded-2xl border-2 border-sky-400/60 bg-slate-900/80" />
                        <div
                          className={`absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 transition-transform duration-500 ${
                            posture === "erect" ? "translate-y-6" : ""
                          }`}
                        />
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Sensor
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-10 rounded-full bg-slate-700">
                          <div className={`w-full rounded-b-full ${
                            posture === "supine" && active.id !== "gravitational"
                              ? "h-2/3 bg-sky-500/70"
                              : posture === "erect" && active.id === "gravitational"
                              ? "h-1/3 bg-emerald-400"
                              : "h-full bg-sky-500"
                          }`} />
                        </div>
                        <span className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">Peritoneum</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">{data.resistance}</p>
                  <p className="text-sm text-slate-200">{data.behavior}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
