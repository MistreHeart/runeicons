import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";
import { TEXTURES } from "@/lib/visual-effects";
import { Section } from "../components/Section";
import { cn } from "@/lib/utils";

interface TextureSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
}

function TexturePreview({ texId }: { texId: string }) {
  const tex = TEXTURES.find(t => t.id === texId);
  return (
    <div
      className="w-5 h-5 rounded-md border border-border/40 overflow-hidden bg-muted/10 flex items-center justify-center"
      style={tex?.path ? {
        backgroundImage: `url(${tex.path})`,
        backgroundSize: 'cover'
      } : {}}
    >
      {texId === 'none' && <span className="text-micro font-medium opacity-40">∅</span>}
    </div>
  );
}

export function TextureSection({
  state,
  onChange,
}: TextureSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentTex = TEXTURES.find(t => t.id === state.texture.selected);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectTexture = (id: string) => {
    onChange({
      texture: { ...state.texture, selected: id, enabled: id !== "none" },
    });
    setIsOpen(false);
  };

  return (
    <Section>
      <div className="space-y-4 pt-1">
        <div
          ref={wrapperRef}
          className={cn(
            "overflow-hidden rounded-lg bg-foreground/3 ring-1 ring-inset ring-foreground/7",
            "transition-colors",
            isOpen && "border-border bg-foreground/5"
          )}
        >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex h-9 w-full cursor-pointer items-center justify-between px-2",
              "text-label text-foreground/70 transition-colors",
              "hover:bg-foreground/5 focus:outline-none",
              isOpen && "bg-foreground/5"
            )}
          >
            <span className="ml-1">Texture</span>
            <div className="flex items-center gap-2">
              <span>{currentTex?.name || "None"}</span>
              <TexturePreview texId={state.texture.selected} />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="border-t border-border">
                  {TEXTURES.map((tex) => (
                    <button
                      key={tex.id}
                      type="button"
                      onClick={() => selectTexture(tex.id)}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-label",
                        "text-foreground/70 transition-colors hover:bg-foreground/5",
                        state.texture.selected === tex.id && "bg-foreground/8 text-foreground"
                      )}
                    >
                      <span>{tex.name}</span>
                      <TexturePreview texId={tex.id} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {state.texture.selected !== "none" && (
          <Scrubber
            label="Opacity"
            value={state.texture.opacity}
            onChange={(val: number) =>
              onChange({
                texture: { ...state.texture, opacity: val },
              })
            }
            min={0}
            max={100}
          />
        )}
      </div>
    </Section>
  );
}
