export const hydrostaticPostures = [
  {
    id: "supine",
    label: "Supine",
    deltaH: -10,
    hydrostatic: -10.07,
    viscous: 0.56,
    effective: -10.63,
    direction: "Abdomen → Cranial (gravity resists drainage)",
    headline: "Recumbent patients need extra driving pressure; gravity creates a −10 cm head.",
  },
  {
    id: "sitting",
    label: "Sitting",
    deltaH: 30,
    hydrostatic: 30.22,
    viscous: -0.56,
    effective: 29.66,
    direction: "Cranial → Abdomen (gravity assists flow)",
    headline:
      "Sitting introduces ~30 cmH₂O of downhill pressure—already an order of magnitude above viscous losses.",
  },
  {
    id: "standing",
    label: "Standing",
    deltaH: 45,
    hydrostatic: 45.33,
    viscous: -0.56,
    effective: 44.77,
    direction: "Cranial → Abdomen (gravity dominates)",
    headline: "Upright posture pushes nearly 45 cmH₂O through the shunt, overwhelming any programmable setting.",
  },
] as const;

export type HydrostaticPosture = (typeof hydrostaticPostures)[number];
