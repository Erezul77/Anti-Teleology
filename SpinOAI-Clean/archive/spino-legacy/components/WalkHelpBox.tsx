"use client";
import { WALK_HELP_EN, WALK_HELP_HE } from "../lib/walkthroughHelp";

export default function WalkHelpBox({
  id,
  he = false,
  defaultOpen = false,
}: {
  id: keyof typeof WALK_HELP_EN | keyof typeof WALK_HELP_HE;
  he?: boolean;
  defaultOpen?: boolean;
}) {
  const dict = he ? WALK_HELP_HE : WALK_HELP_EN;
  const h = dict[id];
  if (!h) return null;
  const label = he ? "מה זה אומר?" : "What does this mean?";
  return (
    <details className="rounded-2xl border border-black/10 dark:border-white/10 p-3" {...(defaultOpen ? { open: true } : {})}>
      <summary className="cursor-pointer list-none text-sm font-medium">
        {label} <span className="opacity-60 text-xs">({h.title})</span>
      </summary>
      <div className="mt-2 text-sm space-y-2">
        {!!h.how?.length && (
          <div>
            <div className="text-xs opacity-70">{he ? "איך לעבוד" : "How to use"}</div>
            <ul className="list-disc ml-5">{h.how.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        )}
        {!!h.terms?.length && (
          <div>
            <div className="text-xs opacity-70">{he ? "מונחים" : "Terms"}</div>
            <ul className="list-disc ml-5">
              {h.terms.map((t, i) => (
                <li key={i}><b>{t.label}:</b> {t.text}</li>
              ))}
            </ul>
          </div>
        )}
        {!!h.tips?.length && (
          <div>
            <div className="text-xs opacity-70">{he ? "טיפים" : "Tips"}</div>
            <ul className="list-disc ml-5">{h.tips.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        )}
      </div>
    </details>
  );
}
