import Image from "next/image";

const coreQuestions = [
  {
    id: "Q1",
    title: "Q1. 정의 및 임상적 중요성",
    description:
      "실험실의 사이펀에서 뇌실 션트까지 사이펀 현상을 추적하고, 어떻게 중력(gravity)이 임상적 위험 요소가 되는지 밝힙니다.",
  },
  {
    id: "Q2",
    title: "Q2. 문제의 규모 (정량화)",
    description:
      "자세 변화로 인해 생성되는 정수압 헤드(hydrostatic head)를 정량화하고, 점성 저항(viscous loss)이 왜 Δρgh를 상쇄할 수 없는지 증명합니다.",
  },
  {
    id: "Q3",
    title: "Q3. 공학적 해결책",
    description:
      "최신 밸브 전략을 비교하고, 중력 보상(gravitational compensation) 메커니즘이 어떻게 사이펀으로 인한 과배액을 무력화하는지 보여줍니다.",
  },
];

const stats = [
  { label: "Δh (Supine → Erect)", value: "+55 cm" },
  { label: "프로그래머블 밸브", value: "부분적인 제어만 가능" },
  { label: "임상 초점", value: "신경외과 & CSF 역학" },
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
          <span className="badge bg-white/10 text-slate-100">사이펀 현상 (Siphon Phenomenon)</span>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            뇌실 션트의 사이펀 효과: 물리학이 신경외과를 만나는 지점
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-200">
            간단한 수족관 사이펀에서부터 체내에 삽입된 CSF 션트까지의 여정을 따라가 보세요. 이 브리핑은 신경외과 의사와 수련의에게 물리학,
            정량 분석, 공학적 대응책을 통합하는 하나의 내러티브를 제공하여, 자세 변화로 인한 과배액(overdrainage)으로부터 환자를 보호할 수
            있도록 돕습니다.
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
              alt="뇌실 카테터를 보여주는 MRI 스타일 삽화"
              fill
              priority
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-950/70 p-5 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">그랜드 라운드 (Grand Rounds) 준비 완료</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                신경외과 교수진과 학생들을 위해 설계된 계층적 스토리텔링, 인터랙티브 시뮬레이션, 그리고 Vercel 배포 편의성.
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
