"use client";

import React, { useState, KeyboardEvent } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  darkMode?: boolean;
};

type ChatMode = "normal" | "storm";

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled,
  darkMode = false
}) => {
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

  const containerClasses = [
    "w-full border-t",
    darkMode ? "border-gray-700 bg-gray-900" : "border-neutral-200 bg-white"
  ].join(" ");

  const helperTextClass = darkMode ? "text-gray-400" : "text-neutral-400";
  const toggleActiveClass = darkMode
    ? "bg-red-500/20 text-red-200 ring-1 ring-red-400/60"
    : "bg-red-100 text-red-700 ring-1 ring-red-300";
  const toggleIdleClass = darkMode
    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200";

  return (
    <div className={containerClasses}>
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-3 sm:px-4 py-3 sm:py-4">
        {/* Mode toggle row */}
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleMode}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium transition",
                mode === "storm" ? toggleActiveClass : toggleIdleClass
              ].join(" ")}
            >
              {mode === "storm"
                ? "Emotional storm active (Spino ΔA ON)"
                : "Process an emotional storm (Spino ΔA)"}
            </button>
            <span className={helperTextClass}>
              {mode === "storm"
                ? "Next message will trigger the post-event Spino ΔA module."
                : "Click if you want to process a current emotional storm."}
            </span>
          </div>
        </div>

        {/* Input + send */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              className={[
                "w-full resize-none rounded-2xl border px-4 py-3 sm:px-3 sm:py-2 text-sm sm:text-base shadow-sm outline-none focus:ring-0",
                darkMode
                  ? "border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:border-gray-500"
                  : "border-neutral-200 bg-white text-gray-900 placeholder-gray-400 focus:border-neutral-400"
              ].join(" ")}
              rows={2}
              placeholder={
                mode === "storm"
                  ? "Describe briefly what happened or what hurts—SpiñO will unpack it causally…"
                  : "Write to SpiñO…"
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
              "mb-[2px] inline-flex items-center justify-center rounded-full px-4 sm:px-4 py-3 sm:py-2 h-10 sm:h-auto text-sm sm:text-base font-medium",
              disabled || !value.trim()
                ? darkMode
                  ? "cursor-not-allowed bg-gray-700 text-gray-500"
                  : "cursor-not-allowed bg-neutral-200 text-neutral-400"
                : darkMode
                  ? "bg-white text-gray-900 hover:bg-gray-200"
                  : "bg-black text-white hover:bg-neutral-800"
            ].join(" ")}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

