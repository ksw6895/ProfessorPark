import { HeroSection } from "@/components/hero";
import { AnimatedPhysicsDiagram } from "@/components/animated-physics-diagram";
import { PatientPostureComparison } from "@/components/patient-posture-comparison";
import { HydrostaticSimulator } from "@/components/hydrostatic-simulator";
import { PressureComparisonChartWrapper } from "@/components/pressure-comparison-chart-wrapper";
import { ReferenceDatasets } from "@/components/reference-datasets";
import { CalculationCheatsheet } from "@/components/calculation-cheatsheet";
import { ShuntValveSimulator } from "@/components/shunt-valve-simulator";
import { ConclusionSection } from "@/components/conclusion";

export default function Page() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <AnimatedPhysicsDiagram />
      <PatientPostureComparison />
      <HydrostaticSimulator />
      <PressureComparisonChartWrapper />
      <ReferenceDatasets />
      <CalculationCheatsheet />
      <ShuntValveSimulator />
      <ConclusionSection />
    </main>
  );
}
