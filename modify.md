
````markdown
각하의 요청에 따라, `Q2answer.md` 의 엄밀한 수치 를 완벽하게 준수하면서, 사이펀 원리 다이어그램을 제외한 모든 시각적 구성 요소를 새로운 디자인으로 교체하였습니다.

새로운 컴포넌트들은 `Q2answer.md` 에서 계산된 핵심 수치들(예: Supine 시 -10.07 cmH₂O, Standing 시 +45.33 cmH₂O, 점성 저항 ~0.56 cmH₂O)을 시각적으로 더 명확하고 직관적으로 표현하는 데 중점을 두었습니다.

아래는 업데이트된 React/TSX 컴포넌트 파일들의 전체 코드입니다.

---

### `components/hydrostatic-posture-data.ts`

(이 파일은 변경되지 않았지만, 모든 시각화의 기준이 되는 핵심 데이터 소스이므로 포함합니다. `Q2answer.md` 의 3번 테이블 "실효 구동력"의 값과 일치합니다.)

```typescript
export const hydrostaticPostures = [
  {
    id: "supine",
    label: "Supine (누운 자세)",
    deltaH: -10, //
    hydrostatic: -10.07, //
    viscous: 0.56, //
    effective: -10.63, //
    direction: "복부 → 두개 (중력이 배액을 방해)", //
    headline: "누운 자세에서는 중력이 배액을 방해하여, 밸브가 약 10 cmH₂O의 '오르막' 압력을 극복해야 합니다.", //
  },
  {
    id: "sitting",
    label: "Sitting (앉은 자세)",
    deltaH: 30, //
    hydrostatic: 30.22, //
    viscous: -0.56, //
    effective: 29.66, //
    direction: "두개 → 복부 (중력이 배액을 도움)", //
    headline:
      "앉은 자세만으로도 약 +30 cmH₂O의 '내리막' 수두가 발생하며, 이는 점성 저항(0.56)보다 수십 배 큽니다.", //
  },
  {
    id: "standing",
    label: "Standing (서 있는 자세)",
    deltaH: 45, //
    hydrostatic: 45.33, //
    viscous: -0.56, //
    effective: 44.77, //
    direction: "두개 → 복부 (중력이 지배적)", //
    headline: "서 있는 자세는 거의 +45 cmH₂O의 강력한 사이펀 압력을 생성하여, 모든 밸브 설정을 압도하고 과배액을 유발합니다.", //
  },
] as const;

export type HydrostaticPosture = (typeof hydrostaticPostures)[number];
````

-----

### `components/patient-posture-comparison.tsx`

(기존의 단순한 실린더 다이어그램을 해부학적 아이콘과 명확한 높이차(Δh)를 강조하는 SVG 다이어그램으로 교체하였습니다.)

```tsx
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
```

-----

### `components/pressure-comparison-chart.tsx`

(기존의 단순한 수평 바 차트를, 두 힘의 크기 차이를 극적으로 대비시키는 수직 압력계(Manometer) 스타일의 시각화로 교체하였습니다. `Q2answer.md` 의 수치(+45.33 vs 0.56) 를 정확히 반영합니다.)

```tsx
type PressureComparisonChartProps = {
  hydrostatic: number; // (Standing: +45.33)
  viscous: number; // (Standing: 0.56)
};

export function PressureComparisonChart({ hydrostatic, viscous }: PressureComparisonChartProps) {
  
  // (45.33 / 0.56 ≈ 80.9)
  const ratio = hydrostatic / (viscous || 1e-6); 
  // (45.33 - 0.56 = 44.77)
  const netPressure = hydrostatic - viscous; 
  
  // 시각화를 위한 스케일링
  const maxVisualHeight = 200; // 픽셀
  const hydrostaticHeight = maxVisualHeight;
  const viscousHeight = Math.max(2, (viscous / hydrostatic) * maxVisualHeight); // 최소 2px로 보여줌

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/40 bg-slate-950 text-slate-100 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.75)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_rgba(15,118,110,0.12),_transparent_70%)]" />
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200/70">Standing Posture (서 있는 자세)</p>
            <h4 className="mt-2 text-2xl font-semibold text-white">Δh = +45&nbsp;cm</h4> 
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              환자가 서 있을 때, 중력 수두(정수압)는 카테터의 점성 저항보다 
              {/* (Q2answer.md "두 자릿수 이상 작습니다") */}
              <span className="font-bold text-white"> 약 {ratio.toFixed(0)}배</span> 더 강력한 구동력을 생성합니다. 
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs uppercase tracking-[0.3em]">
            <p className="text-slate-300">Net Driving Pressure (실효 구동력)</p>
            <p className="mt-2 text-3xl font-semibold text-teal-100">{netPressure.toFixed(1)} cmH₂O</p> 
            <p className="mt-1 text-[0.7rem] text-slate-400">중력 구동력 − 점성 손실</p>
          </div>
        </div>

        {/* --- 새로운 시각화 영역: 수직 압력계 --- */}
        <div className="mt-10 flex items-end justify-center gap-8 rounded-2xl border border-white/10 bg-white/5 p-6 pt-8">
          {/* 1. Hydrostatic Head Bar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex w-20 flex-col items-center">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-sky-400 to-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                style={{ height: `${hydrostaticHeight}px` }}
              />
              <div className="absolute -top-6 rounded-md bg-slate-800 px-2 py-1 text-sm font-semibold text-white">
                {hydrostatic.toFixed(2)} <span className="text-xs text-slate-300">cmH₂O</span>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-sky-200">정수압 구동력 (Δρgh)</p>
            <p className="max-w-[200px] text-center text-xs text-slate-400">자세로 인해 발생하는 중력 수두</p>
          </div>
          
          {/* 2. Viscous Loss Bar */}
          <div className="flex flex-col items-center gap-2">
             <div className="relative flex w-20 flex-col items-center">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-emerald-400 to-lime-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                style={{ height: `${viscousHeight}px` }}
              />
              <div className="absolute -top-6 rounded-md bg-slate-800 px-2 py-1 text-sm font-semibold text-white">
                {viscous.toFixed(2)} <span className="text-xs text-slate-300">cmH₂O</span>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-emerald-200">점성 저항 (Poiseuille)</p>
            <p className="max-w-[200px] text-center text-xs text-slate-400">카테터 마찰 손실 (Q=0.3 mL/min)</p>
          </div>
        </div>
        {/* --- --- */}


        <div className="mt-10 grid gap-4 sm:grid-cols-[minmax(0,1fr),auto]">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm leading-relaxed text-slate-200">
            <p className="font-semibold text-teal-100">임상적 해석 (Clinical interpretation)</p>
            <p className="mt-2">
              밸브 설정값을 아무리 정밀하게 조절해도, +{hydrostatic.toFixed(0)} cmH₂O에 달하는 자세 변화 충격을 흡수할 수 없습니다. 
              중력 보상(Anti-siphon) 기술 없이는 자세 변화 즉시 과배액이 발생합니다.
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-5 text-right">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">정수압 ÷ 점성 저항</p>
            <p className="mt-2 text-4xl font-semibold text-cyan-200">{ratio.toFixed(1)}×</p>
            <p className="mt-1 text-[0.7rem] text-slate-400">자세(방향)가 압력 예산을 지배함</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

-----

### `components/hydrostatic-simulator.tsx`

(기존의 추상적인 점 다이어그램을 `lucide-react` 의 `Brain` (뇌실) 과 `Database` (복강/저장소) 아이콘으로 교체하였습니다. 또한, 기존의 중앙 정렬 바 차트를 압력의 '방향' (음압/저항 vs 양압/촉진)을 명확히 구분하는 좌우 분리형 차트로 변경하였습니다.)

```tsx
"use client";

import { useState } from "react";
import { Brain, Database } from "lucide-react"; //

import { hydrostaticPostures, type HydrostaticPosture } from "./hydrostatic-posture-data";

// (Q2answer.md 의 전제)
const assumptions = [
  { label: "CSF 생성량 (Q)", value: "0.3 mL/min" }, //
  { label: "카테터 내반경 (r)", value: "0.6 mm (ID 1.2 mm)" }, //
  { label: "카테터 길이 (L)", value: "0.80 m" }, //
  { label: "유체 밀도 (ρ)", value: "1,007 kg/m³" }, //
  { label: "유체 점도 (μ)", value: "0.0007 Pa·s" }, //
];

// (최대 절대값: +45.33)
const maxMagnitude = Math.max(...hydrostaticPostures.map((posture) => Math.abs(posture.hydrostatic)));

// --- 새로운 시각화 컴포넌트 1: PostureFigure ---
function PostureFigure({ posture }: { posture: HydrostaticPosture }) {
  // (deltaH 값: -10, +30, +45)
  const offset = Math.max(-70, Math.min(70, posture.deltaH * 1.2));
  const measurementTop = offset >= 0 ? 92 : 92 + offset;
  const measurementHeight = Math.abs(offset);
  const measurementMid = measurementTop + measurementHeight / 2;
  const measurementColor = posture.deltaH >= 0 ? "bg-sky-400/60" : "bg-amber-400/70";
  const measurementNarrative = posture.deltaH >= 0 ? "중력 (배액 도움)" : "중력 (배액 방해)"; //
  const deltaLabel = `${posture.deltaH > 0 ? "+" : ""}${posture.deltaH} cm`; //

  return (
    <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_70%)]" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          <span>Orientation (자세)</span>
          <span className="font-semibold text-sky-300">{posture.label}</span>
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative h-full w-24">
            {/* 수직 기준선 */}
            <div className="absolute left-1/2 top-8 h-[200px] w-px -translate-x-1/2 bg-slate-700/50" />
            
            {/* Peritoneum (복강) - 위치가 변함 */}
            <div
              className="absolute left-1/2 top-[92px] flex -translate-x-1/2 flex-col items-center gap-2"
              style={{ transform: `translateY(${offset}px)`, transition: "transform 500ms ease-out" }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Peritoneum (복강)</span>
              <Database className="h-5 w-5 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.45)]" />
            </div>
            
            {/* Ventricles (뇌실) - 고정 기준점 */}
            <div className="absolute left-1/2 top-[92px] flex -translate-x-1/2 flex-col items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Ventricles (뇌실)</span>
            </div>
            
            {/* 높이차(Δh) 측정선 */}
            <div
              className={`absolute left-[70%] w-1 rounded-full ${measurementColor}`}
              style={{
                top: `${measurementTop}px`,
                height: `${measurementHeight}px`,
                transition: "top 500ms ease-out, height 500ms ease-out",
              }}
            />
            {/* ... (측정선 상/하단 점) ... */}
            
            {/* Δh 라벨 */}
            <div
              className="absolute left-[70%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{ top: `${measurementMid}px`, transition: "top 500ms ease-out" }}
            >
              <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-100 shadow-[0_6px_18px_rgba(15,23,42,0.45)]">
                Δh {deltaLabel}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-300">{measurementNarrative}</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 text-xs text-slate-300">
          Δh = <span className="font-semibold text-white">{posture.deltaH} cm</span> · 정수압 =
          <span className="font-semibold text-white"> {posture.hydrostatic.toFixed(2)} cmH₂O</span>
        </div>
      </div>
    </div>
  );
}
// --- ---

export function HydrostaticSimulator() {
  const [selected, setSelected] = useState<HydrostaticPosture>(hydrostaticPostures[2]);

  return (
    <section>
      <div className="section-wrapper">
        <span className="badge">Q2 · Quantification</span>
        <h2 className="section-title">정수압 수두가 점성 저항을 압도합니다</h2>
        <p className="section-subtitle max-w-4xl">
          반경 0.6mm 카테터와 생리학적 CSF 생성 속도(0.3 mL/min) 를 기준으로 할 때, 점성 마찰 손실은 고작 0.56 cmH₂O 입니다.
          반면 자세로 인한 높이차는 구동 압력을 −10 cmH₂O 에서 +45 cmH₂O 까지 변화시켜, 환자가 일어설 때 과배액이 폭발적으로 발생하는 이유를 설명합니다.
        </p>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-16">
          <div className="card flex-1 space-y-8">
            <div className="grid gap-6 md:grid-cols-[1.1fr,1fr]">
              <div className="rounded-2xl bg-slate-900/90 p-4">
                <PostureFigure posture={selected} />
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">시뮬레이션 전제 조건 (Assumptions)</p>
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
                  onClick={() => setSelected(posture)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    selected.id === posture.id ? "bg-primary text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                  <p className="metric-label">Δh (뇌실 − 복부)</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.hydrostatic.toFixed(2)}&nbsp;cmH₂O</p>
                  <p className="metric-label">정수압 구동력</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.viscous > 0 ? "+" : ""}{selected.viscous.toFixed(2)}&nbsp;cmH₂O</p>
                  <p className="metric-label">점성 저항/손실</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.effective.toFixed(2)}&nbsp;cmH₂O</p>
                  <p className="metric-label">실효 구동력 (Net)</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">흐름 방향: {selected.direction}</p>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            
            {/* --- 새로운 시각화 컴포넌트 2: 압력 방향 차트 --- */}
            <div className="card bg-slate-900 text-slate-100">
              <h3 className="text-lg font-semibold">자세별 구동 압력 방향</h3>
              <p className="mt-2 text-sm text-slate-300">
                정수압은 점성 저항(0.56) 과 비교할 수 없을 정도로 큽니다.
                중심선(0) 기준, 음압(왼쪽)은 배액을 방해하고 양압(오른쪽)은 배액을 촉진합니다.
              </p>
              <div className="mt-8 space-y-6">
                {hydrostaticPostures.map((posture) => {
                  // (e.g., 45.33 / 45.33 * 100 = 100%)
                  const width = Math.abs((posture.hydrostatic / maxMagnitude) * 100); 
                  const isNegative = posture.hydrostatic < 0; // (Supine만 해당)
                  return (
                    <div key={posture.id} className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs uppercase tracking-wide text-slate-400">
                        <span className="min-w-0 shrink">{posture.label}</span>
                        <span className="min-w-0 shrink">{posture.hydrostatic.toFixed(2)} cmH₂O</span>
                      </div>
                      <div className="relative h-6 overflow-hidden rounded-md bg-slate-700/60">
                        {/* 중앙 기준선 */}
                        <div className="absolute left-1/2 top-0 h-full w-px bg-white/30" />
                        
                        {/* 압력 바 */}
                        <div
                          className={`absolute top-0 h-full ${
                            isNegative ? "right-1/2 origin-right" : "left-1/2 origin-left"
                          } ${
                            posture.id === selected.id 
                              ? (isNegative ? "bg-amber-400" : "bg-sky-400")
                              : (isNegative ? "bg-amber-700" : "bg-sky-700")
                          }`}
                          style={{ width: `calc(${width / 2}% - 1px)` }} // 1px 여백
                        />
                        
                        {/* 값 라벨 (바 위에 표시) */}
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
                  <span className="font-bold text-amber-300">왼쪽 (음압)</span>: 배액 방해 (오르막)
                  <br />
                  <span className="font-bold text-sky-300">오른쪽 (양압)</span>: 배액 촉진 (내리막/사이펀)
                </div>
              </div>
            </div>
            {/* --- --- */}
            
          </div>
        </div>
      </div>
    </section>
  );
}
```

-----

### `components/shunt-valve-simulator.tsx`

(기존의 추상적인 실린더/센서 다이어그램을, 각 밸브의 '압력 상태'를 직관적으로 보여주는 '압력 게이지(Pressure Gauge)' 시각화로 전면 교체하였습니다. 각 자세에서 밸브가 '안전', '위험(과배액)', '저하(배액 부전)' 중 어떤 상태에 놓이는지 명확히 보여줍니다.)

```tsx
"use client";

import { useState } from "react";
import { Zap, Gauge, ShieldCheck } from "lucide-react";

// Q2answer.md 의 데이터를 기반으로 한 밸브 시뮬레이션
const valves = [
  {
    id: "standard",
    name: "표준 차압(DP) 밸브",
    icon: Zap,
    supine: {
      resistance: "기본 저항 ≈ 10 cmH₂O",
      behavior: "정수압(≈-10) 이 뇌압을 일부 상쇄. 뇌압이 20 이상이어야 배액됨.",
      outcome: "안정적 (또는 배액 저하)",
      badge: "success", // Supine에서는 과배액 위험이 없음
      gaugeValue: 10, // 뇌압(ICP)이 10이라 가정, 10(ICP) - 10(Δh) = 0. 밸브 설정값 10을 못넘김.
                     // 임상적 의미: 뇌압이 20은 되어야 10만큼의 구동력이 생겨 배액됨. (안정)
    },
    erect: {
      resistance: "동일 저항 ≈ 10 cmH₂O",
      behavior: "정수압(≈+45) 이 뇌압에 더해져 밸브를 활짝 엽니다. (예: 10(ICP) + 45(Δh) = 55 >> 10)",
      outcome: "심각한 과배액",
      badge: "danger",
      gaugeValue: 55, // (가정된 ICP 10 + 정수압 45)
    },
    insight:
      "고전적인 밸브는 자세를 감지하지 못합니다. 서 있을 때 더해지는 +45 cmH₂O 의 사이펀 압력으로 인해 밸브가 활짝 열려 과배액이 발생합니다.",
  },
  {
    id: "programmable",
    name: "프로그래머블 밸브 (고압 설정)",
    icon: Gauge,
    supine: {
      resistance: "높은 설정 저항 (예: 20 cmH₂O)",
      behavior: "누운 자세에서 뇌압이 설정값(20)을 넘기 매우 어려움 (10(ICP) - 10(Δh) = 0 << 20).",
      outcome: "배액 부전 위험",
      badge: "warning", // 'danger' 대신 'warning' (배액 부전)
      gaugeValue: 0, // 구동 압력이 0
    },
    erect: {
      resistance: "높은 설정 저항 (예: 20 cmH₂O)",
      behavior: "높은 저항(20)이 사이펀(45) 을 일부 상쇄하지만, 여전히 강력한 구동력(55)이 남습니다 (55 >> 20).",
      outcome: "과배액 (부분적 제어)",
      badge: "danger",
      gaugeValue: 55, // 구동력은 동일, 밸브 '문턱'만 높아짐
    },
    insight:
      "설정압을 높이는 것은 자세 변화를 보상할 수 없습니다. 서 있을 때의 안전(과배액 방지)과 누웠을 때의 적절한 배액 사이에 절충 문제가 발생합니다.",
  },
  {
    id: "gravitational",
    name: "중력 보상 / 안티사이펀 밸브",
    icon: ShieldCheck,
    supine: {
      resistance: "기본 저항 ≈ 10 cmH₂O",
      behavior: "중력 센서가 수평 상태. 기본 저항(10)만 작동합니다. 누운 자세의 역방향 압력(-10) 을 고려하여 안정적 배액.",
      outcome: "안정적 배액",
      badge: "success",
      gaugeValue: 10, // 기본 밸브 저항값 근처에서 안정화
    },
    erect: {
      resistance: "기본(10) + 중력(≈30) ≈ 40 cmH₂O",
      behavior: "중력 센서(볼)가 수직으로 떨어져 추가 저항(예: 30)을 더합니다. 이 저항이 사이펀(+45) 을 거의 상쇄시킵니다.",
      outcome: "균형 잡힌 배액",
      badge: "success",
      gaugeValue: 15, // (10(ICP) + 45(Δh)) - 40(Valve Res) = 15. (안전 범위)
    },
    insight:
      "자세 의존적인 저항을 추가함으로써, 중력 밸브는 환자가 일어설 때 발생하는 +45 cmH₂O 의 추가 압력을 '중화'시킵니다. 누운 자세의 배액은 방해하지 않으면서요.",
  },
];

const badgeStyle: Record<string, string> = {
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  warning: "bg-amber-500/15 text-amber-600",
};

// --- 새로운 시각화 컴포넌트: 압력 게이지 ---
function PressureGauge({ value }: { value: number }) {
  // 게이지 값 (0-60 범위)을 각도(-90 to +90)로 변환
  const maxValue = 60;
  const rotation = Math.max(-90, Math.min(90, (value / maxValue) * 180 - 90));

  return (
    <div className="relative h-40 w-full rounded-2xl bg-slate-800/80 p-4">
      <div className="relative h-24 w-full overflow-hidden">
        {/* 게이지 배경 (반원) */}
        <div className="absolute bottom-0 left-0 h-full w-full rounded-t-full border-[20px] border-slate-700" />
        {/* 게이지 위험 구역 (빨간색) */}
        <div
          className="absolute bottom-0 left-0 h-full w-full rounded-t-full border-[20px] border-transparent border-t-danger"
          style={{ clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)" }}
        />
        {/* 게이지 안정 구역 (녹색) */}
        <div
          className="absolute bottom-0 left-0 h-full w-full rounded-t-full border-[20px] border-transparent border-l-success"
          style={{ clipPath: "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)" }}
        />
      </div>
      
      {/* 게이지 바늘 */}
      <div
        className="absolute bottom-[30px] left-1/2 h-20 w-1 -translate-x-1/2 rounded-full bg-white shadow-lg"
        style={{
          transformOrigin: "bottom center",
          transform: `translateX(-50%) rotate(${rotation}deg)`,
          transition: "transform 500ms ease-out",
        }}
      />
      <div className="absolute bottom-[24px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-slate-300" />

      {/* 게이지 라벨 */}
      <div className="absolute bottom-4 left-4 text-xs font-bold text-success">안전</div>
      <div className="absolute bottom-4 right-4 text-xs font-bold text-danger">과배액</div>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xl font-bold text-white shadow-md">
        {value.toFixed(0)}
        <span className="text-xs"> cmH₂O</span>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">실효 구동 압력 (Net Driving Pressure)</p>
    </div>
  );
}
// --- ---


export function ShuntValveSimulator() {
  const [active, setActive] = useState(valves[2]);

  return (
    <section className="bg-white">
      <div className="section-wrapper">
        <span className="badge">Q3 · Engineering response</span>
        <h2 className="section-title">중력 밸브가 사이펀을 제어하는 원리</h2>
        <p className="section-subtitle max-w-4xl">
          다양한 밸브 구조가 자세 변화에 어떻게 반응하는지 비교하십시오. 오직 중력 보상 설계만이 환자가 일어설 때
          정확하게 저항을 추가하여, 누운 자세의 배액을 방해하지 않으면서 Δρgh 급증을 상쇄합니다.
        </p>
        <div className="mb-10 rounded-2xl border border-slate-200/70 bg-white p-6 text-sm text-slate-600">
          <p className="font-semibold uppercase tracking-wide text-primary">이 모듈 활용법</p>
          <p className="mt-3 leading-relaxed">
            각 탭은 밸브의 제어 로직과 자세별 압력 상태를 요약합니다. 
            <span className="font-bold text-success">녹색(안전)</span>, 
            <span className="font-bold text-amber-600">노란색(배액 부전)</span>, 
            <span className="font-bold text-danger">빨간색(과배액)</span> 
            배지를 따라가며 위험 신호를 확인하십시오.
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
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    active.id === valve.id
                      ? "bg-primary text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <valve.icon className="h-4 w-4" />
                  {valve.name}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-600">{active.insight}</p>
          </div>
          <div className="card grid gap-8 bg-slate-900 text-slate-100 md:grid-cols-2">
            {["supine", "erect"].map((postureKey) => {
              const posture = postureKey as "supine" | "erect";
              const data = active[posture];
              return (
                <div key={posture} className="space-y-4">
                  <p className="text-lg font-semibold capitalize">
                    {posture === "supine" ? "Supine (누운 자세)" : "Erect (서 있는 자세)"}
                  </p>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    badgeStyle[data.badge]
                  }`}>
                    {data.outcome}
                  </span>
                  
                  {/* --- 새로운 게이지 시각화 --- */}
                  <PressureGauge value={data.gaugeValue} />
                  {/* --- --- */}

                  <p className="text-sm font-semibold text-slate-300">{data.resistance}</p>
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
```

```
```
