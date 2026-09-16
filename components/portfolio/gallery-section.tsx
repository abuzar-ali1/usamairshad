"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { galleryRows, type GalleryImage } from "@/lib/gallery";
import { useGalleryMotion } from "@/hooks/use-gallery-motion";
import styles from "./gallery.module.css";

function GalleryTile({ image, progress, duplicate }: { image: GalleryImage; progress: MotionValue<number>; duplicate: boolean }) {
  const animation = useGalleryMotion(progress, image.entrance);

  return (
    <div className={styles.tileSlot} style={{ "--tile-width": `${image.width}px` } as CSSProperties}>
      <motion.div className={styles.tile} style={{ background: image.background, ...animation }}>
        <Image src={`/images/gallery/${image.file}.avif`} alt={duplicate ? "" : image.alt} fill sizes={`${image.width}px`} draggable={false} style={{ scale: image.zoom ?? 1 }} />
      </motion.div>
    </div>
  );
}

function GalleryRow({ row, index, progress }: { row: typeof galleryRows[number]; index: number; progress: MotionValue<number> }) {
  // Include the final gap in each group so the loop joins without a jump.
  const width = row.images.reduce((total, image) => total + image.width + 10, 0);

  return (
    <div className={styles.rowTrack} style={{ "--row-height": `${row.height}px`, "--row-width": `${width}px`, "--marquee-duration": `${width / 32}s` } as CSSProperties}>
      <div className={styles.row} data-direction={index % 2 === 0 ? "left" : "right"}>
        {[0, 1, 2].map((copy) => (
          <div className={styles.rowGroup} key={copy} aria-hidden={copy > 0 ? true : undefined}>
            {row.images.map((image) => <GalleryTile key={image.file} image={image} progress={progress} duplicate={copy > 0} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryLetter({ letter, index, progress }: { letter: string; index: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [index * .035, .45 + index * .035], ["110%", "0%"]);

  return <span className={styles.letterMask} aria-hidden="true"><motion.span style={reduce ? undefined : { y }}>{letter}</motion.span></span>;
}

export function GallerySection() {
  const target = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(target);
  const [revealed, setRevealed] = useState(false);
  // Every row settles before the heading reaches the upper half of the screen.
  const { scrollYProgress } = useScroll({ target, offset: ["start 90%", "start 45%"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => setRevealed(progress >= 1));

  return (
    <section id="gallery" ref={target} className={styles.gallery} aria-labelledby="gallery-title" data-running={revealed && inView && reduce === false}>
      <h2 id="gallery-title" className={styles.heading} aria-label="Gallery">
        {"Gallery".split("").map((letter, index) => <GalleryLetter key={index} letter={letter} index={index} progress={scrollYProgress} />)}
      </h2>
      <div className={styles.stage}>
        {galleryRows.map((row, index) => <GalleryRow key={index} row={row} index={index} progress={scrollYProgress} />)}
      </div>
    </section>
  );
}
