import Link from "next/link";

import { Button } from "@/components/ui/button";

import RocketBurstScene from "./rocket-burst-scene";

const NotFoundContent = () => (
  <div className="flex w-full flex-col items-center text-center">
    <div
      className="w-full"
      style={{ height: "clamp(280px, 50vh, 500px)", maxWidth: "clamp(175px, 32vh, 320px)" }}
    >
      <RocketBurstScene />
    </div>

    <div className="mt-8 flex w-fit -rotate-2 items-center gap-2 rounded-md border px-2.5 py-1 text-label">
      <span className="font-semibold text-blue-700">404</span>
      <span className="text-muted-foreground">page not found</span>
    </div>

    <h1 className="mt-4 text-h1">
      This page never made it <span className="text-blue-700">off the pad</span>
    </h1>

    <p className="mt-4 max-w-md text-lead text-muted-foreground">
      The link is broken, or the page moved somewhere we forgot to tell you about.
    </p>

    <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-4">
      <Link href="/icons" prefetch={false}>
        <Button className="bg-brand py-5 text-white hover:bg-brand/90 dark:hover:bg-brand/90">Browse Icons</Button>
      </Link>
      <Link href="/" prefetch={false}>
        <Button className="py-5">Back to home</Button>
      </Link>
    </div>
  </div>
);

export default NotFoundContent;
