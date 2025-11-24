# Spinozistic AI Coacher — RAG Vector DB

A minimal, copy‑paste‑safe RAG pipeline that indexes your Empowerapy corpus into a FAISS vector DB and serves retrieval‑augmented answers in a Spinozistic coaching style.

## Quickstart
1) Create venv & install
```
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
```
2) Set your API key
```
cp .env.example .env
# edit .env and paste your key
```
3) Build the index
```
python scripts/build_index.py
```
4) Ask a question
```
python scripts/query.py "I feel ashamed after failing. What would Spinoza say?"
```

## Files
- corpus/ — Part 1–5 files (md/json)
- scripts/build_index.py — chunk, embed, index
- scripts/query.py — retrieve & answer (SpiñO style)
- data/ — faiss.index + meta.jsonl
