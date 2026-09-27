import type { ReactNode } from "react";

import Footer from "@/components/landing/components/footer";
import { FRAME_WIDTH, FrameRails } from "@/components/layout/page-frame";
import Navbar from "@/components/ui/navbar";
import { NAV_LINKS } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

type DocsShellProps = {
  title: string;
  lead: ReactNode;
  wide?: boolean;
  children: ReactNode;
};

const DocsShell = ({ title, lead, wide = false, children }: DocsShellProps) => (
  <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F5F5F5] dark:bg-background">
    <FrameRails />

    <div className={cn(FRAME_WIDTH, "mx-auto flex flex-col")}>
      <Navbar showDashedBorder links={NAV_LINKS} />

      <div
        className={cn(
          "mx-auto flex w-full flex-col gap-10 px-4 pt-32 pb-14 sm:gap-12 sm:px-6 sm:pb-18 lg:px-8 lg:pb-22",
          wide ? "max-w-6xl" : "max-w-2xl",
        )}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-h1">{title}</h1>
          <p className="max-w-[65ch] text-lead text-muted-foreground">{lead}</p>
        </div>

        {children}
      </div>

      <div className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
        <Footer />
      </div>
    </div>
  </div>
);

export default DocsShell;
