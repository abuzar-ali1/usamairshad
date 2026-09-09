"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal, ScrollHeading } from "./reveal";

export function AboutSection() {
  const target = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  return (
    <section id="about" ref={target} className="about-section section-shell" aria-label="About Usama">
      <div className="section-kicker"><p className="eyebrow">The person behind the pixels</p><span>Lahore, PK</span></div>
      <ScrollHeading className="display-heading">About me</ScrollHeading>
      <div className="about-grid">
        <div className="about-portrait"><motion.div className="about-image" style={reduce ? {} : { y: imageY }}><Image src="/images/usama-portrait.png" alt="Usama Irshad in his studio portrait" fill sizes="(max-width: 700px) 90vw, 40vw" /></motion.div><span className="portrait-caption">Usama Irshad — Designer &amp; visual thinker</span></div>
        <Reveal className="about-copy"><p className="eyebrow">Hello, I’m Usama.</p><h3>More than a visual.<br /><em>A point of view.</em></h3><p>I build brand identities and packaging that make products sell. My work brings together strategy, craft, and motion to give each brand a clear, distinctive voice.</p><p>Based in Lahore and open to remote projects, I use Adobe Creative Cloud and AI-assisted workflows to explore ideas and bring them into focus.</p><div className="about-position"><span>Senior Brand &amp; Motion Designer</span><strong>Areeb Areel Corporation</strong></div><div className="tag-list"><span>Brand identity</span><span>Packaging</span><span>Motion</span><span>Adobe CC + AI</span></div></Reveal>
      </div>
    </section>
  );
}
