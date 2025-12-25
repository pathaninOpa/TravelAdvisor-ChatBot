import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer, CrossEncoder
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
from pathlib import Path
import time

scriptDir = Path(__file__).parent.resolve()
indexDir = scriptDir.parent / "scripts/index"

class FAISSQuery:
    def __init__(self, index_path=indexDir/"faiss_index.idx", metadata_path=indexDir/"doc_metadata.json"):
        start = time.time()
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        print(f"Model loaded in {time.time() - start:.2f}s")
        start = time.time()
        self.reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
        print(f"Reranker loaded in {time.time() - start:.2f}s")

        start = time.time()
        self.index = faiss.read_index(str(index_path))
        print(f"Index loaded in {time.time() - start:.2f}s")
        with open(metadata_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        start = time.time()
        self.chunk_embeddings = np.load(indexDir / "chunk_embeddings.npy")
        print(f"Embeddings loaded in {time.time() - start:.2f}s")

    @lru_cache(maxsize=512)
    def get_embedding(self, text):
        return self.model.encode(text).astype("float32")

    def is_high_quality(self, chunk):
        return len(chunk.split()) > 30

    def search(self, query, top_k=5):
        query_embedding = self.get_embedding(query).reshape(1, -1)
        D, I = self.index.search(query_embedding, 20)

        candidates = []
        for rank, i in enumerate(I[0]):
            if i >= len(self.metadata):
                continue
            chunk = self.metadata[i]["chunk"]
            if not self.is_high_quality(chunk):
                continue
            score = cosine_similarity([query_embedding[0]], [self.chunk_embeddings[i]])[0][0]
            score *= 1.0 - (rank * 0.015)
            candidates.append((chunk, score))

        candidates.sort(key=lambda x: x[1], reverse=True)
        rerank_inputs = [(query, chunk) for chunk, _ in candidates[:top_k*3]]
        rerank_scores = self.reranker.predict(rerank_inputs)
        reranked = sorted(zip(rerank_inputs, rerank_scores), key=lambda x: x[1], reverse=True)
        top_chunks = [q_chunk[1] for q_chunk, _ in reranked[:top_k]]

        return top_chunks

    def build_context(self, query, top_k=5):
        chunks = self.search(query, top_k)
        return "\n".join(chunks)

if __name__ == "__main__":
    engine = FAISSQuery()
    while True:
        q = input("\n🔍 Enter a travel query (or 'quit'): ")
        if q.lower().strip() == "quit":
            break
        print("Retrieved Context:\n")
        print(engine.build_context(q))
