import type { Metadata } from "next";

import DocsShell from "@/components/docs/docs-shell";
import { GITHUB_REPO, githubRepoPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms" },
  description: "Terms of Use for RuneIcons.",
};

const TermsPage = () => (
  <DocsShell title="Terms of Use" lead="Last updated: July 29, 2026">
    <div className="flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
      <p>
        By accessing or using RuneIcons, you{" "}
        <strong className="font-medium text-foreground">
          agree to be bound by these Terms of Use
        </strong>
        . If you do not agree with any part of these terms, please{" "}
        <strong className="font-medium text-foreground">do not use the site or its contents</strong>
        .
      </p>

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">1. Use of Icons</h2>
        <p>
          RuneIcons are <strong className="font-medium text-foreground">open-source</strong> and the
          icons are distributed under the{" "}
          <a
            href={githubRepoPath("blob", "LICENSE")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline"
          >
            Apache License 2.0
          </a>
          . You may use them in personal, commercial, and client projects, subject to the license
          terms in our GitHub repository.
        </p>
        <p>
          Everything else on the site, including the landing page designs, UI components,
          animations, and editor, is licensed under the Apache License 2.0 with an Attribution
          Requirement and the Commons Clause. Any project that ships any part of it must{" "}
          <strong className="font-medium text-foreground">
            credit the Rune Icons Team with a visible link to runeicons.com
          </strong>
          , placed where a visitor or user can find it, such as a site footer, an about page, a
          credits screen, or a README. You{" "}
          <strong className="font-medium text-foreground">
            may not sell, sublicense, or redistribute
          </strong>{" "}
          the landing page designs, components, or animations themselves, whether alone, in a
          bundle, or as a ported version.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">2. Acceptable Use</h2>
        <p>
          You agree <strong className="font-medium text-foreground">not to misuse the site</strong>,
          attempt to disrupt its operation, or use it in any way that violates applicable laws or
          the rights of others.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">3. No Warranty</h2>
        <p>
          RuneIcons is provided{" "}
          <strong className="font-medium text-foreground">
            &quot;as is&quot; without warranties of any kind
          </strong>
          , express or implied. We do not guarantee the site or icons will be error-free or
          uninterrupted.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">4. Changes to These Terms</h2>
        <p>
          We may update these Terms of Use from time to time. Continued use of the site after
          changes are posted{" "}
          <strong className="font-medium text-foreground">
            constitutes acceptance of the revised terms
          </strong>
          .
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">5. Contact</h2>
        <p>
          Questions about these terms can be raised via our{" "}
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline"
          >
            GitHub repository
          </a>
          .
        </p>
      </div>
    </div>
  </DocsShell>
);

export default TermsPage;
