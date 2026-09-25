import { Marked, type Tokens } from "marked";
import { createHighlighter, type Highlighter } from "shiki";

const LANGS = ["sh", "json", "ts", "tsx", "js", "html", "vue", "svelte", "astro", "dart"] as const;
const ALIASES: Record<string, string> = { bash: "sh", shell: "sh", text: "text", "": "text" };
const REPO = "https://github.com/Nexvyn/runeicons/blob/main/packages";

let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [...LANGS],
  });
  return highlighterPromise;
};

const resolveLang = (lang: string | undefined, highlighter: Highlighter) => {
  const key = (lang ?? "").trim().toLowerCase();
  const mapped = ALIASES[key] ?? key;
  return highlighter.getLoadedLanguages().includes(mapped) ? mapped : "text";
};

const toHtml = (highlighter: Highlighter, code: string, lang?: string) =>
  highlighter.codeToHtml(code, {
    lang: resolveLang(lang, highlighter),
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

const escapeAttr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export async function renderReadme(markdown: string, packageDir: string) {
  const highlighter = await getHighlighter();
  const marked = new Marked({ gfm: true });

  marked.use({
    renderer: {
      code({ text, lang }: Tokens.Code) {
        return `<div class="readme-code" data-code="${escapeAttr(text)}">${toHtml(highlighter, text, lang)}<button type="button" class="readme-copy">copy</button></div>`;
      },
      link({ href, tokens }: Tokens.Link) {
        const label = this.parser.parseInline(tokens);
        const absolute = /^(https?:|mailto:|#)/.test(href);
        const url = absolute ? href : `${REPO}/${packageDir}/${href.replace(/^\.\//, "")}`;
        const external = !url.startsWith("#");
        return `<a href="${escapeAttr(url)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`;
      },
      image() {
        return "";
      },
    },
  });

  return marked.parse(markdown, { async: false });
}
