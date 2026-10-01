"use client";

import { usePathname } from "next/navigation";

import { useEditorWorkspace } from "@/components/editor/use-editor-workspace";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { IconLibraryPanel } from "@/components/icon-page/panels/icon-library";
import { ToolRail } from "@/components/icon-page/panels/outline";
import { KeyboardShortcutsModal } from "@/components/icon-page/panels/outline/components/keyboard-shortcuts-modal";
import { PropertiesPanel } from "@/components/icon-page/panels/properties";
import { useIconsWorkspace } from "@/components/icon-page/panels/workspace/use-icons-workspace";
import { useWorkspaceState } from "@/hooks/use-workspace-state";

/**
 * /icons and /editor in one tree. The tool rail, library and properties panel
 * sit at the same place for both routes, so a tab switch only updates their
 * props and swaps the centre; nothing else remounts or reloads.
 */
export function WorkspaceApp({ editorAssetsUrl }: { editorAssetsUrl: string }) {
  const pathname = usePathname();
  const isEditor = pathname.startsWith("/editor");

  const workspace = useWorkspaceState({ enableKeyboardShortcuts: false });
  const icons = useIconsWorkspace(workspace, !isEditor);
  const editor = useEditorWorkspace(workspace, editorAssetsUrl, isEditor);
  const active = isEditor ? editor : icons;

  return (
    <ErrorBoundary>
      {isEditor ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-background px-8 text-center lg:hidden">
          <p className="text-lg font-medium text-foreground">Please switch to a laptop</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            This needs a bigger screen to work properly.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:hidden">
          <div className="relative flex min-h-0 flex-1">
            <aside className="w-12 shrink-0" aria-label="Icon style">
              <ToolRail {...icons.toolRail} />
            </aside>
            <div className="min-w-0 flex-1 overflow-y-auto" aria-label="Icon library">
              <IconLibraryPanel {...icons.library} />
            </div>
            {icons.mobileActionBar}
          </div>
        </div>
      )}

      <div className="hidden min-h-0 flex-1 overflow-x-auto overflow-y-hidden lg:flex">
        <aside className="relative z-[100] w-12 shrink-0" aria-label="Tool rail">
          <ToolRail {...active.toolRail} />
        </aside>

        <aside className="w-[320px] shrink-0" aria-label="Icon library">
          <IconLibraryPanel {...active.library} />
        </aside>

        {/* Keyed so each route's centre keeps its own subtree. */}
        <div key={isEditor ? "editor" : "icons"} className="flex min-w-0 flex-1">
          {active.center}
        </div>

        <aside
          className="bg-workspace-pattern relative w-[341px] shrink-0 overflow-y-auto border-l border-border"
          aria-label="Customization controls"
        >
          <div className="pointer-events-none absolute inset-0 bg-background/80" />
          <div className="relative z-10">
            <PropertiesPanel {...active.properties} />
          </div>
        </aside>

        <KeyboardShortcutsModal isOpen={active.showHelp} onClose={() => active.setShowHelp(false)} />
      </div>
    </ErrorBoundary>
  );
}
