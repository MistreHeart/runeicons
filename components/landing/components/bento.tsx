import React from "react";

import TextHighlightWave from "@/components/ui/text-highlight-wave";

import BentoCenterSvg from "../svg/bento-center-svg";
import BentoSvg from "../svg/bento-svg";
import RocketInteractive from "../svg/rocket-interactive";
import IconCarousel from "./icon-carousel";
import { IconVarietyShowcase } from "./icon-variety-showcase";

interface BentoCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  graphicClassName?: string;
  fullBackgroundGraphic?: boolean;
  inlineLabel?: boolean;
}

const BentoCard = ({
  title,
  description,
  children,
  className,
  graphicClassName,
  fullBackgroundGraphic,
  inlineLabel,
}: BentoCardProps) => {
  const label = (title || description) && (
    <div
      className={
        inlineLabel
          ? "relative z-10 flex flex-col gap-2 pad-card"
          : "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 pad-card"
      }
    >
      <TextHighlightWave as="h3" className="text-h3" text={title} />
      <p className="text-body-sm text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div
      className={`ease relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground transition-colors duration-150 hover:bg-foreground/[0.03] md:rounded-3xl ${className}`}
    >
      <div
        className={
          fullBackgroundGraphic
            ? `absolute inset-0 z-0 overflow-hidden ${graphicClassName ?? ""}`
            : `relative z-0 flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 md:p-6 ${graphicClassName ?? ""}`
        }
      >
        {children}
      </div>
      {label}
    </div>
  );
};

const Bento = () => {
  return (
    <section className="w-full">
      <div className="mx-auto grid min-h-[60vh] w-full grid-cols-1 gap-4 max-sm:h-full sm:gap-6 lg:h-[calc(100vh-104px)] lg:grid-cols-12">
        <div className="grid min-h-0 grid-cols-1 gap-4 sm:gap-6 lg:col-span-4 lg:grid-rows-[6fr_4fr]">
          <BentoCard
            title="Five styles, one library"
            description="Outline, duotone, fill, pixel, glass. The same glyph, drawn five ways."
            className="h-full"
            inlineLabel
          >
            <RocketInteractive />
          </BentoCard>
          <BentoCard
            title="Edit in the browser"
            description="Grab a point, drag it, watch the path bend. No Figma round-trip."
            className="h-full"
            inlineLabel
          >
            <IconVarietyShowcase />
          </BentoCard>
        </div>

        <BentoCard
          title="Snaps to your grid"
          description="Built on a 24px grid so nothing lands half a pixel off."
          className="h-full min-h-0 lg:col-span-3"
          inlineLabel
        >
          <BentoCenterSvg />
        </BentoCard>

        <div className="grid min-h-0 grid-cols-1 gap-4 sm:gap-6 lg:col-span-5 lg:grid-rows-[5fr_5fr]">
          <BentoCard
            title="Tune every detail"
            description="Stroke, size, color, motion. Dial each icon in until it fits."
            className="h-full"
            graphicClassName="p-0!"
            inlineLabel
          >
            <IconCarousel />
          </BentoCard>
          <BentoCard
            title="Drawn by hand"
            description="Every curve was placed on purpose. They stay sharp at any size."
            className="h-full max-lg:aspect-square"
            fullBackgroundGraphic
          >
            <BentoSvg />
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default Bento;
