"use client";

import { useEffect, useRef, useState } from "react";

const phases = [
  {
    title: "Priming the siphon",
    description:
      "Atmospheric pressure pushes on the reservoir while gravity pulls the down-leg column, allowing the circuit to fill.",
  },
  {
    title: "Sustained flow",
    description:
      "Once both limbs are full, the taller column weighs more. The hydrostatic imbalance accelerates flow toward the lower exit.",
  },
  {
    title: "Clinical analogue",
    description:
      "A ventricular catheter behaves the same way: when the distal end drops far below the ventricles, gravity augments drainage.",
  },
];

export function AnimatedPhysicsDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [fill, setFill] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFill(100);
            setRevealed(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white">
      <div className="section-wrapper grid gap-12 lg:grid-cols-[2fr,3fr] lg:items-center">
        <div className="space-y-6">
          <span className="badge">Q1 · Physics</span>
          <h2 className="section-title">Fundamentals: the siphon phenomenon</h2>
          <p className="section-subtitle">
            A siphon forms when a continuous fluid column connects a higher reservoir to a lower outlet. Gravity acting on the
            longer down-leg creates negative pressure at the apex, sustained by atmospheric pressure at the source.
          </p>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Key equation</p>
            <p className="mt-3 text-lg font-semibold text-primary">ΔP = ρ g Δh − losses</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              The gravitational term (ρ g Δh) dominates because viscous losses are tiny in a primed, narrow catheter—setting up a
              self-sustaining siphon as soon as the distal end drops lower than the source.
            </p>
          </div>
          <ul className="space-y-4">
            {phases.map((phase, index) => (
              <li
                key={phase.title}
                className={`rounded-xl border border-slate-200/70 bg-slate-50/80 p-5 transition duration-500 ease-out ${
                  revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                <p className="font-semibold text-primary">{phase.title}</p>
                <p className="mt-2 text-sm text-slate-600">{phase.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div
          ref={ref}
          className={`relative flex h-[420px] items-end justify-center rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 transition ${
            revealed ? "fade-right" : ""
          }`}
        >
          <div className="relative h-full w-[220px]">
            <div className="absolute bottom-0 left-0 right-1/2 flex h-[65%] flex-col items-center">
              <div className="relative h-full w-12 rounded-t-full border-2 border-slate-300/70 bg-slate-900/80">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-b-full bg-sky-500/80 transition-[height] duration-700 ease-out"
                  style={{ height: `${fill}%` }}
                />
              </div>
              <p className="mt-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-200">Reservoir</p>
            </div>
            <div className="absolute inset-x-[44%] bottom-0 top-6 rounded-full border-2 border-slate-300/60 bg-slate-900/80">
              <div
                className="absolute bottom-0 left-0 right-0 rounded-b-full bg-sky-400/70 transition-[height] duration-700 ease-out"
                style={{ height: `${fill}%` }}
              />
              <div className="absolute -left-8 top-10 rotate-[-65deg] text-[10px] font-semibold uppercase tracking-wider text-slate-200">
                Gravity (mg)
              </div>
            </div>
            <div className="absolute bottom-0 right-0 left-1/2 flex h-[90%] flex-col items-center">
              <div className="relative h-full w-12 rounded-t-full border-2 border-slate-300/70 bg-slate-900/80">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-b-full bg-sky-500 transition-[height] duration-700 ease-out"
                  style={{ height: `${fill}%` }}
                />
              </div>
              <p className="mt-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-200">Down-leg</p>
            </div>
            <div className="absolute -left-12 top-6 w-20 rounded-lg bg-white/10 p-3 text-[10px] leading-4 text-slate-200">
              <span className="font-semibold text-sky-300">Pₐₜₘ</span> pushes up on the reservoir
            </div>
            <div className="absolute -right-16 bottom-28 w-24 rounded-lg bg-white/10 p-3 text-[10px] leading-4 text-slate-200">
              <span className="font-semibold text-sky-300">Δρgh</span> pulls the column downward
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
