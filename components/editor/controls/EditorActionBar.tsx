"use client";

import { type ReactNode } from "react";
import { ChevronDown, Download, Eye, EyeOff, FileCode } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { toast } from "sonner";

export const EDITOR_TRANSITION = {
  pill: 0.22,
  pillExit: 0.18,
  pillLayout: {
    type: "spring" as const,
    duration: 0.28,
    bounce: 0.12,
  },
  toolStagger: 0.025,
  toolStaggerExit: 0.015,
  toolFade: 0.16,
  toolFadeExit: 0.12,
  toolDelay: 0.12,
  toggle: 0.22,
  canvas: 0.3,
  canvasExit: 0.24,
  canvasFade: 0.16,
  canvasFadeExit: 0.08,
  tray: 0.16,
  trayDelay: 0.24,
  easeOut: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
  easeInOut: [0.645, 0.045, 0.355, 1] as [number, number, number, number],
} as const;

const toolsParent = {
  hidden: {
    transition: {
      staggerChildren: EDITOR_TRANSITION.toolStaggerExit,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      delayChildren: EDITOR_TRANSITION.toolDelay,
      staggerChildren: EDITOR_TRANSITION.toolStagger,
    },
  },
};

const toolChild = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    transition: {
      duration: EDITOR_TRANSITION.toolFadeExit,
      ease: EDITOR_TRANSITION.easeOut,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: EDITOR_TRANSITION.toolFade,
      ease: EDITOR_TRANSITION.easeOut,
    },
  },
};
import {
  ActionMenuItem,
  ActionPill,
  HistoryControls,
  SizeGridControls,
} from "@/components/shared/action-bar/action-bar-controls";
import { copyToClipboard, usePending } from "@/components/shared/action-bar/use-pending";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DRAW_TOOLS,
  type DrawTool,
} from "@/components/editor/controls/EditorDrawToolbar";
import { downloadBlob } from "@/lib/download";
import type { CustomizationState } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface EditorActionBarProps {
  state?: CustomizationState;
  onChange?: (updates: Partial<CustomizationState>) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onReset?: () => void;
  showGrid?: boolean;
  onGridToggle?: () => void;
  onGetSvgContent?: () => Promise<string>;
  editorMode: "edit" | "draw";
  activeTool: DrawTool;
  onToolChange: (tool: DrawTool) => void;
  showReference: boolean;
  onToggleReference: () => void;
  additionalDropdownItems?: ReactNode;
  className?: string;
}

export function EditorActionBar({
  state,
  onChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onReset,
  showGrid = false,
  onGridToggle,
  onGetSvgContent,
  editorMode,
  activeTool,
  onToolChange,
  showReference,
  onToggleReference,
  additionalDropdownItems,
  className,
}: EditorActionBarProps) {
  const reduceMotion = useReducedMotion();
  const { isPending, withPending } = usePending();

  const getSvgContent = async (): Promise<string> => {
    if (!onGetSvgContent) return "";
    try {
      return await onGetSvgContent();
    } catch (error) {
      console.error("Custom SVG generator failed:", error);
      toast.error("Export failed.");
      return "";
    }
  };

  const downloadSvg = async () => {
    await withPending(async () => {
      const svg = await getSvgContent();
      if (!svg) return;
      downloadBlob(svg, "icon.svg", "image/svg+xml");
      toast.success("SVG downloaded successfully");
    });
  };

  const groupLayoutTransition = reduceMotion
    ? { duration: 0 }
    : EDITOR_TRANSITION.pillLayout;

  return (
    <TooltipProvider delayDuration={400}>
      <LayoutGroup>
        <div
          className={cn(
            "flex items-center gap-2",
            className,
          )}
        >
        <HistoryControls
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onReset={onReset}
          layoutTransition={groupLayoutTransition}
        />

        <SizeGridControls
          state={state}
          onChange={onChange}
          showGrid={showGrid}
          onGridToggle={onGridToggle}
          layoutTransition={groupLayoutTransition}
        />

        <AnimatePresence initial={false} mode="popLayout">
          {editorMode === "draw" && (
            <motion.div
              key="draw-tools"
              layout
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }
              }
              animate={
                reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.92,
                      transition: {
                        duration: EDITOR_TRANSITION.pillExit,
                        ease: EDITOR_TRANSITION.easeOut,
                      },
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      layout: EDITOR_TRANSITION.pillLayout,
                      opacity: {
                        duration: EDITOR_TRANSITION.pill,
                        ease: EDITOR_TRANSITION.easeOut,
                      },
                      scale: {
                        duration: EDITOR_TRANSITION.pill,
                        ease: EDITOR_TRANSITION.easeOut,
                      },
                    }
              }
              style={{ originX: 0.5, originY: 0.5 }}
              className="flex items-center gap-0.5 rounded-xl bg-background p-1 ring-1 ring-foreground/10"
            >
              <motion.div
                variants={reduceMotion ? undefined : toolsParent}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex items-center gap-0.5"
              >
                {DRAW_TOOLS.map(({ id, label, Icon }) => {
                  const isActive = activeTool === id;
                  return (
                    <Tooltip key={id}>
                      <TooltipTrigger asChild>
                        <motion.button
                          variants={reduceMotion ? undefined : toolChild}
                          type="button"
                          onClick={() => onToolChange(id)}
                          aria-pressed={isActive}
                          aria-label={label}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,scale] duration-150 outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 active:scale-[0.96]",
                            isActive && "bg-foreground text-background hover:bg-foreground hover:text-background",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
                <div
                  className="mx-0.5 h-5 w-px bg-border"
                  aria-hidden="true"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      variants={reduceMotion ? undefined : toolChild}
                      type="button"
                      onClick={onToggleReference}
                      aria-pressed={showReference}
                      aria-label={
                        showReference ? "Hide reference" : "Show reference"
                      }
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,scale] duration-150 outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 active:scale-[0.96]",
                        showReference && "bg-foreground text-background hover:bg-foreground hover:text-background",
                      )}
                    >
                      {showReference ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>
                      {showReference ? "Hide reference" : "Show reference"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ActionPill layoutTransition={groupLayoutTransition}>
          <button
            disabled={isPending}
            onClick={downloadSvg}
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 text-center text-background transition-[opacity,scale] duration-150 outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/30 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="text-label font-medium whitespace-nowrap">
              {isPending ? "Exporting…" : "Export SVG"}
            </span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="More export options"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,scale] duration-150 outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 active:scale-[0.96]"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[184px] p-1"
            >
              <ActionMenuItem
                disabled={isPending}
                onClick={async () => {
                  await withPending(async () => {
                    const svg = await getSvgContent();
                    if (svg) {
                      await copyToClipboard(svg, "SVG");
                    } else {
                      toast.error("Nothing to copy");
                    }
                  });
                }}
              >
                <FileCode className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-1 items-center justify-between">
                  <span>Copy as SVG</span>
                  <span className="font-mono text-micro text-muted-foreground">SVG</span>
                </div>
              </ActionMenuItem>
              <DropdownMenuSeparator />
              <ActionMenuItem
                disabled={isPending}
                onClick={downloadSvg}
              >
                <Download className="h-4 w-4 text-muted-foreground" />
                <span>Download as SVG</span>
              </ActionMenuItem>
              {additionalDropdownItems && (
                <>
                  <DropdownMenuSeparator />
                  {additionalDropdownItems}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </ActionPill>
        </div>
      </LayoutGroup>
    </TooltipProvider>
  );
}
