"use client";
import { memo, useCallback, useEffect, useRef } from "react";

import { motion, useReducedMotion } from "motion/react";

import type { IconType } from "@/lib/icons";
import { getSpriteHref } from "@/lib/icons";
import { STROKE_STYLE_MAP } from "@/lib/stroke-style";
import { CustomizationState, IconData } from "@/lib/types";
import { cn } from "@/lib/utils";

import { CursorNameTag, type CursorNameTagHandle } from "./IconNameTag";

interface IconGridProps {
  icons: IconData[];
  selectedIconId: string | null;
  onIconClick: (icon: IconData) => void;
  isSearching?: boolean;
  iconType: IconType;
  customizationState?: CustomizationState;
}

interface GridTileProps {
  icon: IconData;
  index: number;
  iconType: IconType;
  isSelected: boolean;
  isSearching?: boolean;
  invertInDark: boolean;
  customizationState?: CustomizationState;
  reduceMotion: boolean;
  onShowTag: (icon: IconData, index: number, el: HTMLButtonElement) => void;
  onTrackMove: (icon: IconData, el: HTMLButtonElement, x: number, y: number) => void;
  onHideTag: () => void;
  onSelect: (icon: IconData) => void;
}

const GridTile = memo(function GridTile({
  icon,
  index,
  iconType,
  isSelected,
  isSearching,
  invertInDark,
  customizationState,
  reduceMotion,
  onShowTag,
  onTrackMove,
  onHideTag,
  onSelect,
}: GridTileProps) {
  const Icon = icon.icon;

  return (
    <div className="relative w-full">
      <motion.button
        onClick={() => onSelect(icon)}
        onMouseEnter={(e) => onTrackMove(icon, e.currentTarget, e.clientX, e.clientY)}
        onMouseMove={(e) => onTrackMove(icon, e.currentTarget, e.clientX, e.clientY)}
        onMouseLeave={onHideTag}
        onFocus={(e) => onShowTag(icon, -1, e.currentTarget)}
        onBlur={onHideTag}
        initial="initial"
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        className={cn(
          "group relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden border-r border-b border-border transition-colors duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
          isSelected ? "bg-accent" : "bg-transparent hover:bg-muted focus-visible:bg-muted",
        )}
        style={
          isSelected && customizationState?.backgroundColor
            ? { backgroundColor: customizationState.backgroundColor }
            : undefined
        }
        type="button"
        aria-label={`${icon.name} icon`}
        tabIndex={0}
      >
        <div className="relative z-10 flex items-center justify-center p-3">
          {(() => {
            if (isSelected && customizationState && Icon) {
              const s = customizationState;
              const stroke = STROKE_STYLE_MAP[s.strokeStyle ?? "round"];
              const color = s.colors[0] || "currentColor";
              const fillSelected = s.iconType === "fill";
              const duotoneSelected = s.iconType === "duotone";
              return (
                <Icon
                  className="h-5 w-5"
                  strokeWidth={stroke.strokeWidth}
                  strokeLinecap={stroke.strokeLinecap}
                  strokeLinejoin={stroke.strokeLinejoin}
                  stroke={color}
                  fill={fillSelected ? color : duotoneSelected ? `${color}33` : "none"}
                  aria-hidden="true"
                />
              );
            }
            if (Icon) {
              return (
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isSearching
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              );
            }
            return (
              <svg
                aria-hidden="true"
                className={cn("h-5 w-5 select-none", invertInDark && "dark:invert")}
              >
                <use href={getSpriteHref(icon.iconType ?? iconType, icon.id)} />
              </svg>
            );
          })()}
        </div>
      </motion.button>
    </div>
  );
});

function IconGridInner({
  icons,
  selectedIconId,
  onIconClick,
  isSearching,
  iconType,
  customizationState,
}: IconGridProps) {
  const invertInDark = iconType === "normal" || iconType === "pixelated";
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const COLS = 5;
  const tagRef = useRef<CursorNameTagHandle>(null);
  const hide = useCallback((immediate?: boolean) => tagRef.current?.hide(immediate), []);

  const showTag = useCallback(
    (icon: IconData, _index: number, el: HTMLButtonElement) =>
      tagRef.current?.showAt(icon.name, el),
    [],
  );
  const trackMove = useCallback(
    (icon: IconData, _el: HTMLButtonElement, x: number, y: number) =>
      tagRef.current?.follow(icon.name, x, y),
    [],
  );
  const hideTag = useCallback(() => hide(), [hide]);

  useEffect(() => {
    const hideNow = () => hide(true);
    window.addEventListener("blur", hideNow);
    window.addEventListener("resize", hideNow);
    return () => {
      window.removeEventListener("blur", hideNow);
      window.removeEventListener("resize", hideNow);
    };
  }, [hide]);

  useEffect(() => {
    hide(true);
  }, [icons, hide]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (!active || !container.contains(active)) return;
      const buttons = Array.from(container.querySelectorAll("button"));
      const currentIndex = buttons.indexOf(active as HTMLButtonElement);
      if (currentIndex === -1) return;
      let nextIndex = -1;
      switch (e.key) {
        case "Escape":
          hideTag();
          (active as HTMLElement).blur();
          return;
        case "ArrowRight":
          nextIndex = currentIndex + 1;
          break;
        case "ArrowLeft":
          nextIndex = currentIndex - 1;
          break;
        case "ArrowDown":
          nextIndex = currentIndex + COLS;
          break;
        case "ArrowUp":
          nextIndex = currentIndex - COLS;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = buttons.length - 1;
          break;
      }
      if (nextIndex >= 0 && nextIndex < buttons.length) {
        e.preventDefault();
        buttons[nextIndex].focus();
      }
    };
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [hideTag]);

  return (
    <div
      className="grid-fade relative grid grid-cols-5 border-b border-border outline-none [&>div:nth-child(5n)>button]:border-r-0"
      ref={containerRef}
      tabIndex={-1}
    >
      {icons.map((icon, index) => (
        <GridTile
          key={icon.id}
          icon={icon}
          index={index}
          iconType={iconType}
          isSelected={selectedIconId === icon.id}
          isSearching={isSearching}
          invertInDark={invertInDark}
          customizationState={customizationState}
          reduceMotion={reduceMotion === true}
          onShowTag={showTag}
          onTrackMove={trackMove}
          onHideTag={hideTag}
          onSelect={onIconClick}
        />
      ))}
      <CursorNameTag
        ref={tagRef}
        containerRef={containerRef}
        reduceMotion={reduceMotion === true}
      />
    </div>
  );
}
export const IconGrid = memo(IconGridInner);
