import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Register the semantic type scale from globals.css as font sizes. Without this,
// tailwind-merge reads `text-body-sm` as a text colour and drops it whenever a
// colour class like `text-muted-foreground` sits next to it.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "lead",
            "body",
            "body-sm",
            "caption",
            "label",
            "micro",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
