import Link from "next/link";

import { cn } from "@/lib/utils";
import { GITHUB_REPO, X_URL } from "@/lib/site";

import FooterWordmark from "./footer-wordmark";

const socialLinks = [
  { title: "GitHub", href: GITHUB_REPO },
  { title: "X / Twitter", href: X_URL },
];

const pageLinks = [
  { title: "Icons", href: "/icons" },
  { title: "Packages", href: "/packages" },
  { title: "Changelog", href: "/changelog" },
  { title: "Terms", href: "/terms" },
  { title: "Privacy", href: "/privacy" },
];

const team = [
  { title: "Nexvyn", href: X_URL },
  { title: "Vansh", href: "https://x.com/vansh1029" },
  { title: "Abhinav", href: "https://x.com/Abhinavstwt" },
  { title: "Mohit", href: "https://x.com/mohitmehtre" },
];

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
    className={cn("group relative inline-flex items-center", className)}
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
    <footer className="relative w-full overflow-hidden rounded-3xl border border-border bg-card text-card-foreground lg:rounded-4xl">
      <Screw className="top-3 left-3 sm:top-6 sm:left-6" />
      <Screw className="top-3 right-3 sm:top-6 sm:right-6" />
      <Screw className="bottom-3 left-3 sm:bottom-6 sm:left-6" />
      <Screw className="right-3 bottom-3 sm:right-6 sm:bottom-6" />

      <div className="relative z-10 flex flex-col gap-10 pad-panel sm:gap-12">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2 className="text-h2">
            Draw less. Ship more.
          </h2>
          <p className="text-body-sm text-muted-foreground">
            © {new Date().getFullYear()} Rune Icons · Apache 2.0
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-3">
            <RollLink
              href={GITHUB_REPO}
              external
              className="w-fit text-lead text-foreground"
            >
              Star Rune Icons on GitHub
            </RollLink>
            <p className="flex flex-wrap items-center gap-x-1.5 text-body-sm text-muted-foreground">
              Made by
              {team.map((person, i) => (
                <span key={person.title} className="inline-flex items-center">
                  <RollLink href={person.href} external className="text-foreground/80 hover:text-foreground">
                    {person.title}
                  </RollLink>
                  {i < team.length - 1 && <span className="ml-0.5">,</span>}
                </span>
              ))}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-lead">
              {socialLinks.map((item) => (
                <RollLink key={item.title} href={item.href} external>
                  {item.title}
                </RollLink>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-muted-foreground">
              {pageLinks.map((item) => (
                <RollLink key={item.title} href={item.href} className="hover:text-foreground">
                  {item.title}
                </RollLink>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <FooterWordmark className="mt-8 translate-y-[6%] px-2 sm:mt-12" />
    </footer>
  );
};

export default Footer;
