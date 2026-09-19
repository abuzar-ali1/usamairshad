"use client";

import { useRef } from "react";
import { ArrowDownRight, Asterisk, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { clientReviews } from "@/lib/client-feedback";
import { Reveal } from "./reveal";
import styles from "./client-reviews.module.css";

function ReviewCard({ review, index }: { review: typeof clientReviews[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 55%"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, (value) => .3 + value * .7);

  return (
    <motion.article ref={ref} className={styles.review} style={reduce ? undefined : { y, opacity }} aria-labelledby={`${review.id}-title`}>
      <div className={styles.cardTop}>
        <span className={styles.discipline}>{review.discipline}</span>
        <span className={styles.number} aria-hidden="true">0{index + 1}</span>
      </div>
      <h3 id={`${review.id}-title`}>{review.highlight}</h3>
      <figure className={styles.feedback}>
        <blockquote>“{review.quote}”</blockquote>
        <figcaption className={styles.author}>
          <span className={styles.avatar} aria-hidden="true">{review.initials}</span>
          <span><strong>{review.name}</strong><span>{review.role}</span></span>
          <Asterisk className={styles.star} size={32} strokeWidth={1} aria-hidden="true" />
        </figcaption>
      </figure>
    </motion.article>
  );
}

export function ClientReviewsSection() {
  return (
    <section id="client-reviews" className={styles.section} aria-labelledby="reviews-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <Reveal>
            <p className={styles.kicker}><span aria-hidden="true">●</span> Client reviews</p>
            <h2 id="reviews-heading">Good work.<br /><em>Better together.</em></h2>
            <p className={styles.description}>A thoughtful process. An open conversation. Design that feels like you, at every touchpoint.</p>
            <div className={styles.scrollCue}><ArrowDownRight size={34} strokeWidth={1} aria-hidden="true" /><span>A few words on<br />the creative experience</span></div>
            <p className={styles.sampleNote}>Sample reviews shown for layout.<br />Replace with approved client feedback.</p>
          </Reveal>
        </div>
        <div className={styles.reviews}>
          {clientReviews.map((review, index) => <ReviewCard key={review.id} review={review} index={index} />)}
          <Reveal className={styles.invitation}>
            <span>Your story could be next.</span>
            <a href="#contact">Let’s create together <ArrowUpRight size={18} aria-hidden="true" /></a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
