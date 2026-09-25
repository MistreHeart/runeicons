import type { Metadata } from "next";

import NotFoundContent from "@/components/not-found/content";
import Navbar from "@/components/ui/navbar";
import { NAV_LINKS } from "@/lib/nav-links";

export const metadata: Metadata = {
  title: "404: Page not found",
  description: "This page doesn't exist.",
  robots: { index: false },
};

const NotFoundPage = () => (
  <div className="relative grid min-h-dvh w-full grid-cols-[1fr_auto_1fr] grid-rows-[auto_1fr] overflow-hidden bg-[#F5F5F5] font-(family-name:--font-inter-tight) dark:bg-background">
    <div className="relative col-start-2 row-start-1 flex w-[95vw] max-w-[1440px] flex-col overflow-hidden md:w-[90vw] 2xl:w-[85vw] 2xl:max-w-[1800px]">
      <Navbar showBanner showDashedBorder links={NAV_LINKS} />
    </div>

    <main className="col-start-2 row-start-2 flex w-[95vw] max-w-[1440px] flex-col items-center justify-center px-3 pt-20 pb-10 sm:px-6 md:w-[90vw] 2xl:w-[85vw] 2xl:max-w-[1800px]">
      <NotFoundContent />
    </main>

    <div className="pointer-events-none fixed inset-y-0 left-1/2 z-40 w-[95vw] max-w-[1440px] -translate-x-1/2 border-x-2 border-dashed md:w-[90vw] 2xl:w-[85vw] 2xl:max-w-[1800px]" />
  </div>
);

export default NotFoundPage;
