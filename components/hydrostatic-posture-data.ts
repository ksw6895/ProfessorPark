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
    headline:
      "서 있는 자세는 거의 +45 cmH₂O의 강력한 사이펀 압력을 생성하여, 모든 밸브 설정을 압도하고 과배액을 유발합니다.", //
  },
] as const;

export type HydrostaticPosture = (typeof hydrostaticPostures)[number];
