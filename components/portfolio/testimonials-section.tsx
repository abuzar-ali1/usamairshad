"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { featuredTestimonials } from "@/lib/client-feedback";
import { Reveal } from "./reveal";
import styles from "./testimonials.module.css";

type Testimonial = (typeof featuredTestimonials)[number];

function Quote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className={styles.figure}>
      <div className={styles.quoteMeta}>
        <span className={styles.sampleBadge}>Sample testimonial</span>
        <span className={styles.discipline}>{testimonial.discipline}</span>
      </div>
      <blockquote className={styles.quote}>
        <p>“{testimonial.quote}”</p>
      </blockquote>
      <figcaption className={styles.author}>
        <span className={styles.avatar} aria-hidden="true">{testimonial.initials}</span>
        <span className={styles.authorDetails}>
          <span className={styles.authorName}>{testimonial.name}</span>
          <span className={styles.authorRole}>{testimonial.role}</span>
        </span>
        <span className={styles.authorMark} aria-hidden="true">✳</span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [{ index, direction }, setSelection] = useState({ index: 0, direction: 1 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const testimonial = featuredTestimonials[index];
  const total = featuredTestimonials.length;

  function step(offset: number) {
    setSelection((current) => ({ index: (current.index + offset + total) % total, direction: offset }));
  }

  function select(nextIndex: number) {
    if (nextIndex === index) return;
    setSelection({ index: nextIndex, direction: nextIndex > index ? 1 : -1 });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0);
    } else if (event.key === "End") {
      event.preventDefault();
      select(total - 1);
    }
  }

  return (
    <section ref={sectionRef} id="testimonials" className={styles.section} aria-labelledby="testimonials-heading">
      <motion.div className={styles.glow} aria-hidden="true" style={reduceMotion ? undefined : { y: glowY }} />
      <div className={styles.inner}>
        <div className={styles.topline} aria-hidden="true"><span>Creative partnerships</span><span>A shared perspective</span></div>
        <div className={styles.layout}>
          <div className={styles.introduction}>
            <Reveal>
              <p className={styles.kicker}><span aria-hidden="true">●</span> Testimonials</p>
              <h2 id="testimonials-heading">Good work.<br /><em>Better together.</em></h2>
              <p className={styles.description}>Thoughtful design starts with a conversation. The best part is what we build together.</p>
            </Reveal>
            <div className={styles.quoteSymbol} aria-hidden="true">
              <motion.div className={styles.orbit} style={reduceMotion ? undefined : { rotate: orbitRotate }} />
              <span>“</span>
              <span className={styles.orbitPoint} />
            </div>
          </div>
          <div
            className={styles.carousel}
            role="group"
            aria-roledescription="carousel"
            aria-label="Featured testimonials"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.quoteStage}>
              <div className={styles.sizer} aria-hidden="true">
                {featuredTestimonials.map((item) => <Quote key={item.id} testimonial={item} />)}
              </div>
              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.div
                  key={testimonial.id}
                  className={styles.slide}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}`}
                  custom={direction}
                  variants={{
                    enter: (travel: number) => ({ opacity: 0, x: reduceMotion ? 0 : travel * 28 }),
                    center: { opacity: 1, x: 0 },
                    exit: (travel: number) => ({ opacity: 0, x: reduceMotion ? 0 : travel * -20 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduceMotion ? 0 : .3, ease: [.22, 1, .36, 1] }}
                >
                  <Quote testimonial={testimonial} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className={styles.controls}>
              <span className={styles.counter} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}</span>
              <div className={styles.indicators} role="group" aria-label="Choose a testimonial">
                {featuredTestimonials.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.indicator}
                    aria-label={`Show testimonial from ${item.name}`}
                    aria-pressed={index === itemIndex}
                    onClick={() => select(itemIndex)}
                  ><span /></button>
                ))}
              </div>
              <div className={styles.arrows}>
                <button className={styles.arrow} type="button" onClick={() => step(-1)} aria-label="Previous testimonial"><ArrowLeft size={19} strokeWidth={1.5} aria-hidden="true" /></button>
                <button className={styles.arrow} type="button" onClick={() => step(1)} aria-label="Next testimonial"><ArrowRight size={19} strokeWidth={1.5} aria-hidden="true" /></button>
              </div>
            </div>
            <p className={styles.screenReaderOnly} aria-live="polite" aria-atomic="true">Testimonial {index + 1} of {total}: {testimonial.name}, {testimonial.discipline}.</p>
          </div>
        </div>
        <p className={styles.sampleNote}>Illustrative feedback — replace with approved client quotes.</p>
      </div>
    </section>
  );
}
