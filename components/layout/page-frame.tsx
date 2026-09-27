import { cn } from "@/lib/utils";

// Width of the centered content column shared by the landing, docs and 404 pages.
export const FRAME_WIDTH = "w-[95vw] max-w-[1440px] md:w-[90vw] 2xl:w-[85vw] 2xl:max-w-[1800px]";

// The dashed vertical rails that run down both sides of the content column.
export const FrameRails = () => (
  <div
    className={cn(
      "pointer-events-none fixed inset-y-0 left-1/2 z-40 -translate-x-1/2 border-x-2 border-dashed",
      FRAME_WIDTH,
    )}
  />
);
