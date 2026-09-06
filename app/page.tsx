"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Lenis from "lenis";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import type {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three";
import type { MotionValue } from "motion/react";
import legacyArtwork from "@/public/featured-legacy.png";

function smoothStep(value: number, start: number, end: number) {
  const normalized = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return normalized * normalized * (3 - 2 * normalized);
}

function Sculpture({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;

    group.current.rotation.y += delta * 0.16;
    group.current.rotation.x = state.pointer.y * 0.18;
    group.current.rotation.z = state.pointer.x * -0.12;
    group.current.position.x +=
      (state.pointer.x * 0.18 - group.current.position.x) * 0.035;
  });

  return (
    <group ref={group} rotation={[0.34, -0.45, 0.14]}>
      <Float
        speed={reducedMotion ? 0 : 1.8}
        rotationIntensity={reducedMotion ? 0 : 0.3}
        floatIntensity={reducedMotion ? 0 : 0.45}
      >
        <mesh>
          <torusKnotGeometry args={[1.48, 0.36, 180, 28, 2, 3]} />
          <meshPhysicalMaterial
            color="#dfff3f"
            emissive="#708000"
            emissiveIntensity={0.2}
            metalness={0.55}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.08}
            iridescence={0.9}
            iridescenceIOR={1.8}
          />
        </mesh>
        <mesh scale={1.055}>
          <torusKnotGeometry args={[1.48, 0.36, 140, 22, 2, 3]} />
          <meshBasicMaterial color="#efffc0" wireframe transparent opacity={0.12} />
        </mesh>
      </Float>
    </group>
  );
}

function HeroScene({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  return (
    <Canvas
      aria-label="Interactive lime-green sculptural form"
      camera={{ position: [0, 0, 5.8], fov: 38 }}
      dpr={reducedMotion ? 1 : [1, 1.35]}
      frameloop={reducedMotion || !active ? "demand" : "always"}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 3]} intensity={4} color="#ffffff" />
      <pointLight position={[-3, -1, 3]} intensity={30} color="#b8ff1f" />
      <pointLight position={[2, -3, -2]} intensity={14} color="#8e7cff" />
      <Sculpture reducedMotion={reducedMotion} />
      <Sparkles count={42} scale={[7, 5, 4]} size={1.7} speed={0.2} opacity={0.35} color="#dfff3f" />
    </Canvas>
  );
}

function ScrollSculpture({
  progress,
  reducedMotion,
}: {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const rig = useRef<Group>(null);
  const rawGroup = useRef<Group>(null);
  const formGroup = useRef<Group>(null);
  const memoryGroup = useRef<Group>(null);
  const rawWire = useRef<MeshBasicMaterial>(null);
  const rawCore = useRef<MeshStandardMaterial>(null);
  const formMetal = useRef<MeshPhysicalMaterial>(null);
  const formWire = useRef<MeshBasicMaterial>(null);
  const memoryMetal = useRef<MeshPhysicalMaterial>(null);
  const memoryWire = useRef<MeshBasicMaterial>(null);
  const orbit = useRef<Mesh>(null);

  useFrame((state) => {
    if (
      !rig.current ||
      !rawGroup.current ||
      !formGroup.current ||
      !memoryGroup.current ||
      !rawWire.current ||
      !rawCore.current ||
      !formMetal.current ||
      !formWire.current ||
      !memoryMetal.current ||
      !memoryWire.current
    ) return;

    const p = reducedMotion ? 0.9 : progress.get();
    const raw = 1 - smoothStep(p, 0.16, 0.35);
    const form = smoothStep(p, 0.2, 0.38) * (1 - smoothStep(p, 0.56, 0.73));
    const memory = smoothStep(p, 0.62, 0.82);
    const time = reducedMotion ? 0 : state.clock.elapsedTime;

    rawWire.current.opacity = raw * 0.9;
    rawCore.current.opacity = raw * 0.22;
    formMetal.current.opacity = form;
    formWire.current.opacity = form * 0.22;
    memoryMetal.current.opacity = memory;
    memoryWire.current.opacity = memory * 0.72;

    rawGroup.current.visible = raw > 0.01;
    formGroup.current.visible = form > 0.01;
    memoryGroup.current.visible = memory > 0.01;

    rawGroup.current.scale.setScalar(0.72 + raw * 0.28);
    formGroup.current.scale.setScalar(0.7 + form * 0.3);
    memoryGroup.current.scale.setScalar(0.68 + memory * 0.32);

    rawGroup.current.rotation.set(
      0.45 + Math.sin(time * 0.35) * 0.12,
      time * 0.16 + p * 2.4,
      -0.2 + p * 0.5,
    );
    formGroup.current.rotation.set(0.25 - p * 0.22, time * 0.12 + p * 4.8, p * 0.55);
    memoryGroup.current.rotation.set(-0.34 + p * 0.35, -0.4 + p * 2.2, 0.34 - p * 0.2);

    if (orbit.current) {
      orbit.current.rotation.x = 1.2 + time * 0.18 + p * 0.4;
      orbit.current.rotation.z = -0.4 - time * 0.24 - p * 0.7;
    }

    rig.current.position.y = Math.sin(p * Math.PI) * 0.15;
    rig.current.rotation.y = (state.pointer.x * 0.1 + p * 0.16) * (reducedMotion ? 0 : 1);
    rig.current.rotation.x = state.pointer.y * 0.06 * (reducedMotion ? 0 : 1);
    state.camera.position.z += (6.1 - p * 0.45 - state.camera.position.z) * 0.045;
  });

  return (
    <group ref={rig}>
      <group ref={rawGroup}>
        <mesh renderOrder={1}>
          <icosahedronGeometry args={[1.95, 2]} />
          <meshBasicMaterial
            ref={rawWire}
            color="#c7b7ff"
            wireframe
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
        <mesh renderOrder={1} scale={0.78}>
          <icosahedronGeometry args={[1.95, 1]} />
          <meshStandardMaterial
            ref={rawCore}
            color="#6847ff"
            emissive="#3d18ff"
            emissiveIntensity={1.8}
            roughness={0.28}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group ref={formGroup} visible={false} rotation={[0.2, 0, 0]}>
        <mesh renderOrder={2}>
          <torusKnotGeometry args={[1.48, 0.36, 200, 32, 2, 3]} />
          <meshPhysicalMaterial
            ref={formMetal}
            color="#dfff3f"
            emissive="#506200"
            emissiveIntensity={0.34}
            metalness={0.62}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.05}
            iridescence={0.85}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
        <mesh renderOrder={2} scale={1.045}>
          <torusKnotGeometry args={[1.48, 0.36, 150, 24, 2, 3]} />
          <meshBasicMaterial
            ref={formWire}
            color="#f7ffd1"
            wireframe
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group ref={memoryGroup} visible={false}>
        <mesh renderOrder={3} scale={[1.15, 1.7, 1.15]}>
          <octahedronGeometry args={[1.55, 2]} />
          <meshPhysicalMaterial
            ref={memoryMetal}
            color="#d8d9d1"
            emissive="#dfff3f"
            emissiveIntensity={0.08}
            metalness={1}
            roughness={0.08}
            clearcoat={1}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
        <mesh renderOrder={3} scale={[1.2, 1.77, 1.2]}>
          <octahedronGeometry args={[1.55, 1]} />
          <meshBasicMaterial
            ref={memoryWire}
            color="#080906"
            wireframe
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={orbit} renderOrder={3} rotation={[1.2, 0.1, -0.4]}>
          <torusGeometry args={[2.35, 0.015, 10, 180]} />
          <meshBasicMaterial color="#080906" transparent opacity={0.55} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function MorphScene({
  active,
  progress,
  reducedMotion,
}: {
  active: boolean;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 6.1], fov: 36 }}
      dpr={reducedMotion ? 1 : [1, 1.35]}
      frameloop={reducedMotion || !active ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 5, 5]} intensity={5.2} color="#ffffff" />
      <pointLight position={[-4, 0, 4]} intensity={32} color="#7559ff" />
      <pointLight position={[3, -3, 3]} intensity={26} color="#dfff3f" />
      <ScrollSculpture progress={progress} reducedMotion={reducedMotion} />
      <Sparkles
        count={reducedMotion ? 18 : 52}
        scale={[8, 6, 4]}
        size={1.45}
        speed={reducedMotion ? 0 : 0.12}
        opacity={0.3}
        color="#ffffff"
      />
    </Canvas>
  );
}

const entrance = {
  hidden: { y: 46, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  const reducedMotion = Boolean(useReducedMotion());
  const heroSection = useRef<HTMLElement>(null);
  const morphSection = useRef<HTMLElement>(null);
  const heroVisible = useInView(heroSection, { amount: 0.05 });
  const morphVisible = useInView(morphSection, { amount: 0.03 });
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: rawMorphProgress } = useScroll({
    target: morphSection,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.25 });
  const morphProgress = useSpring(rawMorphProgress, { stiffness: 90, damping: 24, mass: 0.32 });
  const heroDrift = useTransform(scrollYProgress, [0, 0.32], [0, 120]);
  const morphBackground = useTransform(
    morphProgress,
    [0, 0.38, 0.7, 0.84, 1],
    ["#3515d4", "#0b0c09", "#0b0c09", "#dfff3f", "#dfff3f"],
  );
  const morphInk = useTransform(
    morphProgress,
    [0, 0.775, 0.785, 1],
    ["#f1f2e9", "#f1f2e9", "#090a07", "#090a07"],
  );
  const stageOneOpacity = useTransform(morphProgress, [0, 0.2, 0.34], [1, 1, 0]);
  const stageOneY = useTransform(morphProgress, [0, 0.34], [0, -90]);
  const stageTwoOpacity = useTransform(morphProgress, [0.24, 0.38, 0.56, 0.7], [0, 1, 1, 0]);
  const stageTwoY = useTransform(morphProgress, [0.24, 0.4, 0.7], [90, 0, -90]);
  const stageThreeOpacity = useTransform(morphProgress, [0.66, 0.82, 1], [0, 1, 1]);
  const stageThreeY = useTransform(morphProgress, [0.66, 0.84], [90, 0]);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return (
    <main id="top" className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <header className="site-nav">
        <a className="monogram" href="#top" aria-label="Back to top">
          M<span>/</span>03
        </a>
        <div className="nav-status"><i /> Independent · Senior graphic designer</div>
        <a className="nav-link" href="#work">Selected work <span>↘</span></a>
      </header>

      <section ref={heroSection} className="hero" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <motion.div className="hero-scene" style={{ y: reducedMotion ? 0 : heroDrift }}>
          <HeroScene active={heroVisible} reducedMotion={reducedMotion} />
        </motion.div>

        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.18 }}
        >
          <motion.p className="eyebrow" variants={entrance} transition={{ duration: 0.7 }}>
            Art direction · Brand systems · 2009—2026
          </motion.p>
          <h1 id="hero-title" className="hero-title">
            <motion.span variants={entrance} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
              Designing
            </motion.span>
            <motion.span className="outline-line" variants={entrance} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
              culture into
            </motion.span>
            <motion.span variants={entrance} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
              form.
            </motion.span>
          </h1>
        </motion.div>

        <motion.div
          className="hero-note"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
        >
          <span>Based everywhere</span>
          <p>Visual identities and experiences built to stay relevant after the launch noise fades.</p>
        </motion.div>

        <a className="scroll-cue" href="#work" aria-label="Scroll to selected work">
          <span>Explore</span><i>↓</i>
        </a>
      </section>

      <section id="work" className="work" aria-labelledby="work-title">
        <div className="section-kicker">
          <span>01 / Selected work</span>
          <span>Three studies, one point of view</span>
        </div>

        <motion.div
          className="work-heading"
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 id="work-title">Work that moves<br /><em>before it speaks.</em></h2>
          <p>Identity systems shaped across image, object, type, and space—not isolated deliverables.</p>
        </motion.div>

        <article className="featured-project">
          <motion.div
            className="featured-art"
            initial={{ clipPath: "inset(12% 0 12% 0)", opacity: 0.45 }}
            whileInView={{ clipPath: "inset(0% 0 0% 0)", opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={legacyArtwork}
              alt="Chrome and acid-lime folded ribbon sculpture"
              fill
              sizes="(max-width: 800px) 100vw, 68vw"
              className="featured-image"
              priority={false}
            />
            <div className="art-index">N° 001</div>
            <div className="art-stamp">Archive<br />of motion</div>
          </motion.div>

          <motion.div
            className="featured-copy"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.08 }}
          >
            <div>
              <span className="project-number">01</span>
              <h3>Monument<br />in Motion</h3>
            </div>
            <div className="project-meta">
              <p>Culture &amp; Identity</p>
              <p>Art direction / CGI / Campaign</p>
              <p>2026</p>
            </div>
            <p className="project-summary">A visual language built from tension: permanence against speed, strict geometry against luminous material.</p>
            <span className="project-arrow" aria-hidden="true"><ArrowUpRight strokeWidth={1.4} /></span>
          </motion.div>
        </article>

        <div className="project-pair">
          <motion.article
            className="mini-project cobalt"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={reducedMotion ? undefined : { y: -10, rotateZ: -0.6 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mini-art cobalt-art" aria-hidden="true">
              <span>FORM</span><span>/</span><span>FUNC</span>
              <i>02</i>
            </div>
            <div className="mini-info">
              <h3>Form / Function</h3>
              <span>Editorial system · 2025</span>
            </div>
          </motion.article>

          <motion.article
            className="mini-project paper"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={reducedMotion ? undefined : { y: -10, rotateZ: 0.6 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="mini-art paper-art" aria-hidden="true">
              <span>SIGNAL</span>
              <span className="signal-orbit">S / O</span>
              <i>03</i>
            </div>
            <div className="mini-info">
              <h3>Signal Objects</h3>
              <span>Packaging · 2024</span>
            </div>
          </motion.article>
        </div>
      </section>

      <motion.section
        ref={morphSection}
        className="morph-story"
        aria-labelledby="morph-title"
        style={reducedMotion
          ? { backgroundColor: "#dfff3f", color: "#090a07" }
          : { backgroundColor: morphBackground, color: morphInk }}
      >
        <div className="morph-sticky">
          <div className="morph-grid" aria-hidden="true" />

          <div className="morph-header">
            <span>02 / Identity engine</span>
            <span>Scroll to transform</span>
          </div>

          <div className="morph-scene">
            <MorphScene active={morphVisible} progress={morphProgress} reducedMotion={reducedMotion} />
          </div>

          <div className="morph-axis" aria-hidden="true">
            <span>Shape</span>
            <span>Meaning</span>
            <span>Memory</span>
          </div>

          <motion.article
            className="morph-copy morph-copy-one"
            style={{ opacity: stageOneOpacity, y: stageOneY }}
          >
            <span className="morph-index">01 — Observe</span>
            <h2 id="morph-title">Find the<br /><em>signal.</em></h2>
            <p>Before form comes attention: listening for the contradiction, energy, and human truth hiding inside the brief.</p>
          </motion.article>

          <motion.article
            className="morph-copy morph-copy-two"
            style={{ opacity: stageTwoOpacity, y: stageTwoY }}
          >
            <span className="morph-index">02 — Distill</span>
            <h2>Give tension<br /><em>a shape.</em></h2>
            <p>Strategy becomes a recognisable visual behavior—flexible enough to move, precise enough to remain unmistakable.</p>
          </motion.article>

          <motion.article
            className="morph-copy morph-copy-three"
            style={{ opacity: stageThreeOpacity, y: stageThreeY }}
          >
            <span className="morph-index">03 — Release</span>
            <h2>Build what<br /><em>outlives us.</em></h2>
            <p>The final work is not a fixed object. It is a living system other people can use, bend, and remember.</p>
          </motion.article>

          <div className="morph-progress" aria-hidden="true">
            <span>00</span>
            <i><motion.b style={{ scaleX: morphProgress }} /></i>
            <span>100</span>
          </div>
        </div>
      </motion.section>

      <section className="legacy" aria-labelledby="legacy-title">
        <div className="running-type" aria-hidden="true">
          <div>IDENTITY — DIRECTION — CULTURE — EXPERIENCE — IDENTITY — DIRECTION — CULTURE — EXPERIENCE —</div>
        </div>

        <div className="section-kicker legacy-kicker">
          <span>03 / Point of view</span>
          <span>Built over time</span>
        </div>

        <motion.div
          className="legacy-statement"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1 }}
        >
          <p className="legacy-intro">The practice</p>
          <h2 id="legacy-title">A legacy isn’t<br />a <em>look.</em> It’s a system.</h2>
          <p className="legacy-body">For seventeen years, the work has moved between boardrooms, print rooms, launch days, and public spaces—turning complex ideas into visual behavior people remember.</p>
        </motion.div>

        <div className="legacy-bottom">
          <div className="metric"><strong>17</strong><span>Years refining<br />the instinct</span></div>
          <div className="metric"><strong>86</strong><span>Identity systems<br />released</span></div>
          <div className="metric"><strong>12</strong><span>Global design<br />recognitions</span></div>
          <div className="capabilities">
            <span>Brand strategy</span><span>Creative direction</span><span>Editorial design</span><span>Visual systems</span>
          </div>
        </div>

        <footer className="site-footer">
          <p>Make it clear.<br /><em>Make it last.</em></p>
          <a href="#top">Back to the beginning <span>↑</span></a>
          <span>Portfolio concept / 2026</span>
        </footer>
      </section>
    </main>
  );
}
