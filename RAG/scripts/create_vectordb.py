import json
import os
from pathlib import Path
import chromadb
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

BASE_DIR = Path(__file__).resolve().parent.parent
CHUNKS_PATH = BASE_DIR / "chunks" / "chunks.json"
DB_DIR = BASE_DIR / "vectordb"

# Clear existing db if it exists to recreate it
import shutil
if DB_DIR.exists():
    print(f"Removing existing vector database at {DB_DIR}...")
    shutil.rmtree(DB_DIR)

DB_DIR.mkdir(parents=True, exist_ok=True)

# Initialize ChromaDB client
client = chromadb.PersistentClient(path=str(DB_DIR))

print("Loading sentence-transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

class EmbeddingFunction:
    def __call__(self, input):
        if isinstance(input, str):
            input = [input]
        return model.encode(input).tolist()

emb_fn = EmbeddingFunction()
collection = client.create_collection(
    name="cyclone_knowledge",
    embedding_function=emb_fn
)

print(f"Loading chunks from {CHUNKS_PATH}...")
with open(CHUNKS_PATH, 'r', encoding='utf-8') as f:
    chunks = json.load(f)

print(f"Loaded {len(chunks)} chunks. Generating embeddings and adding to ChromaDB...")

# Batch processing
batch_size = 500
for i in tqdm(range(0, len(chunks), batch_size)):
    batch = chunks[i:i + batch_size]
    
    ids = [chunk["id"] for chunk in batch]
    documents = [chunk["text"] for chunk in batch]
    metadatas = [{
        "source": chunk.get("source", ""),
        "category": chunk.get("category", ""),
        "heading": chunk.get("heading", ""),
        "chunk_number": chunk.get("chunk_number", 0)
    } for chunk in batch]
    
    collection.add(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )

print("Vector database created successfully!")
