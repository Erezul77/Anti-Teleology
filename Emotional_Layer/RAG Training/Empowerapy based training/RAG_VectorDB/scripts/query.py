#!/usr/bin/env python
import os, json
from pathlib import Path
from typing import List, Tuple
import numpy as np
from dotenv import load_dotenv
import faiss

# OpenAI v1+
try:
    from openai import OpenAI
    client = OpenAI()
except Exception:
    client = None
    import openai

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
INDEX_PATH = DATA_DIR / "faiss.index"
META_PATH = DATA_DIR / "meta.jsonl"

EMBED_MODEL = os.environ.get("EMBED_MODEL", "text-embedding-3-small")
CHAT_MODEL = os.environ.get("CHAT_MODEL", "gpt-4o-mini")
TOP_K = int(os.environ.get("TOP_K", 6))

def load_meta() -> List[dict]:
    meta = []
    with open(META_PATH, "r", encoding="utf-8") as f:
        for line in f:
            meta.append(json.loads(line))
    return meta

def embed(texts: List[str]) -> np.ndarray:
    texts = [t.replace("\n", " ") for t in texts]
    if client:
        resp = client.embeddings.create(model=EMBED_MODEL, input=texts)
        vecs = np.array([d.embedding for d in resp.data], dtype="float32")
    else:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        resp = openai.Embedding.create(model=EMBED_MODEL, input=texts)
        vecs = np.array([d["embedding"] for d in resp["data"]], dtype="float32")
    norms = np.linalg.norm(vecs, axis=1, keepdims=True) + 1e-12
    return vecs / norms

def search(query: str, index, meta: List[dict], top_k: int = TOP_K):
    q = embed([query]).astype("float32")
    D, I = index.search(q, top_k)
    return [(float(D[0][j]), meta[int(I[0][j])]) for j in range(top_k)]

def compose_prompt(user_query: str, contexts: List[dict]) -> List[dict]:
    system = (
        "You are **SpiñO**, a 1:1 Spinozistic teleology debugger. "
        "Your mission: detect teleological stories (\"this happened in order to\", \"meant to be\", \"punishment\", \"deserve\", etc.) "
        "and help users move from teleology (imagined purposes) to causal clarity (real causes and conditions). "
        "Always end with one clear, concrete next move. "
        "Follow a 3-part format: 1) Teleology you're using, 2) Causal reconstruction, 3) One clear move. "
        "Tone: calm, sharp, non-sentimental. No therapy clichés, no motivational slogans. "
        "Use only the provided context; cite key phrases with [source: title]. "
        "If user writes in Hebrew, answer in Hebrew. If English, answer in English."
    )
    ctx = "\n\n".join(
        f"[{i+1}] Title: {c['title']}\nSource: {c['source']}\nChunk {c['chunk_id']}:\n{c['text']}"
        for i, c in enumerate(contexts)
    )
    user = (
        f"User query:\n{user_query}\n\n"
        f"Relevant context:\n{ctx}\n\n"
        "Instructions:\n"
        "- Diagnose emotion and belief.\n"
        "- Expose event → idea → passion.\n"
        "- Replace with an adequate idea rooted in necessity.\n"
        "- End with one concrete next step."
    )
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]

def chat(messages: List[dict]) -> str:
    if client:
        resp = client.chat.completions.create(model=CHAT_MODEL, messages=messages, temperature=0.2)
        return resp.choices[0].message.content.strip()
    else:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        resp = openai.ChatCompletion.create(model=CHAT_MODEL, messages=messages, temperature=0.2)
        return resp["choices"][0]["message"]["content"].strip()

def main():
    import argparse
    load_dotenv()
    parser = argparse.ArgumentParser()
    parser.add_argument("query", type=str, nargs="+")
    args = parser.parse_args()
    q = " ".join(args.query)

    index = faiss.read_index(str(INDEX_PATH))
    meta = load_meta()
    results = search(q, index, meta, TOP_K)
    for i, (score, m) in enumerate(results, 1):
        print(f"#{i} score={score:.4f} title={m['title']} source={m['source']} chunk={m['chunk_id']}")

    contexts = [m for _, m in results]
    messages = compose_prompt(q, contexts)
    print("\n[Answer]\n")
    print(chat(messages))

if __name__ == "__main__":
    main()
