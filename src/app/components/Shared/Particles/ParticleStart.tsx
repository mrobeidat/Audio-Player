"use client";
import React, { useCallback } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
const Particle = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    await loadSlim(engine);
  }, []);

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true },
          fpsLimit: 244,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              detect_on: "canvas",
              bubble: {
                distance: 800,
                size: 150,
                duration: 2,
                opacity: 8,
                speed: 3,
              },
              repulse: {
                distance: 100,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          particles: {
            color: {
              value: ["#d71515", "#d715d7", "#d71579", "#d71515", "#fff"],
              animation: {
                enable: true,
                speed: 200,
              },
            },
            move: {
              enable: true,
              speed: 5,
              direction: "outside",
              random: true,
              straight: true,
              out_mode: "out",
              attract: {
                enable: false,
                rotateX: 500,
                rotateY: 500,
              },
            },
            number: {
              value: 250,
              density: {
                enable: true,
                area: 800,
              },
            },
            opacity: {
              value: 1,
              animation: {
                enable: false,
                startValue: "max",
                destroy: "min",
                speed: 0.3,
                sync: true,
              },
            },
            rotate: {
              value: {
                min: 0,
                max: 360,
              },
              direction: "random",
              move: true,
              animation: {
                enable: true,
                speed: 50,
              },
            },
            tilt: {
              direction: "random",
              enable: true,
              move: true,
              value: {
                min: 0,
                max: 360,
              },
              animation: {
                enable: true,
                speed: 60,
              },
            },
            shape: {
              type: ["triangle", "circle", "square", "star"],
            },
            size: {
              value: {
                min: 3,
                max: 5,
              },
            },
            roll: {
              darken: {
                enable: true,
                value: 30,
              },
              enlighten: {
                enable: true,
                value: 30,
              },
              enable: true,
              speed: {
                min: 15,
                max: 25,
              },
            },
            wobble: {
              distance: 30,
              enable: true,
              move: true,
              speed: {
                min: -15,
                max: 15,
              },
            },
          },
        }}
      />
    </>
  );
};

export default Particle;
