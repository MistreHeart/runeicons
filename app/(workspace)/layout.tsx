import { HeaderPanel } from "@/components/icon-page/panels/header";
import { APP_GROUND } from "@/components/icon-page/surface";
import { TuningProvider } from "@/components/icon-page/tuning";
import { cn } from "@/lib/utils";

// /icons and /editor share this layout so the header and ground stay mounted
// across the tab switch. Only the panels below swap, and the tab pill slides
// instead of the whole page flashing.
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <TuningProvider>
      <div className={cn("flex h-screen flex-col", APP_GROUND)}>
        <HeaderPanel />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </TuningProvider>
  );
}
