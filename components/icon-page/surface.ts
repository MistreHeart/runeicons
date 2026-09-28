// Shared surfaces for the icons and editor workspaces, matched to the landing page:
// white cards with a hairline border on the same #F5F5F5 ground, neutral controls,
// and black as the only solid accent.

/** Page ground behind the panels (same as the landing page frame). */
export const APP_GROUND = "bg-[#F5F5F5] dark:bg-background";

/** A workspace panel: tool rail, library, canvas, properties. */
export const PANEL = "overflow-hidden rounded-2xl border border-border bg-card";

/** Translucent pill used for secondary header actions (GitHub, theme). */
export const GLASS_PILL =
  "bg-background/60 text-foreground ring-1 ring-foreground/10 backdrop-blur-md hover:bg-background/80";

/** Solid ink pill for the primary action. */
export const SOLID_PILL = "bg-foreground text-background hover:opacity-90";

/** A field row in the properties panel (scrubbers, colour rows, toggles). */
export const FIELD =
  "rounded-lg bg-foreground/3 ring-1 ring-inset ring-foreground/7 transition-[background-color,box-shadow] duration-150 hover:ring-foreground/15";

/** Label text inside a field row. */
export const FIELD_LABEL = "text-label text-foreground/75";

/** Section eyebrow, as on the landing page ("Packages"). */
export const EYEBROW = "text-label font-medium uppercase tracking-[0.08em] text-muted-foreground";

/** Segmented control track and its items. */
export const SEGMENT = "flex rounded-md bg-foreground/5 p-0.5";
export const SEGMENT_ITEM =
  "h-6 rounded-[5px] px-2.5 text-label font-medium transition-[background-color,color,box-shadow] duration-150";
export const SEGMENT_ITEM_ON = "bg-background text-foreground ring-1 ring-foreground/10";
export const SEGMENT_ITEM_OFF = "text-muted-foreground hover:text-foreground";
