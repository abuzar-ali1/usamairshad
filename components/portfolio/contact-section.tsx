import { ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/portfolio";
import { Reveal } from "./reveal";

export function ContactSection() {
  const contactHref = profile.email ? `mailto:${profile.email}` : profile.linkedin;
  return (
    <footer id="contact" className="contact-section">
      <div className="section-shell">
        <div className="contact-top"><p className="eyebrow"><i className="status-dot" />Open to creative collaboration</p><span>Lahore, Pakistan · Working remotely</span></div>
        <Reveal><h2>Have something<br /><em>meaningful</em> in mind?</h2></Reveal>
        <div className="contact-bottom"><p>Brand identities. Packaging. Motion.<br />Let’s give your next idea a point of view.</p>{contactHref ? <a href={contactHref} className="pill-button"><span className="button-icon"><ArrowUpRight size={20} /></span>Start a conversation</a> : <p className="contact-pending">Open to remote projects<span>Direct contact details will be added shortly.</span></p>}</div>
        <div className="footer-wordmark" aria-hidden="true">Usama Irshad</div>
        <div className="footer-meta"><span>© {new Date().getFullYear()} Usama Irshad</span><span>Designed with meaning.</span><a href="#home">Back to top <ArrowUp size={15} /></a></div>
      </div>
    </footer>
  );
}
