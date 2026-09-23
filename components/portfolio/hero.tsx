"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { easeOut, motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useHeroIntro } from "@/hooks/use-hero-intro";
import { HeroCarousel } from "./hero-carousel";
import styles from "./hero.module.css";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const { introProgress, reducedMotion } = useHeroIntro(section);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const portraitOpacity = useTransform(introProgress, [1, 2.1], [0, 1], { ease: easeOut });
  const portraitEntranceY = useTransform(introProgress, [1, 2.1], [24, 0], { ease: easeOut });
  const titleOpacity = useTransform(introProgress, [1.4, 2.2], [0, 1], { ease: easeOut });
  const titleY = useTransform(introProgress, [1.4, 2.2], [20, 0], { ease: easeOut });
  const quoteOpacity = useTransform(introProgress, [1.6, 2.4], [0, 1], { ease: easeOut });
  const quoteY = useTransform(introProgress, [1.6, 2.4], [16, 0], { ease: easeOut });

  return (
    <section id="home" className={styles.hero} ref={section} aria-labelledby="hero-title">
      <HeroCarousel introProgress={introProgress} />
      <div className={styles.container}>
        <motion.div className={styles.portrait} style={{ y: reducedMotion ? 0 : portraitY }}>
          <motion.div className={styles.portraitReveal} style={{ opacity: portraitOpacity, y: reducedMotion ? 0 : portraitEntranceY }}>
            <Image src="/images/usama-portrait.png" alt="Usama Irshad, senior brand and motion designer" fill sizes="(max-width: 809px) 130vw, (max-width: 1199px) 640px, 800px" preload className={styles.portraitImage} />
          </motion.div>
        </motion.div>
        <div className={styles.content}>
          <motion.div className={styles.title} style={{ opacity: titleOpacity, y: reducedMotion ? 0 : titleY }}>
            <p className={styles.eyebrow}>Hi, I’m Usama Irshad</p>
            <h1 id="hero-title">Brand &amp;<br />Motion Designer</h1>
            <a href="#contact" className={styles.action}>
              <span className={styles.actionIcon}><ArrowRight size={18} aria-hidden="true" /></span>
              <span>Start a project</span>
            </a>
          </motion.div>
          <motion.div className={styles.quote} style={{ opacity: quoteOpacity, y: reducedMotion ? 0 : quoteY }}>
            <p>“Where others add visuals,<br />I create <span>meaning.</span>”</p>
            <Image src="/images/usama-signature.png" alt="Usama Irshad’s signature" width={1041} height={438} sizes="240px" className={styles.signature} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
