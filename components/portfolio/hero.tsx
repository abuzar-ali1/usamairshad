"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { HeroCarousel } from "./hero-carousel";
import styles from "./hero.module.css";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section id="home" className={styles.hero} ref={section} aria-labelledby="hero-title">
      <HeroCarousel />
      <div className={styles.container}>
        <motion.div className={styles.portrait} style={reducedMotion ? {} : { y: portraitY }}>
          <Image src="/images/usama-portrait.png" alt="Usama Irshad, senior brand and motion designer" fill sizes="(max-width: 809px) 130vw, (max-width: 1199px) 640px, 800px" preload className={styles.portraitImage} />
        </motion.div>
        <div className={styles.content}>
          <div className={styles.title}>
            <p className={styles.eyebrow}>Hi, I’m Usama Irshad</p>
            <h1 id="hero-title">Brand &amp;<br />Motion Designer</h1>
            <a href="#contact" className={styles.action}>
              <span className={styles.actionIcon}><ArrowRight size={18} aria-hidden="true" /></span>
              <span>Start a project</span>
            </a>
          </div>
          <div className={styles.quote}>
            <p>“Where others add visuals,<br />I create <span>meaning.</span>”</p>
            <Image src="/images/usama-signature.png" alt="Usama Irshad’s signature" width={1041} height={438} sizes="240px" className={styles.signature} />
          </div>
        </div>
      </div>
    </section>
  );
}
