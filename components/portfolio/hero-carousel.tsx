"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
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

function smoothStep(value: number) {
  const progress = Math.max(0, Math.min(1, value));
  return progress * progress * (3 - 2 * progress);
}

export function HeroCarousel({ introProgress }: { introProgress: MotionValue<number> }) {
  const stage = useRef<HTMLDivElement>(null);
  const active = useInView(stage);
  const reducedMotion = useReducedMotion();
  const rotation = useMotionValue(0);
  const scale = useMotionValue(0.848793);
  const transform = useMotionTemplate`translateZ(-470px) scale(${scale}) rotateY(${rotation}deg)`;
  const opacity = useTransform(introProgress, [0, 0.55], [0, 1]);
  const entryY = useTransform(introProgress, [0, 0.75], [20, 0]);
  const panelScale = useTransform(introProgress, [0, 1.1], [0.68, 1], { ease: (value) => 1 - (1 - value) ** 3 });

  useEffect(() => {
    if (!stage.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scale.set(Math.max(0.1, Math.min((width - 40) / 640, (height - 40) / 580)) * 0.9);
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [scale]);

  useAnimationFrame((_, delta) => {
    if (!active || reducedMotion !== false || document.hidden) return;
    const elapsed = introProgress.get();
    if (elapsed === 0) return;
    const speed = elapsed < 0.65
      ? 5 + 95 * smoothStep(elapsed / 0.65)
      : 100 - 95 * smoothStep((elapsed - 1.05) / 2.15);
    rotation.set((rotation.get() + Math.min(delta, 50) * speed / 1000) % 360);
  });

  return (
    <motion.div className={styles.carousel} aria-hidden="true" style={{ opacity, y: reducedMotion ? 0 : entryY }}>
      <div ref={stage} className={styles.carouselStage}>
        <motion.div className={styles.carouselRing} style={{ transform }}>
          {panels.map((panel, index) => (
            <div className={styles.carouselPanel} key={index} style={{ transform: `translate(-50%, -50%) rotateY(${index * 360 / panels.length}deg) translateZ(-1449.3px)` }}>
              <motion.div style={{ position: "absolute", inset: 0, scale: reducedMotion ? 1 : panelScale }}>
                <Image src={panel.src} alt="" fill sizes="320px" loading="eager" style={{ objectPosition: panel.position }} />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
