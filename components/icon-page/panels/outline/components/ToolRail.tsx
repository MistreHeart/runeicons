"use client";
import { useState } from "react";

import Link from "next/link";

import { History, Info, Keyboard, MessageCircle, User } from "lucide-react";
import { AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomizationState } from "@/lib/types";
import { cn } from "@/lib/utils";

import { FeedbackForm } from "@/components/docs/FeedbackForm";
import { IconTypeList } from "./IconTypeList";

type IconType = CustomizationState["iconType"];
export interface ToolRailProps {
  activeType?: IconType;
  onTypeChange?: (type: IconType) => void;
  onHelpClick?: () => void;
  supportedTypes?: readonly IconType[];
}
export function ToolRail({
  activeType = "normal",
  onTypeChange,
  onHelpClick,
  supportedTypes,
}: ToolRailProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-between py-2">
      <div className="relative z-10 flex h-full flex-col">
        <IconTypeList
          activeType={activeType}
          onTypeChange={onTypeChange}
          compact
          supportedTypes={supportedTypes}
        />
        <div className="relative mt-auto flex justify-center pt-4">
          <AnimatePresence>
            {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
          </AnimatePresence>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg text-muted-foreground transition-[background-color,color,scale] duration-150 ease-out hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 active:scale-[0.96]",
                  showFeedback && "bg-foreground/5 text-foreground",
                )}
                aria-label="Info and shortcuts"
              >
                <Info className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" sideOffset={12} className="w-48">
              <DropdownMenuItem onClick={onHelpClick} className="cursor-pointer gap-2">
                <Keyboard className="h-4 w-4" />
                <span>Shortcuts</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowFeedback(true)}
                className="cursor-pointer gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Feature Requests</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/about"
                  prefetch={false}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>About</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/changelog"
                  prefetch={false}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  <span>Change Log</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
