import { PressureComparisonChart } from "./pressure-comparison-chart";
import { hydrostaticPostures } from "./hydrostatic-posture-data";

const standingPosture = hydrostaticPostures.find((posture) => posture.id === "standing") ?? hydrostaticPostures[0];

export function PressureComparisonChartWrapper() {
  return (
    <section>
      <div className="section-wrapper">
        <span className="badge">Q2 · 정량화 (Quantification)</span>
        <h2 className="section-title">선 자세, 압력 예산을 압박하다</h2>
        <p className="section-subtitle max-w-4xl">
          선 자세(Upright)에서는 중력이 +{standingPosture.hydrostatic.toFixed(0)}&nbsp;cmH₂O의 헤드 압력을 주입하는 반면, 점성 손실은 1 cmH₂O 미만에 머무릅니다. 이 둘 사이의 격차는 왜 프로그래머블 밸브만으로는 자세 변화를 감당할 수 없는지 설명합니다.
        </p>
        <div className="mt-10">
          <PressureComparisonChart hydrostatic={standingPosture.hydrostatic} viscous={Math.abs(standingPosture.viscous)} />
        </div>
      </div>
    </section>
  );
}
