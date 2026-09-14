"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { galleryRows, type GalleryImage } from "@/lib/gallery";
import styles from "./gallery.module.css";

function GalleryTile({ image, progress }: { image: GalleryImage; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const entrance = image.entrance;
  const x = useTransform(progress, [0, 1], [entrance?.x ?? 0, 0]);
  const y = useTransform(progress, [0, 1], [entrance?.y ?? 0, 0]);
  const scale = useTransform(progress, [0, 1], [entrance?.scale ?? 1, 1]);
  const rotate = useTransform(progress, [0, 1], [entrance?.rotate ?? 0, 0]);
  const rotateX = useTransform(progress, [0, 1], [entrance?.rotateX ?? 0, 0]);
  const rotateY = useTransform(progress, [0, 1], [entrance?.rotateY ?? 0, 0]);
  const opacity = useTransform(progress, [0, 1], [entrance ? 0 : 1, 1]);

  return (
    <div className={styles.tileSlot} style={{ "--tile-width": `${image.width}px` } as CSSProperties}>
      <motion.div className={styles.tile} style={{ background: image.background, ...(reduce ? {} : { x, y, scale, rotate, rotateX, rotateY, opacity }) }}>
        <Image src={`/images/gallery/${image.file}.avif`} alt={image.alt} fill sizes={`${image.width}px`} draggable={false} style={{ scale: image.zoom ?? 1 }} />
      </motion.div>
    </div>
  );
}

function GalleryRow({ row, progress }: { row: typeof galleryRows[number]; progress: MotionValue<number> }) {
  const target = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Measure the stationary row, so the animated tiles never alter their own scroll trigger.
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "start 45%"] });
  const x = useTransform(progress, [0, 1], row.drift);

  return (
    <div ref={target} className={styles.rowTrack} style={{ "--row-height": `${row.height}px` } as CSSProperties}>
      <motion.div className={styles.row} style={reduce ? undefined : { x }}>
        {row.images.map((image) => <GalleryTile key={image.file} image={image} progress={scrollYProgress} />)}
      </motion.div>
    </div>
  );
}

export function GallerySection() {
  const target = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });

  return (
    <section id="gallery" ref={target} className={styles.gallery} aria-labelledby="gallery-title">
      <h2 id="gallery-title" className={styles.heading} aria-label="Gallery">
        {"Gallery".split("").map((letter, index) => (
          <span className={styles.letterMask} aria-hidden="true" key={index}>
            <motion.span initial={false} whileInView={reduce ? {} : { y: ["110%", "0%"] }} viewport={{ once: true, amount: .2 }} transition={{ duration: .8, delay: index * .06, ease: [.23, 1, .32, 1] }}>{letter}</motion.span>
          </span>
        ))}
      </h2>
      <div className={styles.stage}>
        {galleryRows.map((row, index) => <GalleryRow key={index} row={row} progress={scrollYProgress} />)}
      </div>
    </section>
  );
}
