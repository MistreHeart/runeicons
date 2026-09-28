"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { GithubIcon } from "lucide-react";
import { motion } from "motion/react";

import { BrandMark } from "@/app/brand-mark";
import { LightDarkMode } from "@/components/ui/light-dark-mode";
import { GITHUB_REPO } from "@/lib/site";
import { cn } from "@/lib/utils";

import { GLASS_PILL } from "../../surface";
import { useGitHubStars } from "./hooks/use-github-stars";

const TABS = [
  { href: "/icons", label: "Icons" },
  { href: "/editor", label: "Editor" },
] as const;

interface HeaderPanelProps {
  className?: string;
}

// Same lockup, pills and toggle as the landing navbar, so moving between the
// landing page and the workspace doesn't feel like switching products.
export function HeaderPanel({ className }: HeaderPanelProps) {
  const pathname = usePathname();
  const displayCount = useGitHubStars();
  // Move the pill on click rather than when the route commits, so the tab
  // answers at once; `from` drops the pending tab once the pathname moves on.
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null);
  const activeHref = pending?.from === pathname ? pending.href : pathname;

  return (
    <header className={cn("flex h-14 shrink-0 items-center gap-4 px-4", className)}>
      <div className="flex flex-1 items-center">
        <Link
          href="/"
          prefetch={false}
          aria-label="Rune home"
          className="inline-flex items-center gap-1.75 rounded-md text-foreground transition-opacity duration-150 outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
          <BrandMark size={19} fill="currentColor" />
          <span className="text-[21px] leading-none font-semibold tracking-[-0.04em]">Rune</span>
        </Link>
      </div>

      <nav
        aria-label="Workspace"
        className="flex items-center gap-0.5 rounded-lg bg-foreground/5 p-0.5"
      >
        {TABS.map((tab) => {
          const active = activeHref === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={(e) => {
                // A modified click opens a new tab; this page isn't navigating.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                if (tab.href !== pathname) setPending({ href: tab.href, from: pathname });
              }}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-7 items-center rounded-md px-3.5 text-body-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-foreground/30",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="workspace-tab"
                  className="absolute inset-0 rounded-md bg-background ring-1 ring-foreground/10"
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
              )}
              <span className="relative">{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Link
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`GitHub, ${displayCount} stars`}
          className={cn(
            "hidden h-8 items-center gap-1.5 rounded-lg px-2.5 text-body-sm leading-none font-medium transition-[background-color,scale] duration-150 motion-safe:active:scale-[0.96] sm:inline-flex",
            GLASS_PILL,
          )}
        >
          <GithubIcon className="size-3.5" aria-hidden="true" />
          <span className="inline-block min-w-[3ch] text-left tabular-nums">{displayCount}</span>
        </Link>
        <LightDarkMode className="size-8 rounded-lg border-0 bg-background/60 shadow-none ring-1 ring-foreground/10 backdrop-blur-md hover:bg-background/80" />
      </div>
    </header>
  );
}
