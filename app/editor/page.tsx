import type { Metadata } from "next";

import { createHash } from "node:crypto";

import { TuningProvider } from "@/components/icon-page/tuning";
import { getEditorAssets } from "@/lib/editor/assets";

import { EditorClient } from "./editor-client";

export const metadata: Metadata = {
  title: "Editor",
  alternates: { canonical: "/editor" },
  description: "Create and edit custom SVG icons with the RuneIcons editor.",
};

export default async function EditorPage() {
  // The icon set is ~1.4 MB of path data. Inlining it made every visit and
  // every client-side navigation download it again, so it is fetched from a
  // static, long-cached JSON file instead. The hash busts that cache when the
  // icons change.
  const assets = await getEditorAssets();
  const version = createHash("sha1").update(JSON.stringify(assets)).digest("hex").slice(0, 12);

  return (
    <TuningProvider>
      <EditorClient assetsUrl={`/editor/assets.json?v=${version}`} />
    </TuningProvider>
  );
}
