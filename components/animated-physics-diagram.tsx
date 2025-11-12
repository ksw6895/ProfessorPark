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
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            // 한 번 보이면 계속 애니메이션 실행 (선택 사항)
            // observer.disconnect();
          } else {
            // 화면 밖으로 나가면 애니메이션 리셋 (선택 사항)
            setIsIntersecting(false);
          }
        });
      },
      { threshold: 0.4 } // 섹션이 40% 보일 때 시작
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white">
      <div className="section-wrapper grid gap-12 lg:grid-cols-[2fr,3fr] lg:items-center">
        {/* 1. 텍스트 설명 부분 */}
        <div className="space-y-6">
          <span className="badge">Q1 · Physics</span>
          <h2 className="section-title">Fundamentals: the siphon phenomenon</h2>
          <p className="section-subtitle">
            사이펀은 더 높은 곳의 유체가 중간의 더 높은 지점(Apex)을 넘어 더 낮은 출구로 흐르는 현상입니다. 이 흐름은 대기압과 중력에 의한 무게 차이(정수압 헤드)로 유지됩니다.
          </p>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">핵심 공식 (Key equation)</p>
            <p className="mt-3 text-lg font-semibold text-primary">ΔP_drive = P_atm + (ρ g h_1) - (ρ g h_2) - P_losses</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
            <defs>
              {/* 물이 흐르는 애니메이션을 위한 클립 패스 */}
              <clipPath id="siphon-clip-path">
                <rect
                  x="0"
                  y="0"
                  width="400"
                  height="300"
                  className={`transition-[transform] duration-[2500ms] ease-out ${
                    isIntersecting ? "translate-x-0" : "-translate-x-full"
                  }`}
                  style={{ transitionDelay: "300ms" }}
                />
              </clipPath>
              {/* 흐르는 물결(점선) 애니메이션 */}
              <linearGradient id="flow-gradient" x1="0" x2="20" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#0ea5e9" />
                <stop offset="1" stopColor="#0ea5e9" />
                <animate attributeName="x1" from="0" to="20" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="x2" from="20" to="40" dur="0.5s" repeatCount="indefinite" />
              </linearGradient>
            </defs>

            {/* 물탱크 (Reservoir) */}
            <rect x="20" y="100" width="100" height="150" fill="rgba(148, 163, 184, 0.1)" />
            <rect x="20" y="150" width="100" height="100" fill="#0ea5e9" fillOpacity="0.6" />
            <line x1="20" y1="150" x2="120" y2="150" stroke="#38bdf8" strokeWidth="2" />
            <text x="70" y="270" textAnchor="middle" fill="#94a3b8" fontSize="12" className="font-semibold uppercase tracking-wide">
              Reservoir (저장조)
            </text>

            {/* 튜브 (Path) - 배경 */}
            <path
              d="M 90 150 
                 V 50   
                 Q 90 30, 110 30 
                 H 290
                 Q 310 30, 310 50
                 V 280"
              fill="none"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            
            {/* 튜브 (Path) - 물 채워지는 부분 (Priming) */}
            <path
              d="M 90 150 
                 V 50   
                 Q 90 30, 110 30 
                 H 290
                 Q 310 30, 310 50
                 V 280"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="14"
              strokeLinecap="round"
              clipPath="url(#siphon-clip-path)" // 채워지는 효과
            />

            {/* 튜브 (Path) - 흐르는 효과 (Flow) */}
            <path
              d="M 90 150 
                 V 50   
                 Q 90 30, 110 30 
                 H 290
                 Q 310 30, 310 50
                 V 280"
              fill="none"
              stroke="url(#flow-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="5 15" // 점선
              className={`transition-opacity duration-1000 ${
                isIntersecting ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "2800ms" }} // Priming이 끝난 후 흐름 시작
            />

            {/* 어노테이션: P_atm (대기압) */}
            <g className={`transition-opacity duration-500 ${isIntersecting ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "500ms" }}>
              <ArrowDown x="50" y="105" width="20" height="20" color="#f59e0b" />
              <ArrowDown x="90" y="105" width="20" height="20" color="#f59e0b" />
              <text x="70" y="95" textAnchor="middle" fill="#f59e0b" fontSize="14" className="font-bold">P_atm</text>
            </g>

            {/* 어노테이션: Apex */}
            <g className={`transition-opacity duration-500 ${isIntersecting ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "1000ms" }}>
              <text x="200" y="25" textAnchor="middle" fill="#e2e8f0" fontSize="12" className="font-semibold uppercase tracking-wide">Apex</text>
            </g>

            {/* 어노테이션: Δρgh (중력/정수압) */}
            <g className={`transition-opacity duration-500 ${isIntersecting ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "1500ms" }}>
              <line x1="330" y1="150" x2="330" y2="280" stroke="#f87171" strokeWidth="2" strokeDasharray="4 4" />
              <ArrowDown x="320" y="200" width="20" height="20" color="#f87171" />
              <text x="340" y="190" fill="#f87171" fontSize="14" className="font-bold">Δρgh</text>
              <text x="340" y="210" fill="#fca5a5" fontSize="12">(중력 헤드)</text>
              <text x="310" y="295" textAnchor="middle" fill="#94a3b8" fontSize="12" className="font-semibold uppercase tracking-wide">
                Down-leg (하강관)
              </text>
            </g>

          </svg>
        </div>
      </div>
    </section>
  );
}
