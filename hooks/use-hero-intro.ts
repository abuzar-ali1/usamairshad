"use client";

import { useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, type RefObject } from "react";

const INTRO_DURATION = 3.2;
const HERO_IMAGE_NAMES = ["aura-concept.png", "form-concept.png", "usama-portrait.png"];

export function useHeroIntro(section: RefObject<HTMLElement | null>) {
  const introProgress = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const visible = useInView(section);
  const ready = useRef(false);

  useEffect(() => {
    ready.current = false;
    introProgress.set(reducedMotion ? INTRO_DURATION : 0);
    if (reducedMotion !== false || !section.current) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const finish = () => {
      if (cancelled) return;
      window.clearTimeout(timeout);
      cleanups.forEach((cleanup) => cleanup());
      ready.current = true;
    };

    // Use the actual rendered images so cold and cached reloads share one timeline.
    // A failed or slow image must never leave the hero hidden indefinitely.
    const timeout = window.setTimeout(finish, 1500);
    const images = new Map<string, HTMLImageElement>();
    section.current.querySelectorAll("img").forEach((image) => {
      if (HERO_IMAGE_NAMES.some((name) => image.src.includes(name))) {
        images.set(image.currentSrc || image.src, image);
      }
    });

    void Promise.all(
      [...images.values()].map((image) => new Promise<void>((resolve) => {
        const decode = () => {
          void image.decode().catch(() => undefined).then(resolve);
        };
        const fail = () => resolve();
        if (image.complete) {
          decode();
          return;
        }
        image.addEventListener("load", decode, { once: true });
        image.addEventListener("error", fail, { once: true });
        cleanups.push(() => {
          image.removeEventListener("load", decode);
          image.removeEventListener("error", fail);
        });
      })),
    ).then(finish);

    return () => {
      cancelled = true;
      ready.current = false;
      window.clearTimeout(timeout);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [introProgress, reducedMotion, section]);

  useAnimationFrame((_, delta) => {
    if (!ready.current || !visible || document.hidden || introProgress.get() >= INTRO_DURATION) return;
    introProgress.set(Math.min(INTRO_DURATION, introProgress.get() + Math.min(delta, 50) / 1000));
  });

  return { introProgress, reducedMotion };
}
