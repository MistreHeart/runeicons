import { GITHUB_REPO } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `/* TEAM */
Site: Rune Icons
Role: Design and engineering

Nexvyn: design engineering, https://nexvyn.dev
Abhinav: software engineering, https://abhi.at
Vansh: design engineering, https://vanshnagar.me
Mohit: software development

/* THANKS */
Everyone who requested icons and starred the repo.

/* SITE */
Standards: HTML, CSS, JavaScript
Built with: Next.js, React, Tailwind CSS
${GITHUB_REPO}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
