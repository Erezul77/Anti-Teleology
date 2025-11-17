"use client";

import { useState } from "react";

type TeleologyResult = {
  teleologyScore?: number;
  teleologyType?: string | null;
  manipulationRisk?: string | null;
  detectedPhrases?: string[];
  purposeClaim?: string | null;
  neutralCausalParaphrase?: string | null;
  error?: string;
};

export default function TeleologyDemoPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<TeleologyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/teleology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Request failed");
        return;
      }

      setResult(data);
    } catch (err: any) {
      console.error("[Honestra][teleology-demo] error", err);
      setError("Unexpected error while calling the API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Honestra – Teleology Integrity Demo</h1>
      <p>
        Paste any sentence, headline, or statement below. We&apos;ll identify
        teleological (purpose-based) language and show you a purely causal
        rewrite.
      </p>

      <label style={{ marginTop: "0.5rem" }}>
        Text to analyze:
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='e.g. "This war is happening so that our nation will be purified."'
        />
      </label>

      <div style={{ marginTop: "0.75rem" }}>
        <button onClick={handleAnalyze} disabled={loading || !text.trim()}>
          {loading ? "Analyzing..." : "Analyze teleology"}
        </button>
      </div>

      {error && (
        <p style={{ marginTop: "1rem", color: "red" }}>
          Error: {error}
        </p>
      )}

      {result && !error && (
        <section style={{ marginTop: "1rem" }}>
          <h2>Analysis</h2>
          <ul>
            <li>
              <strong>Teleology score:</strong>{" "}
              {typeof result.teleologyScore === "number"
                ? result.teleologyScore.toFixed(2)
                : "n/a"}
            </li>
            <li>
              <strong>Teleology type:</strong>{" "}
              {result.teleologyType ?? "none"}
            </li>
            <li>
              <strong>Manipulation risk:</strong>{" "}
              {result.manipulationRisk ?? "n/a"}
            </li>
            <li>
              <strong>Detected phrases:</strong>{" "}
              {result.detectedPhrases && result.detectedPhrases.length > 0
                ? result.detectedPhrases.join(", ")
                : "none"}
            </li>
          </ul>

          <h3>LLM summaries</h3>
          <p>
            <strong>Purpose claim:</strong>{" "}
            {result.purposeClaim ??
              "No clear teleological story extracted."}
          </p>
          <p>
            <strong>Neutral causal paraphrase:</strong>{" "}
            {result.neutralCausalParaphrase ??
              "No causal paraphrase generated."}
          </p>
        </section>
      )}
    </main>
  );
}
