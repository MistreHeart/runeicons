"use client";

import { Plus, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import { CustomizationState, IconData } from "@/lib/types";
import { cn } from "@/lib/utils";

const TRAY_ITEM = {
  initialScale: 0.9,
  initialY: 8,
  exitY: -8,
  spring: { type: "spring" as const, stiffness: 400, damping: 28 },
};

const MAX_SLOTS = 8;

// Normal icons in the tray are painted through a CSS mask, and a CSS background
// can't reference the SVG `#icon-gradient`, so rebuild the gradient in CSS.
function trayPaint(state: CustomizationState): string {
  const fallback = state.colors[0] || "currentColor";
  if (!state.iconGradient || !state.gradient.stops.length) return fallback;
  const stops = [...state.gradient.stops]
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");
  const cx = state.gradient.cx ?? 50;
  const cy = state.gradient.cy ?? 50;
  if (state.gradient.type === "radial") return `radial-gradient(circle at ${cx}% ${cy}%, ${stops})`;
  if (state.gradient.type === "angular")
    return `conic-gradient(from ${state.gradient.angle}deg at ${cx}% ${cy}%, ${stops})`;
  return `linear-gradient(${state.gradient.angle}deg, ${stops})`;
}

interface IconTrayProps {
  trayIcons: IconData[];
  selectedIconId: string | null;
  onSelectIcon: (icon: IconData) => void;
  onRemoveFromTray: (iconId: string) => void;
  state: CustomizationState;
}

export function IconTray({
  trayIcons,
  selectedIconId,
  onSelectIcon,
  onRemoveFromTray,
  state,
}: IconTrayProps) {
  if (trayIcons.length === 0) return null;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center gap-2 rounded-2xl bg-background/80 p-2 ring-1 ring-foreground/8 backdrop-blur-sm">
        <AnimatePresence mode="popLayout" initial={false}>
          {trayIcons.map((trayIcon) => {
            const slotType = trayIcon.iconType ?? "normal";
            const isDesigned =
              slotType === "duotone" ||
              slotType === "fill" ||
              slotType === "pixelated" ||
              slotType === "glass";
            const invertInDark = slotType === "pixelated";
            const isSelected = trayIcon.id === selectedIconId;

            return (
              <m.div
                key={trayIcon.id}
                layout
                initial={{
                  opacity: 0,
                  scale: TRAY_ITEM.initialScale,
                  y: TRAY_ITEM.initialY,
                }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: TRAY_ITEM.initialScale,
                  y: TRAY_ITEM.exitY,
                }}
                transition={TRAY_ITEM.spring}
                className="group flex items-center justify-center will-change-transform"
              >
                <div className="relative">
                  <button
                    type="button"
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-lg border p-2",
                      "transition-[colors,transform] duration-150 ease-out hover:scale-105 active:scale-[0.97]",
                      "cursor-pointer outline-none",
                      isDesigned && slotType !== "pixelated"
                        ? "bg-white dark:bg-zinc-200"
                        : "bg-card",
                      isSelected
                        ? "border-foreground ring-2 ring-foreground/15"
                        : "border-border hover:border-foreground/25",
                    )}
                    onClick={() => onSelectIcon(trayIcon)}
                    aria-label={`Select ${trayIcon.name}`}
                  >
                    {trayIcon.icon ? (
                      <trayIcon.icon
                        className={cn("h-full w-full", invertInDark && "dark:invert")}
                        strokeWidth={2}
                        style={{
                          stroke: state.iconGradient
                            ? `url(#icon-gradient)`
                            : state.colors[0] || "currentColor",
                          ...(state.shadow.inner ? { filter: "url(#inner-shadow)" } : null),
                          transform:
                            `rotate(${state.rotation}deg) ${state.flipH ? "scaleX(-1)" : ""} ${state.flipV ? "scaleY(-1)" : ""}`.trim(),
                        }}
                      />
                    ) : isDesigned ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={trayIcon.url}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className={cn(
                          "h-full w-full object-contain select-none",
                          invertInDark && "dark:invert",
                        )}
                        style={{
                          ...(state.shadow.inner ? { filter: "url(#inner-shadow)" } : null),
                          transform:
                            `rotate(${state.rotation}deg) ${state.flipH ? "scaleX(-1)" : ""} ${state.flipV ? "scaleY(-1)" : ""}`.trim(),
                        }}
                      />
                    ) : (
                      <div
                        className={cn("h-full w-full", invertInDark && "dark:invert")}
                        style={{
                          maskImage: trayIcon.url ? `url(${trayIcon.url})` : "none",
                          WebkitMaskImage: trayIcon.url ? `url(${trayIcon.url})` : "none",
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                          background: trayPaint(state),
                          ...(state.shadow.inner ? { filter: "url(#inner-shadow)" } : null),
                          transform:
                            `rotate(${state.rotation}deg) ${state.flipH ? "scaleX(-1)" : ""} ${state.flipV ? "scaleY(-1)" : ""}`.trim(),
                        }}
                      />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromTray(trayIcon.id);
                    }}
                    className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:opacity-100 hover:scale-110 active:scale-90"
                    aria-label={`Remove ${trayIcon.name}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              </m.div>
            );
          })}
        </AnimatePresence>

        {trayIcons.length < MAX_SLOTS ? (
          <div className="flex items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground/50">
              <Plus className="h-4 w-4" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
