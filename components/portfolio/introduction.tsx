import { profile } from "@/lib/portfolio";
import { Reveal } from "./reveal";
import styles from "./showcase.module.css";

const disciplines = ["Brand identity", "Packaging", "Motion design", "Art direction"];

export function Introduction() {
  return (
    <section id="intro" className={styles.introduction} aria-labelledby="intro-title">
      <div className={styles.disciplineStrip} aria-label="Design disciplines">
        <div className={styles.disciplineTrack}>
          {[0, 1].map((copy) => <div key={copy} className={styles.disciplineGroup} aria-hidden={copy === 1 ? true : undefined}>
            {disciplines.map((discipline, index) => <span key={discipline} className={styles[`discipline${index}`]}>{discipline}<i aria-hidden="true">✳</i></span>)}
          </div>)}
        </div>
      </div>
      <div className={styles.introGrid}>
        <Reveal><h2 id="intro-title" className={styles.introTitle}>Design that sparks<br className={styles.desktopBreak} /> engagement and<br className={styles.desktopBreak} /> inspires action</h2></Reveal>
        <Reveal delay={.12} className={styles.introDescription}>
          <p>With over {profile.years} years of experience in design, I create thoughtful identities, packaging, and motion for brands with something to say. Having worked with {profile.brands}+ brands, I bring a clear idea and a considered visual language to every brief. I’m Usama Irshad, a senior brand and motion designer based in Lahore, connecting strategy with craft to make brands memorable.</p>
        </Reveal>
      </div>
    </section>
  );
}
