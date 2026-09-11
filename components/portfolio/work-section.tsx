"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { projects } from "@/lib/portfolio";
import { ScrollHeading } from "./reveal";
import styles from "./showcase.module.css";

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const card = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: card, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 220, damping: 25 });
  const y = useSpring(pointerY, { stiffness: 220, damping: 25 });
  function movePreview(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.min(rect.width - 158, Math.max(10, event.clientX - rect.left + 16)));
    pointerY.set(Math.min(rect.height - 50, Math.max(10, event.clientY - rect.top + 16)));
  }
  return (
    <motion.article ref={card} className={styles.projectCard} initial={false}
      whileInView={reduce ? {} : { y: [55, 0], opacity: [.5, 1] }}
      viewport={{ once: true, amount: .08 }} transition={{ duration: .9, delay: index % 2 * .1, ease: [.22, 1, .36, 1] }}>
      <button className={styles.projectImageButton} onPointerMove={movePreview} onClick={() => dialog.current?.showModal()} aria-label={`View ${project.title} demo concept`}>
        <motion.div className={styles.projectImage} style={reduce ? {} : { y: imageY }}><Image src={project.image} alt={project.alt} fill sizes="(max-width: 700px) 94vw, 46vw" /></motion.div>
        <span className={styles.projectCategory}>{project.category}</span>
        <motion.span aria-hidden="true" className={styles.projectCursor} style={reduce ? { x: pointerX, y: pointerY } : { x, y }}>Click to preview <ArrowUpRight size={16} /></motion.span>
      </button>
      <div className={styles.projectInfo}>
        <div><h3>{project.title}</h3><span>Demo concept</span></div>
        <button onClick={() => dialog.current?.showModal()} className={styles.viewProject} aria-label={`View ${project.title} project`}>View Project <ArrowUpRight size={23} /></button>
      </div>
      <dialog ref={dialog} className="project-dialog" aria-labelledby={`${project.id}-title`} aria-describedby={`${project.id}-description`} data-lenis-prevent onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="project-dialog-content">
          <button className="dialog-close" aria-label="Close project" onClick={() => dialog.current?.close()}><X size={24} /></button>
          <div className="dialog-image"><Image src={project.image} alt={project.alt} width={1536} height={1024} sizes="90vw" /></div>
          <div className="dialog-copy"><p className="eyebrow">Illustrative portfolio concept</p><h3 id={`${project.id}-title`}>{project.title}</h3><p id={`${project.id}-description`}>{project.description}</p><div className="tag-list">{project.disciplines.map((tag) => <span key={tag}>{tag}</span>)}</div><small>This AI-generated concept demonstrates the portfolio layout. It is not presented as Usama’s commissioned work.</small></div>
        </div>
      </dialog>
    </motion.article>
  );
}

export function WorkSection() {
  return (
    <section id="work" className={styles.work} aria-label="Selected design explorations">
      <ScrollHeading className={styles.projectsHeading}>Projects</ScrollHeading>
      <div className={styles.projectGrid}>{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
      <p className={styles.workNote}>Design explorations · Demo concepts, not commissioned client work.</p>
    </section>
  );
}
