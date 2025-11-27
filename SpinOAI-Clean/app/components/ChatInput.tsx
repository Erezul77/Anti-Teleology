"use client";

import React, { useState, KeyboardEvent } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

type ChatMode = "normal" | "storm";

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<ChatMode>("normal");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    // When in "storm" mode we prepend a clear tag to help SpiñO
    // switch into the Emotional Storm (ΔA) protocol.
    const content =
      mode === "storm"
        ? "[[EMOTIONAL_STORM_MODE]] " + trimmed
        : trimmed;

    onSend(content);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "storm" ? "normal" : "storm"));
  };

  return (
    <div className="w-full border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-3 py-2">
        {/* Mode toggle row */}
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleMode}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium transition",
                mode === "storm"
                  ? "bg-red-100 text-red-700 ring-1 ring-red-300"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              ].join(" ")}
            >
              {mode === "storm"
                ? "🧠 אני בסערה רגשית (Spino ΔA פעיל)"
                : "🧠 אני בסערה רגשית (Spino ΔA)"}
            </button>
            <span className="text-neutral-400">
              {mode === "storm"
                ? "ההודעה הבאה תופעל במודול שפינוזה ΔA (בדיעבד)."
                : "לחץ אם אתה רוצה לעבד סערה רגשית בדיעבד."}
            </span>
          </div>
        </div>

        {/* Input + send */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              className="w-full resize-none rounded-2xl border border-neutral-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-neutral-400 focus:ring-0"
              rows={2}
              placeholder={
                mode === "storm"
                  ? "תאר בקצרה מה קרה או מה כואב – ספיניו יעזור לפרק את זה כמנגנון…"
                  : "כתוב לספיניו…"
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className={[
              "mb-[2px] inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium",
              disabled || !value.trim()
                ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
                : "bg-black text-white hover:bg-neutral-800"
            ].join(" ")}
          >
            שלח
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

