import kaplay from "kaplay";
import { planckIntegration } from "./planck/world";

// Plugin Link: https://github.com/mflerackers/KaboomJSPlanckIntegration/tree/main

export const k = kaplay({
  global: false,
  width: 960,
  height: 640,
  // stretch: true,
  debug: true,
  background: [0, 255, 255],
  //   plugins: [planckIntegration],
});
