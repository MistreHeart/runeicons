"use client";

import { useEffect, useId, useRef, useState } from "react";

import { AnimatePresence, useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { EASE_OUT_QUART } from "@/lib/easing";
import { getIconUrlById, type IconType } from "@/lib/icons";
import type { IconData } from "@/lib/types";

const CYCLE_MS = 4000;
// Shield-check shows off every style well: it mixes curves, sharp corners and
// a check, and it has a matching glass file (glass ids don't share the
// normal manifest's ids, so the match is set by hand).
const DEFAULT_ID = "identity-shield-check";
const DEFAULT_NAME = "shield-check";
const DEFAULT_GLASS = "/glass-icons/ShieldCheck%201.svg";
// Inlined so the first frame renders before any fetch.
const DEFAULT_PATHS: ParsedPath[] = [
  {
    d: "M9 12L11 14L15 10M20 13C20 18 16.5 20.5 12.34 21.95C12.1222 22.0238 11.8855 22.0202 11.67 21.94C7.5 20.5 4 18 4 13V5.99996C4 5.73474 4.10536 5.48039 4.29289 5.29285C4.48043 5.10532 4.73478 4.99996 5 4.99996C7 4.99996 9.5 3.79996 11.24 2.27996C11.4519 2.09896 11.7214 1.99951 12 1.99951C12.2786 1.99951 12.5481 2.09896 12.76 2.27996C14.51 3.80996 17 4.99996 19 4.99996C19.2652 4.99996 19.5196 5.10532 19.7071 5.29285C19.8946 5.48039 20 5.73474 20 5.99996V13Z",
    stroke: "black",
    fill: null,
    strokeWidth: "2",
  },
];

const STYLE_ORDER: IconType[] = ["normal", "duotone", "fill", "pixelated", "glass"];

const STYLE_LABELS: Record<IconType, string> = {
  normal: "outline",
  duotone: "duotone",
  fill: "fill",
  pixelated: "pixelated",
  glass: "glass",
};

interface ParsedPath {
  d: string;
  stroke: string | null;
  fill: string | null;
  strokeWidth: string | null;
}

interface Vector {
  kind: "vector";
  vb: string;
  paths: ParsedPath[];
  anchors: [number, number][];
  key: string;
}

interface Glass {
  kind: "glass";
  url: string;
  key: string;
}

type View = Vector | Glass;

// Values each path command consumes per segment.
const ARITY: Record<string, number> = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7 };

// The path's real anchor points: where every segment ends and every subpath
// starts, in absolute coordinates. Control handles are skipped, so this matches
// the points a vector editor shows on the path.
const extractAnchors = (paths: ParsedPath[]): [number, number][] => {
  const out: [number, number][] = [];
  const push = (x: number, y: number) => {
    if (out.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 0.05)) return;
    out.push([x, y]);
  };
  for (const p of paths) {
    if (!p.stroke) continue;
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;
    for (const [, cmd, args] of p.d.matchAll(/([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi)) {
      const type = cmd.toUpperCase();
      const relative = cmd !== type;
      if (type === "Z") {
        x = startX;
        y = startY;
        continue;
      }
      const nums = (args.match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? []).map(Number);
      const arity = ARITY[type];
      for (let i = 0; i + arity <= nums.length; i += arity) {
        if (type === "H") {
          x = relative ? x + nums[i] : nums[i];
        } else if (type === "V") {
          y = relative ? y + nums[i] : nums[i];
        } else {
          const endX = nums[i + arity - 2];
          const endY = nums[i + arity - 1];
          x = relative ? x + endX : endX;
          y = relative ? y + endY : endY;
        }
        if (type === "M" && i === 0) {
          startX = x;
          startY = y;
        }
        push(x, y);
      }
    }
  }
  return out;
};

const svgCache = new Map<string, { vb: string; paths: ParsedPath[] }>();

const loadSvg = async (url: string) => {
  const cached = svgCache.get(url);
  if (cached) return cached;
  const res = await fetch(url);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const svg = doc.querySelector("svg");
  const vb = svg?.getAttribute("viewBox") ?? "0 0 24 24";
  const paths = [...doc.querySelectorAll("path")].map((p) => ({
    d: p.getAttribute("d") ?? "",
    stroke: p.getAttribute("stroke"),
    fill: p.getAttribute("fill"),
    strokeWidth: p.getAttribute("stroke-width"),
  }));
  const parsed = { vb, paths };
  svgCache.set(url, parsed);
  return parsed;
};

const fillClass = (fill: string | null) => (fill === "#DDDDDD" ? "fill-muted-foreground" : "");

const strokeProps = (p: ParsedPath) => {
  if (!p.stroke) return { stroke: undefined, className: "" };
  if (p.stroke === "black" || p.stroke === "#1C1F21" || p.stroke === "#A4A5A6") {
    return { stroke: "currentColor", className: "" };
  }
  if (p.stroke === "#DDDDDD" || p.stroke === "#F3F3F3") {
    return { stroke: undefined, className: "stroke-muted-foreground" };
  }
  return { stroke: p.stroke, className: "" };
};

interface SpecimenPlateProps {
  iconType: IconType;
  onChange: (t: IconType) => void;
  paused?: boolean;
  icon?: IconData;
}

const SpecimenPlate = ({ iconType, onChange, paused, icon }: SpecimenPlateProps) => {
  const shouldReduceMotion = useReducedMotion();
  const uid = useId();
  const gridFadeId = `${uid}-grid-fade`;
  const gridMaskId = `${uid}-grid-mask`;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });

  const activeId = icon?.id ?? DEFAULT_ID;
  const activeName = (icon?.name ?? DEFAULT_NAME).toLowerCase();
  const isDefault = activeId === DEFAULT_ID;

  const [view, setView] = useState<View>({
    kind: "vector",
    vb: "0 0 24 24",
    paths: DEFAULT_PATHS,
    anchors: extractAnchors(DEFAULT_PATHS),
    key: `${DEFAULT_ID}:normal`,
  });

  const holdRef = useRef({ iconType, onChange });
  useEffect(() => {
    holdRef.current = { iconType, onChange };
  }, [iconType, onChange]);

  useEffect(() => {
    if (paused || shouldReduceMotion || !inView) return;
    const id = setInterval(() => {
      const { iconType: current, onChange: change } = holdRef.current;
      const idx = STYLE_ORDER.indexOf(current);
      change(STYLE_ORDER[(idx + 1) % STYLE_ORDER.length]);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [paused, shouldReduceMotion, inView]);

  useEffect(() => {
    const key = `${activeId}:${iconType}`;
    let url = getIconUrlById(activeId, iconType);
    if (!url) {
      if (isDefault && iconType === "glass") {
        url = DEFAULT_GLASS;
      } else {
        url =
          getIconUrlById(activeId, "normal") ??
          getIconUrlById(activeId, "pixelated") ??
          icon?.url ??
          null;
      }
    }
    if (!url) return;
    let alive = true;
    if (url.includes("glass-icons")) {
      const glassUrl = url;
      queueMicrotask(() => {
        if (alive) setView({ kind: "glass", url: glassUrl, key });
      });
      return () => {
        alive = false;
      };
    }
    loadSvg(url).then(({ vb, paths }) => {
      if (!alive) return;
      setView({
        kind: "vector",
        vb,
        paths,
        anchors: iconType === "normal" ? extractAnchors(paths) : [],
        key,
      });
    });
    return () => {
      alive = false;
    };
  }, [activeId, iconType, icon?.url]);

  const strokeWidth = view.kind === "vector" ? view.paths.find((p) => p.stroke)?.strokeWidth : null;
  const stats =
    view.kind === "glass"
      ? ["layered", "blur + highlight"]
      : iconType === "pixelated"
        ? [`${view.paths.length} cells`, "no curves"]
        : iconType === "normal"
          ? [`${view.anchors.length} anchors`, `${strokeWidth ?? 2}px stroke`]
          : iconType === "duotone"
            ? [`${view.paths.length} paths`, "2 layers"]
            : [`${view.paths.length} paths`, "solid"];
  const cycling = !paused && !shouldReduceMotion && inView;

  const strokePaths = view.kind === "vector" ? view.paths.filter((p) => p.stroke) : [];
  const isDetailStroke = (s: string | null) => s === "#DDDDDD" || s === "#F3F3F3";
  const duoBase = view.kind === "vector" ? view.paths.filter((p) => !isDetailStroke(p.stroke)) : [];
  const duoDetail =
    view.kind === "vector" ? view.paths.filter((p) => isDetailStroke(p.stroke)) : [];

  return (
    <div
      ref={rootRef}
      className="relative flex h-full min-h-[400px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-background"
    >
      <div className="relative z-10 flex items-center justify-between gap-4 px-5 pt-5">
        <div className="flex min-w-0 items-center gap-2 text-body-sm">
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={activeName}
              className="truncate font-medium text-foreground"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: EASE_OUT_QUART }}
            >
              {activeName}
            </m.span>
          </AnimatePresence>
          <span className="rounded-md bg-brand/10 px-1.5 py-0.5 text-label font-medium text-brand">
            {STYLE_LABELS[iconType]}
          </span>
        </div>
        <span className="shrink-0 font-mono text-label text-muted-foreground tabular-nums">
          24 × 24
        </span>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center py-2">
        <svg
          viewBox="-3 -3 30 30"
          className="h-auto w-[58%] max-w-[320px] min-w-[200px] text-foreground"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* The grid dissolves toward the edges instead of ending in a hard box. */}
            <radialGradient id={gridFadeId} cx="12" cy="12" r="15" gradientUnits="userSpaceOnUse">
              <stop offset="0.55" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id={gridMaskId} maskUnits="userSpaceOnUse" x="-3" y="-3" width="30" height="30">
              <rect x="-3" y="-3" width="30" height="30" fill={`url(#${gridFadeId})`} />
            </mask>
          </defs>
          <g aria-hidden="true" className="text-muted-foreground" mask={`url(#${gridMaskId})`}>
            {/* Live area: the 20×20 zone icons are drawn inside. */}
            <rect x="2" y="2" width="20" height="20" rx="1" fill="currentColor" opacity="0.05" />
            {/* 1px device-pixel lines: fractional user-unit strokes blur when the
                24-unit grid is scaled up, so strokes don't scale and snap to pixels. */}
            <g stroke="currentColor" shapeRendering="crispEdges">
              {Array.from({ length: 29 }, (_, n) => {
                const i = n - 2;
                const major = i % 4 === 0;
                return (
                  <g key={i} opacity={major ? 0.28 : 0.12}>
                    <line x1={i} y1="-3" x2={i} y2="27" vectorEffect="non-scaling-stroke" />
                    <line x1="-3" y1={i} x2="27" y2={i} vectorEffect="non-scaling-stroke" />
                  </g>
                );
              })}
            </g>
            {/* Centre axes and keylines, hairline and quiet so the glyph leads. */}
            <g stroke="var(--brand)" strokeWidth="1" opacity="0.5" fill="none">
              <g shapeRendering="crispEdges">
                <line x1="12" y1="-3" x2="12" y2="27" vectorEffect="non-scaling-stroke" />
                <line x1="-3" y1="12" x2="27" y2="12" vectorEffect="non-scaling-stroke" />
              </g>
              <rect x="2" y="2" width="20" height="20" rx="2" vectorEffect="non-scaling-stroke" />
              <circle cx="12" cy="12" r="10" vectorEffect="non-scaling-stroke" />
            </g>
          </g>
          {/* Canvas corner marks at 0 and 24. */}
          <g
            aria-hidden="true"
            className="text-muted-foreground"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.7"
            fill="none"
          >
            <path
              d="M0 -1.2V0H-1.2M24 -1.2V0H25.2M0 25.2V24H-1.2M24 25.2V24H25.2"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <AnimatePresence mode="wait" initial={false}>
            {/* One entrance for every style: the glyph fades up while settling
                from slightly smaller, and leaves the same way. */}
            <m.g
              key={view.key}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE_OUT_QUART }}
            >
              {view.kind === "glass" ? (
                <image href={view.url} x="0" y="0" width="24" height="24" />
              ) : (
                <svg x="0" y="0" width="24" height="24" viewBox={view.vb} overflow="visible">
                  {iconType === "pixelated" ? (
                    view.paths.map((cell, i) => <path key={i} d={cell.d} fill="currentColor" />)
                  ) : iconType === "duotone" ? (
                    <>
                      {duoBase.map((p, i) => (
                        <path
                          key={`b-${i}`}
                          d={p.d}
                          stroke={
                            p.stroke === "white" || p.stroke === "#A4A5A6"
                              ? undefined
                              : (p.stroke ?? undefined)
                          }
                          className={
                            p.stroke === "white"
                              ? "stroke-background"
                              : p.stroke === "#A4A5A6"
                                ? "stroke-foreground"
                                : undefined
                          }
                          strokeWidth={p.strokeWidth ?? undefined}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill={p.fill && p.fill !== "none" ? p.fill : "none"}
                        />
                      ))}
                      {duoDetail.map((p, i) => {
                        const sp = strokeProps(p);
                        return (
                          <path
                            key={`d-${i}`}
                            d={p.d}
                            stroke={sp.stroke}
                            className={sp.className}
                            strokeWidth={p.strokeWidth ?? undefined}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill={p.fill && p.fill !== "none" ? p.fill : "none"}
                          />
                        );
                      })}
                    </>
                  ) : iconType === "fill" ? (
                    view.paths.map((p, i) => {
                      const sp = strokeProps(p);
                      return (
                        <path
                          key={`f-${i}`}
                          d={p.d}
                          stroke={sp.stroke}
                          className={`${sp.className} ${fillClass(p.fill)}`}
                          strokeWidth={p.strokeWidth ?? undefined}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill={
                            p.fill && p.fill !== "#DDDDDD" && p.fill !== "none"
                              ? p.fill
                              : p.fill === "#DDDDDD"
                                ? undefined
                                : "none"
                          }
                        />
                      );
                    })
                  ) : (
                    <>
                      {strokePaths.map((p, i) => (
                        <path
                          key={`o-${i}`}
                          d={p.d}
                          stroke="currentColor"
                          strokeWidth={p.strokeWidth ?? "2"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      ))}
                      <g className="text-brand">
                        {view.anchors.map(([x, y]) => (
                          <rect
                            key={`a-${x}-${y}`}
                            x={x - 0.4}
                            y={y - 0.4}
                            width="0.8"
                            height="0.8"
                            rx="0.1"
                            className="fill-background"
                            stroke="currentColor"
                            strokeWidth="0.18"
                          />
                        ))}
                      </g>
                    </>
                  )}
                </svg>
              )}
            </m.g>
          </AnimatePresence>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 px-4 pb-5">
        <p className="font-mono text-label text-muted-foreground tabular-nums">
          {stats.join("  ·  ")}
        </p>
        <div
          role="tablist"
          aria-label="Icon style"
          className="flex max-w-full gap-0.5 overflow-x-auto rounded-xl border border-border bg-muted/60 p-1"
        >
          {STYLE_ORDER.map((style) => {
            const isActive = style === iconType;
            return (
              <button
                key={style}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(style)}
                className={`relative cursor-pointer rounded-lg px-3 py-1.5 text-body-sm transition-colors duration-150 ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  // The pill slides between tabs; buttons must not clip it mid-flight.
                  <m.span
                    layoutId={`${uid}-tab`}
                    className="absolute inset-0 rounded-lg bg-background ring-1 ring-border"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", duration: 0.4, bounce: 0.12 }
                    }
                  />
                )}
                {isActive && cycling && (
                  // Autoplay progress lives outside the pill so the layout
                  // animation doesn't stretch it; it fades in once the pill lands.
                  <m.span
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-1 z-10 h-0.5 overflow-hidden rounded-full bg-foreground/10"
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                  >
                    <m.span
                      key={iconType}
                      className="absolute inset-0 origin-left rounded-full bg-brand"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                    />
                  </m.span>
                )}
                <span className="relative z-10">{STYLE_LABELS[style]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SpecimenPlate;
