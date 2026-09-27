import type { Metadata } from "next";

import DocsShell from "@/components/docs/docs-shell";
import { GITHUB_REPO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  description: "Privacy Policy for RuneIcons.",
};

const PrivacyPage = () => (
  <DocsShell title="Privacy Policy" lead="Last updated: July 29, 2026">
    <div className="flex max-w-[65ch] flex-col gap-8 text-body text-muted-foreground">
      <p>
        This Privacy Policy explains what information RuneIcons collects and how it is used. We aim
        to collect{" "}
        <strong className="font-medium text-foreground">
          as little personal information as possible
        </strong>
        .
      </p>

      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">1. Information We Collect</h2>
        <p>
          We <strong className="font-medium text-foreground">do not require an account</strong> to
          browse or download icons. If you sponsor the project or contact us, we may receive the
          information you voluntarily provide, such as your
          <strong className="font-medium text-foreground">name and email address</strong>, through
          third-party services (e.g. GitHub, payment processors).
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">2. Cookies & Analytics</h2>
        <p>
          We may use{" "}
          <strong className="font-medium text-foreground">
            basic, privacy-respecting analytics
          </strong>{" "}
          to understand aggregate site usage. We{" "}
          <strong className="font-medium text-foreground">
            do not sell personal data to third parties
          </strong>
          .
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">3. Third-Party Services</h2>
        <p>
          Sponsorships and payments are processed by third-party providers, and interactions with
          our GitHub repository are governed by{" "}
          <strong className="font-medium text-foreground">GitHub&apos;s own privacy policy</strong>.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">4. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Continued use of the site after
          changes are posted{" "}
          <strong className="font-medium text-foreground">
            constitutes acceptance of the revised policy
          </strong>
          .
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-foreground">5. Contact</h2>
        <p>
          Questions about this policy can be raised via our{" "}
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

export default PrivacyPage;
