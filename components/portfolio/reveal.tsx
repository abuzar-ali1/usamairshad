"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef, type ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduce ? {} : { y: [35, 0], opacity: [.35, 1] }} viewport={{ once: true, amount: .15 }} transition={{ duration: .85, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Letter({ letter, index, total, progress }: { letter: string; index: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [index / total * .65, index / total * .65 + .24], [.14, 1]);
  const y = useTransform(progress, [index / total * .65, index / total * .65 + .24], [28, 0]);
  const reduce = useReducedMotion();
  return <motion.span aria-hidden="true" style={reduce ? {} : { opacity, y }}>{letter === " " ? "\u00a0" : letter}</motion.span>;
}

export function ScrollHeading({ children, className = "" }: { children: string; className?: string }) {
  const target = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start 95%", "end 40%"] });
  const words = children.split(" ");
  return <h2 className={`scroll-heading ${className}`} ref={target} aria-label={children}>{words.map((word, wordIndex) => {
    const offset = words.slice(0, wordIndex).join(" ").length + (wordIndex ? 1 : 0);
    return <Fragment key={`${word}-${wordIndex}`}>{wordIndex > 0 && " "}<span className="heading-word">{word.split("").map((letter, index) => <Letter key={index} letter={letter} index={offset + index} total={children.length} progress={scrollYProgress} />)}</span></Fragment>;
  })}</h2>;
}
