"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig, useReducedMotion } from "motion/react";
import "lenis/dist/lenis.css";

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion !== false) return;
    // Native touch scrolling stays intact. Lenis only smooths wheel/anchor input.
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false, anchors: { offset: -90 } });
    let frame = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, [reducedMotion]);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
