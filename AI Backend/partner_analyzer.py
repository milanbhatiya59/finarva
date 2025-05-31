import os
from pathlib import Path
from langchain.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from rag_engine import RAGInferenceEngine

# --- Configuration (should match the creation script) ---
POSITIVE_DB_DIR = Path("./chroma_db_positive")
NEGATIVE_DB_DIR = Path("./chroma_db_negative")

# Using the same embedding model used during creation
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

POSITIVE_COLLECTION_NAME = "positive_conversations_collection"
NEGATIVE_COLLECTION_NAME = "negative_conversations_collection"

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional


class SkillRating(BaseModel):
    score: Optional[int] = Field(
        None,
        ge=0,
        le=100,
        description="Rating score from 0-100, null if not applicable",
    )
    applicable: bool = Field(
        ..., description="Whether this aspect was demonstrated in the conversation"
    )
    reasoning: List[str] = Field(..., description="Specific reasons for the rating")


class PartnerPerformanceAnalysis(BaseModel):
    # Core skills ratings
    conversation_skills: SkillRating = Field(
        ..., description="Rating of general conversation abilities"
    )
    product_knowledge: SkillRating = Field(
        ..., description="Rating of product expertise demonstrated"
    )
    customer_engagement: SkillRating = Field(
        ..., description="Rating of how well partner engaged with customer needs"
    )
    professionalism: SkillRating = Field(
        ..., description="Rating of professional conduct"
    )
    sales_effectiveness: SkillRating = Field(
        ..., description="Rating of sales techniques and closing ability"
    )

    # Overall performance
    overall_rating: int = Field(
        ..., ge=0, le=100, description="Combined performance score"
    )
    overall_summary: str = Field(
        ..., description="Brief summary of overall performance"
    )

    # Key strengths and areas for improvement
    key_strengths: List[str] = Field(
        ..., description="Partner's strongest skills demonstrated"
    )
    improvement_areas: List[str] = Field(
        ..., description="Specific skills that need development"
    )

    # Comparative analysis
    missed_opportunities: List[str] = Field(
        ...,
        description="Things that could have been said or done based on positive examples",
    )
    communication_missteps: List[str] = Field(
        ..., description="Negative aspects similar to negative examples"
    )

    # Learning recommendations
    recommended_actions: List[str] = Field(
        ..., description="Specific actions to improve performance"
    )


PARTNER_ANALYSIS_PROMPT_TEMPLATE = """
# GroMo Partner Performance Analysis

You are an expert sales coach specializing in financial product sales. Analyze the performance of a GroMo partner in the provided conversation and give structured, actionable feedback.

## IMPORTANT INSTRUCTIONS
- Only rate aspects that appear in the conversation - mark others as "not applicable" (set applicable=false and score=null)
- For each rating, provide specific evidence from the conversation
- Ratings should be on a scale of 0-100 where:
  * 90-100: Exceptional performance
  * 70-89: Strong performance
  * 50-69: Adequate performance
  * 30-49: Needs improvement
  * 0-29: Serious concerns
- Be specific, constructive, and evidence-based in your feedback
- DO NOT invent or assume information not present in the conversation

## POLICY INFORMATION FROM KNOWLEDGE BASE
{rag_context}

## POSITIVE EXAMPLES
The following are examples of highly effective conversations:
{positive_examples}

## NEGATIVE EXAMPLES
The following are examples of problematic conversations:
{negative_examples}

## ASPECTS TO ANALYZE

### 1. CONVERSATION SKILLS (0-100)
Rate the partner's ability to:
- Listen actively and respond appropriately
- Communicate clearly and concisely
- Build rapport and trust
- Structure the conversation effectively
- Handle objections smoothly

### 2. PRODUCT KNOWLEDGE (0-100)
Rate the partner's:
- Accuracy of product information
- Understanding of features and benefits
- Ability to explain complex concepts simply
- Command of specific details (rates, terms, etc.)
- If partner admits not knowing something, note this but don't heavily penalize if they commit to following up

### 3. CUSTOMER ENGAGEMENT (0-100)
Rate how well the partner:
- Identifies and addresses customer needs
- Personalizes the conversation
- Asks effective discovery questions
- Demonstrates value proposition
- Shows genuine interest in the customer's situation

### 4. PROFESSIONALISM (0-100)
Rate the partner's:
- Courtesy and respect
- Appropriate language and tone
- Time management
- Follow-through on commitments
- Ethical representation of products

### 5. SALES EFFECTIVENESS (0-100)
Rate the partner's ability to:
- Create interest and urgency
- Handle objections effectively
- Use trial closing techniques
- Demonstrate value
- Plan next steps and follow-up

## COMPARATIVE ANALYSIS
Based on the positive and negative examples provided:
1. List 3-5 specific techniques or statements from positive examples that were missing from this conversation
2. Identify any problematic patterns similar to the negative examples (if any)

## LEARNING RECOMMENDATIONS
Provide 3-5 concrete, actionable recommendations for how the partner could improve their performance

## CONVERSATION TO ANALYZE
{conversation}

"""


# --- Helper Function to Load DB ---
def load_vector_db(db_dir: Path, collection_name: str, embedding_function):
    """
    Loads an existing ChromaDB vector store from a persisted directory.
    """
    if not db_dir.exists() or not db_dir.is_dir():
        print(
            f"Error: Database directory '{db_dir}' not found. Please create the DB first."
        )
        return None

    print(
        f"Loading ChromaDB vector store from '{db_dir}' with collection '{collection_name}'..."
    )
    try:
        vector_db = Chroma(
            persist_directory=str(db_dir),
            embedding_function=embedding_function,
            collection_name=collection_name,
        )
        print(
            f"Successfully loaded database. Total documents: {vector_db._collection.count()}"
        )
        return vector_db
    except Exception as e:
        print(f"Error loading database from '{db_dir}': {e}")
        print(
            "Make sure the collection name matches the one used during creation and the DB files are intact."
        )
        return None


if __name__ == "__main__":
    llm = ChatGroq(
        api_key="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",
        temperature=0,
    )
    db_path = "./health_rag_db"  # Update this path
    conversation = ""
    rag_engine = RAGInferenceEngine(db_path=db_path)
    raw_result = rag_engine.query(
        conversation, n_results=40, similarity_threshold=0.1, return_raw=True
    )
    rag_content = ""
    for i, chunk in enumerate(raw_result["retrieved_chunks"], 1):
        rag_content += f"\n{i}. Source: {chunk['metadata']['file_name']} "
        rag_content += f"\n   Content: {chunk['content']}"
    embeddings = SentenceTransformerEmbeddings(model_name=EMBEDDING_MODEL_NAME)

    # Load Positive Conversations DB
    print("\n--- Loading Positive Conversations DB ---")
    positive_db = load_vector_db(POSITIVE_DB_DIR, POSITIVE_COLLECTION_NAME, embeddings)

    positive_conversations = ""
    negative_conversations = ""

    if positive_db:

        results_positive = positive_db.similarity_search_with_score(conversation, k=2)

        if results_positive:
            ct = 1
            for doc, score in results_positive:
                positive_conversations += f"Conversation No.: {ct}\n"
                ct += 1

                positive_conversations += f"  Content: \n{doc.page_content}\n"
        else:
            print("No results found for the positive query.")

    negative_db = load_vector_db(NEGATIVE_DB_DIR, NEGATIVE_COLLECTION_NAME, embeddings)

    if negative_db:

        results_negative = negative_db.similarity_search_with_score(conversation, k=2)

        if results_negative:

            ct = 1
            for doc, score in results_positive:
                negative_conversations += f"Conversation No.: {ct}\n"
                ct += 1

                negative_conversations += f"  Content: \n{doc.page_content}\n"
        else:
            print("No results found for the negative query.")

    structured_llm = llm.with_structured_output(PartnerPerformanceAnalysis)
    prompt_template = PromptTemplate(
        template=PARTNER_ANALYSIS_PROMPT_TEMPLATE,
        input_variables=[
            "conversation_transcript",
            "rag_context",
            "negative_examples",
            "positive_examples",
        ],
    )

    prompt = prompt_template.format(
        conversation_transcript=conversation,
        rag_context=rag_content,
        positive_examples=positive_conversations,
        negative_examples=negative_conversations,
    )

    output = llm.invoke(prompt).json()
