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
    <section id="valves" className="bg-white scroll-mt-32">
      <div className="section-wrapper">
        <span className="badge">Q3 · Engineering response</span>
        <h2 className="section-title">How gravitational valves rein in the siphon</h2>
        <p className="section-subtitle max-w-4xl">
          Compare how each valve architecture reacts to posture changes. Only gravity-compensated designs add just enough
          resistance when the patient stands to cancel the Δρgh surge while leaving supine drainage unobstructed.
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
