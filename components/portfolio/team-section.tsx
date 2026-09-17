import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import styles from "./team.module.css";

const members = [
  {
    name: "Usama Irshad",
    role: "Senior Brand & Motion Designer",
    discipline: "Creative direction · Brand & motion",
    image: "/images/usama-portrait.png",
    initials: "UI",
  },
  {
    name: "Ayesha Khan",
    role: "Graphic Designer",
    discipline: "Brand identity · Packaging",
    initials: "AK",
  },
  {
    name: "Hamza Ali",
    role: "Graphic Designer",
    discipline: "Digital design · Motion",
    initials: "HA",
  },
];

export function TeamSection() {
  return (
    <section id="team" className={styles.section} aria-labelledby="team-heading">
      <div className={styles.inner}>
        <Reveal className={styles.header}>
          <div>
            <p className={styles.kicker}><span aria-hidden="true">●</span> The team</p>
            <h2 id="team-heading">Good people.<br /><em>Great design.</em></h2>
          </div>
          <p className={styles.introduction}>Brand thinking, visual craft, and motion.<br />Different perspectives. One shared eye for detail.</p>
        </Reveal>

        <div className={styles.grid}>
          {members.map((member, index) => (
            <Reveal key={member.name} delay={index * .1}>
              <article className={styles.card}>
                <div className={styles.portrait}>
                  <span className={styles.index} aria-hidden="true">0{index + 1}</span>
                  <div className={styles.orbit} aria-hidden="true" />
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt="Usama Irshad, senior brand and motion designer"
                      fill
                      sizes="(max-width: 700px) 90vw, 30vw"
                      className={styles.photo}
                    />
                  ) : (
                    <div className={styles.placeholder} aria-hidden="true">
                      <svg viewBox="0 0 300 340" fill="none">
                        <circle cx="150" cy="106" r="54" />
                        <path d="M41 340v-50c0-72 43-113 109-113s109 41 109 113v50" />
                      </svg>
                      <span className={styles.initials}>{member.initials}</span>
                    </div>
                  )}
                  {!member.image && <span className={styles.sampleLabel}>Sample profile</span>}
                  <span className={styles.discipline}>{member.discipline}</span>
                </div>
                <div className={styles.details}>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.footer}>
          <p>Have something in mind? Let’s give it a point of view.</p>
          <a href="#contact">Let’s work together <ArrowUpRight size={19} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  );
}
