import { createHash } from "node:crypto";

import { HeaderPanel } from "@/components/icon-page/panels/header";
import { TuningProvider } from "@/components/icon-page/tuning";
import { WorkspaceApp } from "@/components/workspace/WorkspaceApp";
import { getEditorAssets } from "@/lib/editor/assets";

// /icons and /editor share this layout, and the whole workspace lives here
// rather than in the pages, so a tab switch keeps the header and side panels
// mounted and only swaps the centre. The pages only carry metadata.
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  // The editor icon set is ~1.4 MB of path data, so it is fetched from a
  // static, long-cached JSON file instead of being inlined. The hash busts that
  // cache when the icons change.
  const assets = await getEditorAssets();
  const version = createHash("sha1").update(JSON.stringify(assets)).digest("hex").slice(0, 12);

  return (
    <TuningProvider>
      <div className="flex h-screen flex-col bg-background">
        <HeaderPanel />
        <div className="flex min-h-0 flex-1 flex-col">
          <WorkspaceApp editorAssetsUrl={`/editor/assets.json?v=${version}`} />
          {children}
        </div>
      </div>
    </TuningProvider>
  );
}
