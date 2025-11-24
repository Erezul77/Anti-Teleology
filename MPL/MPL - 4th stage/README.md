# MPL Playground

A lightweight, dependency‑free graph reasoning & visualization playground with **exports**, **plugins**, **live DB bridge**, **collaboration**, **performance autotuning**, and **accessibility**. Built with TypeScript + React, ships as a static site.

---

## ✨ Features

* **Renderer**: fast canvas graph with layout, labels, and snapshot timeline
* **Export**: PNG / SVG / PDF, background & scale options (4T)
* **Share Packs**: portable `.mpack(.gz)` bundles of scene + local state (4T)
* **Plugins**: sandboxed Workers (draw overlays, metrics, alerts) (4U)
* **Collab**: presence, ghost cursors, comments, reviews (tiny WS protocol) (4V)
* **Graph DB Bridge**: adapters for Cypher / Gremlin / GraphQL (4W)
* **Performance**: HUD meters, batched rendering, frame‑budget autotuner (4X)
* **Accessibility & Themes**: keyboard nav, SR summaries, light/dark/high‑contrast, font scale (4Y)

---

## 🚀 Quickstart

> **Prereqs**: Node 20+, npm 9+ (or pnpm 8+). No global deps.

```bash
# From repo root
npm -w engine ci && npm -w playground ci
npm -w playground run dev
# Open http://localhost:5173 and explore the DebugExample pages
```

**Build (static site):**

```bash
npm -w playground run build
# Output: playground/dist (deploy to any static host/CDN)
```

**Engine package (optional):**

```bash
npm -w engine run build
# (publish) npm -w engine publish --access public
```

**Docker (static Nginx):**

```bash
# produces an image serving playground/dist on :80
docker build -t mpl-playground .
docker run --rm -p 8080:80 mpl-playground
```

---

## 🧭 Project Layout

```
/engine           # core renderer, ingest, plugins, db bridge, collab, perf
/playground       # React UI, panels, pages, styles, examples
/scripts          # demo scripts, smoke & golden tests
/.github          # CI workflows & templates
/assets           # logos, screenshots, sample packs/data
```

---

## 🧪 Try the Highlights

### 1) Export & Share Packs

* Open **Export** panel → PNG @2× or SVG / PDF
* Open **Share Pack** panel → Export pack → Import to restore local state

### 2) Plugins (Worker sandbox)

Paste this into **Plugins → Install from code**:

```ts
export const manifest = {
  id: 'hello.halo', name: 'Halo Overlay', version: '0.1.0',
  permissions: ['readSnapshot','drawOverlay']
};
export function onTick(snap, ctx){
  const ops=[]; for(const id in snap.monads){ const m=snap.monads[id];
    if ((m.neighbors||[]).length >= 4) ops.push({ k:'circle', x:m.x, y:m.y, r:8, stroke:'#22c55e', width:2, alpha:0.9 });
  }
  ctx.draw(ops); ctx.metrics({ nodes:Object.keys(snap.monads).length });
}
```

Enable and watch overlays + metrics update.

### 3) Graph DB Bridge

1. **Connections** → add a gateway (e.g., `http://localhost:9000/cypher`)
2. **Query** → run:

```cypher
MATCH (a)-[r]->(b) RETURN id(a) AS a, id(b) AS b LIMIT 200
```

3. Mapping: Edge `a` → `b` → **Run** → **Send to Canvas**

### 4) Collab (two tabs)

* **Collab** → connect the same room → see presence cursors
* Add a comment thread, resolve/reopen, toggle review state

### 5) Performance & A11y

* Watch the **HUD** adapt edge cap/labels/layout
* Toggle **Theme & Accessibility** panel (Dark / High Contrast, font scale)
* Use arrow keys to pan, `=`/`-` to zoom; screen reader announces counts

---

## ⚙️ Configuration

* **DB adapters**: client talks to a simple HTTP gateway; set per‑connection headers (e.g., `Authorization`) in the UI.
* **Plugins**: disabled by default; each declares explicit permissions (`readSnapshot`, `drawOverlay`, `emitAlerts`, `storage`, `network`).
* **Packs**: by design, packs include annotations/saved searches/baselines/settings, but exclude collab user logs.

---

## 📦 CI/CD

* **CI** (build + golden + smoke): `.github/workflows/ci.yml`
* **Release** (tag → npm publish + Pages deploy): `.github/workflows/release.yml`

Run locally:

```bash
node scripts/golden-test.cjs
node scripts/smoke.cjs
```

---

## 🤝 Contributing

* Open issues with steps to reproduce and environment details (templates included)
* Before PRs: ensure CI is green, no perf regressions (HUD p95), a11y unaffected

---

## 🔒 Security

See `SECURITY.md` for contact & disclosure process.

---

## 📜 License

MIT © MPL Playground contributors

---

## 🗺️ Roadmap (post‑0.9 → 1.0)

* WebGL line instancing for 100k+ edges @60fps
* Rich plugin UI via host‑rendered components
* CRDT text notes for concurrent editing
* Native SVG/PDF export with annotations
* Persisted collab rooms + auth

---

## 📎 Appendix: Known Limitations

* DB adapters are gateway‑oriented; direct drivers are out of scope
* Plugin sandbox forbids DOM; request host‑rendered widgets instead
* PDF export uses browser print pipeline (raster image)
