import type { Metadata } from "next";

import Bento from "@/components/landing/components/bento";
import CTA from "@/components/landing/components/cta";
import Faq from "@/components/landing/components/faq";
import Footer from "@/components/landing/components/footer";
import HeroSection from "@/components/landing/components/herosection";
import Packages from "@/components/landing/components/packages";
import Search from "@/components/landing/components/search";
import { FRAME_WIDTH, FrameRails } from "@/components/layout/page-frame";
import Navbar from "@/components/ui/navbar";
import { NAV_LINKS } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "RuneIcons - Beautiful Icons for Your Next Project",
  description: "900+ modern, customizable icons for designers and developers.",
};

const Page = async () => {
  return (
    <div className="relative grid min-h-screen w-full grid-cols-[1fr_auto_1fr] grid-rows-[auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto] overflow-hidden bg-[#F5F5F5] font-(family-name:--font-inter-tight) dark:bg-background">
      <div
        className={cn(
          FRAME_WIDTH,
          "relative col-start-2 row-start-1 flex flex-col overflow-hidden",
        )}
      >
        <Navbar showBanner showDashedBorder links={NAV_LINKS} />
      </div>

      <div
        id="home"
        className={cn(
          FRAME_WIDTH,
          "col-start-2 row-start-3 flex scroll-mt-24 flex-col gap-2 px-3 pt-20 pb-4 sm:px-6 sm:pb-6",
        )}
      >
        <HeroSection />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-4 border-b-2 border-dashed" />

      <div
        id="search"
        className={cn(
          FRAME_WIDTH,
          "col-start-2 row-start-5 flex scroll-mt-24 flex-col gap-2 px-3 py-10 sm:px-6 sm:py-14",
        )}
      >
        <Search />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-6 border-b-2 border-dashed" />

      <div
        id="features"
        className={cn(FRAME_WIDTH, "col-start-2 row-start-7 flex scroll-mt-24 flex-col p-3 sm:p-6")}
      >
        <Bento />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-8 border-b-2 border-dashed" />

      <div
        id="packages"
        className={cn(FRAME_WIDTH, "col-start-2 row-start-9 flex scroll-mt-24 flex-col p-3 sm:p-6")}
      >
        <Packages />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-10 border-b-2 border-dashed" />

      <div
        id="faq"
        className={cn(
          FRAME_WIDTH,
          "col-start-2 row-start-11 flex scroll-mt-24 flex-col justify-center p-3 sm:p-6 lg:min-h-[calc(100vh-104px)]",
        )}
      >
        <Faq />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-12 border-b-2 border-dashed" />

      <div
        className={cn(
          FRAME_WIDTH,
          "col-start-2 row-start-13 flex flex-col overflow-hidden p-3 sm:p-6",
        )}
      >
        <CTA />
      </div>

      <div className="pointer-events-none col-span-full col-start-1 row-start-14 border-b-2 border-dashed" />

      <div
        className={cn(
          FRAME_WIDTH,
          "col-start-2 row-start-15 flex flex-col px-3 py-10 sm:px-6 sm:py-14",
        )}
      >
        <Footer />
      </div>

      <FrameRails />
    </div>
  );
};

export default Page;
