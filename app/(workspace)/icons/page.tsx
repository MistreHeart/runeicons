import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse icons",
  alternates: { canonical: "/icons" },
  description: "Browse and customize 900+ beautiful icons.",
};

// Rendered by the workspace layout, so switching to /editor only swaps the centre.
export default function IconsPage() {
  return null;
}
