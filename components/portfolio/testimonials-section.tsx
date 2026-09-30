"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { clientReviews, featuredTestimonials } from "@/lib/client-feedback";
import styles from "./testimonials.module.css";

const testimonials = [...clientReviews, ...featuredTestimonials];
type Testimonial = (typeof testimonials)[number];

function ReviewCard({ review, index }: { review: Testimonial; index: number }) {
  return (
    <figure className={styles.card}>
      <blockquote className={styles.quote}>{review.quote}</blockquote>
      <figcaption className={styles.author}>
        <Image
          className={styles.avatar}
          src={`/images/testimonials/avatar-${String(index + 1).padStart(2, "0")}.png`}
          alt=""
          width={48}
          height={48}
          sizes="48px"
        />
        <span className={styles.name}>{review.name}</span>
        <span className={styles.role}>{review.role.split(" · ")[0]}</span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: .1 });
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    <section ref={sectionRef} id="testimonials" className={styles.section} aria-labelledby="testimonials-heading">
      <span id="client-reviews" className={styles.anchor} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <h2 id="testimonials-heading" className={styles.heading} aria-label="What Clients Say">
        {["What", "Clients", "Say"].map((word, index) => (
          <span key={word} className={styles.wordMask} aria-hidden="true">
            <motion.span
              initial={false}
              whileInView={reducedMotion ? {} : { y: ["105%", "0%"], opacity: [.2, 1] }}
              viewport={{ once: true, amount: .4 }}
              transition={{ duration: .7, delay: index * .07, ease: [.22, 1, .36, 1] }}
            >{word}</motion.span>
          </span>
        ))}
      </h2>
      <div
        className={styles.marquee}
        role="region"
        aria-label="Client reviews"
        aria-describedby="reviews-note"
        tabIndex={0}
        data-running={inView && !paused}
        data-lenis-prevent-horizontal
      >
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
              {testimonials.map((review, index) => <ReviewCard key={review.id} review={review} index={index} />)}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <p id="reviews-note">Sample client feedback · For illustration</p>
        <button
          className={styles.pause}
          type="button"
          aria-label={paused ? "Resume scrolling reviews" : "Pause scrolling reviews"}
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          <span>{paused ? "Resume" : "Pause"}</span>
        </button>
      </div>
    </section>
  );
}
