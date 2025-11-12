요청하신 대로, `Q1 · PHYSICS` 섹션의 스타일과 같이 한글과 영문 핵심 용어를 혼용하는 방식으로 모든 컴포넌트의 텍스트 콘텐츠를 수정했습니다.

아래는 프로젝트 전체 파일에 대한 수정사항 목록입니다.

````markdown
# 웹사이트 전체 콘텐츠 한/영 혼용 수정 가이드

이 문서는 프로젝트 내 모든 사용자 노출 텍스트를 "Q1 · PHYSICS" 섹션의 스타일(전문 용어는 영문 유지, 서술부는 한글)로 통일하기 위한 전체 수정 내역입니다.

---

## 1. `app/layout.tsx` (메타데이터)

웹사이트의 브라우저 탭 제목과 검색 엔진 설명(SEO)을 수정합니다.

```typescript
// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // [수정]
  title: "사이펀 현상 (The Siphon Phenomenon)",
  // [수정]
  description:
    "뇌실 션트 시스템의 사이펀 효과(siphon effect)에 대한 학술적 심층 분석. 물리학, 임상적 통찰, 공학적 해결책을 통합적으로 다룹니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`bg-background ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
````

-----

## 2\. `components/hero.tsx` (히어로 섹션)

메인 페이지의 도입부 콘텐츠입니다.

```tsx
// components/hero.tsx

import Image from "next/image";

const coreQuestions = [
  {
    id: "Q1",
    // [수정]
    title: "Q1. 정의 및 임상적 중요성",
    // [수정]
    description:
      "실험실의 사이펀에서 뇌실 션트까지 사이펀 현상을 추적하고, 어떻게 중력(gravity)이 임상적 위험 요소가 되는지 밝힙니다.",
  },
  {
    id: "Q2",
    // [수정]
    title: "Q2. 문제의 규모 (정량화)",
    // [수정]
    description:
      "자세 변화로 인해 생성되는 정수압 헤드(hydrostatic head)를 정량화하고, 점성 저항(viscous loss)이 왜 Δρgh를 상쇄할 수 없는지 증명합니다.",
  },
  {
    id: "Q3",
    // [수정]
    title: "Q3. 공학적 해결책",
    // [수정]
    description:
      "최신 밸브 전략을 비교하고, 중력 보상(gravitational compensation) 메커니즘이 어떻게 사이펀으로 인한 과배액을 무력화하는지 보여줍니다.",
  },
];

const stats = [
  { label: "Δh (Supine → Erect)", value: "+55 cm" }, // 기술 용어 유지
  {
    // [수정]
    label: "프로그래머블 밸브",
    // [수정]
    value: "부분적인 제어만 가능",
  },
  {
    // [수정]
    label: "임상 초점",
    // [수정]
    value: "신경외과 & CSF 역학",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100">
      {/* ... (배경 스타일) ... */}
      <div className="section-wrapper relative z-10 flex flex-col gap-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-8 fade-up">
          {/* [수정] */}
          <span className="badge bg-white/10 text-slate-100">사이펀 현상 (Siphon Phenomenon)</span>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {/* [수정] */}
            뇌실 션트의 사이펀 효과: 물리학이 신경외과를 만나는 지점
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-200">
            {/* [수정] */}
            간단한 수족관 사이펀에서부터 체내에 삽입된 CSF 션트까지의 여정을 따라가 보세요. 이 브리핑은 신경외과 의사와 수련의에게 물리학, 정량 분석, 공학적 대응책을 통합하는 하나의 내러티브를 제공하여, 자세 변화로 인한 과배액(overdrainage)으로부터 환자를 보호할 수 있도록 돕습니다.
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
              // [수정]
              alt="뇌실 카테터를 보여주는 MRI 스타일 삽화"
              fill
              priority
              className="object-cover opacity-80"
            />
            {/* ... (그라데이션) ... */}
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-950/70 p-5 backdrop-blur">
              {/* [수정] */}
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">그랜드 라운드 (Grand Rounds) 준비 완료</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {/* [수정] */}
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
```

-----

## 3\. `components/animated-physics-diagram.tsx` (Q1 - 물리)

사용자가 제공한 예시 섹션입니다. 요청에 따라 한/영 스타일을 유지합니다.

```tsx
// components/animated-physics-diagram.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

// Q1 답변의 핵심 단계를 여기에 맞게 재구성합니다.
const phases = [
  {
    title: "1. The Setup (준비)",
    description:
      "물탱크(뇌실)와 더 낮은 출구(복강)가 튜브로 연결됩니다. 대기압(P_atm)이 물탱크의 표면을 누릅니다.",
  },
  {
    title: "2. Priming (채우기)",
    description:
      "튜브가 유체로 채워지면, 출구 쪽(Down-leg)의 긴 물기둥이 더 무거워집니다(더 큰 중력).",
  },
  {
    title: "3. Sustained Flow (흐름 발생)",
    description:
      "이 무게 차이(Δρgh)가 튜브 상단(Apex)에 음압을 생성하여, 대기압이 물을 계속 밀어 올리게 만들어 흐름이 유지됩니다.",
  },
];

export function AnimatedPhysicsDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  // ... (useEffect, useState 훅) ...

  return (
    <section className="bg-white">
      <div className="section-wrapper grid gap-12 lg:grid-cols-[2fr,3fr] lg:items-center">
        {/* 1. 텍스트 설명 부분 */}
        <div className="space-y-6">
          <span className="badge">Q1 · Physics</span>
          <h2 className="section-title">Fundamentals: the siphon phenomenon</h2>
          <p className="section-subtitle">
            {/* [수정] (사용자 요청 텍스트 반영) */}
            사이펀은 더 높은 곳의 유체가 중간의 더 높은 지점(Apex)을 넘어 더 낮은 출구로 흐르는 현상입니다. 이 흐름은 대기압과 중력에 의한 무게 차이(정수압 헤드)로 유지됩니다.
          </p>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            {/* [수정] */}
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">핵심 공식 (Key equation)</p>
            <p className="mt-3 text-lg font-semibold text-primary">ΔP_drive = P_atm + (ρ g h_1) - (ρ g h_2) - P_losses</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {/* [수정] */}
              핵심은 중력이 긴 다리(h_2)를 당기는 힘이 짧은 다리(h_1)를 누르는 힘보다 커서 발생하는 **순수 압력 차이(Δρgh)**입니다.
            </p>
          </div>
          <ul className="space-y-4">
            {phases.map((phase, index) => (
              <li
                key={phase.title}
                className={`rounded-xl border border-slate-200/70 bg-slate-50/80 p-5 transition duration-500 ease-out ${
                  isIntersecting ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <p className="font-semibold text-primary">{phase.title}</p>
                <p className="mt-2 text-sm text-slate-600">{phase.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. 시각화 (SVG) 부분 */}
        <div
          ref={ref}
          className={`relative flex h-[450px] items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 transition-opacity duration-500 ${
            isIntersecting ? "opacity-100" : "opacity-0"
          }`}
        >
          <svg
            viewBox="0 0 400 300"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* ... (defs, clip paths) ... */}
            
            {/* ... (물탱크, 튜브) ... */}
            <text x="70" y="270" textAnchor="middle" fill="#94a3b8" fontSize="12" className="font-semibold uppercase tracking-wide">
              {/* [수정] */}
              Reservoir (저장조)
            </text>

            {/* ... (튜브, 흐름 효과) ... */}
            
            {/* ... (P_atm) ... */}

            {/* ... (Apex) ... */}

            {/* 어노테이션: Δρgh (중력/정수압) */}
            <g className={`transition-opacity duration-500 ${isIntersecting ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "1500ms" }}>
              <line x1="330" y1="150" x2="330" y2="280" stroke="#f87171" strokeWidth="2" strokeDasharray="4 4" />
              <ArrowDown x="320" y="200" width="20" height="20" color="#f87171" />
              <text x="340" y="190" fill="#f87171" fontSize="14" className="font-bold">Δρgh</text>
              {/* [수정] */}
              <text x="340" y="210" fill="#fca5a5" fontSize="12">(중력 헤드)</text>
              <text x="310" y="295" textAnchor="middle" fill="#94a3b8" fontSize="12" className="font-semibold uppercase tracking-wide">
                {/* [수정] */}
                Down-leg (하강관)
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
```

-----

## 4\. `components/patient-posture-comparison.tsx` (Q1 - 임상)

Q1의 임상 적용 및 합병증 섹션입니다.

```tsx
// components/patient-posture-comparison.tsx

import { Brain, Headset, ShieldAlert } from "lucide-react";

const postures = [
  {
    // [수정]
    posture: "누운 자세 (Supine)",
    // [수정]
    summary: "Δh ≈ −10 cm · 중력이 흐름에 저항",
    // [수정]
    narrative:
      "환자가 평평하게 누우면, 복부가 뇌실보다 약간 위에 위치하게 됩니다. 중력이 배액에 저항하여, 밸브가 이 작은 오르막 기둥을 극복해야 하는 압력이 필요합니다.",
    // [수정]
    status: "안정적인 배액",
    color: "text-success",
  },
  {
    // [수정]
    posture: "선 자세 (Erect)",
    // [수정]
    summary: "Δh ≈ +45 cm · 중력이 과배액 유발",
    // [수정]
    narrative:
      "서 있는 자세는 션트를 긴 수직의 사이펀으로 만듭니다. 원위부 카테터가 뇌실보다 약 45cm 아래로 떨어지며, 약 +45 cmH₂O의 구동 압력을 추가합니다.",
    // [수정]
    status: "과배액 위험 (Risk of Overdrainage)",
    color: "text-danger",
  },
];

const complications = [
  {
    // [수정]
    title: "자세성 두통 (Postural Headaches)",
    // [수정]
    description: "저압성 두통은 일어설 때 악화되고 누우면 완화됩니다. 이는 자세 의존적인 과배액의 고전적인 증상입니다.",
    icon: Headset,
  },
  {
    // [수정]
    title: "슬릿 뇌실 증후군 (Slit Ventricle Syndrome)",
    // [수정]
    description: "만성적으로 허탈된 뇌실은 순응도(compliance)를 감소시켜, 간헐적인 폐쇄와 심각한 증상을 유발합니다.",
    icon: Brain,
  },
  {
    // [수정]
    title: "경막하 수종/혈종 (Subdural Hygroma/Hematoma)",
    // [수정]
    description: "과도한 음압은 뇌수막을 안쪽으로 당겨, 교정맥(bridging veins)을 신장시키고 출혈 위험을 증가시킵니다.",
    icon: ShieldAlert,
  },
];

export function PatientPostureComparison() {
  return (
    <section className="bg-white/70">
      <div className="section-wrapper">
        {/* [수정] */}
        <span className="badge">Q1 · 임상적 연관성 (Clinical Relevance)</span>
        {/* [수정] */}
        <h2 className="section-title">자세 변화가 션트를 사이펀으로 바꾸는 이유</h2>
        <p className="section-subtitle max-w-4xl">
          {/* [수정] */}
          뇌실-복강간 션트(VP shunt)는 환자가 누워있을 때는 안정적으로 작동합니다. 그러나 원위부 카테터가 뇌실보다 아래로 처지는 순간, 사이펀 현상이 중력 헤드(gravitational head)를 끊임없는 흡인력으로 바꾸어 생리적인 CSF 생산 속도를 초과하는 과배액을 유발합니다.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {postures.map((item) => (
            <div key={item.posture} className="card transition hover:-translate-y-1 hover:shadow-lg">
              {/* ... (posture, status) ... */}
              <div className="mt-6 h-48 rounded-2xl bg-gradient-to-br from-slate-100 via-white to-slate-100 p-6">
                <div className="flex h-full items-end justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="h-32 w-8 rounded-full bg-slate-300/70">
                      <div className="h-1/2 w-full rounded-b-full bg-sky-400/80" />
                    </div>
                    {/* [수정] */}
                    <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">뇌실 (Ventricle)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-40 w-8 rounded-full bg-slate-300/70">
                      <div className={`w-full rounded-b-full ${item.posture === "Supine" ? "h-1/2 bg-sky-400/60" : "h-full bg-sky-500"}`} />
                    </div>
                    {/* [수정] */}
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
```

-----

## 5\. `components/hydrostatic-posture-data.ts` (데이터)

시뮬레이터에서 사용되는 데이터 파일입니다. 서술적인 `headline`과 `direction` 필드를 수정합니다.

```typescript
// components/hydrostatic-posture-data.ts

export const hydrostaticPostures = [
  {
    id: "supine",
    label: "Supine",
    deltaH: -10,
    hydrostatic: -10.07,
    viscous: 0.56,
    effective: -10.63,
    // [수정]
    direction: "복부 → 두개 (중력이 배액에 저항)",
    // [수정]
    headline: "누운 자세(Recumbent)에서는 중력이 -10 cm 헤드를 생성하여 추가적인 구동 압력이 필요합니다.",
  },
  {
    id: "sitting",
    label: "Sitting",
    deltaH: 30,
    hydrostatic: 30.22,
    viscous: -0.56,
    effective: 29.66,
    // [수정]
    direction: "두개 → 복부 (중력이 흐름을 보조)",
    // [수정]
    headline:
      "앉은 자세(Sitting)는 약 30 cmH₂O의 내리막 압력을 생성하며, 이는 점성 손실보다 이미 수십 배 큽니다.",
  },
  {
    id: "standing",
    label: "Standing",
    deltaH: 45,
    hydrostatic: 45.33,
    viscous: -0.56,
    effective: 44.77,
    // [수정]
    direction: "두개 → 복부 (중력이 지배적)",
    // [수정]
    headline: "선 자세(Upright)는 션트를 통해 거의 45 cmH₂O의 압력을 밀어내며, 이는 어떤 프로그래머블 설정으로도 감당하기 어렵습니다.",
  },
] as const;

export type HydrostaticPosture = (typeof hydrostaticPostures)[number];
```

-----

## 6\. `components/hydrostatic-simulator.tsx` (Q2 - 시뮬레이터)

Q2의 메인 인터랙티브 컴포넌트입니다.

```tsx
// components/hydrostatic-simulator.tsx

"use client";

import { useState } from "react";
import { hydrostaticPostures, type HydrostaticPosture } from "./hydrostatic-posture-data";

const assumptions = [
  // [수정]
  { label: "CSF 생성 속도", value: "0.3 mL/min" },
  { label: "카테터 내경 (반지름)", value: "0.6 mm (ID 1.2 mm)" },
  { label: "카테터 길이", value: "0.80 m" },
  { label: "유체 밀도 (Density)", value: "1,007 kg/m³" },
  { label: "동점도 (Viscosity)", value: "0.0007 Pa·s" },
];

// ... (maxMagnitude) ...

function PostureFigure({ posture }: { posture: HydrostaticPosture }) {
  // ... (계산 로직) ...
  // [수정]
  const measurementNarrative = posture.deltaH >= 0 ? "중력 보조" : "중력 저항";
  // ...

  return (
    <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100">
      {/* ... */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          {/* [수정] */}
          <span>자세 (Orientation)</span>
          <span className="font-semibold text-sky-300">{posture.label}</span>
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative h-full w-24">
            {/* ... */}
            <div
              className="absolute left-1/2 top-[92px] flex -translate-x-1/2 flex-col items-center gap-2"
              style={{ transform: `translateY(${offset}px)`, transition: "transform 500ms ease-out" }}
            >
              {/* [수정] */}
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">복강 (Peritoneum)</span>
              <div className="h-4 w-4 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.45)]" />
            </div>
            <div className="absolute left-1/2 top-[92px] flex -translate-x-1/2 flex-col items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
              {/* [수정] */}
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">뇌실 (Ventricles)</span>
            </div>
            {/* ... (측정 바) ... */}
            <div
              className="absolute left-[70%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{
                top: `${measurementMid}px`,
                transition: "top 500ms ease-out",
              }}
            >
              <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-100 shadow-[0_6px_18px_rgba(15,23,42,0.45)]">
                Δh {deltaLabel}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-300">{measurementNarrative}</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 text-xs text-slate-300">
          {/* [수정] */}
          Δh = <span className="font-semibold text-white">{posture.deltaH} cm</span> · Hydrostatic drive(정수압) =
          <span className="font-semibold text-white"> {posture.hydrostatic.toFixed(2)} cmH₂O</span>
        </div>
      </div>
    </div>
  );
}

export function HydrostaticSimulator() {
  const [selected, setSelected] = useState<HydrostaticPosture>(hydrostaticPostures[2]);

  return (
    <section>
      <div className="section-wrapper">
        {/* [수정] */}
        <span className="badge">Q2 · 정량화 (Quantification)</span>
        {/* [수정] */}
        <h2 className="section-title">정수압 헤드, 점성 저항을 압도하다</h2>
        <p className="section-subtitle max-w-4xl">
          {/* [수정] */}
          반경 0.6mm 카테터와 생리적인 CSF 생성 속도(0.3&nbsp;mL/min)를 기준으로 할 때, 점성 마찰(viscous friction)은 고작 0.56&nbsp;cmH₂O의 압력 손실만을 유발합니다. 반면, 자세로 인한 높이 차이는 구동 압력을 −10에서 +45&nbsp;cmH₂O까지 변화시킵니다. 이는 환자가 앉거나 일어서는 즉시 과배액이 폭발적으로 발생하는 이유를 설명합니다.
        </p>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-16">
          <div className="card flex-1 space-y-8">
            <div className="grid gap-6 md:grid-cols-[1.1fr,1fr]">
              <div className="rounded-2xl bg-slate-900/90 p-4">
                <PostureFigure posture={selected} />
              </div>
              <div className="space-y-4">
                {/* [수정] */}
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">시뮬레이션 가정 (Assumptions)</p>
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
            {/* ... (버튼) ... */}
            <div className="space-y-6">
              <p className="text-lg font-semibold text-primary">{selected.headline}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.deltaH}&nbsp;cm</p>
                  {/* [수정] */}
                  <p className="metric-label">Δh (뇌실 − 복부)</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.hydrostatic.toFixed(2)}&nbsp;cmH₂O</p>
                  {/* [수정] */}
                  <p className="metric-label">정수압 구동력 (Hydrostatic drive)</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.viscous > 0 ? "+" : ""}{selected.viscous.toFixed(2)}&nbsp;cmH₂O</p>
                  {/* [수정] */}
                  <p className="metric-label">점성 손실 (Viscous loss)</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="metric">{selected.effective.toFixed(2)}&nbsp;cmH₂O</p>
                  {/* [수정] */}
                  <p className="metric-label">순수 구동 압력 (Net driving pressure)</p>
                </div>
              </div>
              {/* [수정] */}
              <p className="text-sm font-medium text-slate-500">흐름 방향: {selected.direction}</p>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="card bg-slate-900 text-slate-100">
              {/* [수정] */}
              <h3 className="text-lg font-semibold">자세 對 구동 압력 (Posture vs. driving pressure)</h3>
              <p className="mt-2 text-sm text-slate-300">
                {/* [수정] */}
                정수압으로 인한 이득이 점성 손실을 50배 이상 능가합니다. 밸브의 개방 압력을 높이는 것만으로는 이 구배(gradient)를 상쇄할 수 없습니다.
              </p>
              <div className="mt-8 space-y-6">
                {/* ... (차트 매핑) ... */}
                <div className="rounded-xl bg-slate-800/80 p-4 text-xs text-slate-300">
                  {/* [수정] */}
                  중앙이 0점입니다. 0점 오른쪽 막대는 배액을 가속화하며, 왼쪽 막대는 흐름에 저항하는 오르막을 나타냅니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

-----

## 7\. `components/pressure-comparison-chart-wrapper.tsx` (Q2 - 차트 래퍼)

`modify.md`에 따라 분리된 "정수압 vs 점성" 비교 차트 섹션입니다.

```tsx
// components/pressure-comparison-chart-wrapper.tsx

import { PressureComparisonChart } from "./pressure-comparison-chart";
import { hydrostaticPostures } from "./hydrostatic-posture-data";

const standingPosture = hydrostaticPostures.find((posture) => posture.id === "standing") ?? hydrostaticPostures[0];

export function PressureComparisonChartWrapper() {
  return (
    <section>
      <div className="section-wrapper">
        {/* [수정] */}
        <span className="badge">Q2 · 정량화 (Quantification)</span>
        {/* [수정] */}
        <h2 className="section-title">선 자세, 압력 예산을 압박하다</h2>
        <p className="section-subtitle max-w-4xl">
          {/* [수정] */}
          선 자세(Upright)에서는 중력이 +{standingPosture.hydrostatic.toFixed(0)}&nbsp;cmH₂O의 헤드 압력을 주입하는 반면, 점성 손실은 1 cmH₂O 미만에 머무릅니다. 이 둘 사이의 격차는 왜 프로그래머블 밸브만으로는 자세 변화를 감당할 수 없는지 설명합니다.
        </p>
        <div className="mt-10">
          <PressureComparisonChart hydrostatic={standingPosture.hydrostatic} viscous={Math.abs(standingPosture.viscous)} />
        </div>
      </div>
    </section>
  );
}
```

-----

## 8\. `components/pressure-comparison-chart.tsx` (Q2 - 차트)

비교 차트의 내부 컴포넌트입니다.

```tsx
// components/pressure-comparison-chart.tsx

type PressureComparisonChartProps = {
  hydrostatic: number;
  viscous: number;
};

export function PressureComparisonChart({ hydrostatic, viscous }: PressureComparisonChartProps) {
  const bars = [
    {
      // [수정]
      label: "정수압 헤드 (Hydrostatic head, Δρgh)",
      value: hydrostatic,
      accent: "bg-cyan-400",
      gradient: "from-sky-400 via-sky-500 to-cyan-300",
      // [수정]
      description: "환자가 일어설 때 생성되는 중력 기둥",
    },
    {
      // [수정]
      label: "점성 손실 (Viscous loss, Poiseuille)",
      value: viscous,
      accent: "bg-emerald-400",
      gradient: "from-emerald-400 via-emerald-500 to-lime-300",
      // [수정]
      description: "0.3 mL·min⁻¹ 유속에서 카테터 마찰로 인한 에너지 손실",
    },
  ];

  // ... (maxValue, ratio 계산) ...

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/40 bg-slate-950 text-slate-100 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.75)]">
      {/* ... */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            {/* [수정] */}
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200/70">선 자세 (Standing Posture)</p>
            <h4 className="mt-2 text-2xl font-semibold text-white">Δh = +45&nbsp;cm</h4>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              {/* [수정] */}
              환자가 앉거나 일어설 때, 정수압 기둥은 수십 cmH₂O의 구동 압력을 주입합니다. 이는 카테터의 점성 저항(viscous drag)보다 50배 이상 큽니다.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs uppercase tracking-[0.35em]">
            {/* [수정] */}
            <p className="text-slate-300">순수 구동 압력 (Net Driving Pressure)</p>
            <p className="mt-2 text-3xl font-semibold text-teal-100">{(hydrostatic - viscous).toFixed(1)} cmH₂O</p>
            {/* [수정] */}
            <p className="mt-1 text-[0.7rem] text-slate-400">중력 - 마찰 손실</p>
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {/* ... (차트 바 매핑) ... */}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-[minmax(0,1fr),auto]">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm leading-relaxed text-slate-200">
            {/* [수정] */}
            <p className="font-semibold text-teal-100">임상적 해석 (Clinical Interpretation)</p>
            <p className="mt-2">
              {/* [수정] */}
              완벽하게 조율된 밸브라도 +{hydrostatic.toFixed(0)} cmH₂O의 급격한 변화를 흡수할 수 없습니다. 중력 보상 기술 없이는, 자세 변화가 즉시 복강을 향한 과도한 흐름을 유발합니다.
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-5 text-right">
            {/* [수정] */}
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">정수압 ÷ 점성 저항</p>
            <p className="mt-2 text-4xl font-semibold text-cyan-200">{ratio.toFixed(1)}×</p>
            {/* [수정] */}
            <p className="mt-1 text-[0.7rem] text-slate-400">자세가 전체 압력 예산을 지배함</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

-----

## 9\. `components/reference-datasets.tsx` (Q2 - 데이터셋)

`modify.md`에 따라 분리된 데이터 테이블 및 SVG 시각화 섹션입니다.

```tsx
// components/reference-datasets.tsx

const spinalDataset = {
  // ... (데이터) ...
};

// ... (타입 정의, computeSpinalChartGeometry 함수) ...

function DatasetSvgPreview({ datasetKey }: { datasetKey: DatasetKey }) {
  // ... (계산 로직) ...

  return (
    <figure className="mt-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-950/95 text-slate-100 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.65)]">
      <div className="relative">
        <svg
          role="img"
          aria-labelledby={`${datasetKey}-svg-title`}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-auto w-full"
        >
          {/* [수정] */}
          <title id={`${datasetKey}-svg-title`}>{`${title} 정수압 구배 미리보기`}</title>
          {/* ... (defs, gradients) ... */}
          <rect width="100%" height="100%" rx={24} fill="#020617" />
          <rect width="100%" height="100%" rx={24} fill={`url(#${datasetKey}-glow)`} />
          <text
            x={geometry.width / 2}
            y={40}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={20}
            fontWeight={600}
            letterSpacing={-0.5}
          >
            {title}
          </text>
          <text x={geometry.width / 2} y={62} textAnchor="middle" fill="#cbd5e1" fontSize={12}>
            {/* [수정] */}
            배꼽(Umbilicus) 기준 정수압 구배
          </text>
          {/* ... (lines) ... */}
          <text
            x={geometry.zeroX}
            y={geometry.chartTop - 12}
            textAnchor="middle"
            fill="#a5f3eb"
            fontSize={10}
            letterSpacing="0.2em"
          >
            {/* [수정] */}
            중립축 (NEUTRAL AXIS)
          </text>
          {/* ... (bars 매핑) ... */}
          {/* ... (ticks 매핑) ... */}
          <g>
            <text
              x={geometry.width - geometry.margin.right}
              y={geometry.chartTop - 16}
              textAnchor="end"
              fill="#94a3b8"
              fontSize={10}
              letterSpacing="0.15em"
            >
              {/* [수정] */}
              최대 구배 (PEAK GRADIENT)
            </text>
            <text
              x={geometry.width - geometry.margin.right}
              y={geometry.chartTop + 2}
              textAnchor="end"
              fill="#a5f3fc"
              fontSize={18}
              fontWeight={600}
            >
              {`${peak.hydrostatic >= 0 ? "+" : ""}${peak.hydrostatic.toFixed(2)} cmH₂O`}
            </text>
          </g>
        </svg>
        {/* ... */}
      </div>
      <figcaption className="border-t border-white/5 bg-slate-900/80 px-6 py-4 text-sm leading-relaxed text-slate-200">
        {/* [수정] */}
        중력은 흉추(thoracic spine) 주변의 압력 프로파일을 변화시킵니다. 강조된 막대는 이 자세에서 가장 지배적인 레벨을 표시하며, 청록색 축은 사이펀 현상이 역전되는 0점(zero-crossing)을 보여줍니다.
      </figcaption>
    </figure>
  );
}

function DatasetTable({ datasetKey }: { datasetKey: DatasetKey }) {
  // ... (계산 로직) ...

  return (
    <details className="dataset-accordion group p-4">
      <summary className="rounded-lg transition group-open:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
        <div className="flex flex-1 flex-wrap items-center justify-between gap-6">
          <div className="max-w-xs">
            <p className="text-base font-semibold text-primary">{title}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {/* [수정] */}
              배꼽(Umbilicus) 기준 정수압 슬라이스
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              {/* [수정] */}
              최대 (Peak) {peakRow.hydrostatic >= 0 ? "+" : ""}
              {peakRow.hydrostatic.toFixed(2)} cmH₂O @ {peakRow.level}
            </span>
            {/* [수정] */}
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-500">범위 (Span) {span.toFixed(2)} cmH₂O</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[0.65rem] font-bold text-primary transition group-open:rotate-45 group-open:bg-primary group-open:text-white">
              +
            </span>
          </div>
        </div>
      </summary>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              {/* [수정] */}
              <th className="px-4 py-2 text-left">레벨 (Level)</th>
              <th className="px-4 py-2 text-right">Δh (cm)</th>
              <th className="px-4 py-2 text-right">ΔPₕ (cmH₂O)</th>
              <th className="px-4 py-2 text-right">ΔPₕ (mmHg)</th>
            </tr>
          </thead>
          {/* ... (테이블 바디) ... */}
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {/* [수정] */}
        175cm 성인, 뇌실을 외이도(EAM)에 정렬한 기준. Δh 값을 조절하고 ΔPₕ ≈ 1.007 × Δh 공식을 사용하여 압력을 다시 계산할 수 있습니다.
      </p>
      <DatasetSvgPreview datasetKey={datasetKey} />
    </details>
  );
}

export function ReferenceDatasets() {
  return (
    <section>
      <div className="section-wrapper">
        {/* [수정] */}
        <span className="badge">Q2 · 정량화 (Quantification)</span>
        {/* [수정] */}
        <h2 className="section-title">정수압 구배 (Hydrostatic Gradients) 참조 데이터셋</h2>
        <p className="section-subtitle max-w-4xl">
          {/* [수정] */}
          보고서 전반에 사용된 원시 측정 데이터를 탐색하십시오. 각 아코디언은 표로 정리된 Δh 및 ΔP 값과 함께, 발표 자료 캡처에 최적화된 반응형 SVG 미리보기를 제공합니다.
        </p>
        {/* ... */}
      </div>
    </section>
  );
}
```

-----

## 10\. `components/calculation-cheatsheet.tsx` (Q2 - 치트시트)

`modify.md`에 따라 분리된 계산 치트시트 섹션입니다.

```tsx
// components/calculation-cheatsheet.tsx

const cheatsheet = [
  {
    // [수정]
    title: "정수압 변환 (Hydrostatic)",
    items: [
      "ΔPₕ (cmH₂O) ≈ 1.007 × Δh(cm) for CSF (ρ = 1007 kg/m³)",
      "1 cmH₂O ≈ 0.7356 mmHg (multiply by 0.7356 to convert)",
      // [수정]
      "부호 규약: 양수(+)는 두개(cranial) → 복강(peritoneal) 흐름을 의미",
    ],
  },
  {
    // [수정]
    title: "점성 손실 (Viscous loss, Poiseuille)",
    items: [
      "ΔPᵥ ≈ 1.87 cmH₂O × (Q / 1 mL·min⁻¹) × (L / 0.80 m) × (0.6 mm / r)⁴",
      "Q = 0.3 mL·min⁻¹ → ΔPᵥ ≈ 0.56 cmH₂O (0.41 mmHg)",
      // [수정]
      "층류(Laminar flow) 확인 (Re ≪ 2000); 저항은 길이에 비례",
    ],
  },
  {
    // [수정]
    title: "임상적 해석 (Clinical Interpretation)",
    items: [
      // [수정]
      "선 자세(Upright)는 +45 cmH₂O의 구동 헤드를 추가 → 사이펀 위험",
      // [수정]
      "누운 자세(Supine)는 −10 cmH₂O를 유발, 밸브 개방압(opening pressure) 필요",
      // [수정]
      "프로그래머블 설정만으로는 자세 변화(posture swings)를 감당할 수 없음",
    ],
  },
];

// ... (CheatsheetCard 컴포넌트) ...

export function CalculationCheatsheet() {
  return (
    <section>
      <div className="section-wrapper">
        {/* [수정] */}
        <span className="badge">Q2 · 정량화 (Quantification)</span>
        {/* [수정] */}
        <h2 className="section-title">계산 치트시트 (Calculation Cheatsheet)</h2>
        <p className="section-subtitle max-w-4xl">
          {/* [수정] */}
          주요 변환 공식과 가정을 가까이에 두십시오. 이 빠른 참조 자료는 자세로 인한 높이 차이가 어떻게 압력 헤드로 변환되는지, 그리고 점성 저항이 카테터 기하학에 어떻게 반응하는지 요약합니다.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cheatsheet.map((card) => (
            <CheatsheetCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

-----

## 11\. `components/shunt-valve-simulator.tsx` (Q3 - 밸브 시뮬레이터)

Q3의 밸브 비교 인터랙티브 섹션입니다.

```tsx
// components/shunt-valve-simulator.tsx

"use client";

import { useState } from "react";

const valves = [
  {
    id: "standard",
    // [수정]
    name: "표준 차압 밸브 (Standard DP Valve)",
    supine: {
      // [수정]
      resistance: "기본 개방압 ≈ 10 cmH₂O",
      behavior: "압력 강하가 적당할 때 정상적으로 흐름.",
      outcome: "수평 자세에서 안정적",
      badge: "success",
    },
    erect: {
      // [수정]
      resistance: "동일한 개방 압력",
      behavior: "정수압 헤드(약 45 cmH₂O)가 뇌실압에 더해져 → 제어되지 않는 사이펀 발생.",
      outcome: "심각한 과배액",
      badge: "danger",
    },
    // [수정]
    insight:
      "고전적인 밸브는 방향을 감지할 수 없습니다. 선 자세에서는 사이펀이 수십 cmH₂O의 압력을 더해 밸브가 활짝 열리게 만들어 과배액을 유발합니다.",
  },
  {
    id: "programmable",
    // [수정]
    name: "프로그래머블 밸브 (Programmable Valve)",
    supine: {
      // [수정]
      resistance: "높게 프로그래밍된 개방압",
      behavior: "설정값을 높이면 중력으로부터는 보호되지만, 누운 자세에서의 배액이 원활하지 않게 됨.",
      outcome: "배액 부족 위험",
      badge: "danger",
    },
    erect: {
      // [수정]
      resistance: "높게 프로그래밍된 개방압",
      behavior: "더 높은 기본 압력이 중력을 부분적으로 상쇄하지만, 잔여 헤드가 여전히 흐름을 유발.",
      outcome: "부분적인 제어만 가능",
      badge: "danger",
    },
    // [수정]
    insight:
      "조절 가능한 임계값은 CSF 용량을 미세 조정하는 데 도움이 되지만, 자세 변화를 스스로 보상할 수는 없습니다. 임상의는 여전히 선 자세의 안전성과 누운 자세의 적절성 사이에서 절충(trade-off)을 겪습니다.",
  },
  {
    id: "gravitational",
    // [수정]
    name: "중력 / 항-사이펀 밸브 (Gravitational / ASD)",
    supine: {
      // [수정]
      resistance: "기본 저항 ≈ 10 cmH₂O",
      behavior: "방향 센서가 수평을 유지하므로, 공칭 저항(nominal resistance)만 작동. CSF 유출이 생리학적 생산 속도와 일치함.",
      outcome: "안정적인 배액",
      badge: "success",
    },
    erect: {
      // [수정]
      resistance: "기본 10 + 중력 모듈 20 ≈ 30 cmH₂O",
      behavior: "Ball-in-cage 요소가 떨어져 바이패스(bypass)를 닫고, 사이펀 헤드를 상쇄하는 추가 저항을 주입함.",
      outcome: "균형 잡힌 흐름",
      badge: "success",
    },
    // [수정]
    insight:
      "자세 의존적 저항(posture-dependent resistance)을 추가함으로써, 중력 밸브는 누운 자세의 흐름을 방해하지 않으면서도 환자가 일어설 때 발생하는 추가적인 30–45 cmH₂O의 압력을 중화시킵니다.",
  },
];

// ... (badgeStyle) ...

export function ShuntValveSimulator() {
  const [active, setActive] = useState(valves[2]);

  return (
    <section className="bg-white">
      <div className="section-wrapper">
        {/* [수정] */}
        <span className="badge">Q3 · 공학적 대응 (Engineering Response)</span>
        {/* [수정] */}
        <h2 className="section-title">중력 밸브(Gravitational Valves)가 사이펀을 제어하는 이유</h2>
        <p className="section-subtitle max-w-4xl">
          {/* [수정] */}
          다양한 밸브 아키텍처가 자세 변화에 따라 어떻게 다르게 작동하는지 비교해 보십시오. 오직 중력 보상(gravity-compensating) 설계만이 환자가 일어설 때 정확하게 저항을 추가하여, 누운 자세의 배액(supine drainage)을 유지하면서 Δρgh 급증을 상쇄합니다.
        </p>
        <div className="mb-10 rounded-2xl border border-slate-200/70 bg-white p-6 text-sm text-slate-600">
          {/* [수정] */}
          <p className="font-semibold uppercase tracking-wide text-primary">이 모듈 읽는 법</p>
          <p className="mt-3 leading-relaxed">
            {/* [수정] */}
            각 탭은 밸브의 제어 로직을 요약하고 자세별 흐름 상태를 보여줍니다. 녹색 배지는 제어되는 배액을, 적색 배지는 잔여 사이펀 위험을 의미합니다. 이 스토리보드를 다학제 컨퍼런스에서 사용하여 신경외과 의사, 레지던트, 의공학자 간의 이해를 일치시키십시오.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
          {/* ... (버튼 매핑) ... */}
          <div className="card grid gap-8 bg-slate-900 text-slate-100 md:grid-cols-2">
            {[{id: "supine", label: "누운 자세 (Supine)"}, {id: "erect", label: "선 자세 (Erect)"}].map((posture) => {
              const data = active[posture.id as "supine" | "erect"];
              return (
                <div key={posture.id} className="space-y-4">
                  <p className="text-lg font-semibold capitalize">{posture.label}</p>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    badgeStyle[data.badge]
                  }`}>
                    {data.outcome}
                  </span>
                  <div className="h-40 rounded-2xl bg-slate-800/80 p-4">
                    <div className="flex h-full items-center justify-around">
                      <div className="flex flex-col items-center">
                        {/* ... */}
                        {/* [수정] */}
                        <span className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">뇌실 (Ventricle)</span>
                      </div>
                      <div className={`relative h-32 w-20 ${posture.id === "erect" ? "rotate-90" : ""} transition-transform duration-500`}>
                        {/* ... */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {/* [수정] */}
                          센서 (Sensor)
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        {/* ... */}
                        {/* [수정] */}
                        <span className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">복강 (Peritoneum)</span>
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
```

-----

## 12\. `components/conclusion.tsx` (결론 섹션)

마지막 요약 및 CTA 섹션입니다.

```tsx
// components/conclusion.tsx

const summaryPoints = [
  {
    // [수정]
    title: "물리학 (Physics)",
    // [수정]
    message:
      "서 있는 자세는 션트를 30–45 cmH₂O의 사이펀으로 변환합니다. 밸브 설정이 아닌 중력(Gravity)이 압력 예산을 지배합니다.",
  },
  {
    // [수정]
    title: "정량화 (Quantification)",
    // [수정]
    message:
      "0.6mm 카테터 내부의 점성 손실(Viscous loss)은 생리적 유속에서 <1 cmH₂O이며, 이는 중력 헤드를 상쇄하기에 턱없이 부족합니다.",
  },
  {
    // [수정]
    title: "해결책 (Solution)",
    // [수정]
    message:
      "방향 감응형 밸브(Orientation-responsive valves)는 자세 의존적 저항을 추가하여, 누운 자세의 배액을 방해하지 않으면서 사이펀을 상쇄합니다.",
  },
];

export function ConclusionSection() {
  return (
    <section className="bg-slate-900 text-slate-100">
      <div className="section-wrapper">
        {/* [수정] */}
        <span className="badge bg-white/10 text-slate-100">결론 (Conclusion)</span>
        {/* [수정] */}
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">의사결정자를 위한 핵심 요약 (Key Takeaways)</h2>
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
            {/* [수정] */}
            정수역학(hydrostatics), 인체 자세, 밸브 메커니즘에 근거한 이 증거들은 션트 선택 및 추적 관찰 프로토콜의 가이드가 됩니다. 이 시각 자료들을 수술 중 사진이나 추적 관찰 영상과 함께 사용하여 Vercel 기반의 프레젠테이션을 완성하십시오.
          </p>
          <a
            href="#"
            className="inline-flex items-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-400"
          >
            {/* [수정] */}
            발표자 노트 다운로드 (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}
```

```
```
