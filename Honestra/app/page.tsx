import TeleologyDemo from "./_components/TeleologyDemo";

export default function LandingPage() {
  return (
    <main>
      <section>
        <h1>Honestra – Teleology Firewall for Language</h1>
        <p>
          Honestra detects hidden purpose-narratives in text and helps you see
          the causal structure behind teleological language.
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
        <h2>Try it live</h2>
        <TeleologyDemo />
      </section>
    </main>
  );
}
