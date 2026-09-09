"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CircleUserRound, House, Layers } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

const links = [
  { id: "home", label: "Home", Icon: House },
  { id: "work", label: "Work", Icon: BriefcaseBusiness },
  { id: "experience", label: "Expertise", Icon: Layers },
  { id: "about", label: "About", Icon: CircleUserRound },
];

export function ScrollNavigation() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("home");
  useMotionValueEvent(scrollY, "change", (value) => setVisible(value > 550));
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-20% 0px -50% 0px", threshold: 0 });
    for (const { id } of links) { const section = document.getElementById(id); if (section) observer.observe(section); }
    return () => observer.disconnect();
  }, []);
  return (
    <motion.nav className="scroll-navigation" aria-label="Section navigation" inert={!visible} initial={false} animate={{ y: visible ? 0 : -110, opacity: visible ? 1 : 0 }} transition={{ duration: .4 }}>
      {links.map(({ id, label, Icon }) => <a key={id} href={`#${id}`} aria-label={label} className={active === id ? "is-active" : ""} aria-current={active === id ? "location" : undefined}><Icon size={16} /><span>{label}</span></a>)}
      <a className="nav-contact" href="#contact">Let’s talk <ArrowUpRight size={16} /></a>
    </motion.nav>
  );
}
