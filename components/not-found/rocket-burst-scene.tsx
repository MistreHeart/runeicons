"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";

import { burstRocket } from "@/components/landing/svg/hero/burst";
import { BURST } from "@/components/landing/svg/hero/constants";
import HeroDefs from "@/components/landing/svg/hero/defs";
import { Rocket, RocketPad } from "@/components/landing/svg/hero/scene-cargo-and-rocket";
import { LaunchTower } from "@/components/landing/svg/hero/scene-pipes-and-pulse";

const FIRST_LAUNCH_DELAY = 1.6;

const RocketBurstScene = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const busyRef = useRef(false);
  const launchRef = useRef<(fromSky: boolean) => void>(() => {});

  useEffect(() => {
    const svg = svgRef.current;
    const rocket = svg?.querySelector<SVGGElement>(".rocket");
    if (!svg || !rocket) return;

    const fullMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = rocket.querySelectorAll<SVGPathElement>(".rocketTrail-core");
    const glow = rocket.querySelectorAll<SVGPathElement>(".rocketTrail-plume, .rocketTrail-halo");
    let timeline: gsap.core.Timeline | null = null;
    let cleanupBurst: (() => void) | null = null;
    let shake: gsap.core.Tween | null = null;

    gsap.set(rocket, { transformOrigin: "50% 100%" });
    gsap.set(cores, { transformOrigin: "50% 0%", scaleY: 0.4 });

    const launch = (fromSky: boolean) => {
      if (busyRef.current) return;
      busyRef.current = true;
      cleanupBurst?.();
      cleanupBurst = null;
      timeline?.kill();

      timeline = gsap.timeline({
        delay: fromSky ? 0 : FIRST_LAUNCH_DELAY,
        onComplete: () => {
          busyRef.current = false;
        },
      });

      if (fromSky) {
        timeline
          .set(rocket, { x: 0, y: -520, opacity: 1 })
          .set([...cores, ...glow], { opacity: 0 })
          .to(rocket, { y: 8, duration: fullMotion ? 0.7 : 0.01, ease: "power2.in" })
          .to(rocket, { y: 0, duration: 0.26, ease: "power2.out" })
          .to({}, { duration: 0.35 });
      }

      if (!fullMotion) {
        timeline.call(() => {
          cleanupBurst = burstRocket(svg, rocket, false);
        });
        timeline.to({}, { duration: 1.1 });
        return;
      }

      timeline
        .to(cores, {
          opacity: 0.85,
          scaleY: 0.9,
          duration: 0.18,
          stagger: 0.05,
          ease: "power1.out",
          onStart: () => {
            shake = gsap.to(rocket, {
              x: "+=1.2",
              duration: 0.045,
              repeat: -1,
              yoyo: true,
              ease: "none",
            });
          },
        })
        .to(cores, {
          opacity: 0.55,
          scaleY: 0.7,
          duration: 0.12,
          repeat: 3,
          yoyo: true,
          ease: "sine.inOut",
        })
        .to(cores, { opacity: 1, scaleY: 1.3, duration: 0.2, ease: "power2.out" })
        .to(glow, { opacity: 1, duration: 0.3, ease: "power1.out" }, "<")
        .to(rocket, { y: BURST.climb, duration: BURST.climbDuration, ease: "power1.in" }, "<0.05")
        .call(() => {
          shake?.kill();
          cleanupBurst = burstRocket(svg, rocket, true);
        })
        .to({}, { duration: BURST.lifeMax });
    };

    launchRef.current = launch;
    launch(false);

    return () => {
      timeline?.kill();
      shake?.kill();
      cleanupBurst?.();
      busyRef.current = false;
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => launchRef.current(true)}
      aria-label="Launch the rocket again"
      className="group relative block h-full w-full cursor-pointer outline-none"
    >
      <svg
        ref={svgRef}
        viewBox="470 -30 360 640"
        overflow="visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible dark:invert"
        aria-hidden="true"
      >
        <RocketPad />
        <Rocket />
        <LaunchTower />
        <HeroDefs />
      </svg>
    </button>
  );
};

export default RocketBurstScene;
