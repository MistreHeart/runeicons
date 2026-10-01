import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor",
  alternates: { canonical: "/editor" },
  description: "Create and edit custom SVG icons with the RuneIcons editor.",
};

// Rendered by the workspace layout, so switching from /icons only swaps the centre.
export default function EditorPage() {
  return null;
}
