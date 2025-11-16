"use client";
import { PROMPT_HELP_EN, PROMPT_HELP_HE } from "../lib/promptHelp";

export default function HelpBox({
  promptId,
  he = false,
  defaultOpen = false,
}: {
  promptId: string | undefined;
  he?: boolean;
  defaultOpen?: boolean;
}) {
  const dict = he ? PROMPT_HELP_HE : PROMPT_HELP_EN;
  const help = promptId ? dict[promptId] : undefined;
  if (!help) return null;
  const label = he ? "מה זה אומר?" : "What does this mean?";
  return (
    <details className="rounded-2xl border border-black/10 dark:border-white/10 p-3" {...(defaultOpen ? { open: true } : {})}>
      <summary className="cursor-pointer list-none text-sm font-medium">
        {label} <span className="opacity-60 text-xs">({help.title})</span>
      </summary>
      <div className="mt-2 text-sm space-y-2">
        {help.how?.length ? (
          <div>
            <div className="text-xs opacity-70">{he ? "איך לכתוב" : "How to write"}</div>
            <ul className="list-disc ml-5">
              {help.how.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {help.examples?.length ? (
          <div>
            <div className="text-xs opacity-70">{he ? "דוגמאות" : "Examples"}</div>
            <ul className="list-disc ml-5">
              {help.examples.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {help.notes?.length ? (
          <div>
            <div className="text-xs opacity-70">{he ? "הערות" : "Notes"}</div>
            <ul className="list-disc ml-5">
              {help.notes.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}
