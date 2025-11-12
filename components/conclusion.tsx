const summaryPoints = [
  {
    title: "Physics",
    message:
      "Standing converts the shunt into a 30–45 cmH₂O siphon. Gravity, not the valve setting, dominates the pressure budget.",
  },
  {
    title: "Quantification",
    message:
      "Viscous losses inside a 0.6 mm catheter are <1 cmH₂O at physiologic flow, far too small to counter gravitational head.",
  },
  {
    title: "Solution",
    message:
      "Orientation-responsive valves add posture-dependent resistance, cancelling the siphon without starving supine drainage.",
  },
];

export function ConclusionSection() {
  return (
    <section className="bg-slate-900 text-slate-100">
      <div className="section-wrapper">
        <span className="badge bg-white/10 text-slate-100">Conclusion</span>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Key takeaways for decision makers</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {summaryPoints.map((point) => (
            <div key={point.title} className="rounded-2xl bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">{point.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-200">{point.message}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-4 text-center text-sm text-slate-300">
          <p>
            Evidence grounded in hydrostatics, human posture, and valve mechanics guides shunt selection and follow-up protocols.
            Pair these visuals with intraoperative photos or follow-up imaging to complete your Vercel-hosted presentation.
          </p>
          <a
            href="#"
            className="inline-flex items-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-400"
          >
            Download speaker notes (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}
