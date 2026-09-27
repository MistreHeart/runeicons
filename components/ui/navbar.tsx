"use client";

import { useEffect, useId, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NumberFlow from "@number-flow/react";
import { GithubIcon, MenuIcon, XIcon } from "lucide-react";
import { AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import * as m from "motion/react-m";

import { BrandMark } from "@/app/brand-mark";
import { useGitHubStars } from "@/components/icon-page/panels/header/hooks/use-github-stars";
import { useCountUp } from "@/components/landing/hooks/use-count-up";
import { LightDarkMode } from "@/components/ui/light-dark-mode";
import { EASE_OUT_QUINT } from "@/lib/easing";
import { GITHUB_REPO } from "@/lib/site";
import { cn } from "@/lib/utils";

const HERO_REVEAL_PX = 12;
const SCROLL_JITTER_PX = 2;

const BANNER_FALLBACK = "#1a43c7";

// Kept as a literal: importing TOTAL_ICON_COUNT from @/lib/icons would pull the
// icon manifest into every page that renders the navbar.
const BANNER_ICON_COUNT = 900;

const BANNER_REVEAL = { duration: 0.22, ease: EASE_OUT_QUINT } as const;
const BANNER_HIDE = { duration: 0.15, ease: EASE_OUT_QUINT } as const;

const BANNER_COLLAPSE = {
  visible: { height: "auto" },
  hidden: { height: 0 },
} as const;

const BANNER_SLIDE = {
  visible: { y: 0 },
  hidden: { y: "-100%" },
} as const;

// Mobile menu motion, sampled from orchid.ai: the panel drops 8px while
// un-blurring, and the menu/close glyph spins out before the next spins in.
const MENU_PANEL = {
  initial: { opacity: 0, y: -8, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -4, filter: "blur(8px)" },
} as const;

const MENU_GLYPH = {
  initial: { opacity: 0, scale: 0.6, rotate: -90 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.6, rotate: 90 },
} as const;

const MENU_PANEL_TRANSITION = { duration: 0.2, ease: EASE_OUT_QUINT } as const;
const MENU_GLYPH_TRANSITION = { duration: 0.15, ease: EASE_OUT_QUINT } as const;

// Shared pill surfaces (orchid's paper/ink pair, mapped to theme tokens).
const GLASS_PILL =
  "bg-background/60 text-foreground ring-1 ring-foreground/10 backdrop-blur-md hover:bg-background/80";
const SOLID_PILL = "bg-foreground text-background hover:opacity-90";

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  showBanner?: boolean;
  showDashedBorder?: boolean;
  links?: NavLink[];
}

const Navbar = ({ showBanner = false, showDashedBorder = false, links = [] }: NavbarProps) => {
  const [bannerHidden, setBannerHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const iconCount = useCountUp(BANNER_ICON_COUNT);
  const { scrollY } = useScroll();
  const githubStars = useGitHubStars();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > HERO_REVEAL_PX);

    const previous = scrollY.getPrevious() ?? 0;
    const delta = latest - previous;

    if (latest <= HERO_REVEAL_PX) {
      setBannerHidden(false);
      return;
    }

    if (Math.abs(delta) < SCROLL_JITTER_PX) return;

    setBannerHidden(delta > 0);
  });

  // Close the mobile menu on navigation (adjusting state during render, not in an effect).
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {showBanner && (
        <m.div
          className="overflow-hidden"
          initial={false}
          animate={bannerHidden ? "hidden" : "visible"}
          variants={BANNER_COLLAPSE}
          transition={bannerHidden ? BANNER_HIDE : BANNER_REVEAL}
        >
          <m.div
            initial={false}
            animate={bannerHidden ? "hidden" : "visible"}
            variants={BANNER_SLIDE}
            transition={bannerHidden ? BANNER_HIDE : BANNER_REVEAL}
          >
            <Link
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: BANNER_FALLBACK }}
              className="relative block overflow-hidden border-b border-black/15 px-4 py-2 text-center text-label font-medium text-white sm:px-8 md:px-24"
            >
              <Image
                src="/landing/gradient/cta-gradient.webp"
                className="absolute inset-0 h-full w-full object-cover"
                alt=""
                fill
                sizes="100vw"
                unoptimized
              />
              <span className="relative z-10 flex flex-wrap items-center justify-center text-micro sm:text-label">
                Rune Icons now includes&nbsp;
                <NumberFlow value={iconCount} suffix="+" />
                &nbsp;modern icons for your products.
              </span>
            </Link>
          </m.div>
        </m.div>
      )}

      <header
        className={cn(
          "flex w-full justify-center transition-[background-color,backdrop-filter] duration-200",
          scrolled || menuOpen
            ? "bg-[#F5F5F5]/80 backdrop-blur-md dark:bg-background/80"
            : "bg-transparent",
          showDashedBorder && "border-b-2 border-dashed",
        )}
      >
        <div className="flex w-[95vw] max-w-360 items-center justify-between px-3 py-5 sm:px-6 md:w-[90vw] 2xl:w-[85vw] 2xl:max-w-450">
          <div className="flex items-center gap-9">
            <Link
              href="/"
              prefetch={false}
              aria-label="Rune home"
              className="relative inline-flex items-center rounded-md transition-opacity duration-150 outline-none before:absolute before:-inset-y-1.5 before:-inset-x-1.5 before:content-[''] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/30"
            >
              {/* Mark sized to the wordmark's cap height so neither outweighs the other. */}
              <span className="inline-flex items-center gap-[7px] text-foreground">
                <BrandMark size={19} fill="currentColor" />
                <span className="text-h3 leading-none font-semibold tracking-[-0.04em]">Rune</span>
              </span>
            </Link>

            {links.length > 0 && (
              <nav className="hidden items-center md:flex">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className="inline-flex items-center rounded-lg px-4 py-2 text-body-sm leading-none text-foreground/80 transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/30"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub, ${githubStars} stars`}
              className={cn(
                "relative hidden items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-body-sm leading-none font-medium transition-[opacity,scale,background-color] duration-150 before:absolute before:inset-x-0 before:-inset-y-1.25 before:content-[''] motion-safe:active:scale-[0.96] md:inline-flex",
                GLASS_PILL,
              )}
            >
              <GithubIcon className="size-3.5" aria-hidden="true" />
              <span className="inline-block min-w-[3ch] text-left tabular-nums">{githubStars}</span>
            </Link>

            <LightDarkMode className="size-8 rounded-lg border-0 bg-background/60 shadow-none ring-1 ring-foreground/10 backdrop-blur-md hover:bg-background/80" />

            <Link
              href="/icons"
              className={cn(
                "relative hidden items-center justify-center rounded-lg px-2.5 py-2 text-body-sm leading-none font-medium transition-[opacity,scale] duration-150 before:absolute before:inset-x-0 before:-inset-y-1.25 before:content-[''] motion-safe:active:scale-[0.96] md:inline-flex",
                SOLID_PILL,
              )}
            >
              Browse Icons
            </Link>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className={cn(
                "relative inline-flex size-8 touch-manipulation items-center justify-center rounded-lg outline-none transition-[background-color,scale] duration-150 before:absolute before:-inset-2 before:content-[''] focus-visible:ring-2 focus-visible:ring-foreground/30 motion-safe:active:scale-[0.96] md:hidden",
                GLASS_PILL,
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={menuOpen ? "close" : "menu"}
                  className="inline-flex"
                  variants={MENU_GLYPH}
                  initial={reduceMotion ? false : "initial"}
                  animate="animate"
                  exit={reduceMotion ? { opacity: 0 } : "exit"}
                  transition={reduceMotion ? { duration: 0 } : MENU_GLYPH_TRANSITION}
                >
                  {menuOpen ? (
                    <XIcon className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
                  ) : (
                    <MenuIcon className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
                  )}
                </m.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <m.nav
            id={menuId}
            aria-label="Mobile"
            variants={MENU_PANEL}
            initial={reduceMotion ? false : "initial"}
            animate="animate"
            exit={reduceMotion ? { opacity: 0 } : "exit"}
            transition={reduceMotion ? { duration: 0 } : MENU_PANEL_TRANSITION}
            className="absolute inset-x-6 top-full mt-1 max-h-[calc(100dvh-96px)] overflow-y-auto overscroll-contain rounded-3xl bg-background p-3 ring-1 ring-foreground/8 ring-inset md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={closeMenu}
                className="flex min-h-11 touch-manipulation items-center rounded-xl px-2.5 py-2.5 text-body leading-none text-foreground/80 transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:bg-foreground/6 focus-visible:ring-2 focus-visible:ring-foreground/30"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2 p-1.5">
              <Link
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-lg bg-foreground/4 px-4 text-body-sm leading-none font-medium text-foreground ring-1 ring-foreground/10 transition-colors outline-none ring-inset hover:bg-foreground/7 focus-visible:ring-2 focus-visible:ring-foreground/30"
              >
                <GithubIcon className="size-4" aria-hidden="true" />
                Star on GitHub
                <span className="text-foreground/60 tabular-nums">{githubStars}</span>
              </Link>
              <Link
                href="/icons"
                onClick={closeMenu}
                className="flex min-h-11 w-full touch-manipulation items-center justify-center rounded-lg bg-foreground px-4 text-body-sm leading-none font-medium text-background transition-[opacity,scale] duration-150 outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/30 motion-safe:active:scale-[0.98]"
              >
                Browse Icons
              </Link>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
