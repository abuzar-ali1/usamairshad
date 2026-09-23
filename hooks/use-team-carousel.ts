"use client";

import { useCallback, useState, type KeyboardEvent } from "react";

type CarouselSelection = {
  index: number;
  direction: -1 | 0 | 1;
};

export function useTeamCarousel(memberCount: number, initialIndex = 0) {
  const lastIndex = Math.max(0, memberCount - 1);
  const [selection, setSelection] = useState<CarouselSelection>({
    index: Math.max(0, Math.min(initialIndex, lastIndex)),
    direction: 0,
  });
  const activeIndex = Math.min(selection.index, lastIndex);

  const selectMember = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, lastIndex));

      setSelection((current) => {
        const currentIndex = Math.min(current.index, lastIndex);
        if (nextIndex === currentIndex) return current;

        return {
          index: nextIndex,
          direction: nextIndex > currentIndex ? 1 : -1,
        };
      });
    },
    [lastIndex],
  );

  const step = useCallback(
    (direction: -1 | 1) => {
      setSelection((current) => {
        const currentIndex = Math.min(current.index, lastIndex);
        const nextIndex = Math.max(0, Math.min(currentIndex + direction, lastIndex));
        if (nextIndex === currentIndex) return current;

        return { index: nextIndex, direction };
      });
    },
    [lastIndex],
  );

  const goPrevious = useCallback(() => step(-1), [step]);
  const goNext = useCallback(() => step(1), [step]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

      const target = event.target as HTMLElement;
      if (target.isContentEditable || target.closest("input, textarea, select")) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goPrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          goNext();
          break;
        case "Home":
          event.preventDefault();
          selectMember(0);
          break;
        case "End":
          event.preventDefault();
          selectMember(lastIndex);
          break;
      }
    },
    [goNext, goPrevious, lastIndex, selectMember],
  );

  return {
    activeIndex,
    direction: selection.direction,
    selectMember,
    goPrevious,
    goNext,
    canGoPrevious: activeIndex > 0,
    canGoNext: activeIndex < lastIndex,
    onKeyDown,
  };
}
