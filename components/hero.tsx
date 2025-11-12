import Image from "next/image";

const coreQuestions = [
  {
    id: "Q1",
    title: "What is it, and why does it matter?",
    description:
      "Trace the siphon phenomenon from a laboratory siphon to the ventricular shunt and expose how gravity becomes a clinical hazard.",
  },
  {
    id: "Q2",
    title: "How big is the problem?",
    description:
      "Quantify the hydrostatic head created by posture changes and reveal why viscous losses cannot offset Δρgh.",
  },
  {
    id: "Q3",
    title: "How do we solve it?",
    description:
      "Compare modern valve strategies and demonstrate how gravitational compensation neutralises siphon-driven overdrainage.",
  },
];

const stats = [
  { label: "Δh (supine → erect)", value: "+55 cm" },
  { label: "Programmable valves", value: "Only partial control" },
  { label: "Clinical focus", value: "Neurosurgery & CSF dynamics" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,64,175,0.45),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,132,199,0.18),transparent_55%)]" />
      </div>
      <div className="section-wrapper relative z-10 flex flex-col gap-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-8 fade-up">
          <span className="badge bg-white/10 text-slate-100">Siphon Phenomenon</span>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            The siphon effect in ventricular shunts: where physics meets neurosurgery
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-200">
            Follow the journey from a simple aquarium siphon to an implanted CSF shunt. This briefing equips neurosurgeons and
            trainees with a unified narrative—physics, quantitative analysis, and engineering countermeasures—to defend patients
            against posture-driven overdrainage.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">{stat.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-8 fade-right">
          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60">
            <Image
              src="/hero-illustration.svg"
              alt="MRI inspired illustration showing ventricular catheter"
              fill
              priority
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-950/70 p-5 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">Grand Rounds Ready</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Layered storytelling, interactive simulations, and deploy-to-Vercel readiness crafted for neurosurgical faculty
                and students.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {coreQuestions.map((question) => (
              <div
                key={question.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
              >
                <p className="badge mb-4 bg-sky-500/20 text-sky-200">{question.id}</p>
                <h3 className="text-xl font-semibold text-white">{question.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">{question.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
