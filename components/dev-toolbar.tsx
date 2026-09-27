"use client";

import dynamic from "next/dynamic";

/**
 * Agentation visual-feedback toolbar — development only.
 *
 * Behind a lazy `import()` so the ~410 kB package gets its own chunk that
 * production never requests. Referencing it directly from the server layout
 * would register a client reference and bundle it on every route.
 */
const Agentation = dynamic(() => import("agentation").then((m) => m.Agentation), {
  ssr: false,
});

export function DevToolbar() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation />;
}
