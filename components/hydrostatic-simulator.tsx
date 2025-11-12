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
    <section id="simulator" className="scroll-mt-32">
      <div className="section-wrapper">
        <span className="badge">Q2 · Quantification</span>
        <h2 className="section-title">Hydrostatic head overwhelms viscous resistance</h2>
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
            {/* --- 새로운 시각화 컴포트 2: 압력 방향 차트 --- */}
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
                              ? isNegative
                                ? "bg-amber-400"
                                : "bg-sky-400"
                              : isNegative
                              ? "bg-amber-700"
                              : "bg-sky-700"
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
