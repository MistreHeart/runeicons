export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://runeicons.com";

export const GITHUB_REPO = "https://github.com/Nexvyn/runeicons";
export const GITHUB_ISSUES_NEW = `${GITHUB_REPO}/issues/new`;
export const X_URL = "https://x.com/nexvyn";

export function githubRepoPath(kind: "tree" | "blob", path: string) {
  return `${GITHUB_REPO}/${kind}/main/${path}`;
}
