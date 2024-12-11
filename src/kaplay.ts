import kaplay from "kaplay";
import { planckIntegration } from "./planck/world";
import KaPlanckPlugin from "kaplanck";

// Plugin Link: https://github.com/mflerackers/KaboomJSPlanckIntegration/tree/main

export const k = kaplay({
  global: false,
  width: 1280,
  height: 720,
  // stretch: true,
  debug: true,
  background: [69, 43, 43],
  plugins: [KaPlanckPlugin()],
});
