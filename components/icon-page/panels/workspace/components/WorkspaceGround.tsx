"use client";

import React, { useId } from "react";

import { cn } from "@/lib/utils";

// Drawing paper behind the preview: a fine 20-unit grid with a heavier line every
// 100 units, kept faint so it reads as a surface, not a chart. The 1100x800 box
// matches CanvasFrame, which places the tray in the same space; the grid spills
// past it (overflow visible) so it covers the whole panel while staying aligned
// to the icon at every scale.
export const WorkspaceGround: React.FC<{ className?: string }> = ({ className }) => {
  const id = useId().replace(/:/g, "");
  const minor = `ground-minor-${id}`;
  const major = `ground-major-${id}`;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none",
        className,
      )}
    >
      <div className="flex h-full w-full -translate-y-10 items-center justify-center">
        <svg
          width="1100"
          height="800"
          viewBox="0 0 1100 800"
          preserveAspectRatio="xMidYMid meet"
          className="h-auto max-h-full w-auto max-w-full overflow-visible text-foreground"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id={minor} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.035" />
            </pattern>
            <pattern
              id={major}
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
              x="50"
              y="50"
            >
              <rect width="100" height="100" fill={`url(#${minor})`} />
              <path d="M100 0H0V100" fill="none" stroke="currentColor" strokeOpacity="0.07" />
            </pattern>
          </defs>

          <rect x="-4950" y="-4950" width="11000" height="10700" fill={`url(#${major})`} />
        </svg>
      </div>
    </div>
  );
};
