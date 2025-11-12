export const hydrostaticPostures = [
  {
    id: "supine",
    label: "Supine",
    deltaH: -10,
    hydrostatic: -10.07,
    viscous: 0.56,
    effective: -10.63,
    direction: "복부 → 두개 (중력이 배액에 저항)",
    headline: "누운 자세(Recumbent)에서는 중력이 -10 cm 헤드를 생성하여 추가적인 구동 압력이 필요합니다.",
  },
  {
    id: "sitting",
    label: "Sitting",
    deltaH: 30,
    hydrostatic: 30.22,
    viscous: -0.56,
    effective: 29.66,
    direction: "두개 → 복부 (중력이 흐름을 보조)",
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
    direction: "두개 → 복부 (중력이 지배적)",
    headline: "선 자세(Upright)는 션트를 통해 거의 45 cmH₂O의 압력을 밀어내며, 이는 어떤 프로그래머블 설정으로도 감당하기 어렵습니다.",
  },
] as const;

export type HydrostaticPosture = (typeof hydrostaticPostures)[number];
