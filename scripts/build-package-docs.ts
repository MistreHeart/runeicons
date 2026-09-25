import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const packagesDir = join(root, "packages");
const out = join(root, "lib", "docs", "package-readmes.generated.ts");

const readmes: Record<string, string> = {};
const versions: Record<string, string> = {};

const readVersion = (dir: string) => {
  const pkgJson = join(packagesDir, dir, "package.json");
  if (existsSync(pkgJson)) return JSON.parse(readFileSync(pkgJson, "utf8")).version ?? "0.0.0";
  const pubspec = join(packagesDir, dir, "pubspec.yaml");
  if (existsSync(pubspec)) {
    const match = readFileSync(pubspec, "utf8").match(/^version:\s*([^\s]+)/m);
    if (match) return match[1];
  }
  return "0.0.0";
};

for (const dir of readdirSync(packagesDir).sort()) {
  const file = join(packagesDir, dir, "README.md");
  if (!existsSync(file)) continue;
  readmes[dir] = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  versions[dir] = readVersion(dir);
}

writeFileSync(
  out,
  `export const PACKAGE_VERSIONS: Record<string, string> = ${JSON.stringify(versions, null, 2)};\n\nexport const PACKAGE_READMES: Record<string, string> = ${JSON.stringify(readmes, null, 2)};\n`,
);

console.log(
  `wrote ${Object.keys(readmes).length} readmes to lib/docs/package-readmes.generated.ts`,
);
