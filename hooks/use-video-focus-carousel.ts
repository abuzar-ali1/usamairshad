"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion, type PanInfo } from "motion/react";

type CarouselOptions = {
  dragStep?: number;
  initialIndex?: number;
};

type PanSession = {
  start: number;
  axis: "horizontal" | "vertical" | null;
};

const wrap = (index: number, count: number) => ((index % count) + count) % count;
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export function useVideoFocusCarousel(itemCount: number, { dragStep = 320, initialIndex = 0 }: CarouselOptions = {}) {
  const count = Math.max(1, itemCount);
  const step = Math.max(1, dragStep);
  const position = useMotionValue(initialIndex);
  const reducedMotion = useReducedMotion();
  const [virtualIndex, setVirtualIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(initialIndex);
  const panRef = useRef<PanSession | null>(null);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelGesture = useRef<{ start: number; distance: number } | null>(null);
  const suppressClick = useRef(false);

  useMotionValueEvent(position, "change", (value) => {
    setVirtualIndex((current) => Math.round(value) === current ? current : Math.round(value));
  });

  const clearWheelTimer = useCallback(() => {
    if (wheelTimer.current !== null) {
      clearTimeout(wheelTimer.current);
      wheelTimer.current = null;
    }
  }, []);

  const select = useCallback((index: number) => {
    if (!Number.isFinite(index) || itemCount < 2) return;
    clearWheelTimer();
    wheelGesture.current = null;
    position.stop();
    const target = Math.round(index);
    targetRef.current = target;

    if (reducedMotion) {
      position.set(target);
      return;
    }

    animate(position, target, { type: "spring", stiffness: 240, damping: 32, mass: 0.8 });
  }, [clearWheelTimer, itemCount, position, reducedMotion]);

  const previous = useCallback(() => select(targetRef.current - 1), [select]);
  const next = useCallback(() => select(targetRef.current + 1), [select]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target.isContentEditable || target.closest("input, textarea, select, video")) return;
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) && target.closest("article")) {
      // A focused card can leave the virtual render window after navigation.
      regionRef.current?.focus({ preventScroll: true });
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        previous();
        break;
      case "ArrowRight":
        event.preventDefault();
        next();
        break;
      case "Home":
        event.preventDefault();
        select(Math.floor(targetRef.current / count) * count);
        break;
      case "End":
        event.preventDefault();
        select(Math.floor(targetRef.current / count) * count + count - 1);
        break;
    }
  }, [count, next, previous, select]);

  const onPanStart = useCallback(() => {
    panRef.current = { start: position.get(), axis: null };
  }, [position]);

  const onPan = useCallback((_event: PointerEvent, info: PanInfo) => {
    const session = panRef.current;
    if (!session || itemCount < 2) return;

    if (session.axis === null) {
      if (Math.max(Math.abs(info.offset.x), Math.abs(info.offset.y)) < 6) return;
      session.axis = Math.abs(info.offset.x) > Math.abs(info.offset.y) ? "horizontal" : "vertical";
      if (session.axis === "horizontal") {
        clearWheelTimer();
        wheelGesture.current = null;
        position.stop();
        setIsDragging(true);
      }
    }

    if (session.axis !== "horizontal") return;
    suppressClick.current = true;
    position.set(session.start - info.offset.x / step);
    targetRef.current = Math.round(position.get());
  }, [clearWheelTimer, itemCount, position, step]);

  const onPanEnd = useCallback((_event: PointerEvent, info: PanInfo) => {
    const session = panRef.current;
    panRef.current = null;
    setIsDragging(false);
    if (session?.axis !== "horizontal") return;

    suppressClick.current = true;
    const projected = position.get() - clamp(info.velocity.x * 0.18 / step, 1.5);
    let destination = Math.round(projected);
    if (destination === Math.round(session.start) && Math.abs(info.offset.x) > 32) {
      destination = Math.round(session.start) - Math.sign(info.offset.x);
    }
    select(destination);
  }, [position, select, step]);

  const onClickCapture = useCallback((event: MouseEvent<HTMLElement>) => {
    // Keyboard-generated clicks have detail=0 and remain available after a drag.
    if (event.detail > 0 && suppressClick.current) {
      suppressClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  useEffect(() => {
    const region = regionRef.current;
    if (!region || itemCount < 2) return;

    // A new pointer press is an intentional click, even immediately after a drag.
    const onPointerDown = () => { suppressClick.current = false; };
    const cancelPan = () => {
      const session = panRef.current;
      panRef.current = null;
      suppressClick.current = false;
      setIsDragging(false);
      if (session?.axis === "horizontal") select(Math.round(position.get()));
    };

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || panRef.current?.axis === "horizontal") return;
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const shifted = event.shiftKey && event.deltaY !== 0;
      // Ordinary vertical page scrolling remains native, including on touch screens.
      if (!horizontal && !shifted && document.activeElement !== region) return;

      const rawDelta = horizontal ? event.deltaX : event.deltaY;
      if (!rawDelta) return;
      event.preventDefault();
      event.stopPropagation();
      clearWheelTimer();
      position.stop();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? region.clientWidth : 1;
      const gesture = wheelGesture.current ?? { start: position.get(), distance: 0 };
      gesture.distance += rawDelta * unit;
      wheelGesture.current = gesture;
      position.set(position.get() + clamp(rawDelta * unit / step, 1));
      targetRef.current = Math.round(position.get());
      wheelTimer.current = setTimeout(() => {
        let destination = Math.round(position.get());
        if (destination === Math.round(gesture.start) && Math.abs(gesture.distance) >= Math.min(32, step * 0.15)) {
          destination = Math.round(gesture.start) + Math.sign(gesture.distance);
        }
        select(destination);
      }, 140);
    };

    region.addEventListener("pointerdown", onPointerDown, true);
    region.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointercancel", cancelPan);
    window.addEventListener("blur", cancelPan);
    return () => {
      region.removeEventListener("pointerdown", onPointerDown, true);
      region.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointercancel", cancelPan);
      window.removeEventListener("blur", cancelPan);
      panRef.current = null;
      wheelGesture.current = null;
      clearWheelTimer();
    };
  }, [clearWheelTimer, itemCount, position, select, step]);

  useEffect(() => () => {
    clearWheelTimer();
    position.stop();
  }, [clearWheelTimer, position]);

  return {
    regionRef,
    position,
    virtualIndex,
    activeIndex: wrap(virtualIndex, count),
    select,
    previous,
    next,
    onKeyDown,
    onPanStart,
    onPan,
    onPanEnd,
    onClickCapture,
    reducedMotion,
    isDragging,
  };
}
