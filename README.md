# Anti-Teleology

This repository hosts an integrated **anti-teleology stack**:

- **Shared teleology engine** (`src/lib/teleologyEngine.ts`)  
  A module that:
  - detects teleological (purpose-based) language in text,
  - assigns a teleology score, type, and manipulation risk,
  - optionally uses an LLM to extract a concise `purposeClaim` and a `neutralCausalParaphrase`.

- **SpinOAI-Clean** – SpiñO teleology debugger  
  A 1:1 Spinozistic chat agent that:
  - analyzes the user's story with the teleology engine,
  - reflects the teleological story they are telling,
  - reconstructs the situation in purely causal terms,
  - offers one clear next move to increase their power to act.

- **Honestra** – teleology firewall demo + spec  
  A small Next.js app that:
  - exposes `/teleology-demo`, a UI that runs arbitrary text through the shared teleology engine,
  - includes the `Honestra Teleology Integrity v0.1` spec under `docs/`,
  - serves as a live demo of how a teleological firewall could analyze content (posts, headlines, etc.).

## Repository structure

```text
.
├── src/
│   └── lib/
│       └── teleologyEngine.ts    # Shared teleology engine (used by both apps)
├── docs/
│   └── Honestra_Teleology_Integrity_v0.1.md  # Honestra specification
├── SpinOAI-Clean/                # SpiñO app (teleology debugger)
└── Honestra/                     # Honestra app (teleology firewall demo + spec)
```

Each app (SpinOAI-Clean and Honestra) has its own `package.json` and can be run independently.

## Running SpiñO (SpinOAI-Clean)

```bash
cd SpinOAI-Clean
npm install
npm run dev
```

Then open http://localhost:3000 (or the configured port).

SpiñO uses the shared `src/lib/teleologyEngine.ts` to analyze the user's latest message and to structure its 3-part replies:

1. **Teleology you're using**
2. **Causal reconstruction**
3. **One clear move**

## Running Honestra demo

```bash
cd Honestra
npm install
npm run dev
```

Then open http://localhost:3000/teleology-demo.

Paste any text (post, headline, thought), and the demo will display:

- Teleology score
- Teleology type
- Manipulation risk
- Detected teleological phrases
- `purposeClaim` (if available)
- `neutralCausalParaphrase` (if available)

## Shared teleology engine

The shared teleology engine lives at:

```text
src/lib/teleologyEngine.ts
```

It has these responsibilities:

### Heuristic analysis:
- search for teleology markers like "in order to", "meant to", "punishment", "deserves", "fate", "destiny", etc.
- set `teleologyScore`, `teleologyType`, and `manipulationRisk`.

### LLM-assisted analysis:
- `purposeClaim`: summarize the core purpose-based story (if any).
- `neutralCausalParaphrase`: rewrite the text in purely causal terms.

Both apps import `analyzeTeleology` from this shared module.

## Deployment

This repo is suitable for a monorepo-style deployment. For example, on Vercel you can:

- Create one project with root set to `SpinOAI-Clean` (SpiñO app).
- Create another project with root set to `Honestra` (Honestra demo/spec).

Both will share the same `src/lib/teleologyEngine.ts` from the monorepo root.

