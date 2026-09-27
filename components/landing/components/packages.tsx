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
  <div className="flex flex-col gap-2">
    <div className="flex flex-col gap-2">
      <TextHighlightWave
        as="h2"
        className="text-3xl font-medium sm:text-4xl"
        text={["One set, ", { text: "every platform", className: "text-blue-700" }]}
      />
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        The same 900+ icons in all five styles, packaged for the tools you already use. Nothing is
        fetched at runtime.
      </p>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {PLATFORMS.map((platform) => (
        <Link
          key={platform.name}
          href="/packages"
          prefetch={false}
          className="group flex flex-col rounded-2xl border border-border bg-card p-4 text-card-foreground transition-colors duration-150 ease-out hover:border-foreground/20"
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
          <span className="mt-3 text-sm font-semibold">{platform.name}</span>
          <span className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
            {platform.install}
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default Packages;
