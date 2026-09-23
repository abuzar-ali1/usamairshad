"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Film, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { motion, useInView, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useVideoFocusCarousel } from "@/hooks/use-video-focus-carousel";
import { Reveal } from "./reveal";
import styles from "./video.module.css";

type VideoClip = {
  title: string;
  description: string;
  src?: string;
  poster?: string;
  captions?: string;
};

// Add src: "/videos/your-film.mp4" (and an optional poster/captions file)
// to replace a skeleton. Only the focused, visible video plays.
const clips: VideoClip[] = [
  { title: "Brand reveal", description: "A first impression, brought to life through motion." },
  { title: "Identity in motion", description: "A visual language with a rhythm of its own." },
  { title: "Packaging stories", description: "Considered details. A new way to see the everyday." },
  { title: "Type in motion", description: "Words with presence, personality, and a little movement." },
  { title: "Campaign moments", description: "Bold ideas, made to catch the eye and stay in mind." },
  { title: "Product spotlight", description: "Light, texture, and the details that make a difference." },
  { title: "Logo explorations", description: "From a simple mark to a memorable moving identity." },
  { title: "Studio process", description: "A glimpse at the thinking behind the finished frame." },
  { title: "Visual rhythm", description: "Shape, colour, and composition finding their flow." },
  { title: "Selected showreel", description: "A collection of ideas, connected through motion." },
];

const ASPECT_RATIO = 0.68;
const BASE_WIDTH = 440;

function scaleAt(distance: number) {
  return distance <= 1 ? 1 - distance * 0.66 : 0.34 * 0.7 ** (distance - 1);
}

function offsetAt(distance: number, width: number) {
  const magnitude = Math.abs(distance);
  const steps = Math.floor(magnitude);
  let offset = 0;
  for (let step = 0; step < steps; step++) {
    offset += width * (scaleAt(step) + scaleAt(step + 1)) / 2 + 10;
  }
  offset += (magnitude - steps) * (width * (scaleAt(steps) + scaleAt(steps + 1)) / 2 + 10);
  return Math.sign(distance) * offset;
}

function VideoCard({ clip, number, slot, position, cardWidth, active, inView, reducedMotion, select }: {
  clip: VideoClip;
  number: number;
  slot: number;
  position: MotionValue<number>;
  cardWidth: MotionValue<number>;
  active: boolean;
  inView: boolean;
  reducedMotion: boolean | null;
  select: (index: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(clip.src) && !failed;
  const width = useTransform(() => cardWidth.get() * scaleAt(Math.abs(slot - position.get())));
  const height = useTransform(() => width.get() / ASPECT_RATIO);
  const contentScale = useTransform(() => width.get() / BASE_WIDTH);
  const transform = useTransform(() => `translate(-50%, -50%) translateX(${offsetAt(slot - position.get(), cardWidth.get())}px)`);
  const opacity = useTransform(() => {
    const distance = Math.abs(slot - position.get());
    return Math.min(1, 0.7 ** Math.max(0, distance - 1)) * Math.max(0, Math.min(1, 6 - distance));
  });
  const zIndex = useTransform(() => 100 - Math.round(Math.abs(slot - position.get()) * 10));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active && inView && !reducedMotion && !document.hidden) {
      void video.play().catch(() => { /* The play control remains available if autoplay is blocked. */ });
    } else {
      video.pause();
    }
    return () => video.pause();
  }, [active, inView, reducedMotion, clip.src]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  }

  return (
    <motion.article
      className={styles.card}
      style={{ width, height, transform, opacity, zIndex }}
      data-active={active}
      data-tone={number % 3}
      role="group"
      aria-roledescription="slide"
      aria-label={`${number + 1} of ${clips.length}: ${clip.title}`}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          className={styles.video}
          src={clip.src}
          poster={clip.poster}
          preload={active ? "metadata" : "none"}
          playsInline
          loop
          muted={muted}
          aria-label={clip.title}
          onError={() => setFailed(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {clip.captions && <track kind="captions" src={clip.captions} srcLang="en" label="English" default />}
        </video>
      ) : (
        <motion.div className={styles.skeleton} style={{ scale: contentScale }} aria-hidden="true">
          <div className={styles.skeletonGrid} />
          <div className={styles.skeletonFrame}>
            <span className={styles.frameCorner} />
            <span className={styles.frameCorner} />
            <span className={styles.frameCorner} />
            <span className={styles.frameCorner} />
            <div className={styles.filmIcon}><Film size={32} strokeWidth={1} /></div>
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLine} />
          </div>
          <div className={styles.shimmer} />
        </motion.div>
      )}

      <button
        className={styles.selectCard}
        type="button"
        aria-label={`Focus ${clip.title}${hasVideo ? "" : " video placeholder"}`}
        aria-current={active ? "true" : undefined}
        tabIndex={active ? 0 : -1}
        onClick={() => select(slot)}
      />

      <motion.div className={styles.captionCanvas} style={{ scale: contentScale }} aria-hidden={!active}>
        <span className={styles.previewLabel}>{hasVideo ? "Motion study" : "Video coming soon"}</span>
        <div className={styles.caption}>
          <span className={styles.clipNumber}>MOTION / {String(number + 1).padStart(2, "0")}</span>
          <h3>{clip.title}</h3>
          <p>{clip.description}</p>
        </div>
      </motion.div>

      {active && (
        <div className={styles.mediaControls}>
          {hasVideo && <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause video" : "Play video"}>{playing ? <Pause size={15} /> : <Play size={15} />}</button>}
          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            disabled={!hasVideo}
            aria-label={hasVideo ? (muted ? "Unmute video" : "Mute video") : "Sound available when the video is added"}
            aria-pressed={hasVideo ? !muted : undefined}
            title={hasVideo ? undefined : "Video coming soon"}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      )}
    </motion.article>
  );
}

export function VideoSection() {
  const sizerRef = useRef<HTMLDivElement>(null);
  const cardWidth = useMotionValue(BASE_WIDTH);
  const [dragStep, setDragStep] = useState(BASE_WIDTH * 0.67 + 10);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const {
    regionRef, position, virtualIndex, activeIndex, select, previous, next,
    onKeyDown, onPanStart, onPan, onPanEnd, onClickCapture, reducedMotion, isDragging,
  } = useVideoFocusCarousel(clips.length, { dragStep });
  const inView = useInView(regionRef, { amount: 0.45 });
  const visible = inView && pageVisible;
  const autoPlaying = !paused && !hovered && !focused && visible && !reducedMotion && !isDragging;

  useEffect(() => {
    const sizer = sizerRef.current;
    if (!sizer) return;
    const observer = new ResizeObserver(([entry]) => {
      cardWidth.set(entry.contentRect.width);
      setDragStep(entry.contentRect.width * 0.67 + 10);
    });
    observer.observe(sizer);
    return () => observer.disconnect();
  }, [cardWidth]);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!autoPlaying) return;
    const timer = window.setInterval(next, 5000);
    return () => window.clearInterval(timer);
  }, [autoPlaying, next]);

  return (
    <section id="motion" className={styles.section} aria-labelledby="motion-heading">
      <Reveal className={styles.header}>
        <div>
          <p className={styles.kicker}><span aria-hidden="true">●</span> Motion studies</p>
          <h2 id="motion-heading">Made to <em>move you.</em></h2>
        </div>
        <p className={styles.introduction}>Identity, rhythm, and stories in motion.<br />A closer look, one frame at a time.</p>
      </Reveal>

      <div
        ref={regionRef}
        className={styles.carousel}
        role="region"
        aria-roledescription="carousel"
        aria-label="Motion studies video carousel"
        aria-describedby="video-instructions"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        data-animate={visible && !paused && !reducedMotion}
      >
        <p id="video-instructions" className={styles.srOnly}>Drag, swipe, or scroll sideways to explore. When focused, use the scroll wheel or arrow keys. Video placeholders are shown until the films are added.</p>
        <motion.div className={styles.stage} onPanStart={onPanStart} onPan={onPan} onPanEnd={onPanEnd} onClickCapture={onClickCapture}>
          <div className={styles.sizer} ref={sizerRef} aria-hidden="true" />
          {Array.from({ length: 13 }, (_, offset) => virtualIndex + offset - 6).map((slot) => {
            const number = ((slot % clips.length) + clips.length) % clips.length;
            return <VideoCard key={slot} clip={clips[number]} number={number} slot={slot} position={position} cardWidth={cardWidth} active={slot === virtualIndex} inView={visible} reducedMotion={reducedMotion} select={select} />;
          })}
          <span className={styles.focusMarker} aria-hidden="true" />
        </motion.div>

        <div className={styles.navigation}>
          <p className={styles.hint}><span>Drag to explore</span><span>Video previews coming soon</span></p>
          <div className={styles.controls}>
            <button type="button" onClick={previous} aria-label="Previous video"><ArrowLeft size={18} /></button>
            <span className={styles.counter} aria-hidden="true">{String(activeIndex + 1).padStart(2, "0")}<span>/ {String(clips.length).padStart(2, "0")}</span></span>
            <button type="button" onClick={next} aria-label="Next video"><ArrowRight size={18} /></button>
            <button type="button" className={styles.autoControl} onClick={() => setPaused((value) => !value)} aria-label={paused ? "Enable automatic video browsing" : "Pause automatic video browsing"} aria-pressed={paused} disabled={Boolean(reducedMotion)}>
              {paused || reducedMotion ? <Play size={14} /> : <Pause size={14} />}
            </button>
          </div>
        </div>
        <p className={styles.srOnly} role="status" aria-live={autoPlaying ? "off" : "polite"} aria-atomic="true">{clips[activeIndex].title}. Video {activeIndex + 1} of {clips.length}.</p>
      </div>
    </section>
  );
}
