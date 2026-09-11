"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, CircleUserRound, FileText, Link, Zap } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import styles from "./showcase.module.css";

const links = [
  { id: "home", label: "Home", Icon: CircleUserRound },
  { id: "work", label: "Work", Icon: BriefcaseBusiness },
  { id: "services", label: "Skills", Icon: Zap },
  { id: "experience", label: "Experience", Icon: FileText },
  { id: "contact", label: "Contact", Icon: Link },
];

export function ScrollNavigation() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("home");
  function updatePosition(value: number) {
    setVisible(value > 550);
    const candidates = links.map(({ id }) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity }))
      .filter(({ top }) => top <= window.innerHeight * .35).sort((a, b) => b.top - a.top);
    setActive(candidates[0]?.id ?? "home");
  }
  useMotionValueEvent(scrollY, "change", updatePosition);
  useEffect(() => { updatePosition(window.scrollY); }, []);
  return (
    <motion.nav className={styles.navigation} aria-label="Section navigation" inert={!visible} initial={false}
      animate={{ y: visible ? 0 : -140, opacity: visible ? 1 : 0 }} transition={{ duration: reduce ? 0 : .4 }}>
      {links.map(({ id, label, Icon }) => <a key={id} href={`#${id}`} aria-label={label} aria-current={active === id ? "location" : undefined}>
        {active === id && <motion.span aria-hidden="true" className={styles.activePill} layoutId="section-navigation-pill" transition={{ type: "spring", stiffness: 350, damping: 32 }} />}
        <Icon size={20} /><span>{label}</span>
      </a>)}
      <a className={styles.navContact} href="#contact">Let’s talk</a>
    </motion.nav>
  );
}
