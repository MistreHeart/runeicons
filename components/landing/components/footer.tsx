import Link from "next/link";

import { GITHUB_REPO, X_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

// Everything else lives in the navbar; the footer only carries what the navbar
// doesn't.
const links = [
  { title: "GitHub", href: GITHUB_REPO, external: true },
  { title: "X", href: X_URL, external: true },
  { title: "Terms", href: "/terms" },
  { title: "Privacy", href: "/privacy" },
];

const ArrowUpRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-[15px] shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

/**
 * On hover the label blurs up and out while a copy slides in from below.
 */
const RollLink = ({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: string;
  external?: boolean;
  className?: string;
}) => (
  <Link
    href={href}
    prefetch={external ? undefined : false}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={cn("group relative inline-flex items-center gap-0.5", className)}
  >
    <span className="relative overflow-hidden">
      <span className="block transition-[translate,filter,opacity] duration-300 ease-out group-hover:-translate-y-full group-hover:opacity-0 group-hover:blur-[2px] motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full opacity-0 blur-[2px] transition-[translate,filter,opacity] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-none motion-reduce:transition-none"
      >
        {children}
      </span>
    </span>
    {external && <ArrowUpRight />}
  </Link>
);

/** A small domed bolt, like the corner screws on a mounted plate. */
const Screw = ({ className }: { className: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "absolute z-10 size-3 rounded-full border border-border bg-muted sm:size-4",
      className,
    )}
  />
);

const Footer = () => {
  return (
    <footer className="@container relative w-full overflow-hidden rounded-3xl border border-border bg-card text-card-foreground lg:rounded-4xl">
      <Screw className="top-3 left-3 sm:top-6 sm:left-6" />
      <Screw className="top-3 right-3 sm:top-6 sm:right-6" />
      <Screw className="bottom-3 left-3 sm:bottom-6 sm:left-6" />
      <Screw className="right-3 bottom-3 sm:right-6 sm:bottom-6" />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pad-panel">
        <h2 className="text-h2">Draw less. Ship more.</h2>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-body-sm">
          {links.map((item) => (
            <RollLink key={item.title} href={item.href} external={item.external}>
              {item.title}
            </RollLink>
          ))}
        </nav>
      </div>

      {/* Oversized wordmark after cronicle.me: soft grey letters that fade out
          and run off the bottom edge. Decorative, so hidden from assistive tech. */}
      <p
        aria-hidden="true"
        className="mt-6 -mb-[0.2em] text-center font-special-gothic text-[17.5cqw] leading-[0.8] font-bold tracking-[-0.05em] whitespace-nowrap text-foreground/[0.08] uppercase select-none [mask-image:linear-gradient(to_bottom,black_30%,transparent_85%)] sm:mt-10"
      >
        Rune Icons
      </p>
    </footer>
  );
};

export default Footer;
