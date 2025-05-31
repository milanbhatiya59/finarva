import os
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import json

# Vector database and embeddings
import chromadb
from sentence_transformers import SentenceTransformer

# Optional: LLM integration (uncomment if using OpenAI, Anthropic, etc.)
# import openai
# from anthropic import Anthropic

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RAGInferenceEngine:
    """RAG inference engine for querying and generating responses"""

    def __init__(
        self,
        db_path: str = "./financial_rag_db",
        collection_name: str = "financial_documents",
        embedding_model: str = "all-MiniLM-L6-v2",
        llm_provider: str = "local",
    ):  # "openai", "anthropic", "local"

        self.db_path = db_path
        self.collection_name = collection_name
        self.llm_provider = llm_provider

        # Initialize embedding model
        self.embedding_model = SentenceTransformer(embedding_model)

        # Initialize vector database
        self.client = chromadb.PersistentClient(path=db_path)
        try:
            self.collection = self.client.get_collection(collection_name)
            logger.info(f"Connected to collection: {collection_name}")
        except Exception as e:
            logger.error(f"Failed to connect to collection {collection_name}: {e}")
            raise

        # Initialize LLM (uncomment and configure as needed)
        # self._initialize_llm()

    def _initialize_llm(self):
        """Initialize the language model based on provider"""
        if self.llm_provider == "openai":
            # openai.api_key = os.getenv("OPENAI_API_KEY")
            pass
        elif self.llm_provider == "anthropic":
            # self.anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            pass
        # Add other providers as needed

    def retrieve_relevant_chunks(
        self, query: str, n_results: int = 5, similarity_threshold: float = 0.3
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant document chunks for a query"""

        # Generate query embedding
        query_embedding = self.embedding_model.encode([query]).tolist()

        # Query the vector database
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results,
            include=["documents", "metadatas", "distances"],
        )

        # Debug: Print raw results first
        total_results = len(results["documents"][0]) if results["documents"] else 0
        logger.info(f"Raw query returned {total_results} results")

        if total_results == 0:
            logger.warning("No results returned from vector database query")
            return []

        # Filter by similarity threshold and format results
        relevant_chunks = []
        for i, (doc, metadata, distance) in enumerate(
            zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0],
            )
        ):
            similarity_score = 1 - distance  # Convert distance to similarity

            # Debug: Log similarity scores
            if i < 3:  # Log first 3 for debugging
                logger.info(
                    f"Result {i+1}: similarity={similarity_score:.3f}, distance={distance:.3f}"
                )

            if similarity_score >= similarity_threshold:
                relevant_chunks.append(
                    {
                        "content": doc,
                        "metadata": metadata,
                        "similarity_score": similarity_score,
                        "rank": i + 1,
                    }
                )

        logger.info(
            f"Retrieved {len(relevant_chunks)} relevant chunks (threshold={similarity_threshold}) for query: '{query[:50]}...'"
        )

        # If no chunks meet threshold, return top results anyway with warning
        if len(relevant_chunks) == 0 and total_results > 0:
            logger.warning(
                f"No chunks met similarity threshold {similarity_threshold}. Returning top results anyway."
            )
            for i, (doc, metadata, distance) in enumerate(
                zip(
                    results["documents"][0][:3],  # Return top 3
                    results["metadatas"][0][:3],
                    results["distances"][0][:3],
                )
            ):
                similarity_score = 1 - distance
                relevant_chunks.append(
                    {
                        "content": doc,
                        "metadata": metadata,
                        "similarity_score": similarity_score,
                        "rank": i + 1,
                    }
                )

        return relevant_chunks

    def generate_context_from_chunks(self, chunks: List[Dict[str, Any]]) -> str:
        """Generate context string from retrieved chunks"""
        if not chunks:
            return "No relevant information found."

        context_parts = []
        for i, chunk in enumerate(chunks, 1):
            source_info = f"[Source: {chunk['metadata']['file_name']} from {chunk['metadata']['folder_name']}]"
            content = chunk["content"]
            context_parts.append(f"{source_info}\n{content}\n")

        return "\n" + "=" * 50 + "\n".join(context_parts)

    def create_prompt(self, query: str, context: str) -> str:
        """Create a prompt for the LLM"""
        prompt = f"""You are a helpful assistant specializing in financial products and services. 
You have access to various financial documents including credit card terms, loan information, and banking products.

Based on the following retrieved information, please answer the user's question accurately and comprehensively.

Retrieved Information:
{context}

User Question: {query}

Instructions:
- Provide a detailed and accurate answer based on the retrieved information
- If the information is insufficient, clearly state what's missing
- Cite specific sources when possible
- Be helpful and professional in your response
- If you're unsure about something, acknowledge the uncertainty

Answer:"""
        return prompt

    def generate_response_local(self, prompt: str) -> str:
        """Generate response using local processing (without external LLM)"""
        # This is a simple template-based response for when no LLM is available
        return """Based on the retrieved documents, I can provide information about your query. 
However, for more sophisticated responses, please integrate with an LLM service like OpenAI GPT-4 or Anthropic Claude.

To see the raw retrieved information, use the 'get_raw_context' method."""

    def query(
        self,
        query: str,
        n_results: int = 5,
        similarity_threshold: float = 0.3,
        return_raw: bool = False,
    ) -> Dict[str, Any]:
        """Main query method that retrieves and generates response"""

        # Retrieve relevant chunks
        relevant_chunks = self.retrieve_relevant_chunks(
            query, n_results, similarity_threshold
        )

        # Generate context
        context = self.generate_context_from_chunks(relevant_chunks)

        if return_raw:
            return {
                "query": query,
                "retrieved_chunks": relevant_chunks,
                "context": context,
                "timestamp": datetime.now().isoformat(),
            }

        # Create prompt
        prompt = self.create_prompt(query, context)

        # Generate response (extend this section based on your LLM choice)
        if self.llm_provider == "local":
            response = self.generate_response_local(prompt)
        else:
            # Add LLM integration here
            response = "LLM integration not implemented yet. Use return_raw=True to see retrieved context."

        return {
            "query": query,
            "response": response,
            "sources": [chunk["metadata"] for chunk in relevant_chunks],
            "context": context,
            "num_sources": len(relevant_chunks),
            "timestamp": datetime.now().isoformat(),
        }

    def get_database_stats(self) -> Dict[str, Any]:
        """Get statistics about the vector database"""
        count = self.collection.count()
        return {
            "total_chunks": count,
            "collection_name": self.collection_name,
            "db_path": self.db_path,
        }

    def search_by_file(self, file_name: str, query: str = None) -> List[Dict[str, Any]]:
        """Search for chunks from a specific file"""
        # Get all chunks from the specified file
        results = self.collection.get(
            where={"file_name": file_name}, include=["documents", "metadatas"]
        )

        chunks = []
        for doc, metadata in zip(results["documents"], results["metadatas"]):
            chunks.append({"content": doc, "metadata": metadata})

        # If query is provided, rank by similarity
        if query and chunks:
            query_embedding = self.embedding_model.encode([query])
            chunk_embeddings = self.embedding_model.encode(
                [chunk["content"] for chunk in chunks]
            )

            from sklearn.metrics.pairwise import cosine_similarity

            similarities = cosine_similarity(query_embedding, chunk_embeddings)[0]

            for i, chunk in enumerate(chunks):
                chunk["similarity_score"] = similarities[i]

            chunks.sort(key=lambda x: x["similarity_score"], reverse=True)

        return chunks

    def list_available_files(self) -> List[Dict[str, Any]]:
        """List all files in the database"""
        # Get all unique files
        all_metadata = self.collection.get(include=["metadatas"])["metadatas"]

        files = {}
        for metadata in all_metadata:
            file_name = metadata["file_name"]
            if file_name not in files:
                files[file_name] = {
                    "file_name": file_name,
                    "folder_name": metadata["folder_name"],
                    "file_extension": metadata["file_extension"],
                    "chunk_count": 1,
                }
            else:
                files[file_name]["chunk_count"] += 1

        return list(files.values())

    # Add a debugging method
    def debug_query(self, query: str, n_results: int = 5) -> Dict[str, Any]:
        """Debug method to see what's happening with queries"""
        print(f"\n🔍 DEBUGGING QUERY: '{query}'")
        print("-" * 60)

        # Check if collection exists and has data
        try:
            count = self.collection.count()
            print(f"✅ Collection has {count} chunks")
        except Exception as e:
            print(f"❌ Error accessing collection: {e}")
            return {}

        if count == 0:
            print("❌ No chunks in database!")
            return {}

        # Generate embedding
        try:
            query_embedding = self.embedding_model.encode([query]).tolist()
            print(f"✅ Generated query embedding (dim: {len(query_embedding[0])})")
        except Exception as e:
            print(f"❌ Error generating embedding: {e}")
            return {}

        # Raw query to database
        try:
            results = self.collection.query(
                query_embeddings=query_embedding,
                n_results=n_results,
                include=["documents", "metadatas", "distances"],
            )
            print(
                f"✅ Raw query returned {len(results['documents'][0]) if results['documents'] else 0} results"
            )
        except Exception as e:
            print(f"❌ Error querying database: {e}")
            return {}

        # Show top results with scores
        if results["documents"] and len(results["documents"][0]) > 0:
            print(f"\n📊 Top {min(3, len(results['documents'][0]))} results:")
            for i, (doc, metadata, distance) in enumerate(
                zip(
                    results["documents"][0][:3],
                    results["metadatas"][0][:3],
                    results["distances"][0][:3],
                )
            ):
                similarity = 1 - distance
                print(
                    f"\n{i+1}. Similarity: {similarity:.3f} | Distance: {distance:.3f}"
                )
                print(f"   File: {metadata.get('file_name', 'unknown')}")
                print(f"   Folder: {metadata.get('folder_name', 'unknown')}")
                print(f"   Content: {doc[:100]}...")
        else:
            print("❌ No results returned from query")

        return results
