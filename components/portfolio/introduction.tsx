import { Reveal } from "./reveal";

export function Introduction() {
  return (
    <section id="intro" className="intro-section section-shell" aria-labelledby="intro-title">
      <div className="discipline-strip" aria-label="Design disciplines">
        <span>Brand identity</span><i>✳</i><span>Packaging</span><i>✳</i><span>Motion design</span><i>✳</i><span>Art direction</span>
      </div>
      <div className="intro-grid">
        <Reveal><p className="eyebrow">The idea comes first.</p><h2 id="intro-title">Good design gets seen.<br /><span>Meaningful design<br />gets remembered.</span></h2></Reveal>
        <Reveal delay={.1} className="intro-description"><p>I’m Usama, a senior brand and motion designer building identities and packaging that make products sell.</p><p>With 8+ years in design and 40+ brands, I connect thoughtful ideas with purposeful visuals—across identity, packaging, and motion.</p><a className="text-link" href="#about">A little more about me <span>↗</span></a></Reveal>
      </div>
    </section>
  );
}
