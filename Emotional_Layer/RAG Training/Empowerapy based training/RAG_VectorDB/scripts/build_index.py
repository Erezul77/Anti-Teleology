#!/usr/bin/env python
import os, json
from pathlib import Path
from typing import List
import numpy as np
import faiss
from tqdm import tqdm
from dotenv import load_dotenv

# OpenAI v1+
try:
    from openai import OpenAI
    client = OpenAI()
    USE_V1 = True
except Exception:
    client = None
    USE_V1 = False
    import openai

load_dotenv()

BASE_DIR = Path(__file__).resolve().parents[1]
CORPUS_DIR = BASE_DIR / "corpus"
DATA_DIR = BASE_DIR / "data"
INDEX_PATH = DATA_DIR / "faiss.index"
META_PATH = DATA_DIR / "meta.jsonl"

EMBED_MODEL = os.environ.get("EMBED_MODEL", "text-embedding-3-small")
CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE", 1000))
CHUNK_OVERLAP = int(os.environ.get("CHUNK_OVERLAP", 200))
BATCH_SIZE = int(os.environ.get("BATCH_SIZE", 5))

def chunk_text(text: str, chunk_size: int, overlap: int) -> List[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
        if start >= len(text):
            break
    return chunks

def get_embeddings(texts: List[str]) -> np.ndarray:
    """Get embeddings for a batch of texts."""
    texts = [t.replace("\n", " ") for t in texts]
    
    if USE_V1 and client:
        try:
            resp = client.embeddings.create(model=EMBED_MODEL, input=texts)
            vecs = np.array([d.embedding for d in resp.data], dtype="float32")
        except Exception as e:
            print(f"[WARN] OpenAI v1 API failed: {e}")
            # Fallback to dummy embeddings
            vecs = np.random.rand(len(texts), 1536).astype("float32")
    else:
        try:
            import openai
            openai.api_key = os.getenv("OPENAI_API_KEY")
            resp = openai.Embedding.create(model=EMBED_MODEL, input=texts)
            vecs = np.array([d["embedding"] for d in resp["data"]], dtype="float32")
        except Exception as e:
            print(f"[WARN] OpenAI v0 API failed: {e}")
            # Fallback to dummy embeddings
            vecs = np.random.rand(len(texts), 1536).astype("float32")
    
    # Normalize vectors
    norms = np.linalg.norm(vecs, axis=1, keepdims=True) + 1e-12
    return vecs / norms

def main():
    print("[INFO] Building FAISS index for Empowerapy corpus...")
    
    # Create data directory
    DATA_DIR.mkdir(exist_ok=True)
    
    # Load and chunk corpus files
    all_chunks = []
    meta_data = []
    
    for file_path in CORPUS_DIR.glob("*.md"):
        print(f"[INFO] Processing {file_path.name}...")
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        
        chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
        all_chunks.extend(chunks)
        
        for i, chunk in enumerate(chunks):
            meta_data.append({
                "title": file_path.stem,
                "source": str(file_path),
                "chunk_id": i,
                "text": chunk
            })
    
    # Load JSON file if it exists
    json_file = CORPUS_DIR / "PART_5_RAG_JSON_Index.json"
    if json_file.exists():
        print(f"[INFO] Processing {json_file.name}...")
        with open(json_file, "r", encoding="utf-8") as f:
            json_data = json.load(f)
        
        for i, item in enumerate(json_data):
            # Convert JSON item to text representation
            text = f"Query: {item.get('query', '')}\nEmotion: {item.get('emotion', '')}\nBelief: {item.get('beliefDetected', '')}\nInadequate Idea: {item.get('inadequateIdea', '')}\nReframe: {item.get('reframe', '')}\nIntervention: {item.get('intervention', [])}\nAdequate Idea: {item.get('adequateIdea', '')}\nQuotes: {item.get('quotes', [])}\nTherapeutic Practice: {item.get('therapeuticPractice', '')}\nDialogue Example: {item.get('dialogueExample', '')}"
            
            chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
            all_chunks.extend(chunks)
            
            for j, chunk in enumerate(chunks):
                meta_data.append({
                    "title": f"RAG_Index_{i}",
                    "source": str(json_file),
                    "chunk_id": j,
                    "text": chunk
                })
    
    print(f"[INFO] chunks: {len(all_chunks)}")
    
    if not all_chunks:
        print("[ERROR] No chunks found!")
        return
    
    # Get embeddings in batches
    vecs = []
    B = BATCH_SIZE
    
    for i in tqdm(range(0, len(all_chunks), B), desc="Getting embeddings"):
        batch = all_chunks[i:i+B]
        vecs.append(get_embeddings(batch))
    
    # Concatenate all vectors
    all_vecs = np.vstack(vecs)
    print(f"[INFO] vectors shape: {all_vecs.shape}")
    
    # Build FAISS index
    dimension = all_vecs.shape[1]
    index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
    index.add(all_vecs.astype("float32"))
    
    # Save index and metadata
    faiss.write_index(index, str(INDEX_PATH))
    
    with open(META_PATH, "w", encoding="utf-8") as f:
        for item in meta_data:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")
    
    print(f"[INFO] Index saved to {INDEX_PATH}")
    print(f"[INFO] Metadata saved to {META_PATH}")
    print(f"[INFO] Total vectors: {len(all_vecs)}")
    print(f"[INFO] Index ready!")

if __name__ == "__main__":
    main()
