import { Brain, Headset, ShieldAlert } from "lucide-react";

const postures = [
  {
    posture: "누운 자세 (Supine)",
    summary: "Δh ≈ −10 cm · 중력이 흐름에 저항",
    narrative:
      "환자가 평평하게 누우면, 복부가 뇌실보다 약간 위에 위치하게 됩니다. 중력이 배액에 저항하여, 밸브가 이 작은 오르막 기둥을 극복해야 하는 압력이 필요합니다.",
    status: "안정적인 배액",
    color: "text-success",
  },
  {
    posture: "선 자세 (Erect)",
    summary: "Δh ≈ +45 cm · 중력이 과배액 유발",
    narrative:
      "서 있는 자세는 션트를 긴 수직의 사이펀으로 만듭니다. 원위부 카테터가 뇌실보다 약 45cm 아래로 떨어지며, 약 +45 cmH₂O의 구동 압력을 추가합니다.",
    status: "과배액 위험 (Risk of Overdrainage)",
    color: "text-danger",
  },
];

const complications = [
  {
    title: "자세성 두통 (Postural Headaches)",
    description: "저압성 두통은 일어설 때 악화되고 누우면 완화됩니다. 이는 자세 의존적인 과배액의 고전적인 증상입니다.",
    icon: Headset,
  },
  {
    title: "슬릿 뇌실 증후군 (Slit Ventricle Syndrome)",
    description: "만성적으로 허탈된 뇌실은 순응도(compliance)를 감소시켜, 간헐적인 폐쇄와 심각한 증상을 유발합니다.",
    icon: Brain,
  },
  {
    title: "경막하 수종/혈종 (Subdural Hygroma/Hematoma)",
    description: "과도한 음압은 뇌수막을 안쪽으로 당겨, 교정맥(bridging veins)을 신장시키고 출혈 위험을 증가시킵니다.",
    icon: ShieldAlert,
  },
];

export function PatientPostureComparison() {
  return (
    <section className="bg-white/70">
      <div className="section-wrapper">
        <span className="badge">Q1 · 임상적 연관성 (Clinical Relevance)</span>
        <h2 className="section-title">자세 변화가 션트를 사이펀으로 바꾸는 이유</h2>
        <p className="section-subtitle max-w-4xl">
          뇌실-복강간 션트(VP shunt)는 환자가 누워있을 때는 안정적으로 작동합니다. 그러나 원위부 카테터가 뇌실보다 아래로 처지는 순간, 사이펀 현상이 중력 헤드(gravitational head)를 끊임없는 흡인력으로 바꾸어 생리적인 CSF 생산 속도를 초과하는 과배액을 유발합니다.
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
                    <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">뇌실 (Ventricle)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-40 w-8 rounded-full bg-slate-300/70">
                      <div className={`w-full rounded-b-full ${item.posture.includes("Supine") ? "h-1/2 bg-sky-400/60" : "h-full bg-sky-500"}`} />
                    </div>
                    <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">복강 (Peritoneum)</span>
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
