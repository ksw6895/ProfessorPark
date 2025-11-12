import { Brain, Headset, ShieldAlert, PersonStanding, Bed } from "lucide-react";

// Q2answer.md 의 Supine (Δh ≈ -10 cm) 및 Erect (Δh ≈ +45 cm) 데이터를 시각화
const postures = [
  {
    posture: "Supine (누운 자세)",
    summary: "Δh ≈ −10 cm · 중력이 흐름을 방해", //
    narrative:
      "환자가 평평하게 누우면 복부(배꼽)가 뇌실(외이도)보다 약 10cm 더 높은 '오르막' 경사가 됩니다. 중력은 배액을 억제합니다.", //
    status: "배액 억제",
    color: "text-amber-600",
    deltaH: -10, //
    icon: Bed,
  },
  {
    posture: "Erect (서 있는 자세)",
    summary: "Δh ≈ +45 cm · 중력이 과배액 유발", //
    narrative:
      "환자가 서면 션트가 긴 수직 사이펀이 됩니다. 복강 카테터 끝이 뇌실보다 약 45cm 아래로 떨어지며 +45 cmH₂O의 강력한 구동력을 더합니다.", //
    status: "과배액 위험",
    color: "text-danger",
    deltaH: 45, //
    icon: PersonStanding,
  },
];

const complications = [
  {
    title: "자세성 두통 (Postural headaches)",
    description: "일어설 때 악화되고 누우면 완화되는 저압성 두통. 전형적인 자세 의존적 과배액 증상입니다.",
    icon: Headset,
  },
  {
    title: "슬릿 벤트리클 증후군 (Slit ventricle syndrome)",
    description: "만성적인 뇌실 허탈은 순응도를 감소시키고 간헐적인 폐쇄와 심각한 증상을 유발할 수 있습니다.",
    icon: Brain,
  },
  {
    title: "경막하 수종/혈종 (Subdural hygroma/hematoma)",
    description: "과도한 음압이 뇌를 끌어당겨 교정맥(bridging veins)을 신장시키고 출혈 위험을 높입니다.",
    icon: ShieldAlert,
  },
];

// 새로운 SVG 시각화 컴포넌트
function PostureVisual({ posture }: { posture: (typeof postures)[number] }) {
  const isErect = posture.deltaH > 0;

  return (
    <div className="relative flex h-48 w-full items-center justify-center rounded-2xl bg-slate-100 p-4">
      <svg
        viewBox={isErect ? "0 0 100 150" : "0 0 150 100"}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <Brain
            id="icon-brain"
            x={isErect ? 25 : 20}
            y={isErect ? 10 : 30}
            width="50"
            height="50"
            className="text-emerald-600"
            strokeWidth={1.5}
          />
          <svg
            id="icon-abdomen"
            x={isErect ? 35 : 110}
            y={isErect ? 110 : 20} // Supine: Y=20 (더 높음), Erect: Y=110 (더 낮음)
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sky-600"
          >
            <path d="M20 12c0 6-4 6-8 6s-8 0-8-6 4-6 8-6 8 0 8 6Z" />
            <path d="M12 18v-6" />
            <path d="M12 12c-2-2.5-2.5-6-1-7" />
            <path d="M12 12c2-2.5 2.5-6 1-7" />
          </svg>
        </defs>

        {/* 아이콘 사용 */}
        <use href="#icon-brain" />
        <use href="#icon-abdomen" />

        {/* 연결선 및 높이차(Δh) 표시 */}
        {isErect ? (
          <>
            {/* Erect: 수직 연결선 */}
            <line
              x1="50"
              y1="45"
              x2="50"
              y2="125"
              className="stroke-slate-400"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1="75"
              y1="45"
              x2="75"
              y2="125"
              className="stroke-rose-500/70"
              strokeWidth="2"
            />
            <polyline
              points="72,120 75,125 78,120"
              className="fill-none stroke-rose-500/70"
              strokeWidth="2"
            />
            <text
              x="80"
              y="85"
              className="fill-rose-600 text-[10px] font-semibold"
            >
              Δh
            </text>
            <text
              x="80"
              y="98"
              className="fill-rose-600 text-[10px] font-semibold"
            >
              +45cm
            </text>
          </>
        ) : (
          <>
            {/* Supine: 수평 연결선 (복부가 더 높음) */}
            <line
              x1="45"
              y1="55"
              x2="125"
              y2="35"
              className="stroke-slate-400"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <path
              d="M 45 60 Q 85 75 125 45" // 복부(125,45)가 뇌실(45,60)보다 높음
              className="fill-none stroke-amber-500/70"
              strokeWidth="2"
            />
            <polyline
              points="120,48 125,45 123,40" // 화살촉
              className="fill-none stroke-amber-500/70"
              strokeWidth="2"
            />
            <text
              x="85"
              y="75"
              className="fill-amber-600 text-[10px] font-semibold"
            >
              Δh -10cm
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export function PatientPostureComparison() {
  return (
    <section id="clinical" className="bg-white/70 scroll-mt-32">
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
                <div className="flex items-center gap-3">
                  <item.icon className="h-6 w-6 text-primary" />
                  <p className="text-2xl font-semibold text-primary">{item.posture}</p>
                </div>
                <p className={`text-sm font-semibold uppercase tracking-wide ${item.color}`}>{item.status}</p>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{item.summary}</p>

              {/* --- 새로운 시각화 영역 --- */}
              <div className="mt-6">
                <PostureVisual posture={item} />
              </div>
              {/* --- --- */}

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
