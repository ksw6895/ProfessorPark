"use client";

import { useState } from "react";

const valves = [
  {
    id: "standard",
    name: "표준 차압 밸브 (Standard DP Valve)",
    supine: {
      resistance: "기본 개방압 ≈ 10 cmH₂O",
      behavior: "압력 강하가 적당할 때 정상적으로 흐름.",
      outcome: "평 자세에서 안정적",
      badge: "success",
    },
    erect: {
      resistance: "동일한 개방 압력",
      behavior: "정수압 헤드(약 45 cmH₂O)가 뇌실압에 더해져 → 제어되지 않는 사이펀 발생.",
      outcome: "심각한 과배액",
      badge: "danger",
    },
    insight:
      "고전적인 밸브는 방향을 감지할 수 없습니다. 선 자세에서는 사이펀이 수십 cmH₂O의 압력을 더해 밸브가 활짝 열리게 만들어 과배액을 유발합니다.",
  },
  {
    id: "programmable",
    name: "프로그래머블 밸브 (Programmable Valve)",
    supine: {
      resistance: "높게 프로그래밍된 개방압",
      behavior: "설정값을 높이면 중력으로부터는 보호되지만, 누운 자세에서의 배액이 원활하지 않게 됨.",
      outcome: "배액 부족 위험",
      badge: "danger",
    },
    erect: {
      resistance: "높게 프로그래밍된 개방압",
      behavior: "더 높은 기본 압력이 중력을 부분적으로 상쇄하지만, 잔여 헤드가 여전히 흐름을 유발.",
      outcome: "부분적인 제어만 가능",
      badge: "danger",
    },
    insight:
      "조절 가능한 임계값은 CSF 용량을 미세 조정하는 데 도움이 되지만, 자세 변화를 스스로 보상할 수는 없습니다. 임상의는 여전히 선 자세의 안전성과 누운 자세의 적절성 사이에서 절충(trade-off)을 겪습니다.",
  },
  {
    id: "gravitational",
    name: "중력 / 항-사이펀 밸브 (Gravitational / ASD)",
    supine: {
      resistance: "기본 저항 ≈ 10 cmH₂O",
      behavior: "방향 센서가 수평을 유지하므로, 공칭 저항(nominal resistance)만 작동. CSF 유출이 생리학적 생산 속도와 일치함.",
      outcome: "안정적인 배액",
      badge: "success",
    },
    erect: {
      resistance: "기본 10 + 중력 모듈 20 ≈ 30 cmH₂O",
      behavior: "Ball-in-cage 요소가 떨어져 바이패스를 닫고, 사이펀 헤드를 상쇄하는 추가 저항을 주입함.",
      outcome: "균형 잡힌 흐름",
      badge: "success",
    },
    insight:
      "자세 의존적 저항(posture-dependent resistance)을 추가함으로써, 중력 밸브는 누운 자세의 흐름을 방해하지 않으면서도 환자가 일어설 때 발생하는 추가적인 30–45 cmH₂O의 압력을 중화시킵니다.",
  },
];

const badgeStyle: Record<string, string> = {
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
};

export function ShuntValveSimulator() {
  const [active, setActive] = useState(valves[2]);

  return (
    <section className="bg-white">
      <div className="section-wrapper">
        <span className="badge">Q3 · 공학적 대응 (Engineering Response)</span>
        <h2 className="section-title">중력 밸브(Gravitational Valves)가 사이펀을 제어하는 이유</h2>
        <p className="section-subtitle max-w-4xl">
          다양한 밸브 아키텍처가 자세 변화에 따라 어떻게 다르게 작동하는지 비교해 보십시오. 오직 중력 보상(gravity-compensating) 설계만이 환자가 일어설 때 정확하게 저항을 추가하여, 누운 자세의 배액(supine drainage)을 유지하면서 Δρgh 급증을 상쇄합니다.
        </p>
        <div className="mb-10 rounded-2xl border border-slate-200/70 bg-white p-6 text-sm text-slate-600">
          <p className="font-semibold uppercase tracking-wide text-primary">이 모듈 읽는 법</p>
          <p className="mt-3 leading-relaxed">
            각 탭은 밸브의 제어 로직을 요약하고 자세별 흐름 상태를 보여줍니다. 녹색 배지는 제어되는 배액을, 적색 배지는 잔여 사이펀 위험을 의미합니다. 이 스토리보드를 다학제 컨퍼런스에서 사용하여 신경외과 의사, 레지던트, 의공학자 간의 이해를 일치시키십시오.
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
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    active.id === valve.id
                      ? "bg-primary text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {valve.name}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-600">{active.insight}</p>
          </div>
          <div className="card grid gap-8 bg-slate-900 text-slate-100 md:grid-cols-2">
            {[{ id: "supine", label: "누운 자세 (Supine)" }, { id: "erect", label: "선 자세 (Erect)" }].map((posture) => {
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
                        <div className="h-28 w-10 rounded-full bg-slate-700">
                          <div className="h-full w-full rounded-b-full bg-sky-500/80" />
                        </div>
                        <span className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">뇌실 (Ventricle)</span>
                      </div>
                      <div className={`relative h-32 w-20 ${posture.id === "erect" ? "rotate-90" : ""} transition-transform duration-500`}>
                        <div className="absolute inset-0 rounded-2xl border-2 border-sky-400/60 bg-slate-900/80" />
                        <div
                          className={`absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 transition-transform duration-500 ${
                            posture.id === "erect" ? "translate-y-6" : ""
                          }`}
                        />
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          센서 (Sensor)
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-10 rounded-full bg-slate-700">
                          <div className={`w-full rounded-b-full ${
                            posture.id === "supine" && active.id !== "gravitational"
                              ? "h-2/3 bg-sky-500/70"
                              : posture.id === "erect" && active.id === "gravitational"
                              ? "h-1/3 bg-emerald-400"
                              : "h-full bg-sky-500"
                          }`} />
                        </div>
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
