"use client";
export default function FinalSummary({
  he = false,
  line,
  because,
  therefore,
  clarityDelta,
  aha,
  nextTinyAction,
}: {
  he?: boolean;
  line: string;
  because?: string;
  therefore?: string;
  clarityDelta?: number | null;
  aha?: string;
  nextTinyAction?: string;
}) {
  const title = he ? "סיכום פשוט" : "Plain summary";
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="text-sm space-y-1">
        {line ? (<div><b>{he ? "שורה" : "Line"}:</b> {line}</div>) : null}
        {(because || therefore) ? (
          <div><b>{he ? "בגלל → לכן" : "Because → Therefore"}:</b> {because ? `Because ${because}` : ""}{because && therefore ? " → " : ""}{therefore || ""}</div>
        ) : null}
        {typeof clarityDelta === "number" ? (
          <div><b>{he ? "שינוי בהירות" : "Clarity change"}:</b> {clarityDelta >= 0 ? "+" : ""}{clarityDelta}</div>
        ) : null}
        {aha ? (<div><b>{he ? "רגע אהה" : "Aha"}:</b> {aha}</div>) : null}
        {nextTinyAction ? (<div><b>{he ? "צעד קטן" : "Next tiny action"}:</b> {nextTinyAction}</div>) : null}
      </div>
    </div>
  );
}
