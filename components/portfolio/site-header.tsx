import { ArrowUpRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Usama Irshad, home">Usama<span>.</span></a>
      <p className="header-note"><span>Open to collaboration</span><strong><i className="status-dot" />Available for projects</strong></p>
      <p className="header-note location"><span>Based in</span><strong>Lahore, Pakistan</strong></p>
      <nav className="header-nav" aria-label="Main navigation">
        <a href="#about">About</a><a href="#work">Works</a><a href="#contact">Contact</a>
      </nav>
      <a className="pill-button outline" href="#contact"><span className="button-icon"><ArrowUpRight size={18} /></span>Start a project</a>
    </header>
  );
}
