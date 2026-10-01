"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { ToolRail } from "@/components/icon-page/panels/outline";
import { PropertiesPanel } from "@/components/icon-page/panels/properties";
import { IconLibraryPanel } from "@/components/icon-page/panels/icon-library";
import type { EditorAssetSummary } from "@/lib/editor/types";
import type { useWorkspaceState } from "@/hooks/use-workspace-state";
import { useLocalStorageSyncEffect } from "@/hooks/use-localstorage-sync";
import {
  useEditorSelectionStore,
  selectAssetInStore,
} from "@/stores/editor-selection";
import {
  EDITOR_SUPPORTED_TYPES,
  editorAssetIdToManifest,
  getIconDataById,
  manifestIdToEditorAssetId,
  resolveEditorIconType,
} from "@/lib/icons";
import type { IconCategory, IconData } from "@/lib/types";
import { EditorWorkspaceSection } from "@/components/editor/EditorWorkspaceSection";

const MAX_TRAY_ITEMS = 6;

// Matches the `lg` breakpoint the workspace uses to show the editor. Below it
// only a "switch to a laptop" message shows, so the icon set isn't fetched.
const DESKTOP_QUERY = "(min-width: 1024px)";

// Kept for the life of the tab, so returning to the editor renders at once
// instead of flashing the loading state while the JSON is re-read.
let cachedAssets: { url: string; data: EditorAssetSummary[] } | null = null;

/** Fetches the editor icon set the first time the editor is shown on a desktop-sized screen. */
function useEditorAssets(assetsUrl: string, active: boolean) {
  const [assets, setAssets] = useState<EditorAssetSummary[] | null>(() =>
    cachedAssets?.url === assetsUrl ? cachedAssets.data : null,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!active || assets) return;
    const media = window.matchMedia(DESKTOP_QUERY);
    let cancelled = false;
    let started = false;

    const load = () => {
      if (started || !media.matches) return;
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
  }, [active, assets, assetsUrl]);

  return { assets, failed };
}

/**
 * The /editor workspace: asset selection, path editing and the editor canvas.
 * Like useIconsWorkspace, it returns props for the shared side panels plus its
 * own centre.
 */
export function useEditorWorkspace(
  workspace: ReturnType<typeof useWorkspaceState>,
  assetsUrl: string,
  active: boolean,
) {
  useLocalStorageSyncEffect();
  const { assets, failed } = useEditorAssets(assetsUrl, active);
  const { state, handleChange, handleReset } = workspace;
  const resetDocumentRef = useRef<() => void>(() => {});
  const [selectedPathCount, setSelectedPathCount] = useState(0);

  const editorIconType = resolveEditorIconType(state.iconType);

  const hasInitRef = useRef(false);
  useEffect(() => {
    if (!assets || hasInitRef.current) return;
    hasInitRef.current = true;
    const initialAssets = assets.filter(
      (asset) => asset.variant === editorIconType,
    );
    const seedAssets = initialAssets.length > 0 ? initialAssets : assets;
    useEditorSelectionStore.setState({
      selectedAssetId: seedAssets[0]?.id ?? null,
      trayAssetIds: seedAssets.slice(0, MAX_TRAY_ITEMS).map((a) => a.id),
    });
  }, [assets, editorIconType]);

  const selectedAssetId = useEditorSelectionStore((s) => s.selectedAssetId);

  const [activeCategory, setActiveCategory] = useState<IconCategory>("all");
  const [showHelp, setShowHelp] = useState(false);

  const handleFullReset = useCallback(() => {
    handleReset();
    resetDocumentRef.current();
  }, [handleReset]);

  const handleLibrarySelect = useCallback(
    (icon: IconData) => {
      const targetType = icon.iconType
        ? resolveEditorIconType(icon.iconType)
        : editorIconType;
      const editorId = manifestIdToEditorAssetId(icon.id, targetType);
      if (!editorId) return;
      if (targetType !== state.iconType) {
        handleChange({ iconType: targetType });
      }
      selectAssetInStore(editorId);
    },
    [editorIconType, handleChange, state.iconType],
  );

  const handleTypeChange = useCallback(
    (nextType: typeof state.iconType) => {
      handleChange({ iconType: nextType });
      const clamped = resolveEditorIconType(nextType);
      const mapped = selectedAssetId
        ? editorAssetIdToManifest(selectedAssetId)
        : null;
      if (mapped) {
        const nextEditorId = manifestIdToEditorAssetId(mapped.id, clamped);
        if (nextEditorId && nextEditorId !== selectedAssetId) {
          selectAssetInStore(nextEditorId);
        }
      }
    },
    [handleChange, selectedAssetId],
  );

  const librarySelectedId = useMemo(() => {
    if (!selectedAssetId) return null;
    const mapped = editorAssetIdToManifest(selectedAssetId);
    return mapped?.id ?? null;
  }, [selectedAssetId]);

  const selectedIconForPanel = useMemo(() => {
    if (!selectedAssetId) return null;
    const mapped = editorAssetIdToManifest(selectedAssetId);
    if (!mapped) return null;
    const iconData = getIconDataById(mapped.id, mapped.iconType);
    if (!iconData) return null;
    return {
      ...iconData,
      iconType: mapped.iconType,
      pathCount: selectedPathCount,
    };
  }, [selectedAssetId, selectedPathCount]);

  const handleDeleteCustomIcon = useCallback((_id: string) => {}, []);

  const toolRail: ComponentProps<typeof ToolRail> = {
    activeType: state.iconType,
    onTypeChange: handleTypeChange,
    onHelpClick: () => setShowHelp(true),
    supportedTypes: EDITOR_SUPPORTED_TYPES,
  };

  const library: ComponentProps<typeof IconLibraryPanel> = {
    onIconSelect: handleLibrarySelect,
    selectedIconId: librarySelectedId,
    selectedCategory: activeCategory,
    onCategoryChange: setActiveCategory,
    customIcons: state.customIcons,
    iconType: editorIconType,
  };

  const properties: ComponentProps<typeof PropertiesPanel> = {
    state,
    selectedIcon: selectedIconForPanel,
    onIconSelect: handleLibrarySelect,
    onDeleteIcon: handleDeleteCustomIcon,
    onChange: handleChange,
    onReset: handleFullReset,
  };

  const center = assets ? (
    <EditorWorkspaceSection
      assets={assets}
      state={state}
      onGlobalStateChange={handleChange}
      resetDocumentRef={resetDocumentRef}
      onFullReset={handleFullReset}
      onPathCountChange={setSelectedPathCount}
    />
  ) : (
    <main className="flex flex-1 items-center justify-center" aria-label="Editor workspace">
      <p className="text-body-sm text-muted-foreground">
        {failed ? "Couldn't load the icon set. Refresh to try again." : "Loading editor…"}
      </p>
    </main>
  );

  return { toolRail, library, properties, center, showHelp, setShowHelp };
}
