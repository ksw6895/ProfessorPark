import { Brain, Headset, ShieldAlert } from "lucide-react";

const postures = [
  {
    posture: "Supine",
    summary: "Δh ≈ −10 cm · Gravity opposes flow",
    narrative:
      "When lying flat, the abdomen sits slightly above the ventricles. Gravity resists drainage, requiring the valve to overcome a small uphill column.",
    status: "Stable drainage",
    color: "text-success",
  },
  {
    posture: "Erect",
    summary: "Δh ≈ +45 cm · Gravity drives overdrainage",
    narrative:
      "Standing stretches the shunt into a long vertical siphon. The distal catheter drops ~45 cm below the ventricles, adding ~45 cmH₂O of driving pressure.",
    status: "Risk of overdrainage",
    color: "text-danger",
  },
];

const complications = [
  {
    title: "Postural headaches",
    description: "Low-pressure headaches worsen on standing and ease when recumbent—classic posture-dependent overdrainage.",
    icon: Headset,
  },
  {
    title: "Slit ventricle syndrome",
    description: "Chronically collapsed ventricles limit compliance, triggering intermittent obstruction and severe symptoms.",
    icon: Brain,
  },
  {
    title: "Subdural hygroma/hematoma",
    description: "Excessive negative pressure pulls meninges inward, stretching bridging veins and risking bleeding.",
    icon: ShieldAlert,
  },
];

export function PatientPostureComparison() {
  return (
    <section className="bg-white/70">
      <div className="section-wrapper">
        <span className="badge">Q1 · Clinical relevance</span>
        <h2 className="section-title">Why posture transforms a shunt into a siphon</h2>
        <p className="section-subtitle max-w-4xl">
          A ventriculo-peritoneal shunt behaves benignly while the patient is recumbent. The moment the distal catheter hangs
          below the ventricles, the siphon converts gravitational head into relentless suction, outpacing physiologic CSF
          production.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {postures.map((item) => (
            <div key={item.posture} className="card transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-primary">{item.posture}</p>
                <p className={`text-sm font-semibold uppercase tracking-wide ${item.color}`}>{item.status}</p>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{item.summary}</p>
              <div className="mt-6 h-48 rounded-2xl bg-gradient-to-br from-slate-100 via-white to-slate-100 p-6">
                <div className="flex h-full items-end justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="h-32 w-8 rounded-full bg-slate-300/70">
                      <div className="h-1/2 w-full rounded-b-full bg-sky-400/80" />
                    </div>
                    <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Ventricle</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-40 w-8 rounded-full bg-slate-300/70">
                      <div className={`w-full rounded-b-full ${item.posture === "Supine" ? "h-1/2 bg-sky-400/60" : "h-full bg-sky-500"}`} />
                    </div>
                    <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Peritoneum</span>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-slate-600">{item.narrative}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {complications.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-slate-200/70 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/5 p-2 text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">{title}</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
