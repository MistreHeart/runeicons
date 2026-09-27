import Link from "next/link";

import TextHighlightWave from "@/components/ui/text-highlight-wave";

const PLATFORMS = [
  { name: "React", logo: "/brand/react.svg", install: "pnpm add runeicons-react" },
  { name: "Vue", logo: "/brand/vuejs.svg", install: "pnpm add runeicons-vue" },
  { name: "Svelte", logo: "/brand/svelte.svg", install: "pnpm add runeicons-svelte" },
  { name: "Astro", logo: "/brand/astro.svg", install: "pnpm add runeicons-astro" },
  { name: "React Native", logo: "/brand/react.svg", install: "npm install runeicons-react-native" },
  { name: "Flutter", logo: "/brand/flutter.svg", install: "flutter pub add runeicons" },
  { name: "JavaScript", logo: "/brand/javascript.svg", install: "pnpm add runeicons" },
  { name: "VS Code", logo: "/brand/vscode.svg", install: "Rune Icons: Insert Icon" },
  { name: "Figma", logo: "/brand/figma.svg", install: "Import plugin from manifest" },
  { name: "MCP", logo: "/brand/mcp.svg", install: "npx -y runeicons-mcp" },
];

const Packages = () => (
  <div className="flex flex-col gap-10 sm:gap-12">
    <div className="flex flex-col">
      <span className="text-label font-medium tracking-[0.08em] text-muted-foreground uppercase">
        Packages
      </span>
      <TextHighlightWave
        as="h2"
        className="mt-3 text-h2"
        text={["One set, every platform"]}
      />
      <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
        The same 900+ icons in all five styles, packaged for the tools you already use. Nothing is
        fetched at runtime.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
      {PLATFORMS.map((platform) => (
        <Link
          key={platform.name}
          href="/packages"
          prefetch={false}
          className="group flex flex-col gap-4 rounded-2xl border border-border bg-card pad-card text-card-foreground transition-colors duration-150 ease-out hover:bg-foreground/[0.03]"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-foreground/[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={platform.logo}
              alt={`${platform.name} logo`}
              width={22}
              height={22}
              className="size-[22px]"
              loading="lazy"
            />
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="text-h3">{platform.name}</h3>
            <span className="truncate font-mono text-label text-muted-foreground">
              {platform.install}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default Packages;
