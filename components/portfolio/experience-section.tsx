"use client";

import Image from "next/image";
import { animate, AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { profile, projects, services } from "@/lib/portfolio";
import { Reveal, ScrollHeading } from "./reveal";
import styles from "./showcase.module.css";

function Count({ value, label, plus = true }: { value: number; label: string; plus?: boolean }) {
  const target = useRef<HTMLDivElement>(null);
  const inView = useInView(target, { once: true, amount: .6 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(value);
  useEffect(() => {
    if (!inView || reduce) return;
    const control = animate(0, value, { duration: 1.8, ease: "easeOut", onUpdate: (v) => setCount(Math.round(v)) });
    return () => control.stop();
  }, [inView, value, reduce]);
  return <div className={styles.stat} ref={target}><strong><span className="sr-only">{value}{plus ? " plus" : ""}</span><span aria-hidden="true">{count}{plus ? "+" : ""}</span></strong><span>{label}</span></div>;
}

// Images are illustrative concepts, paired with the relevant discipline.
const serviceProjects = [projects[3], projects[0], projects[2], projects[1]];

function Services() {
  const list = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const active = hovered ?? focused;
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 150, damping: 22, mass: .7 });
  const y = useSpring(pointerY, { stiffness: 150, damping: 22, mass: .7 });

  useEffect(() => {
    const dismiss = () => setHovered(null);
    window.addEventListener("scroll", dismiss, { passive: true });
    return () => window.removeEventListener("scroll", dismiss);
  }, []);

  function positionPreview(clientX: number, clientY: number) {
    if (!list.current) return;
    const rect = list.current.getBoundingClientRect();
    const width = Math.min(380, rect.width * .38);
    pointerX.set(Math.max(0, Math.min(rect.width - width, clientX - rect.left + 80)));
    pointerY.set(Math.max(0, Math.min(rect.height - width * 2 / 3, clientY - rect.top - 100)));
  }
  function follow(event: PointerEvent<HTMLElement>, index: number) {
    if (event.pointerType === "touch" || !window.matchMedia("(hover: hover)").matches) return;
    positionPreview(event.clientX, event.clientY);
    setHovered(index);
  }

  return (
    <div id="services" className={styles.services} ref={list} onPointerLeave={() => setHovered(null)}>
      {services.map((service, index) => (
        <article className={styles.serviceRow} key={service.number} data-active={active === index || expanded === index}
          onPointerEnter={(event) => follow(event, index)} onPointerMove={(event) => follow(event, index)}>
          <h3 className={styles.serviceTitle}>
            <button aria-describedby={`service-${index}-description`} aria-expanded={active === index || expanded === index} aria-controls={`service-${index}-details`}
              onFocus={(event) => {
                if (!event.currentTarget.matches(":focus-visible")) return;
                const rect = event.currentTarget.getBoundingClientRect();
                positionPreview(rect.right, rect.top + 60);
                setFocused(index);
              }}
              onBlur={() => setFocused(null)}
              onKeyDown={(event) => { if (event.key === "Escape") { setFocused(null); setHovered(null); setExpanded(null); } }}
              onClick={() => setExpanded(expanded === index ? null : index)}>
              <span>{service.title}</span><sup aria-hidden="true">{service.number}</sup>
              <small className={styles.tapHint}>{expanded === index ? "Close preview −" : "View preview +"}</small>
            </button>
          </h3>
          <div className={styles.serviceCopy}>
            <p id={`service-${index}-description`}>{service.description}</p>
            <div id={`service-${index}-details`} className={styles.serviceDetails} inert={!(active === index || expanded === index)}>
              <div><div className={styles.serviceTags}>{service.tags.map((tag) => <span key={tag}># {tag}</span>)}</div></div>
            </div>
            {expanded === index && <div className={styles.touchPreview}><Image src={serviceProjects[index].image} alt={serviceProjects[index].alt} width={768} height={512} sizes="90vw" /><span>Illustrative demo concept</span></div>}
          </div>
        </article>
      ))}
      <motion.div className={styles.servicePreview} aria-hidden="true" style={reduce ? { x: pointerX, y: pointerY } : { x, y }}>
        <AnimatePresence>
          {active !== null && <motion.div className={styles.previewArtwork} key={active} initial={{ opacity: 0, scale: reduce ? 1 : .9, rotate: reduce ? 0 : -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: reduce ? 1 : .95 }} transition={{ duration: .25 }}>
            <Image src={serviceProjects[active].image} alt="" fill sizes="380px" /><span>Demo concept</span>
          </motion.div>}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className={styles.experience} aria-label="Experience and design expertise">
      <div className={styles.journeyHeading}><Reveal><p>Learning through every brief</p></Reveal><ScrollHeading className={styles.journeyTitle}>{`My ${profile.years}-year journey`}</ScrollHeading></div>
      <div className={styles.stats}><Count value={profile.brands} label="Brands shaped" /><Count value={profile.years} label="Years in design" /><Count value={services.length} label="Creative disciplines" plus={false} /><div className={`${styles.stat} ${styles.toolkitStat}`}><strong>CC <span>+ AI</span></strong><span>Creative toolkit</span></div></div>
      <Services />
    </section>
  );
}
