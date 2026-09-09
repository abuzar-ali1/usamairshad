"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { projects } from "@/lib/portfolio";
import { Reveal, ScrollHeading } from "./reveal";

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const card = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: card, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-22, 22]);
  return (
    <motion.article ref={card} className={`project-card project-${index}`} whileHover={reduce ? {} : { y: -7 }} transition={{ duration: .4 }}>
      <button className="project-image-button" onClick={() => dialog.current?.showModal()} aria-label={`View ${project.title} demo concept`}>
        <motion.div className="project-image" style={reduce ? {} : { y }}><Image src={project.image} alt={project.alt} fill sizes="(max-width: 700px) 90vw, 45vw" /></motion.div>
        <span className="project-category">{project.category}</span>
        <span className="project-hover">Explore concept <ArrowUpRight size={20} /></span>
      </button>
      <div className="project-info"><div><h3>{project.title}</h3><span>Demo concept · Not client work</span></div><button onClick={() => dialog.current?.showModal()} className="square-button" aria-label={`Read about ${project.title}`}><ArrowUpRight size={23} /></button></div>
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
    <section id="work" className="work-section section-shell" aria-label="Selected design explorations">
      <div className="section-kicker"><p className="eyebrow">A sense of the possibilities</p><span>01 — 02</span></div>
      <ScrollHeading className="display-heading">Projects</ScrollHeading>
      <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
      <Reveal className="work-note"><span className="tiny-dot" /><p>Showcase previews. Original client projects will take their place.</p></Reveal>
    </section>
  );
}
