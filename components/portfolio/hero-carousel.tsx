"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./hero.module.css";

// Inward-facing panels form a continuous cylinder. Perspective makes the
// outside cards larger while the middle sits behind the portrait.
const images = [
  { src: "/images/aura-concept.png", position: "30% 50%" },
  { src: "/images/form-concept.png", position: "70% 50%" },
  { src: "/images/aura-concept.png", position: "80% 50%" },
  { src: "/images/form-concept.png", position: "25% 50%" },
  { src: "/images/aura-concept.png", position: "50% 50%" },
  { src: "/images/form-concept.png", position: "50% 50%" },
  { src: "/images/aura-concept.png", position: "10% 50%" },
];
const panels = [...images, ...images];

export function HeroCarousel() {
  const stage = useRef<HTMLDivElement>(null);
  const active = useInView(stage);
  const reducedMotion = useReducedMotion();
  const rotation = useMotionValue(0);
  const scale = useMotionValue(0.943103);
  const transform = useMotionTemplate`translateZ(-470px) scale(${scale}) rotateY(${rotation}deg)`;

  useEffect(() => {
    if (!stage.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scale.set(Math.max(0.1, Math.min((width - 40) / 640, (height - 40) / 580)));
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [scale]);

  useAnimationFrame((_, delta) => {
    if (!active || reducedMotion !== false || document.hidden) return;
    rotation.set((rotation.get() + Math.min(delta, 50) * 0.005) % 360);
  });

  return (
    <div className={styles.carousel} aria-hidden="true">
      <div ref={stage} className={styles.carouselStage}>
        <motion.div className={styles.carouselRing} style={{ transform }}>
          {panels.map((panel, index) => (
            <div className={styles.carouselPanel} key={index} style={{ transform: `translate(-50%, -50%) rotateY(${index * 360 / panels.length}deg) translateZ(-1449.3px)` }}>
              <Image src={panel.src} alt="" fill sizes="320px" loading="eager" style={{ objectPosition: panel.position }} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
