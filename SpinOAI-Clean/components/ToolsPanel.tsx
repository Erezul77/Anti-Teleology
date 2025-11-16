"use client";

export default function ToolsPanel({ showAdvanced = true }: { showAdvanced?: boolean }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
      <div className="text-sm font-semibold mb-3">Tools</div>
      <div className="grid gap-2">
        <div className="text-xs opacity-70">
          SpinO chat is available on the main page.
        </div>
      </div>
    </div>
  );
}
