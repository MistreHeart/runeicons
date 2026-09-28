import type { Metadata } from "next";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WorkspaceShell } from "@/components/icon-page/panels/workspace";

export const metadata: Metadata = {
  title: "Browse icons",
  alternates: { canonical: "/icons" },
  description: "Browse and customize 900+ beautiful icons.",
};

export default function Home() {
  return (
    <ErrorBoundary>
      <WorkspaceShell />
    </ErrorBoundary>
  );
}
