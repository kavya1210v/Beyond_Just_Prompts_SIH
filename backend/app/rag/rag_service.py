import os
from pathlib import Path
import chromadb
from sentence_transformers import SentenceTransformer

class RagService:
    def __init__(self):
        # Setup Chroma DB
        self.rag_db_dir = Path(__file__).resolve().parent.parent.parent.parent / "RAG" / "vectordb"
        self.rag_enabled = False
        try:
            self.chroma_client = chromadb.PersistentClient(path=str(self.rag_db_dir))
            from chromadb.utils import embedding_functions
            self.emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
            self.collection = self.chroma_client.get_collection(name="cyclone_knowledge", embedding_function=self.emb_fn)
            self.rag_enabled = True
        except Exception as e:
            print(f"Failed to initialize Chroma DB: {e}")

    def query_knowledge_base(self, query: str, n_results: int = 4) -> list[str]:
        if not self.rag_enabled:
            return []
            
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results['documents'][0] if results['documents'] else []

rag_service = RagService()
