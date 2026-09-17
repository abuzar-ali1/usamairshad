"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { profile, services } from "@/lib/portfolio";
import { useImpactScroll } from "@/hooks/use-impact-scroll";
import styles from "./why-us.module.css";

const statistics = [
  { value: profile.brands, suffix: "+", label: "Brands brought to life through design" },
  { value: profile.years, suffix: "+", label: "Years of experience in brand & motion" },
  { value: services.length, suffix: "", label: "Creative disciplines. One clear vision." },
  { display: "CC + AI", label: "Adobe craft meets a modern creative toolkit" },
] as const;

function ImpactStatistic({ index, progress, reducedMotion }: {
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean | null;
}) {
  const stat = statistics[index];
  const start = .38 + index * .1;
  const reveal = useTransform(progress, [start, start + .18], [0, 1]);
  const x = useTransform(reveal, [0, 1], [index < 2 ? -200 : 200, 0]);
  const y = useTransform(reveal, [0, 1], [200, 0]);
  const count = useTransform(reveal, (value) => "value" in stat ? `${Math.round(value * stat.value)}${stat.suffix}` : stat.display);
  const finalValue = "value" in stat ? `${stat.value}${stat.suffix}` : stat.display;

  return (
    <motion.div className={styles.statistic} style={reducedMotion ? undefined : { opacity: reveal, x, y }}>
      <dt>{stat.label}</dt>
      <dd aria-label={finalValue}>
        {reducedMotion ? finalValue : <motion.span aria-hidden="true">{count}</motion.span>}
      </dd>
    </motion.div>
  );
}

export function WhyUsSection() {
  const { sectionRef, scrollYProgress, backdropScale, reducedMotion } = useImpactScroll();

  return (
    <section ref={sectionRef} id="why-us" className={styles.section} aria-labelledby="why-us-heading">
      <div className={styles.stage}>
        <div className={styles.gridPattern} aria-hidden="true" />
        <div className={styles.composition}>
          <div className={styles.card}>
            <motion.div className={styles.backdrop} aria-hidden="true" style={{ scale: reducedMotion ? 1 : backdropScale }} />
            <header className={styles.heading}>
              <p className={styles.kicker}><span aria-hidden="true">●</span> Why us</p>
              <h2 id="why-us-heading">Design that<br />drives real impact</h2>
            </header>
            <div className={styles.signoff}>
              <Image src="/images/usama-signature.png" alt="Usama Irshad’s signature" width={1041} height={438} className={styles.signature} sizes="(max-width: 760px) 110px, 160px" />
              <p>Every brand starts with a clear idea. I bring it to life through thoughtful identity, considered craft, and purposeful motion.</p>
            </div>
          </div>
          <dl className={styles.statistics}>
            {statistics.map((stat, index) => <ImpactStatistic key={stat.label} index={index} progress={scrollYProgress} reducedMotion={reducedMotion} />)}
          </dl>
        </div>
      </div>
    </section>
  );
}
