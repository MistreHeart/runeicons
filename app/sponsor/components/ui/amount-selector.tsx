"use client";

import { useState } from "react";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

const PRESETS = [5, 20, 100];
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 10000;

const HIGHLIGHT_CLASS =
  "absolute inset-0 rounded-xl border border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-800";

interface AmountSelectorProps {
  selectedAmount: number;
  customMode: boolean;
  onAmountChange: (amount: number) => void;
  onCustomModeChange: (customMode: boolean) => void;
}

export function AmountSelector({
  selectedAmount,
  customMode,
  onAmountChange,
  onCustomModeChange,
}: AmountSelectorProps) {
  const [customValue, setCustomValue] = useState("");

  const handlePreset = (amount: number) => {
    onCustomModeChange(false);
    onAmountChange(amount);
  };

  const handleCustom = () => {
    onCustomModeChange(true);
    const num = parseInt(customValue, 10);
    onAmountChange(num > 0 ? num : 0);
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = e.target.value.replace(/[^0-9]/g, "");

    if (stripped === "") {
      setCustomValue("");
      onAmountChange(0);
      return;
    }

    let num = parseInt(stripped, 10);
    if (num > MAX_AMOUNT) num = MAX_AMOUNT;

    setCustomValue(String(num));
    onAmountChange(num);
  };

  const handleCustomBlur = () => {
    const num = parseInt(customValue, 10);
    if (!num || num < MIN_AMOUNT) {
      setCustomValue(String(MIN_AMOUNT));
      onAmountChange(MIN_AMOUNT);
    }
  };

  return (
    <div>
      <div className="rounded-xl bg-white dark:bg-zinc-900">
        <div className="flex w-full gap-1 rounded-xl bg-black/10 p-1 dark:bg-white/10">
          {PRESETS.map((amount) => {
            const isActive = !customMode && amount === selectedAmount;
            return (
              <button
                key={amount}
                type="button"
                onClick={() => handlePreset(amount)}
                className="relative flex flex-1 cursor-pointer items-center justify-center py-3 text-[13px] font-medium"
              >
                {isActive && (
                  <m.div
                    layoutId="amount-highlight"
                    className={HIGHLIGHT_CLASS}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? "text-black dark:text-white" : "text-muted-foreground"
                  }`}
                >
                  ${amount}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={handleCustom}
            className="relative flex flex-1 cursor-pointer items-center justify-center py-3 text-[13px] font-medium"
          >
            {customMode && (
              <m.div
                layoutId="amount-highlight"
                className={HIGHLIGHT_CLASS}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span
              className={`relative z-10 ${
                customMode ? "text-black dark:text-white" : "text-muted-foreground"
              }`}
            >
              Custom
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {customMode && (
          <m.div
            key="custom-input"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pt-3">
              <div className="flex items-center rounded-xl border border-border bg-white transition-shadow focus-within:ring-2 focus-within:ring-blue-700/30 dark:bg-zinc-900">
                <span className="pl-4 text-lg font-medium text-muted-foreground">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={customValue}
                  onChange={handleCustomInput}
                  onBlur={handleCustomBlur}
                  autoFocus
                  className="flex-1 bg-transparent px-2 py-3 text-lg font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
                  aria-label="Custom contribution amount"
                  aria-valuemin={MIN_AMOUNT}
                  aria-valuemax={MAX_AMOUNT}
                />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
