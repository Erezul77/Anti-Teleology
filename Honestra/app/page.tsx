import TeleologyDemo from "./_components/TeleologyDemo";

// Force dynamic rendering to prevent build timeout
export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh' }}>
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

      <section style={{ marginTop: "2rem" }}>
        <div style={{ 
          marginTop: "1.5rem", 
          borderRadius: "0.75rem", 
          border: "1px solid rgba(63, 63, 70, 1)", 
          backgroundColor: "rgba(39, 39, 42, 0.7)", 
          padding: "1rem" 
        }}>
          <h3 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>
            See it at feed scale
          </h3>
          <p style={{ fontSize: "0.75rem", color: "rgba(212, 212, 216, 1)", marginBottom: "0.5rem" }}>
            Want to see how this works in a stream of posts? Try the moderated feed
            demo, where each post is scanned by the Honestra firewall and marked as
            allowed, annotated, warned, or blocked.
          </p>
          <a
            href="/feed-demo"
            style={{ 
              display: "inline-flex", 
              fontSize: "0.75rem", 
              fontWeight: "500", 
              color: "rgb(110, 231, 183)", 
              textDecoration: "none"
            }}
          >
            Open feed firewall demo →
          </a>
        </div>
      </section>
    </main>
  );
}
