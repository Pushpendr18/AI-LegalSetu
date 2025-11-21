
import os
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
from typing import List, Dict
import json

class SimpleLegalRAG:
    def __init__(self):
        print("🔄 Loading embedding model...")
        self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        self.documents = []
        self.metadata = []
        self.index = None
        print("✅ RAG system ready!")
        
    def add_document(self, text: str, metadata: Dict = None):
        """Add document to knowledge base"""
        if not metadata:
            metadata = {"source": "user_upload", "type": "legal_document"}
        
        # Simple chunking
        chunks = self._chunk_text(text)
        
        for chunk in chunks:
            self.documents.append(chunk)
            self.metadata.append(metadata)
        
        # Update FAISS index
        self._update_index()
        
        return len(chunks)
    
    def _chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200):
        """Split text into overlapping chunks"""
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start += chunk_size - overlap
        return chunks
    
    def _update_index(self):
        """Update FAISS index with all documents"""
        if not self.documents:
            return
            
        print(f"🔄 Updating index with {len(self.documents)} documents...")
        embeddings = self.embedding_model.encode(self.documents)
        embeddings = embeddings.astype('float32')
        
        # Create or update index
        if self.index is None:
            self.index = faiss.IndexFlatL2(embeddings.shape[1])
        
        self.index.add(embeddings)
        print("✅ Index updated!")
    
    def search_similar(self, query: str, k: int = 3):
        """Search for similar legal content"""
        if not self.documents:
            return []
            
        query_embedding = self.embedding_model.encode([query])
        query_embedding = query_embedding.astype('float32')
        
        # Search
        distances, indices = self.index.search(query_embedding, k)
        
        results = []
        for idx in indices[0]:
            if idx < len(self.documents):
                results.append({
                    'page_content': self.documents[idx],
                    'metadata': self.metadata[idx]
                })
        
        return results
    
    def get_context_for_query(self, query: str) -> str:
        """Get relevant context for a query"""
        similar_docs = self.search_similar(query)
        context = "\n\n".join([doc['page_content'] for doc in similar_docs])
        return context

# Global RAG instance
legal_rag = SimpleLegalRAG()