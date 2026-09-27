import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";
import { Section } from "../components/Section";

interface SizeTransformSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
}

export function SizeTransformSection({
  state,
  onChange,
}: SizeTransformSectionProps) {
  return (
    <Section>
      <div className="flex flex-col gap-2">
        <Scrubber
          label="Blur"
          value={state.blur}
          onChange={(val: number) => onChange({ blur: val })}
          min={0}
          max={50}
        />
      </div>
    </Section>
  );
}
