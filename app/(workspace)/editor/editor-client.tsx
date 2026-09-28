"use client";

import { useEffect, useState } from "react";

import { EditorShell } from "@/components/editor/EditorShell";
import type { EditorAssetSummary } from "@/lib/editor/types";

// Matches the `lg` breakpoint EditorShell uses to show the editor. Below it the
// shell only shows a "switch to a laptop" message, so the icon set isn't fetched.
const DESKTOP_QUERY = "(min-width: 1024px)";

// Kept for the life of the tab, so switching back to the editor renders at
// once instead of flashing the loading state while the JSON is re-read.
let cachedAssets: { url: string; data: EditorAssetSummary[] } | null = null;

export function EditorClient({ assetsUrl }: { assetsUrl: string }) {
  const [assets, setAssets] = useState<EditorAssetSummary[] | null>(() =>
    cachedAssets?.url === assetsUrl ? cachedAssets.data : null,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    let cancelled = false;
    let started = false;

    const load = () => {
      if (started || !media.matches || cachedAssets?.url === assetsUrl) return;
      started = true;
      fetch(assetsUrl)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<EditorAssetSummary[]>;
        })
        .then((data) => {
          cachedAssets = { url: assetsUrl, data };
          if (!cancelled) setAssets(data);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    };

    load();
    media.addEventListener("change", load);
    return () => {
      cancelled = true;
      media.removeEventListener("change", load);
    };
  }, [assetsUrl]);

  if (assets) return <EditorShell assets={assets} />;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
      <p className="text-h3 text-foreground lg:hidden">Please switch to a laptop</p>
      <p className="max-w-xs text-body-sm text-muted-foreground lg:hidden">
        This needs a bigger screen to work properly.
      </p>
      <p className="hidden text-body-sm text-muted-foreground lg:block">
        {failed ? "Couldn't load the icon set. Refresh to try again." : "Loading editor…"}
      </p>
    </div>
  );
}
