import os
from pathlib import Path
from langchain.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.docstore.document import Document
import shutil  # For deleting existing DB directories if needed

# --- Configuration ---
POSITIVE_CONVERSATIONS_DIR = Path("./positive_conversations")
NEGATIVE_CONVERSATIONS_DIR = Path("./negative_conversations")

POSITIVE_DB_DIR = Path("./chroma_db_positive")
NEGATIVE_DB_DIR = Path("./chroma_db_negative")

# Using a common and efficient embedding model
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

# --- Helper Functions ---


def create_or_load_db(conversations_dir: Path, db_dir: Path, collection_name: str):
    """
    Creates a ChromaDB vector store from conversation files in a directory.
    Each file is treated as a single document.
    If the DB directory already exists, it will be deleted and recreated.
    """
    if not conversations_dir.exists() or not conversations_dir.is_dir():
        print(f"Error: Directory '{conversations_dir}' not found.")
        return None

    # Optional: Delete existing DB directory to ensure a fresh build
    if db_dir.exists():
        print(f"Deleting existing database directory: {db_dir}")
        shutil.rmtree(db_dir)
    db_dir.mkdir(parents=True, exist_ok=True)  # Ensure directory exists

    documents = []
    file_count = 0
    for filepath in conversations_dir.glob("*.txt"):
        file_count += 1
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                conversation_text = f.read()
            # Create a LangChain Document. Metadata can be useful.
            doc = Document(
                page_content=conversation_text, metadata={"source": str(filepath.name)}
            )
            documents.append(doc)
            print(f"Processed: {filepath.name}")
        except Exception as e:
            print(f"Error reading or processing file {filepath.name}: {e}")

    if not documents:
        print(
            f"No .txt files found or processed in '{conversations_dir}'. Database not created."
        )
        return None

    print(f"\nFound {len(documents)} conversations in '{conversations_dir}'.")
    print(f"Initializing embedding model: {EMBEDDING_MODEL_NAME}...")
    embeddings = SentenceTransformerEmbeddings(model_name=EMBEDDING_MODEL_NAME)

    print(
        f"Creating ChromaDB vector store at '{db_dir}' with collection '{collection_name}'..."
    )
    vector_db = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        collection_name=collection_name,
        persist_directory=str(db_dir),  # Persist the DB to disk
    )
    vector_db.persist()  # Ensure persistence
    print(
        f"Successfully created and persisted database for '{collection_name}' at '{db_dir}'."
    )
    return vector_db


# --- Main Execution ---
if __name__ == "__main__":
    print("--- Starting RAG Database Creation ---")

    # Create Positive Conversations DB
    print("\n--- Processing Positive Conversations ---")
    # Ensure the positive conversations directory exists
    if not POSITIVE_CONVERSATIONS_DIR.exists():
        POSITIVE_CONVERSATIONS_DIR.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {POSITIVE_CONVERSATIONS_DIR}")
        print(
            f"Please add your positive conversation .txt files to '{POSITIVE_CONVERSATIONS_DIR}' and re-run."
        )
    else:
        positive_db = create_or_load_db(
            POSITIVE_CONVERSATIONS_DIR,
            POSITIVE_DB_DIR,
            "positive_conversations_collection",
        )
        if positive_db:
            print(
                f"Positive conversations DB ready. Total documents: {positive_db._collection.count()}"
            )
            # Example query (optional)
            # results = positive_db.similarity_search("customer agreed to buy", k=1)
            # if results:
            #     print(f"\nSample query result from positive DB for 'customer agreed to buy':")
            #     print(f"Source: {results[0].metadata.get('source', 'N/A')}")
            #     print(f"Content snippet: {results[0].page_content[:200]}...")

    # Create Negative Conversations DB
    print("\n--- Processing Negative Conversations ---")
    # Ensure the negative conversations directory exists
    if not NEGATIVE_CONVERSATIONS_DIR.exists():
        NEGATIVE_CONVERSATIONS_DIR.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {NEGATIVE_CONVERSATIONS_DIR}")
        print(
            f"Please add your negative conversation .txt files to '{NEGATIVE_CONVERSATIONS_DIR}' and re-run."
        )
    else:
        negative_db = create_or_load_db(
            NEGATIVE_CONVERSATIONS_DIR,
            NEGATIVE_DB_DIR,
            "negative_conversations_collection",
        )
        if negative_db:
            print(
                f"Negative conversations DB ready. Total documents: {negative_db._collection.count()}"
            )
            # Example query (optional)
            # results = negative_db.similarity_search("customer was angry", k=1)
            # if results:
            #     print(f"\nSample query result from negative DB for 'customer was angry':")
            #     print(f"Source: {results[0].metadata.get('source', 'N/A')}")
            #     print(f"Content snippet: {results[0].page_content[:200]}...")

    print("\n--- RAG Database Creation Finished ---")
