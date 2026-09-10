"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import styles from "./hero.module.css";

const navigation = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Works" },
  { href: "#contact", label: "Contact" },
  { href: "#experience", label: "Expertise" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={styles.header} onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}>
      <div className={styles.headerInner}>
        <a className={styles.wordmark} href="#home" aria-label="Usama Irshad, home">Usama<span>.</span></a>
        <p className={styles.headerNote}><span>Available for projects</span><strong>Open to collaboration</strong></p>
        <p className={styles.headerNote}><span>Based in</span><strong>Lahore, Pakistan</strong></p>
        <nav className={styles.headerNav} aria-label="Main navigation">
          {navigation.map(({ href, label }) => <a key={href} href={href}><span>{label}</span><span aria-hidden="true">{label}</span></a>)}
        </nav>
        <a className={[styles.action, styles.headerAction].join(" ")} href="#contact"><span className={styles.actionIcon}><ArrowRight size={18} aria-hidden="true" /></span><span>Start a project</span></a>
        <button className={styles.menuToggle} aria-expanded={menuOpen} aria-controls="hero-mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      <nav id="hero-mobile-menu" className={styles.mobileMenu} aria-label="Mobile navigation" hidden={!menuOpen}>
        {navigation.map(({ href, label }) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={18} aria-hidden="true" /></a>)}
      </nav>
    </header>
  );
}
