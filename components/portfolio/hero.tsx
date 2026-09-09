"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const frames = [
  { image: "/images/form-concept.png", label: "Editorial" },
  { image: "/images/aura-concept.png", label: "Packaging" },
  { image: "/images/form-concept.png", label: "Art direction" },
  { image: "/images/aura-concept.png", label: "Brand identity" },
];

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const ribbonX = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const ribbonRotate = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  return (
    <section id="home" className="hero" ref={section} aria-labelledby="hero-title">
      <div className="hero-halo" aria-hidden="true" />
      <motion.div className="hero-ribbon" aria-hidden="true" style={reducedMotion ? {} : { x: ribbonX, rotate: ribbonRotate }}>
        {frames.map((frame, index) => (
          <div className={`ribbon-frame ribbon-frame-${index + 1}`} key={frame.label}>
            <Image src={frame.image} alt="" fill sizes="32vw" /><span>{frame.label}</span>
          </div>
        ))}
      </motion.div>
      <motion.div className="hero-portrait" style={reducedMotion ? {} : { y: portraitY }}>
        <Image src="/images/usama-portrait.png" alt="Usama Irshad, senior brand and motion designer" fill sizes="(max-width: 600px) 123vw, (max-width: 950px) 85vw, 760px" preload className="portrait-image" />
      </motion.div>
      <motion.div className="hero-copy" style={reducedMotion ? {} : { y: copyY }}>
        <p className="eyebrow">Hi, I’m Usama Irshad</p>
        <h1 id="hero-title">Brand &amp;<br /><em>Motion</em> Designer</h1>
        <a href="#work" className="pill-button"><span className="button-icon"><ArrowUpRight size={19} /></span>Explore my work</a>
      </motion.div>
      <div className="hero-quote">
        <p>“Where others add visuals,<br />I create <em>meaning.</em>”</p>
        <span className="signature">Usama Irshad</span>
        <span className="hero-role">Senior Brand &amp; Motion Designer</span>
      </div>
      <a href="#intro" className="scroll-cue"><ArrowDown size={15} /><span>Scroll to discover</span></a>
      <span className="hero-index" aria-hidden="true">PORTFOLIO — 2026</span>
    </section>
  );
}
