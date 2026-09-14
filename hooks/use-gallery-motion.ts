"use client";

import { useReducedMotion, useTransform, type MotionValue } from "motion/react";
import type { GalleryImage } from "@/lib/gallery";

export function useGalleryMotion(progress: MotionValue<number>, entrance: GalleryImage["entrance"]) {
  const reduce = useReducedMotion();
  const x = useTransform(progress, [0, 1], [entrance?.x ?? 0, 0]);
  const y = useTransform(progress, [0, 1], [entrance?.y ?? 0, 0]);
  const scale = useTransform(progress, [0, 1], [entrance?.scale ?? 1, 1]);
  const rotate = useTransform(progress, [0, 1], [entrance?.rotate ?? 0, 0]);
  const rotateX = useTransform(progress, [0, 1], [entrance?.rotateX ?? 0, 0]);
  const rotateY = useTransform(progress, [0, 1], [entrance?.rotateY ?? 0, 0]);
  const opacity = useTransform(progress, [0, 1], [entrance ? 0 : 1, 1]);

  return reduce ? {} : { x, y, scale, rotate, rotateX, rotateY, opacity };
}
