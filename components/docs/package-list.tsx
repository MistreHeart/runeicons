"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";

export type PackageRow = {
  dir: string;
  name: string;
  platform: string;
  description: string;
  logo: string;
  readmeHtml: string;
  githubUrl: string;
  npmUrl: string | null;
};

const SPRING = { type: "spring", duration: 0.5, bounce: 0 } as const;

const copyFromButton = async (event: React.MouseEvent<HTMLElement>) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(".readme-copy");
  if (!button) return;
  const code = button.parentElement?.getAttribute("data-code") ?? "";
  try {
    await navigator.clipboard.writeText(code);
    button.textContent = "copied";
    window.setTimeout(() => {
      button.textContent = "copy";
    }, 1400);
  } catch {
    button.textContent = "copy";
  }
};

const Logo = ({ row }: { row: PackageRow }) => (
  <span
    className={`flex size-12 items-center justify-center rounded-lg ${row.dir === "runeicons-astro" ? "bg-foreground/[0.06] dark:bg-white" : "bg-foreground/[0.06]"}`}
  >
    <img
      src={row.logo}
      alt={`${row.platform} logo`}
      width={28}
      height={28}
      className={`size-7 ${row.dir === "runeicons-mcp" ? "dark:invert" : ""}`}
    />
  </span>
);

const Badge = ({ label, value }: { label: string; value: string }) => (
  <span className="inline-flex overflow-hidden rounded font-mono text-[11px] leading-none">
    <span className="bg-foreground/10 px-1.5 py-1 text-foreground/80">{label}</span>
    <span className="bg-[#1346E7] px-1.5 py-1 text-white">{value}</span>
  </span>
);

const ghostButton =
  "inline-flex h-9 items-center rounded-lg bg-foreground/[0.06] px-4 text-sm text-foreground/80 transition-[background-color,color,scale] duration-150 ease-out hover:bg-foreground/10 hover:text-foreground active:scale-[0.97]";

const PackageCard = ({
  row,
  open,
  onToggle,
}: {
  row: PackageRow;
  open: boolean;
  onToggle: () => void;
}) => (
  <div
    className={`flex flex-col rounded-2xl bg-white p-6 transition-shadow duration-200 ease-out dark:bg-[#141414] ${open ? "ring-1 ring-[#1346E7]" : ""}`}
  >
    <Logo row={row} />
    <h2 className="mt-5 text-lg font-semibold text-foreground">{row.name}</h2>
    <div className="mt-2 flex flex-wrap gap-1.5">
      <Badge label="status" value="live soon" />
      <Badge label="platform" value={row.platform} />
      {/* <Badge label="downloads" value="coming soon" /> */}
    </div>
    <p className="mt-4 mb-6 text-sm leading-relaxed text-muted-foreground">{row.description}</p>

    <div className="mt-auto flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`guide-${row.dir}`}
        className="inline-flex h-9 items-center rounded-lg bg-[#1346E7] px-4 text-sm text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1346E7]/90 active:scale-[0.97]"
      >
        {open ? "Close guide" : "Guide"}
      </button>
      <a href={row.githubUrl} target="_blank" rel="noreferrer" className={ghostButton}>
        Source
      </a>
      {row.npmUrl ? (
        <a href={row.npmUrl} target="_blank" rel="noreferrer" className={ghostButton}>
          npm
        </a>
      ) : (
        <span
          title="Coming soon"
          className={`${ghostButton} cursor-not-allowed opacity-50 hover:bg-foreground/[0.06] hover:text-foreground/80`}
        >
          npm
        </span>
      )}
    </div>
  </div>
);

const useColumns = () => {
  const [columns, setColumns] = useState(1);
  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const sm = window.matchMedia("(min-width: 640px)");
    const update = () => setColumns(lg.matches ? 3 : sm.matches ? 2 : 1);
    update();
    lg.addEventListener("change", update);
    sm.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      sm.removeEventListener("change", update);
    };
  }, []);
  return columns;
};

const Guide = ({ row }: { row: PackageRow }) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.75) {
        window.scrollBy({
          top: top - window.innerHeight * 0.4,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      }
    }, 160);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <motion.div
      ref={ref}
      id={`guide-${row.dir}`}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
      transition={reduceMotion ? { duration: 0.15 } : SPRING}
      className="col-span-full overflow-hidden"
    >
      <motion.div
        initial={reduceMotion ? false : { y: -12 }}
        animate={{ y: 0 }}
        exit={reduceMotion ? undefined : { y: -12 }}
        transition={SPRING}
        className="rounded-2xl bg-white p-6 sm:p-10 dark:bg-[#141414]"
        onClick={copyFromButton}
      >
        <article
          className="readme mx-auto max-w-3xl"
          dangerouslySetInnerHTML={{ __html: row.readmeHtml }}
        />
      </motion.div>
    </motion.div>
  );
};

const PackageList = ({ rows }: { rows: PackageRow[] }) => {
  const [openDir, setOpenDir] = useState<string | null>(null);
  const columns = useColumns();
  const reduceMotion = useReducedMotion();
  const openIndex = rows.findIndex((row) => row.dir === openDir);
  const rowEnd =
    openIndex < 0
      ? -1
      : Math.min(rows.length - 1, Math.floor(openIndex / columns) * columns + columns - 1);

  return (
    <LayoutGroup>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row, index) => (
          <Fragment key={row.dir}>
            <motion.div
              layout={reduceMotion ? false : "position"}
              transition={SPRING}
              className="flex [&>*]:w-full"
            >
              <PackageCard
                row={row}
                open={openDir === row.dir}
                onToggle={() => setOpenDir((current) => (current === row.dir ? null : row.dir))}
              />
            </motion.div>
            <AnimatePresence initial={false}>
              {index === rowEnd && openIndex >= 0 ? (
                <Guide key={rows[openIndex].dir} row={rows[openIndex]} />
              ) : null}
            </AnimatePresence>
          </Fragment>
        ))}
      </div>
    </LayoutGroup>
  );
};

export default PackageList;
