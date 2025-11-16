"use client";

import React, { useState } from "react";

interface TeleologyAnalysis {
  teleologyScore: number;
  teleologyType: string | null;
  manipulationRisk: string;
  detectedPhrases: string[];
  purposeClaim: string | null;
  neutralCausalParaphrase: string | null;
}

export default function TeleologyDemoPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TeleologyAnalysis | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const res = await fetch("/api/teleology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to analyze teleology");
      }

      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Honestra Teleology Demo</h1>
      <p className="text-sm text-gray-600">
        Paste any text (post, headline, thought) and see how teleological it is: purpose language,
        type, and risk. This uses the shared teleologyEngine.
      </p>

      <textarea
        className="w-full border rounded p-2 min-h-[160px]"
        placeholder="Paste some text that explains why something happened..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className="px-4 py-2 rounded border text-sm disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze teleology"}
      </button>

      {error && <p className="text-sm text-red-600">Error: {error}</p>}

      {analysis && (
        <section className="border rounded p-4 space-y-2">
          <h2 className="font-semibold text-lg">Analysis</h2>
          <p>
            <strong>Teleology score:</strong> {analysis.teleologyScore.toFixed(2)}
          </p>
          <p>
            <strong>Teleology type:</strong> {analysis.teleologyType ?? "none"}
          </p>
          <p>
            <strong>Manipulation risk:</strong> {analysis.manipulationRisk}
          </p>
          <p>
            <strong>Detected phrases:</strong>{" "}
            {analysis.detectedPhrases.length > 0
              ? analysis.detectedPhrases.join(", ")
              : "none"}
          </p>
          {analysis.purposeClaim && (
            <p>
              <strong>Purpose claim (if implemented):</strong> {analysis.purposeClaim}
            </p>
          )}
          {analysis.neutralCausalParaphrase && (
            <p>
              <strong>Causal paraphrase (if implemented):</strong>{" "}
              {analysis.neutralCausalParaphrase}
            </p>
          )}
        </section>
      )}
    </main>
  );
}

