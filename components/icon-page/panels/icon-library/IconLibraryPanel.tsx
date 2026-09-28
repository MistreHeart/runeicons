"use client";
import { IconLibraryPanelProps } from "./types";
import { useIconLibrary } from "./hooks/use-icon-library";
import { IconLibraryHeader } from "./components/IconLibraryHeader";
import { IconGrid } from "./components/IconGrid";
import { EmptyState } from "./components/EmptyState";
export function IconLibraryPanel({
  onIconSelect,
  selectedIconId,
  selectedCategory,
  onCategoryChange,
  customIcons = [],
  iconType,
  customizationState,
}: IconLibraryPanelProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredIcons,
    handleIconClick,
    clearSearch,
    searchInputRef,
  } = useIconLibrary(selectedCategory, iconType, onIconSelect, customIcons);
  const isSearching = searchQuery.length > 0;
  return (
    <div className="group/panel relative flex h-full flex-col overflow-hidden">
      <div className="relative z-10 flex h-full flex-col">
        <IconLibraryHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          searchInputRef={searchInputRef}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            clearSearch();
            onCategoryChange(cat);
          }}
        />
        <div
          className="flex-1 overflow-y-auto scrollbar-hide"
          role="tabpanel"
          aria-label="Assets"
        >
          <IconGrid
            icons={filteredIcons}
            selectedIconId={selectedIconId ?? null}
            onIconClick={handleIconClick}
            isSearching={isSearching}
            iconType={iconType}
            customizationState={customizationState}
          />
          <EmptyState isVisible={filteredIcons.length === 0} onClearSearch={clearSearch} />
        </div>
      </div>
    </div>
  );
}
