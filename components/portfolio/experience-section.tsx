"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { profile, services } from "@/lib/portfolio";
import { Reveal, ScrollHeading } from "./reveal";
import { ArrowUpRight } from "lucide-react";

function Count({ value, label }: { value: number; label: string }) {
  const target = useRef<HTMLDivElement>(null);
  const inView = useInView(target, { once: true, amount: .6 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(value);
  useEffect(() => {
    if (!inView || reduce) return;
    const control = animate(0, value, { duration: 1.8, ease: "easeOut", onUpdate: (v) => setCount(Math.round(v)) });
    return () => control.stop();
  }, [inView, value, reduce]);
  return <div className="stat" ref={target}><strong><span className="sr-only">{value} plus</span><span aria-hidden="true">{count}+</span></strong><span>{label}</span></div>;
}

export function ExperienceSection() {
  return (
    <section id="experience" className="experience-section section-shell" aria-label="Experience and design expertise">
      <div className="journey-heading"><p className="eyebrow">Learning through every brief</p><ScrollHeading className="section-title">A journey in design.</ScrollHeading></div>
      <div className="stats-grid"><Count value={profile.years} label="Years in design" /><Count value={profile.brands} label="Brands shaped" /><div className="stat stat-text"><strong>Adobe CC <span>+ AI</span></strong><span>Craft meets possibility</span></div></div>
      <div id="services" className="services-list">
        {services.map((service) => (
          <Reveal key={service.number}>
            <details className="service-row">
              <summary><span className="service-number">{service.number}</span><h3>{service.title}</h3><ArrowUpRight size={30} /></summary>
              <div className="service-body"><p>{service.description}</p><div className="tag-list">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
