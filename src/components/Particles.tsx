"use client";

import { memo, useCallback, useMemo } from "react";
import ParticlesCanvas from "react-particles";
import { loadSlim } from "tsparticles-slim";
import type { Engine, ISourceOptions } from "tsparticles-engine";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const COLORS = ["#d71515", "#d715d7", "#d71579", "#fff"];

const buildOptions = (playing: boolean): ISourceOptions => ({
  fullScreen: { enable: true, zIndex: 0 },
  fpsLimit: 60,
  detectRetina: true,
  interactivity: {
    events: { onClick: { enable: true, mode: "push" }, onHover: { enable: true, mode: "repulse" }, resize: true },
    modes: { repulse: { distance: 100 }, push: { quantity: 3 } },
  },
  particles: {
    color: { value: COLORS, animation: { enable: true, speed: 120 } },
    move: { enable: true, speed: playing ? 4 : 10, direction: playing ? "outside" : "inside", random: true, straight: true, outModes: playing ? "out" : "destroy" },
    number: { value: 120, density: { enable: true, area: 800 } },
    opacity: { value: 1 },
    rotate: { value: { min: 0, max: 360 }, direction: "random", animation: { enable: true, speed: 40 } },
    tilt: { enable: true, direction: "random", value: { min: 0, max: 360 }, animation: { enable: true, speed: 40 } },
    shape: { type: ["triangle", "circle", "square", "star"] },
    size: { value: { min: 3, max: 5 } },
    roll: { enable: true, darken: { enable: true, value: 30 }, enlighten: { enable: true, value: 30 }, speed: { min: 15, max: 25 } },
    wobble: { enable: true, distance: 30, speed: { min: -15, max: 15 } },
  },
});

export const Particles = memo(function Particles({ playing }: { playing: boolean }) {
  const reduced = useReducedMotion();
  const init = useCallback((engine: Engine) => loadSlim(engine), []);
  const options = useMemo(() => buildOptions(playing), [playing]);
  if (reduced) return null;
  return <ParticlesCanvas id="tsparticles" init={init} options={options} />;
});
