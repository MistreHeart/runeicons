import Link from "next/link";

import { BrandMark } from "@/app/brand-mark";
import { GITHUB_REPO, X_URL } from "@/lib/site";

import FooterWordmark from "./footer-wordmark";

type FooterLinkItem = { title: string; href: string; external?: boolean };

const columns: { heading: string; links: FooterLinkItem[] }[] = [
  {
    heading: "Product",
    links: [
      { title: "Icons", href: "/icons" },
      { title: "Editor", href: "/editor" },
      { title: "Packages", href: "/packages" },
      { title: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Project",
    links: [
      { title: "GitHub", href: GITHUB_REPO, external: true },
      { title: "X", href: X_URL, external: true },
      { title: "Sponsor", href: "/sponsor" },
      { title: "About", href: "/about" },
    ],
  },
  {
    heading: "Team",
    links: [
      { title: "Nexvyn", href: X_URL, external: true },
      { title: "Vansh", href: "https://x.com/vansh1029", external: true },
      { title: "Abhinav", href: "https://x.com/Abhinavstwt", external: true },
      { title: "Mohit", href: "https://x.com/mohitmehtre", external: true },
    ],
  },
];

const legal: FooterLinkItem[] = [
  { title: "Terms", href: "/terms" },
  { title: "Privacy", href: "/privacy" },
];

const FooterLink = ({ title, href, external }: FooterLinkItem) => (
  <Link
    href={href}
    prefetch={external ? undefined : false}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
  >
    {title}
  </Link>
);

const Footer = () => {
  return (
    <footer className="w-full overflow-hidden rounded-3xl border border-border bg-card text-card-foreground">
      <div className="grid gap-10 px-6 pt-10 sm:px-10 md:grid-cols-[1fr_auto]">
        <div className="max-w-xs">
          <Link
            href="/"
            prefetch={false}
            aria-label="Rune Icons home"
            className="inline-flex items-center gap-2 text-foreground"
          >
            <BrandMark size={18} fill="currentColor" />
            <span className="text-lg leading-none font-semibold tracking-[-0.03em]">Rune Icons</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Open-source icons in five styles. Edit them in the browser and copy them out as SVG or
            JSX.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-14 gap-y-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-3 text-sm">
              <p className="font-medium text-foreground">{column.heading}</p>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.title}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-6 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:mx-10">
        <p>© {new Date().getFullYear()} Rune Icons. Released under Apache 2.0.</p>
        <ul className="flex gap-5">
          {legal.map((link) => (
            <li key={link.title}>
              <FooterLink {...link} />
            </li>
          ))}
        </ul>
      </div>

      <FooterWordmark className="mt-8 translate-y-[6%] px-2 sm:mt-10" />
    </footer>
  );
};

export default Footer;
