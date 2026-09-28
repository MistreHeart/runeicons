"use client";

import { type ComponentProps, type ReactNode, useState } from "react";

import { Check, ChevronDown, Grid3X3, Redo, RotateCcw, Undo, X } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CustomizationState } from "@/lib/types";
import { cn } from "@/lib/utils";

import { useArmedReset } from "./use-armed-reset";

const PILL_CLASS = "flex items-center rounded-xl bg-background p-1 ring-1 ring-foreground/10";

// Ghost button inside a pill: muted until hovered, like the landing navbar links.
const PILL_BUTTON =
  "flex items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,scale] duration-150 outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 active:scale-[0.96] disabled:pointer-events-none disabled:text-foreground/25";

const ICON_SIZES = [16, 20, 24, 28, 32, 48, 64, 96, 128];

// One rounded group in the action bar. With `layoutTransition` it becomes a
// motion.div with layout animation, which the editor uses when pills come and go.
export function ActionPill({
  layoutTransition,
  className,
  children,
}: {
  layoutTransition?: Transition;
  className?: string;
  children: ReactNode;
}) {
  if (layoutTransition) {
    return (
      <motion.div layout transition={layoutTransition} className={cn(PILL_CLASS, className)}>
        {children}
      </motion.div>
    );
  }
  return <div className={cn(PILL_CLASS, className)}>{children}</div>;
}

export function ActionMenuItem({ className, ...props }: ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-label font-medium",
        className,
      )}
      {...props}
    />
  );
}

export interface HistoryControlsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset?: () => void;
  layoutTransition?: Transition;
}

// Undo / Redo / Reset pill. Reset needs a second confirm from the popover.
export function HistoryControls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onReset,
  layoutTransition,
}: HistoryControlsProps) {
  const { isResetArmed, timeLeft, disarmReset, handleResetClick, handleConfirmReset } =
    useArmedReset(onReset);
  const [resetTooltipOpen, setResetTooltipOpen] = useState(false);

  return (
    <ActionPill layoutTransition={layoutTransition} className="gap-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onUndo} disabled={!canUndo} className={cn(PILL_BUTTON, "h-8 w-8")}>
            <Undo className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>
            Undo <span className="ml-1 text-[10px] opacity-50">⌘Z</span>
          </p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onRedo} disabled={!canRedo} className={cn(PILL_BUTTON, "h-8 w-8")}>
            <Redo className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>
            Redo <span className="ml-1 text-[10px] opacity-50">⌘Y</span>
          </p>
        </TooltipContent>
      </Tooltip>
      <div className="relative">
        <Tooltip open={!isResetArmed && resetTooltipOpen} onOpenChange={setResetTooltipOpen}>
          <TooltipTrigger asChild>
            <button
              onClick={handleResetClick}
              className={cn(
                PILL_BUTTON,
                "h-8 w-8",
                isResetArmed &&
                  "bg-foreground text-background hover:bg-foreground hover:text-background",
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Reset</p>
          </TooltipContent>
        </Tooltip>
        <AnimatePresence>
          {isResetArmed && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.95 }}
              animate={{ opacity: 1, y: -80, scale: 1 }}
              exit={{ opacity: 0, y: 0, scale: 0.95 }}
              className="absolute left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-xl bg-popover p-1 whitespace-nowrap text-popover-foreground ring-1 ring-foreground/10"
            >
              <button
                onClick={handleConfirmReset}
                className="flex h-7 items-center gap-2 rounded-lg bg-foreground px-3 text-label font-medium text-background transition-opacity hover:opacity-90"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Reset</span>
                <span className="font-mono text-micro tabular-nums opacity-60">{timeLeft}s</span>
              </button>
              <button onClick={disarmReset} className={cn(PILL_BUTTON, "h-7 w-7")}>
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ActionPill>
  );
}

export interface SizeGridControlsProps {
  state?: CustomizationState;
  onChange?: (updates: Partial<CustomizationState>) => void;
  showGrid: boolean;
  onGridToggle?: () => void;
  layoutTransition?: Transition;
}

// Icon size dropdown plus the pixel grid toggle.
export function SizeGridControls({
  state,
  onChange,
  showGrid,
  onGridToggle,
  layoutTransition,
}: SizeGridControlsProps) {
  return (
    <ActionPill layoutTransition={layoutTransition}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(PILL_BUTTON, "group h-8 min-w-[64px] gap-1 px-2")}>
            <span className="font-mono text-label tabular-nums">{state?.width}px</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[92px] p-1">
          {ICON_SIZES.map((size) => (
            <DropdownMenuItem
              key={size}
              className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1 font-mono text-label tabular-nums"
              onClick={() => onChange?.({ width: size, height: size })}
            >
              <span>{size}px</span>
              {state?.width === size && <Check className="h-3 w-3 text-muted-foreground" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onGridToggle}
            aria-pressed={showGrid}
            className={cn(PILL_BUTTON, "h-8 w-8", showGrid && "bg-foreground/8 text-foreground")}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{showGrid ? "Hide grid" : "Show grid"}</p>
        </TooltipContent>
      </Tooltip>
    </ActionPill>
  );
}
