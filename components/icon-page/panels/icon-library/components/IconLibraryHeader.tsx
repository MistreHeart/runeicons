import { RefObject, useMemo } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { IconCategory } from "@/lib/types";
interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  selectedCategory: IconCategory;
  onCategoryChange: (category: IconCategory) => void;
}
export function IconLibraryHeader({
  searchQuery,
  setSearchQuery,
  clearSearch,
  searchInputRef,
  selectedCategory,
  onCategoryChange,
}: HeaderProps) {
  const categories = useMemo<{ value: IconCategory; label: string }[]>(
    () => [
      { value: "all", label: "All" },
      { value: "action", label: "Actions" },
      { value: "accessibility", label: "Accessibility" },
      { value: "commerce", label: "Commerce" },
      { value: "communication", label: "Communication" },
      { value: "dev", label: "Dev & Tech" },
      { value: "feedback", label: "Feedback" },
      { value: "files", label: "Files" },
      { value: "hardware", label: "Hardware" },
      { value: "layout", label: "Layout" },
      { value: "media", label: "Media" },
      { value: "metrics", label: "Metrics" },
      { value: "misc", label: "Misc" },
      { value: "navigation", label: "Navigation" },
      { value: "time", label: "Time" },
      { value: "users", label: "Users" },
      { value: "weather", label: "Weather" },
      { value: "custom", label: "Custom" },
    ],
    [],
  );
  return (
    <div className="flex items-center gap-2 border-b border-border p-3">
      <div className="min-w-0 flex-1">
        <div className="group/search relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/search:text-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search icons"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 rounded-lg border-0 bg-foreground/4 pr-12 pl-9 text-body-sm text-foreground shadow-none ring-1 ring-foreground/7 transition-[background-color,box-shadow] outline-none ring-inset placeholder:text-muted-foreground focus-visible:bg-background focus-visible:ring-foreground/20"
            aria-label="Search icons and shapes"
          />
          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1.5 px-0.5">
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="rounded p-1 text-muted-foreground transition-[scale,color] outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.96]"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex-none">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative flex h-9 min-w-[100px] items-center gap-2 rounded-lg bg-foreground/4 px-3 text-body-sm font-medium whitespace-nowrap text-foreground ring-1 ring-foreground/7 transition-[scale,background-color] ring-inset outline-none hover:bg-foreground/7 focus-visible:ring-foreground/20 active:scale-[0.96]"
              aria-label="Category filter"
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 text-muted-foreground"
              >
                <g>
                  <path
                    d="M3.75 5.75C3.75 4.64543 4.64543 3.75 5.75 3.75H8.25C9.35457 3.75 10.25 4.64543 10.25 5.75V8.25C10.25 9.35457 9.35457 10.25 8.25 10.25H5.75C4.64543 10.25 3.75 9.35457 3.75 8.25V5.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.75 15.75C3.75 14.6454 4.64543 13.75 5.75 13.75H8.25C9.35457 13.75 10.25 14.6454 10.25 15.75V18.25C10.25 19.3546 9.35457 20.25 8.25 20.25H5.75C4.64543 20.25 3.75 19.3546 3.75 18.25V15.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.75 17C13.75 15.2051 15.2051 13.75 17 13.75C18.7949 13.75 20.25 15.2051 20.25 17C20.25 18.7949 18.7949 20.25 17 20.25C15.2051 20.25 13.75 18.7949 13.75 17Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.75 5.75C13.75 4.64543 14.6454 3.75 15.75 3.75H18.25C19.3546 3.75 20.25 4.64543 20.25 5.75V8.25C20.25 9.35457 19.3546 10.25 18.25 10.25H15.75C14.6454 10.25 13.75 9.35457 13.75 8.25V5.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="truncate">
                {categories.find((c) => c.value === selectedCategory)?.label || "All"}
              </span>
              <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 opacity-40" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end" sideOffset={8}>
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className="flex cursor-pointer items-center justify-between gap-2"
              >
                <span className="text-body-sm">{cat.label}</span>
                {selectedCategory === cat.value && <Check className="size-3.5 opacity-70" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
