"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { WORDMARK_D } from "../svg/wordmark-data";

// Glyph field clipped to the wordmark: noise zones drift across a grid, dense
// zones show pixel icons, sparse ones show plus signs and dots. Everything
// cross-fades (zones, glyph swaps, pointer stir), and a glyph is only drawn
// where it fits wholly inside a letter, so none get sliced by the letter edges.
// At rest only the faint letters show; hovering fades the field in.

const VB_W = 1202;
const VB_H = 147;
const CELL = 21;
const COLS = Math.floor(VB_W / CELL);
const ROWS = Math.floor(VB_H / CELL);
// Centre the grid so the leftover sliver is split evenly on both sides.
const GRID_X = (VB_W - COLS * CELL) / 2;
const GRID_Y = (VB_H - ROWS * CELL) / 2;
const ICON_SCALE = 0.78;
const STIR_RADIUS = 110;

const DRIFT_PER_SEC = 0.12;
// Each cell re-rolls its glyph once per period, on its own phase, and
// cross-fades over the first slice of it.
const ROLL_PERIOD_S = 2.4;
const ROLL_FADE = 0.18;
const POINTER_EASE = 10;
// Per-second rates for the hover reveal: in over ~150ms, out over ~350ms.
const REVEAL_IN = 7;
const REVEAL_OUT = 3;
const ICON_ALPHA = 0.6;
const MARK_ALPHA = 0.35;
const ALPHA_LEVELS = 16;

const ICONS = [
  "documents/file-text",
  "documents/folder",
  "documents/save",
  "documents/inbox",
  "documents/archive",
  "documents/clipboard",
  "code/braces",
  "code/terminal",
  "code/git-branch",
  "code/server",
  "gadgets/laptop",
  "gadgets/watch",
  "identity/lock",
  "identity/fingerprint-pattern",
  "indicators/circle-check",
  "layouts/grid-2x2",
  "messaging/mail",
  "messaging/send",
  "metrics/chart-bar",
  "metrics/activity",
  "money/gift",
  "money/shopping-bag",
  "nature/cloud",
  "nature/sun",
  "other/zap",
  "playback/play",
  "playback/camera",
  "schedule/clock",
  "senses/eye",
  "senses/pointer",
  "tools/heart",
  "tools/star",
  "tools/sparkles",
  "tools/search",
  "tools/settings",
  "tools/bookmark",
];

const hash = (x: number, y: number) => {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
};

/** Smooth value noise in [0, 1]. */
const noise = (x: number, y: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const FooterWordmark = ({ className }: { className?: string }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const letters = new Path2D(WORDMARK_D);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const images = ICONS.map((name) => {
      const img = new Image();
      img.src = `/pixelated/${name}.svg`;
      return img;
    });

    // Per-cell coverage: which glyph's footprint fits wholly inside a letter.
    // 3 = icon fits, 2 = plus/cross mark fits, 1 = only the centre (dot), 0 = outside.
    // Letter stems are ~1.5 cells wide, so checking the drawn extent rather than
    // the whole cell keeps the field dense without slicing any glyph.
    const coverage = new Uint8Array(COLS * ROWS);
    const probe = document.createElement("canvas").getContext("2d");
    if (probe) {
      const fits = (x: number, y: number, r: number) =>
        probe.isPointInPath(letters, x - r, y - r) &&
        probe.isPointInPath(letters, x + r, y - r) &&
        probe.isPointInPath(letters, x - r, y + r) &&
        probe.isPointInPath(letters, x + r, y + r);
      const iconReach = (CELL * ICON_SCALE) / 2 + 0.5;
      const markReach = CELL * 0.2 + 1;
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const x = GRID_X + i * CELL + CELL / 2;
          const y = GRID_Y + j * CELL + CELL / 2;
          if (!probe.isPointInPath(letters, x, y)) continue;
          coverage[j * COLS + i] = fits(x, y, iconReach) ? 3 : fits(x, y, markReach) ? 2 : 1;
        }
      }
    }

    let scale = 1;
    let dpr = 1;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let visible = false;
    let target: { x: number; y: number } | null = null;
    const pointer = { x: 0, y: 0 };
    let stir = 0;
    let reveal = 0;

    // Icons are black SVGs; tint each once per colour/size into a sprite.
    let spritePx = 0;
    let spriteKey = "";
    let sprites: (HTMLCanvasElement | null)[] = [];
    const getSprites = (color: string) => {
      spritePx = Math.max(8, Math.round(CELL * ICON_SCALE * scale * dpr));
      const key = `${color}|${spritePx}`;
      if (key === spriteKey && sprites.every(Boolean)) return sprites;
      spriteKey = key;
      sprites = images.map((img) => {
        if (!img.complete || !img.naturalWidth) return null;
        const c = document.createElement("canvas");
        c.width = spritePx;
        c.height = spritePx;
        const g = c.getContext("2d");
        if (!g) return null;
        g.imageSmoothingEnabled = false;
        g.drawImage(img, 0, 0, spritePx, spritePx);
        g.globalCompositeOperation = "source-in";
        g.fillStyle = color;
        g.fillRect(0, 0, spritePx, spritePx);
        return c;
      });
      return sprites;
    };

    const draw = (t: number) => {
      const color = getComputedStyle(host).color;
      const tinted = getSprites(color);
      const k = scale * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (reveal <= 0) return;
      ctx.imageSmoothingEnabled = false;

      // Strokes and dots batched by quantised alpha, so each level is one draw call.
      const marks: Path2D[] = Array.from({ length: ALPHA_LEVELS + 1 }, () => new Path2D());
      const dots: Path2D[] = Array.from({ length: ALPHA_LEVELS + 1 }, () => new Path2D());
      const level = (alpha: number) => Math.round(Math.min(1, alpha) * ALPHA_LEVELS);

      const drift = t * DRIFT_PER_SEC;
      const half = CELL / 2;
      const a = CELL * 0.2;
      const b = a * 0.75;

      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const cover = coverage[j * COLS + i];
          if (!cover) continue;
          const x = GRID_X + i * CELL + half;
          const y = GRID_Y + j * CELL + half;

          let zone =
            noise(i * 0.09 + drift, j * 0.3 - drift * 0.4) * 0.75 +
            noise(i * 0.23 - drift, j * 0.5 + 5) * 0.25;
          if (stir > 0.001) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            zone += 0.4 * stir * Math.exp(-(dx * dx + dy * dy) / (STIR_RADIUS * STIR_RADIUS));
          }
          const seed = hash(i, j);

          // Soft tier weights instead of hard thresholds, so cells fade between states.
          const wIcon = cover === 3 ? smoothstep(0.6, 0.66, zone) : 0;
          const wMark = cover >= 2 ? smoothstep(0.54, 0.6, zone) * (1 - wIcon) : 0;
          const wDot = Math.max(smoothstep(0.46, 0.52, zone), seed < 0.12 ? 0.5 : 0) * (1 - wMark - wIcon);

          // Glyph re-roll with a short cross-fade from the previous pick.
          const phase = t / ROLL_PERIOD_S + seed * 6;
          const n = Math.floor(phase);
          const fade = smoothstep(0, ROLL_FADE, phase - n);
          const rollNow = hash(seed * 97, n);
          const rollPrev = hash(seed * 97, n - 1);

          if (wDot > 0.01) {
            const d = 1.2 + 0.2 * wDot;
            dots[level(wDot)].rect(x - d, y - d, d * 2, d * 2);
          }

          if (wMark > 0.01) {
            const plusNow = rollNow < 0.6;
            const plusPrev = rollPrev < 0.6;
            const weights: [boolean, number][] =
              plusNow === plusPrev ? [[plusNow, 1]] : [[plusPrev, 1 - fade], [plusNow, fade]];
            for (const [plus, w] of weights) {
              const path = marks[level(wMark * w)];
              if (plus) {
                path.moveTo(x - a, y);
                path.lineTo(x + a, y);
                path.moveTo(x, y - a);
                path.lineTo(x, y + a);
              } else {
                path.moveTo(x - b, y - b);
                path.lineTo(x + b, y + b);
                path.moveTo(x + b, y - b);
                path.lineTo(x - b, y + b);
              }
            }
          }

          if (wIcon > 0.01) {
            // Snap to whole device pixels so the pixel icons stay crisp.
            const px = Math.round(x * k - spritePx / 2);
            const py = Math.round(y * k - spritePx / 2);
            const now = tinted[Math.floor(rollNow * tinted.length)];
            const prev = tinted[Math.floor(rollPrev * tinted.length)];
            if (prev && prev !== now && fade < 1) {
              ctx.globalAlpha = reveal * ICON_ALPHA * wIcon * (1 - fade);
              ctx.drawImage(prev, px, py);
            }
            if (now) {
              ctx.globalAlpha = reveal * ICON_ALPHA * wIcon * (prev === now ? 1 : fade);
              ctx.drawImage(now, px, py);
            }
          }
        }
      }

      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.save();
      ctx.clip(letters);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "square";
      for (let l = 1; l <= ALPHA_LEVELS; l++) {
        ctx.globalAlpha = (reveal * MARK_ALPHA * l) / ALPHA_LEVELS;
        ctx.stroke(marks[l]);
        ctx.fill(dots[l]);
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      elapsed += dt;
      if (target) {
        // Ease the stir centre toward the pointer instead of jumping to it.
        const follow = 1 - Math.exp(-dt * POINTER_EASE);
        pointer.x += (target.x - pointer.x) * follow;
        pointer.y += (target.y - pointer.y) * follow;
      }
      stir = target ? Math.min(1, stir + dt * 3) : Math.max(0, stir - dt * 1.2);
      reveal = target ? Math.min(1, reveal + dt * REVEAL_IN) : Math.max(0, reveal - dt * REVEAL_OUT);
      draw(elapsed);
      // Nothing to show once the reveal has faded out, so stop until the next hover.
      if (!target && reveal === 0) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (reducedMotion.matches) reveal = target ? 1 : 0;
      draw(elapsed);
      if (visible && !document.hidden && !reducedMotion.matches && (target || reveal > 0)) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const width = host.clientWidth;
      dpr = Math.min(devicePixelRatio || 1, 2);
      scale = width / VB_W;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(VB_H * scale * dpr));
      draw(elapsed);
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const next = {
        x: ((e.clientX - rect.left) / rect.width) * VB_W,
        y: ((e.clientY - rect.top) / rect.height) * VB_H,
      };
      if (!target && stir === 0) {
        pointer.x = next.x;
        pointer.y = next.y;
      }
      target = next;
      if (!frame) update();
    };
    const onLeave = () => {
      target = null;
      if (reducedMotion.matches) update();
    };

    // Redraw once icons arrive so the first static frame isn't empty.
    for (const img of images) img.addEventListener("load", () => !frame && update(), { once: true });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    intersection.observe(host);
    // The glyph colour follows the theme; redraw when it flips so a paused
    // (off-screen or reduced-motion) wordmark doesn't keep the old colour.
    const themeObserver = new MutationObserver(update);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Padding lives on the outer wrapper so the measured host box is exactly the
  // wordmark's box; the canvas and the letter outline then share one coordinate space.
  return (
    <div className={cn("select-none text-foreground", className)}>
      <div ref={hostRef} className="relative">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-auto w-full"
          aria-hidden="true"
        >
          <path d={WORDMARK_D} fill="currentColor" fillOpacity="0.05" />
        </svg>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
};

export default FooterWordmark;
