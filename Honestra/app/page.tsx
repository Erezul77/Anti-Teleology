import TeleologyDemo from "./_components/TeleologyDemo";

export default function LandingPage() {
  return (
    <main>
      <section>
        <h1>Honestra – Teleology Firewall for Feeds and Platforms</h1>
        <p>
          Detect purpose-based narratives, flag manipulation risk, and attach causal annotations before content reaches your users.
        </p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <ul>
          <li>Detect hidden purpose-narratives in text.</li>
          <li>
            Highlight phrases that smuggle in destiny, fate, or &apos;meant to
            be&apos;.
          </li>
          <li>Offer neutral causal paraphrases for clearer thinking.</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Live firewall demo</h2>
        <TeleologyDemo />
      </section>
    </main>
  );
}
