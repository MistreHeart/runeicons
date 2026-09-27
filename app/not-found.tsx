import type { Metadata } from "next";

import { FRAME_WIDTH, FrameRails } from "@/components/layout/page-frame";
import NotFoundContent from "@/components/not-found/content";
import Navbar from "@/components/ui/navbar";
import { NAV_LINKS } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "404: Page not found",
  description: "This page doesn't exist.",
  robots: { index: false },
};

const NotFoundPage = () => (
  <div className="relative grid min-h-dvh w-full grid-cols-[1fr_auto_1fr] grid-rows-[auto_1fr] overflow-hidden bg-[#F5F5F5] dark:bg-background">
    <div
      className={cn(FRAME_WIDTH, "relative col-start-2 row-start-1 flex flex-col overflow-hidden")}
    >
      <Navbar showBanner showDashedBorder links={NAV_LINKS} />
    </div>

    <main
      className={cn(
        FRAME_WIDTH,
        "col-start-2 row-start-2 flex flex-col items-center justify-center px-4 pt-20 pb-10 sm:px-6 lg:px-8",
      )}
    >
      <NotFoundContent />
    </main>

    <FrameRails />
  </div>
);

export default NotFoundPage;
