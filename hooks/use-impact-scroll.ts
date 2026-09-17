"use client";

import { useRef } from "react";
import { cubicBezier, useReducedMotion, useScroll, useTransform } from "motion/react";

export function useImpactScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Scale only the backdrop: the heading and signature stay still as it contracts.
  const backdropScale = useTransform(scrollYProgress, [.04, .46], [10, 1], {
    ease: cubicBezier(.16, 1, .3, 1),
  });

  return { sectionRef, scrollYProgress, backdropScale, reducedMotion };
}
