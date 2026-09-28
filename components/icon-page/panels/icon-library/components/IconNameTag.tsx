"use client";
import { type Ref, RefObject, useCallback, useEffect, useImperativeHandle, useRef } from "react";

// How far below-right of the cursor the tag settles.
const GAP = 14;
// Share of the remaining distance covered per 60fps frame; scaled by real frame
// time so the trail feels the same on 60Hz and 120Hz screens.
const FOLLOW = 0.35;
// Grace period when the cursor crosses the hairline between two tiles, so the tag
// doesn't blink out and back in.
const HIDE_DELAY_MS = 90;

export interface CursorNameTagHandle {
  follow: (name: string, clientX: number, clientY: number) => void;
  showAt: (name: string, el: HTMLElement) => void;
  hide: (immediate?: boolean) => void;
}

/**
 * A name pill that trails the cursor across the icon grid and settles just to the
 * bottom-right of it, flipping to the left near the grid's right edge.
 *
 * Everything is imperative: the label, visibility and position are written straight
 * to the DOM, so hovering never re-renders the grid or even this component.
 */
export function CursorNameTag({
  containerRef,
  reduceMotion,
  ref,
}: {
  containerRef: RefObject<HTMLElement | null>;
  reduceMotion: boolean;
  ref: Ref<CursorNameTagHandle>;
}) {
  const tagRef = useRef<HTMLSpanElement>(null);
  const state = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    placed: false,
    label: "",
    width: 0,
    frame: 0,
    last: 0,
  });
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLoop = useCallback(() => {
    const s = state.current;
    if (s.frame) return;
    s.last = performance.now();
    const loop = (now: number) => {
      const el = tagRef.current;
      if (!el) {
        s.frame = 0;
        return;
      }
      const dt = Math.min(now - s.last, 64);
      s.last = now;
      const k = reduceMotion ? 1 : 1 - Math.pow(1 - FOLLOW, dt / 16.67);
      s.x += (s.tx - s.x) * k;
      s.y += (s.ty - s.y) * k;
      el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      s.frame = Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    s.frame = requestAnimationFrame(loop);
  }, [reduceMotion]);

  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = null;
  };

  const follow = useCallback(
    (name: string, clientX: number, clientY: number) => {
      const el = tagRef.current;
      const container = containerRef.current;
      if (!el || !container) return;
      cancelHide();
      const s = state.current;
      if (s.label !== name) {
        s.label = name;
        el.textContent = name;
        // Measured only when the text changes, never on plain mouse moves.
        s.width = el.offsetWidth;
      }
      el.style.opacity = "1";

      const box = container.getBoundingClientRect();
      let tx = clientX - box.left + GAP;
      if (tx + s.width > box.width - 4) tx = clientX - box.left - GAP - s.width;
      s.tx = tx;
      s.ty = clientY - box.top + GAP;
      if (!s.placed) {
        // First appearance: start at the target instead of flying in from 0,0.
        s.x = s.tx;
        s.y = s.ty;
        s.placed = true;
      }
      startLoop();
    },
    [containerRef, startLoop],
  );

  const hide = useCallback((immediate = false) => {
    cancelHide();
    const done = () => {
      if (tagRef.current) tagRef.current.style.opacity = "0";
      state.current.placed = false;
    };
    if (immediate) done();
    else hideTimer.current = setTimeout(done, HIDE_DELAY_MS);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      follow,
      hide,
      // Keyboard focus has no cursor: park the tag under the focused tile instead.
      showAt: (name, el) => {
        const box = el.getBoundingClientRect();
        follow(name, box.left + box.width / 2 - GAP, box.bottom - GAP / 2);
      },
    }),
    [follow, hide],
  );

  useEffect(() => {
    const s = state.current;
    return () => {
      cancelAnimationFrame(s.frame);
      cancelHide();
    };
  }, []);

  return (
    <span
      ref={tagRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className="pointer-events-none absolute top-0 left-0 z-30 rounded-full bg-foreground px-3 py-1.5 text-label leading-none font-medium whitespace-nowrap text-background transition-opacity duration-150 ease-out will-change-transform"
    />
  );
}
