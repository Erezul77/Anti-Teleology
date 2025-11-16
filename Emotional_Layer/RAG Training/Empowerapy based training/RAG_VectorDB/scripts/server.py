#!/usr/bin/env python
import os, json
from pathlib import Path
from typing import List
import numpy as np
import faiss
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

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
TOP_K = int(os.environ.get("TOP_K", 6))

app = FastAPI(title="Empowerapy VectorDB Service", version="1.0.0")

index = None
meta: List[dict] = []

class SearchRequest(BaseModel):
    query: str
    top_k: int | None = None

class SearchResult(BaseModel):
    score: float
    title: str
    source: str
    chunk_id: int
    text: str

class SearchResponse(BaseModel):
    results: List[SearchResult]


def load_meta() -> List[dict]:
    items = []
    with open(META_PATH, "r", encoding="utf-8") as f:
        for line in f:
            items.append(json.loads(line))
    return items


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


@app.on_event("startup")
def startup_event():
    global index, meta
    load_dotenv()
    index = faiss.read_index(str(INDEX_PATH))
    meta = load_meta()


@app.get("/health")
def health():
    ok = index is not None and len(meta) > 0
    return {"status": "ok" if ok else "not_ready", "items": len(meta)}


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    top_k = req.top_k or TOP_K
    q = embed([req.query]).astype("float32")
    D, I = index.search(q, top_k)
    results: List[SearchResult] = []
    for j in range(top_k):
        rank = int(I[0][j])
        if rank < 0 or rank >= len(meta):
            continue
        m = meta[rank]
        results.append(SearchResult(
            score=float(D[0][j]),
            title=m["title"],
            source=m["source"],
            chunk_id=int(m["chunk_id"]),
            text=m.get("text", "")
        ))
    return SearchResponse(results=results)
