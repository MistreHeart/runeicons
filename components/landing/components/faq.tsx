"use client";

import Link from "next/link";

import { MessageCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import TextHighlightWave from "@/components/ui/text-highlight-wave";
import { X_URL } from "@/lib/site";

type FAQItem = {
  id: string;
  number: string;
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    id: "item-1",
    number: "01",
    question: "What formats are the icons available in?",
    answer:
      "Optimized SVG, plus React and Vue components. Each one is tree-shakeable, so importing a single icon does not drag the whole set into your bundle.",
  },
  {
    id: "item-2",
    number: "02",
    question: "Can I customize the icon size and color?",
    answer:
      "Yes. Size, stroke width, and color are all controllable through props or plain CSS. Icons use currentColor by default, so they pick up whatever color their parent already has.",
  },
  {
    id: "item-3",
    number: "03",
    question: "Is Rune Icons free to use commercially?",
    answer:
      "Yes. The icons are licensed under Apache 2.0, so use them in personal work, client projects, or anything you sell, no attribution needed. The website itself (landing page, components, and animations) is Apache 2.0 with attribution and the Commons Clause: credit the Rune Icons Team with a link to runeicons.com if you reuse it, and don't resell it as a template or kit.",
  },
  {
    id: "item-4",
    number: "04",
    question: "How do I request a new icon?",
    answer:
      "Open an issue on the GitHub repo. I go through requests most weeks and build the ones people actually vote for first.",
  },
];

export default function Faq() {
  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden">
        <div className="relative z-10 flex flex-col gap-10 sm:gap-12 lg:flex-row lg:gap-20">
          <div className="flex shrink-0 flex-col gap-8 lg:w-[440px]">
            <div className="flex flex-col">
              <span className="text-label font-medium tracking-[0.08em] text-muted-foreground uppercase">
                FAQ
              </span>
              <TextHighlightWave
                as="h2"
                className="mt-3 text-h2"
                text={["Frequently asked\nquestions"]}
              />
              <p className="mt-4 max-w-sm text-body text-muted-foreground">
                Can’t find what you’re looking for? Ask us on X and we’ll get back to you.
              </p>
              <Button asChild variant="outline" className="mt-8 w-fit">
                <Link href={X_URL} target="_blank" rel="noopener noreferrer">
                  Contact us <MessageCircle />
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full flex-1">
            <Accordion type="single" collapsible defaultValue="item-1" className="flex w-full flex-col gap-4">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="rounded-2xl border border-border bg-white px-5 last:border-b sm:px-6 dark:bg-background"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline sm:py-6">
                    <div className="flex items-center gap-4">
                      <span className="text-body-sm font-medium text-muted-foreground tabular-nums">
                        {item.number}
                      </span>
                      <span className="text-body font-medium text-foreground">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 sm:pb-6">
                    <TextHighlightWave
                      as="p"
                      className="pl-10 text-body text-muted-foreground"
                      text={item.answer}
                      charStagger={0.008}
                      lineStagger={0.06}
                      restOpacity={0.25}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
