"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2 } from "lucide-react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { useTeamCarousel } from "@/hooks/use-team-carousel";
import { Reveal } from "./reveal";
import styles from "./team.module.css";

const members = [
  {
    name: "Ayesha Khan",
    role: "Graphic Designer",
    tag: "Graphic Design",
    description: "Thoughtful identities and packaging, with an eye for the smallest details.",
    initials: "AK",
    sample: true,
    visual: "identity",
  },
  {
    name: "Usama Irshad",
    role: "Senior Brand & Motion Designer",
    tag: "Brand & Motion",
    description: "Bringing strategy, identity, and motion together to make brands memorable.",
    image: "/images/usama-portrait.png",
    initials: "UI",
    sample: false,
    visual: "direction",
  },
  {
    name: "Hamza Ali",
    role: "Graphic Designer",
    tag: "Graphic Design",
    description: "Expressive digital design, bold compositions, and visuals made to connect.",
    initials: "HA",
    sample: true,
    visual: "digital",
  },
  {
    name: "Abuzar Ali",
    role: "Full Stack Developer",
    tag: "Full Stack Developer",
    description: "Turning creative ideas into responsive websites and seamless digital experiences.",
    initials: "AA",
    sample: false,
    visual: "development",
  },
];

export function TeamSection() {
  const reduceMotion = useReducedMotion();
  const didDrag = useRef(false);
  const {
    activeIndex, selectMember, goPrevious, goNext,
    canGoPrevious, canGoNext, onKeyDown,
  } = useTeamCarousel(members.length, 1);

  function finishDrag(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (Math.abs(info.offset.x) < 45 && Math.abs(info.velocity.x) < 350) return;
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x) * 1.5) return;
    const movement = Math.abs(info.offset.x) >= 45 ? info.offset.x : info.velocity.x;
    if (movement < 0) goNext();
    else goPrevious();
  }

  return (
    <section id="team" className={styles.section} aria-labelledby="team-heading">
      <div className={styles.inner}>
        <Reveal className={styles.header}>
          <div>
            <p className={styles.kicker}><span aria-hidden="true">●</span> The team</p>
            <h2 id="team-heading">Good people.<br /><em>Great design.</em></h2>
          </div>
          <p className={styles.introduction}>Brand thinking, visual craft, motion, and code.<br />Different perspectives. One shared eye for detail.</p>
        </Reveal>
      </div>

      <div
        className={styles.carousel}
        role="region"
        aria-roledescription="carousel"
        aria-label="Meet the team"
        aria-describedby="team-instructions"
        tabIndex={0}
        onKeyDown={(event) => {
          onKeyDown(event);
          if (event.defaultPrevented && (event.target as HTMLElement).closest("article")) {
            event.currentTarget.focus({ preventScroll: true });
          }
        }}
      >
        <p id="team-instructions" className={styles.srOnly}>Swipe, select a card, or use the arrow keys to explore the team.</p>
        <div className={styles.viewport}>
          <motion.div
            className={styles.positioner}
            initial={false}
            animate={{ x: `calc(50% - var(--card-width) / 2 - ${activeIndex} * (var(--card-width) + var(--card-gap)))` }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 30 }}
          >
            <motion.div
              className={styles.track}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.85}
              dragMomentum={false}
              dragTransition={{ bounceStiffness: 350, bounceDamping: 35 }}
              onPointerDownCapture={() => { didDrag.current = false; }}
              onDragStart={() => { didDrag.current = true; }}
              onDragEnd={finishDrag}
              onClickCapture={(event) => {
                if (!didDrag.current || event.detail === 0) return;
                didDrag.current = false;
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              {members.map((member, index) => {
                const isActive = index === activeIndex;
                return (
                  <article
                    key={member.name}
                    className={styles.card}
                    data-active={isActive}
                    data-visual={member.visual}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${members.length}: ${member.name}`}
                  >
                    <div className={styles.portrait}>
                      <div className={styles.artwork}>
                        <div className={styles.orbit} aria-hidden="true" />
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={`${member.name}, ${member.role}`}
                            fill
                            sizes="360px"
                            draggable={false}
                            className={styles.photo}
                          />
                        ) : (
                          <div className={styles.placeholder} aria-hidden="true">
                            {member.visual === "development" ? <Code2 className={styles.codeIcon} strokeWidth={0.6} /> : (
                              <svg viewBox="0 0 300 440" fill="none">
                                <circle cx="150" cy="137" r="65" />
                                <path d="M18 440v-83c0-86 52-135 132-135s132 49 132 135v83" />
                              </svg>
                            )}
                            <span className={styles.initials}>{member.initials}</span>
                          </div>
                        )}
                        <span className={styles.imageRole}>{member.role}</span>
                      </div>
                      {member.sample && <span className={styles.sampleLabel}>Sample profile</span>}
                    </div>

                    <button
                      type="button"
                      className={styles.selectCard}
                      aria-label={`Show ${member.name}, ${member.role}`}
                      aria-expanded={isActive}
                      aria-controls={`team-profile-${index}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => selectMember(index)}
                    />

                    <div id={`team-profile-${index}`} className={styles.details} aria-hidden={!isActive}>
                      <h3>{member.name}</h3>
                      <p>{member.description}</p>
                      <div className={styles.cardFooter}>
                        <span className={styles.role}>{member.tag}</span>
                        <a href="#contact" tabIndex={isActive ? 0 : -1} aria-label={`Let’s talk with ${member.name}`}>
                          Let’s talk <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        <button type="button" className={`${styles.arrow} ${styles.previous}`} onClick={goPrevious} disabled={!canGoPrevious} aria-label="Previous team member">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={goNext} disabled={!canGoNext} aria-label="Next team member">
          <ArrowRight size={20} aria-hidden="true" />
        </button>

        <div className={styles.navigation}>
          <span className={styles.hint}>Drag to explore <ArrowRight size={14} aria-hidden="true" /></span>
          <div className={styles.dots} role="group" aria-label="Choose a team member">
            {members.map((member, index) => (
              <button key={member.name} type="button" onClick={() => selectMember(index)} aria-label={`Go to ${member.name}`} aria-current={index === activeIndex ? "true" : undefined} />
            ))}
          </div>
          <span className={styles.counter} aria-hidden="true">0{activeIndex + 1} <span>/ 0{members.length}</span></span>
        </div>
        <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{members[activeIndex].name}, {members[activeIndex].role}. {activeIndex + 1} of {members.length}.</p>
      </div>

      <div className={styles.inner}>
        <Reveal className={styles.footer}>
          <p>Have something in mind? Let’s give it a point of view.</p>
          <a href="#contact">Let’s work together <ArrowUpRight size={19} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  );
}
