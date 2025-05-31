import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import hashlib
from dataclasses import dataclass
from datetime import datetime

# Document processing
import PyPDF2
import fitz  # PyMuPDF (alternative PDF reader)

# Semantic chunking and embeddings
import nltk
from nltk.tokenize import sent_tokenize
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Vector database
import chromadb
from chromadb.config import Settings
import uuid


# Download required NLTK data
def setup_nltk():
    """Setup NLTK with proper downloads"""
    try:
        # Try the new punkt_tab first (NLTK 3.8+)
        nltk.data.find("tokenizers/punkt_tab")
        print("Found punkt_tab tokenizer")
    except LookupError:
        try:
            print("Downloading punkt_tab tokenizer...")
            nltk.download("punkt_tab")
        except:
            try:
                # Fallback to old punkt
                print("punkt_tab failed, trying punkt...")
                nltk.download("punkt")
            except Exception as e:
                print(f"NLTK download failed: {e}")
                print("Falling back to simple text splitting...")


# Setup NLTK
setup_nltk()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("rag_pipeline.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


@dataclass
class DocumentChunk:
    """Represents a semantic chunk of a document"""

    id: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[np.ndarray] = None


class DocumentProcessor:
    """Handles extraction of text from various document formats"""

    def __init__(self):
        self.supported_formats = {".txt", ".pdf", ".json", ".docx"}

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF using PyMuPDF (more robust)"""
        try:
            print(f"Attempting to extract from PDF: {file_path}")
            doc = fitz.open(file_path)
            text = ""
            for page_num, page in enumerate(doc):
                page_text = page.get_text()
                text += page_text
                print(f"  Page {page_num + 1}: {len(page_text)} characters")
            doc.close()
            print(f"  Total PDF text length: {len(text)} characters")
            return text.strip()
        except Exception as e:
            logger.warning(f"PyMuPDF failed for {file_path}, trying PyPDF2: {e}")
            # Fallback to PyPDF2
            try:
                with open(file_path, "rb") as file:
                    reader = PyPDF2.PdfReader(file)
                    text = ""
                    for page_num, page in enumerate(reader.pages):
                        page_text = page.extract_text()
                        text += page_text
                        print(f"  Page {page_num + 1}: {len(page_text)} characters")
                print(f"  Total PDF text length (PyPDF2): {len(text)} characters")
                return text.strip()
            except Exception as e2:
                logger.error(f"Failed to extract text from PDF {file_path}: {e2}")
                return ""

    def extract_text_from_txt(self, file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            print(f"Attempting to extract from TXT: {file_path}")
            with open(file_path, "r", encoding="utf-8") as file:
                text = file.read().strip()
                print(f"  TXT text length: {len(text)} characters")
                return text
        except UnicodeDecodeError:
            try:
                print("  UTF-8 failed, trying latin-1 encoding...")
                with open(file_path, "r", encoding="latin-1") as file:
                    text = file.read().strip()
                    print(f"  TXT text length (latin-1): {len(text)} characters")
                    return text
            except Exception as e:
                logger.error(f"Failed to extract text from TXT {file_path}: {e}")
                return ""

    def extract_text_from_json(self, file_path: str) -> str:
        """Extract text from JSON file"""
        try:
            print(f"Attempting to extract from JSON: {file_path}")
            with open(file_path, "r", encoding="utf-8") as file:
                data = json.load(file)
                text = json.dumps(data, indent=2)
                print(f"  JSON text length: {len(text)} characters")
                return text
        except Exception as e:
            logger.error(f"Failed to extract text from JSON {file_path}: {e}")
            return ""

    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            print(f"Attempting to extract from DOCX: {file_path}")
            from docx import Document

            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            print(f"  DOCX text length: {len(text)} characters")
            return text.strip()
        except ImportError:
            logger.error(
                "python-docx not installed. Install with: pip install python-docx"
            )
            return ""
        except Exception as e:
            logger.error(f"Failed to extract text from DOCX {file_path}: {e}")
            return ""

    def extract_text(self, file_path: str) -> str:
        """Extract text from supported file formats"""
        file_extension = Path(file_path).suffix.lower()
        print(f"Processing file: {file_path} (extension: {file_extension})")

        if file_extension == ".pdf":
            return self.extract_text_from_pdf(file_path)
        elif file_extension == ".txt":
            return self.extract_text_from_txt(file_path)
        elif file_extension == ".json":
            return self.extract_text_from_json(file_path)
        elif file_extension == ".docx":
            return self.extract_text_from_docx(file_path)
        else:
            logger.warning(f"Unsupported file format: {file_extension}")
            return ""


class SemanticChunker:
    """Creates semantic chunks using sentence similarity"""

    def __init__(
        self, model_name: str = "all-MiniLM-L6-v2", similarity_threshold: float = 0.3
    ):
        print(f"Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.similarity_threshold = similarity_threshold
        self.max_chunk_size = 1000  # Maximum words per chunk
        self.min_chunk_size = 20  # Minimum words per chunk
        print(f"Chunker initialized with similarity_threshold={similarity_threshold}")

    def create_semantic_chunks(
        self, text: str, metadata: Dict[str, Any]
    ) -> List[DocumentChunk]:
        """Create semantic chunks from text using sentence similarity"""
        print(f"Creating chunks from text of length: {len(text)} characters")

        if not text.strip():
            print("  Empty text, returning no chunks")
            return []

        # Split into sentences with fallback
        try:
            sentences = sent_tokenize(text)
            print(f"  Split into {len(sentences)} sentences using NLTK")
        except Exception as e:
            print(f"  NLTK sentence tokenization failed: {e}")
            print("  Using simple sentence splitting...")
            # Simple fallback sentence splitting
            sentences = [
                s.strip()
                for s in text.replace("!", ".").replace("?", ".").split(".")
                if s.strip()
            ]
            print(f"  Split into {len(sentences)} sentences using simple method")

        if len(sentences) <= 1:
            # If only one sentence or no sentences, return as single chunk
            if len(text.split()) >= self.min_chunk_size:
                chunk_id = self._generate_chunk_id(text, metadata)
                print(f"  Created single chunk with ID: {chunk_id}")
                return [
                    DocumentChunk(
                        id=chunk_id,
                        content=text,
                        metadata={**metadata, "chunk_index": 0, "total_chunks": 1},
                    )
                ]
            else:
                print("  Text too short for chunking")
                return []

        # For very small documents, create simple chunks by word count
        if len(sentences) < 5:
            return self._create_simple_chunks(text, metadata)

        try:
            # Generate embeddings for sentences
            print("  Generating sentence embeddings...")
            sentence_embeddings = self.model.encode(sentences)
            print(f"  Generated embeddings for {len(sentence_embeddings)} sentences")

            # Group semantically similar sentences
            chunks = []
            current_chunk_sentences = [sentences[0]]
            current_chunk_embeddings = [sentence_embeddings[0]]

            for i in range(1, len(sentences)):
                current_sentence = sentences[i]
                current_embedding = sentence_embeddings[i]

                # Calculate similarity with current chunk
                chunk_embedding = np.mean(current_chunk_embeddings, axis=0)
                similarity = cosine_similarity([current_embedding], [chunk_embedding])[
                    0
                ][0]

                # Check if current chunk would be too large
                current_chunk_text = " ".join(
                    current_chunk_sentences + [current_sentence]
                )
                chunk_too_large = len(current_chunk_text.split()) > self.max_chunk_size

                # Add to current chunk if similar and not too large
                if similarity >= self.similarity_threshold and not chunk_too_large:
                    current_chunk_sentences.append(current_sentence)
                    current_chunk_embeddings.append(current_embedding)
                else:
                    # Finalize current chunk if it meets minimum size
                    chunk_text = " ".join(current_chunk_sentences)
                    if len(chunk_text.split()) >= self.min_chunk_size:
                        chunk_id = self._generate_chunk_id(chunk_text, metadata)
                        chunks.append(
                            DocumentChunk(
                                id=chunk_id,
                                content=chunk_text,
                                metadata={
                                    **metadata,
                                    "chunk_index": len(chunks),
                                    "sentence_count": len(current_chunk_sentences),
                                },
                            )
                        )
                        print(
                            f"  Created chunk {len(chunks)} with {len(current_chunk_sentences)} sentences"
                        )

                    # Start new chunk
                    current_chunk_sentences = [current_sentence]
                    current_chunk_embeddings = [current_embedding]

            # Add the last chunk
            if current_chunk_sentences:
                chunk_text = " ".join(current_chunk_sentences)
                if len(chunk_text.split()) >= self.min_chunk_size:
                    chunk_id = self._generate_chunk_id(chunk_text, metadata)
                    chunks.append(
                        DocumentChunk(
                            id=chunk_id,
                            content=chunk_text,
                            metadata={
                                **metadata,
                                "chunk_index": len(chunks),
                                "sentence_count": len(current_chunk_sentences),
                            },
                        )
                    )
                    print(
                        f"  Created final chunk {len(chunks)} with {len(current_chunk_sentences)} sentences"
                    )

            # Update total chunks in metadata
            for chunk in chunks:
                chunk.metadata["total_chunks"] = len(chunks)

            print(f"  Total chunks created: {len(chunks)}")
            return chunks

        except Exception as e:
            print(f"  Error in semantic chunking: {e}")
            print("  Falling back to simple chunking...")
            return self._create_simple_chunks(text, metadata)

    def _create_simple_chunks(
        self, text: str, metadata: Dict[str, Any]
    ) -> List[DocumentChunk]:
        """Create simple chunks by splitting text into fixed-size pieces"""
        words = text.split()
        chunks = []

        for i in range(0, len(words), self.max_chunk_size):
            chunk_words = words[i : i + self.max_chunk_size]
            if len(chunk_words) >= self.min_chunk_size:
                chunk_text = " ".join(chunk_words)
                chunk_id = self._generate_chunk_id(chunk_text, metadata)
                chunks.append(
                    DocumentChunk(
                        id=chunk_id,
                        content=chunk_text,
                        metadata={
                            **metadata,
                            "chunk_index": len(chunks),
                            "word_count": len(chunk_words),
                        },
                    )
                )

        # Update total chunks in metadata
        for chunk in chunks:
            chunk.metadata["total_chunks"] = len(chunks)

        print(f"  Created {len(chunks)} simple chunks")
        return chunks

    def _generate_chunk_id(self, text: str, metadata: Dict[str, Any]) -> str:
        """Generate unique ID for chunk"""
        content_hash = hashlib.md5(text.encode()).hexdigest()[:8]
        file_name = metadata.get("file_name", "unknown")
        return f"{file_name}_{content_hash}_{uuid.uuid4().hex[:8]}"


class VectorDatabase:
    """Manages the vector database using ChromaDB"""

    def __init__(
        self, db_path: str = "./chroma_db", collection_name: str = "financial_documents"
    ):
        self.db_path = db_path
        self.collection_name = collection_name

        print(f"Initializing ChromaDB at: {db_path}")
        self.client = chromadb.PersistentClient(path=db_path)
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        # Create or get collection
        try:
            self.collection = self.client.get_collection(collection_name)
            logger.info(f"Connected to existing collection: {collection_name}")
        except:
            self.collection = self.client.create_collection(
                name=collection_name,
                metadata={"description": "Financial documents RAG collection"},
            )
            logger.info(f"Created new collection: {collection_name}")

    def add_chunks(self, chunks: List[DocumentChunk]) -> None:
        """Add document chunks to the vector database"""
        if not chunks:
            print("  No chunks to add")
            return

        print(f"  Adding {len(chunks)} chunks to vector database...")

        # Generate embeddings for chunks
        texts = [chunk.content for chunk in chunks]
        print("  Generating embeddings...")
        embeddings = self.model.encode(texts).tolist()

        # Prepare data for ChromaDB
        ids = [chunk.id for chunk in chunks]
        metadatas = [chunk.metadata for chunk in chunks]

        # Add to collection
        try:
            self.collection.add(
                embeddings=embeddings, documents=texts, metadatas=metadatas, ids=ids
            )
            print(f"  Successfully added {len(chunks)} chunks to database")
            logger.info(f"Added {len(chunks)} chunks to vector database")
        except Exception as e:
            logger.error(f"Failed to add chunks to database: {e}")
            print(f"  Error adding chunks: {e}")

    def query(self, query_text: str, n_results: int = 5) -> Dict[str, Any]:
        """Query the vector database"""
        query_embedding = self.model.encode([query_text]).tolist()

        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results,
            include=["documents", "metadatas", "distances"],
        )

        return results

    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the collection"""
        count = self.collection.count()
        return {
            "total_chunks": count,
            "collection_name": self.collection_name,
            "db_path": self.db_path,
        }


class RAGPipeline:
    """Main RAG pipeline orchestrator"""

    def __init__(self, root_folder: str, db_path: str = "./chroma_db"):
        self.root_folder = Path(root_folder)
        self.processor = DocumentProcessor()
        self.chunker = SemanticChunker()
        self.vector_db = VectorDatabase(db_path)

        print(f"RAG Pipeline initialized")
        print(f"  Root folder: {self.root_folder}")
        print(f"  Database path: {db_path}")

        # Check if root folder exists
        if not self.root_folder.exists():
            raise FileNotFoundError(f"Root folder does not exist: {self.root_folder}")

    def process_documents(self) -> None:
        """Process all documents in the root folder and create vector database"""
        logger.info(f"Starting document processing from: {self.root_folder}")
        print(f"\n=== PROCESSING DOCUMENTS FROM: {self.root_folder} ===")

        total_files = 0
        processed_files = 0
        total_chunks = 0

        # First, let's see what files we have
        print(f"\nScanning directory structure...")
        all_files = []
        for root, dirs, files in os.walk(self.root_folder):
            print(f"  Folder: {root}")
            for file in files:
                file_path = Path(root) / file
                file_extension = file_path.suffix.lower()
                print(f"    File: {file} (extension: {file_extension})")

                if file_extension in self.processor.supported_formats:
                    all_files.append(file_path)
                    print(f"      -> SUPPORTED")
                else:
                    print(f"      -> UNSUPPORTED")

        print(f"\nFound {len(all_files)} supported files to process")

        if len(all_files) == 0:
            print("ERROR: No supported files found!")
            print("Supported formats:", self.processor.supported_formats)
            return

        # Process each file
        for file_path in all_files:
            folder_name = file_path.parent.name
            total_files += 1

            print(f"\n--- Processing File {total_files}/{len(all_files)} ---")
            print(f"File: {file_path}")
            print(f"Folder: {folder_name}")

            try:
                # Extract text
                text = self.processor.extract_text(str(file_path))

                if not text.strip():
                    print(f"WARNING: No text extracted from: {file_path}")
                    continue

                print(f"Extracted {len(text)} characters, {len(text.split())} words")

                # Create metadata
                metadata = {
                    "file_name": file_path.name,
                    "file_path": str(file_path),
                    "folder_name": folder_name,
                    "file_extension": file_path.suffix.lower(),
                    "file_size": file_path.stat().st_size,
                    "processed_date": datetime.now().isoformat(),
                    "char_count": len(text),
                    "word_count": len(text.split()),
                }

                # Create semantic chunks
                print("Creating semantic chunks...")
                chunks = self.chunker.create_semantic_chunks(text, metadata)

                if chunks:
                    print(f"Created {len(chunks)} chunks")
                    # Add chunks to vector database
                    self.vector_db.add_chunks(chunks)
                    total_chunks += len(chunks)
                    processed_files += 1
                    print(f"SUCCESS: Added {len(chunks)} chunks to database")
                else:
                    print("WARNING: No chunks created from this file")

            except Exception as e:
                logger.error(f"Error processing {file_path}: {e}")
                print(f"ERROR processing {file_path}: {e}")

        # Log summary
        stats = self.vector_db.get_collection_stats()
        summary = f"""
=== PROCESSING SUMMARY ===
Total files found: {total_files}
Successfully processed: {processed_files}
Total chunks created: {total_chunks}
Database stats: {stats}
        """
        print(summary)
        logger.info(summary)

    def query_documents(self, query: str, n_results: int = 5) -> Dict[str, Any]:
        """Query the processed documents"""
        return self.vector_db.query(query, n_results)


# Example usage and main execution
if __name__ == "__main__":
    # Configuration - UPDATE THIS PATH TO YOUR ACTUAL FOLDER
    ROOT_FOLDER = (
        "health insurance"  # Current directory - change this to your actual path
    )
    DB_PATH = "./health_rag_db"

    print("=== RAG PIPELINE STARTING ===")
    print(f"Looking for documents in: {os.path.abspath(ROOT_FOLDER)}")

    # Check if folder exists
    if not os.path.exists(ROOT_FOLDER):
        print(f"ERROR: Folder '{ROOT_FOLDER}' does not exist!")
        print(
            "Please update ROOT_FOLDER in the script to point to your documents folder"
        )
        exit(1)

    try:
        # Create RAG pipeline
        rag_pipeline = RAGPipeline(ROOT_FOLDER, DB_PATH)

        # Process all documents
        logger.info("Starting RAG pipeline...")
        rag_pipeline.process_documents()

        # Print final statistics
        stats = rag_pipeline.vector_db.get_collection_stats()
        print(f"\n=== FINAL DATABASE STATISTICS ===")
        print(f"Total chunks: {stats['total_chunks']}")
        print(f"Collection: {stats['collection_name']}")
        print(f"Database path: {stats['db_path']}")

        if stats["total_chunks"] > 0:
            print("\n=== SUCCESS! ===")
            print("Vector database created successfully!")

            # Test a few queries
            test_queries = ["credit card", "loan", "interest rate"]

            print("\n=== TESTING QUERIES ===")
            for query in test_queries:
                print(f"\nTesting query: '{query}'")
                results = rag_pipeline.query_documents(query, n_results=2)

                if results["documents"] and results["documents"][0]:
                    for i, (doc, metadata) in enumerate(
                        zip(results["documents"][0], results["metadatas"][0])
                    ):
                        print(
                            f"  Result {i+1}: {metadata['file_name']} - {doc[:100]}..."
                        )
                else:
                    print("  No results found")
        else:
            print("\n=== ERROR ===")
            print("No chunks were created. Please check:")
            print("1. ROOT_FOLDER path is correct")
            print("2. Folder contains supported files (.txt, .pdf, .json, .docx)")
            print("3. Files are not empty or corrupted")
            print("4. Check the log file 'rag_pipeline.log' for detailed errors")

    except Exception as e:
        print(f"\nFATAL ERROR: {e}")
        logger.error(f"Fatal error in main execution: {e}")
