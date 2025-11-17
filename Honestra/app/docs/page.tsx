export default function DocsPage() {
  return (
    <main>
      <h1>Honestra Teleology API</h1>
      <p>
        The Honestra Teleology API analyzes text for teleological (purpose-based)
        language patterns. It detects hidden purpose-narratives and provides
        neutral causal paraphrases.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Endpoint</h2>
        <p>
          <strong>POST</strong> <code>/api/teleology</code>
        </p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Request</h2>
        <p>Send a JSON body with a <code>text</code> field:</p>
        <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px", overflow: "auto" }}>
          <code>{`{
  "text": "This war is happening so that our nation will be purified."
}`}</code>
        </pre>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Example: cURL</h2>
        <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px", overflow: "auto" }}>
          <code>{`curl -X POST https://honestra.org/api/teleology \\
  -H "Content-Type: application/json" \\
  -d '{"text": "This war is happening so that our nation will be purified."}'`}</code>
        </pre>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Example: JavaScript</h2>
        <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px", overflow: "auto" }}>
          <code>{`const response = await fetch("/api/teleology", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "This war is happening so that our nation will be purified."
  })
});

const analysis = await response.json();`}</code>
        </pre>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Response</h2>
        <p>The API returns a JSON object with the following fields:</p>
        <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px", overflow: "auto" }}>
          <code>{`{
  "teleologyScore": 0.5,
  "teleologyType": "national/ideological",
  "manipulationRisk": "medium",
  "detectedPhrases": ["so that"],
  "purposeClaim": "The war is happening to purify the nation.",
  "neutralCausalParaphrase": "The war is occurring due to historical, political, and social conditions that led to conflict."
}`}</code>
        </pre>

        <ul style={{ marginTop: "1rem" }}>
          <li>
            <strong>teleologyScore</strong> (number): 0.0–1.0, how strongly
            teleological the text is
          </li>
          <li>
            <strong>teleologyType</strong> (string | null): Type of teleology:
            &quot;personal&quot;, &quot;religious&quot;, &quot;national/ideological&quot;,
            &quot;conspiracy&quot;, or null
          </li>
          <li>
            <strong>manipulationRisk</strong> (string): &quot;low&quot;,
            &quot;medium&quot;, or &quot;high&quot;
          </li>
          <li>
            <strong>detectedPhrases</strong> (string[]): Array of detected
            teleological phrases
          </li>
          <li>
            <strong>purposeClaim</strong> (string | null): Short summary of the
            core teleological story, if present
          </li>
          <li>
            <strong>neutralCausalParaphrase</strong> (string | null): Same
            content rewritten in causal terms
          </li>
        </ul>
      </section>
    </main>
  );
}

