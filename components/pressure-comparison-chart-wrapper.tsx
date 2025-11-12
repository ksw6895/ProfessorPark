import { PressureComparisonChart } from "./pressure-comparison-chart";
import { hydrostaticPostures } from "./hydrostatic-posture-data";

const standingPosture = hydrostaticPostures.find((posture) => posture.id === "standing") ?? hydrostaticPostures[0];

export function PressureComparisonChartWrapper() {
  return (
    <section>
      <div className="section-wrapper">
        <span className="badge">Q2 · Quantification</span>
        <h2 className="section-title">Standing posture compresses the pressure budget</h2>
        <p className="section-subtitle max-w-4xl">
          In the upright position gravity injects +{standingPosture.hydrostatic.toFixed(0)}&nbsp;cmH₂O of head pressure while viscous
          losses remain sub-centimetric. The gap between the two explains why programmable valves alone cannot tame posture swings.
        </p>
        <div className="mt-10">
          <PressureComparisonChart hydrostatic={standingPosture.hydrostatic} viscous={Math.abs(standingPosture.viscous)} />
        </div>
      </div>
    </section>
  );
}
