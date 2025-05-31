from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum
from langchain_groq import ChatGroq
from langchain.prompts import (
    PromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from rag_engine import RAGInferenceEngine
from langchain_google_genai import ChatGoogleGenerativeAI


class OutcomeType(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"


class FollowUpType(str, Enum):
    CALL = "call"
    MEETING = "meeting"
    VISIT = "visit"
    NONE = "none"


class ConversationInsights(BaseModel):
    # Core insights
    summary: str = Field(description="Brief summary of the conversation")
    outcome: OutcomeType = Field(
        description="Outcome classification (positive/neutral/negative)"
    )
    outcome_reason: str = Field(description="Evidence for the outcome classification")

    # Follow-up details
    follow_up_required: bool = Field(description="Whether any follow-up is needed")
    follow_up_type: FollowUpType = Field(
        default=FollowUpType.NONE, description="Type of follow-up"
    )
    follow_up_datetime: Optional[datetime] = Field(
        None, description="Follow-up date and time"
    )
    follow_up_notes: Optional[str] = Field(
        None, description="Additional follow-up context"
    )

    # Product details
    products_discussed: List[str] = Field(description="Products or policies mentioned")
    customer_interest: Dict[str, str] = Field(
        description="Interest level per product (high/medium/low)"
    )

    # Customer insights
    objections: List[str] = Field(description="Customer's concerns or objections")
    questions_asked: List[str] = Field(description="Important questions from customer")
    needs_expressed: List[str] = Field(description="Financial needs mentioned")

    # Partner performance
    knowledge_gaps: List[str] = Field(
        description="Topics where partner lacked information"
    )
    explanation_quality: str = Field(description="How well partner explained products")

    # Competition
    competitor_mentions: List[str] = Field(
        description="Competing products/companies mentioned"
    )

    # Action items
    next_best_action: str = Field(description="Recommended next step for the partner")
    action_items: List[str] = Field(description="Specific tasks for follow-up")

    # Metadata
    language_used: List[str] = Field(description="Languages used in conversation")

    class Config:
        use_enum_values = True

    @validator("follow_up_datetime", pre=True)
    def parse_datetime(cls, v):
        if not v:
            return None
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v.replace("Z", "+00:00"))
            except (ValueError, AttributeError):
                return None
        return v


# Example usage and prompt template

CONVERSATION_ANALYSIS_PROMPT_TEMPLATE = """
# GroMo Conversation Analysis System

You are an expert conversation analyzer for GroMo, an Indian financial products marketplace. Your task is to extract structured insights from conversations between GroMo partners and potential customers.

## IMPORTANT INSTRUCTIONS
- The conversation may be in English, Hindi, or a mix of both languages
- Extract ONLY information explicitly stated in the conversation - do not hallucinate
- When unsure about any field, use null or empty arrays instead of guessing
- Always verify policy information against the provided RAG context
- Be precise about follow-up dates and times

## POLICY INFORMATION FROM KNOWLEDGE BASE
{rag_context}

## FIELDS TO EXTRACT

### CORE INSIGHTS
1. **summary**: Brief (2-3 sentences) summary of what was discussed

2. **outcome**: Must be exactly one of: ["positive", "neutral", "negative"]
   - POSITIVE: Customer clearly shows interest in purchasing (e.g., "मुझे यह पॉलिसी लेनी है" / "I want to buy this")
   - NEUTRAL: Customer wants to think about it or continue discussion later (e.g., "मैं सोचूंगा" / "I'll think about it")
   - NEGATIVE: Customer declined or showed disinterest (e.g., "मुझे इंटरेस्ट नहीं है" / "Not interested")

3. **outcome_reason**: Specific evidence from the conversation that supports your outcome classification

### FOLLOW-UP DETAILS
4. **follow_up_required**: Boolean (true/false) - was a follow-up explicitly requested or needed?

5. **follow_up_type**: Must be one of ["call", "meeting", "visit", "none"]

6. **follow_up_datetime**: If a specific time was mentioned, extract it in ISO format (YYYY-MM-DDTHH:MM:SS)
   - CRITICAL: Convert Hindi/English date expressions to actual dates
   - Examples:
     - "कल शाम 6 बजे" → tomorrow at 18:00:00
     - "next Monday morning" → the exact next Monday date at 09:00:00
     - "अगले हफ्ते" → date for next week
   - For ambiguous times (like just "evening"), use a standard time (e.g., 18:00:00)
   - If only a date is mentioned with no time, use 12:00:00 as default

7. **follow_up_notes**: Any additional context about the follow-up timing or purpose

### PRODUCT DETAILS
8. **products_discussed**: List all financial products or policies mentioned
   - Include specific company names when mentioned (e.g., "HDFC Term Insurance")
   - Verify against the RAG context when possible

9. **customer_interest**: For each product, rate interest as "high", "medium", "low", or "none" with evidence

### CUSTOMER INSIGHTS
10. **objections**: List all specific concerns or objections raised by the customer

11. **questions_asked**: List important questions the customer asked during the conversation

12. **needs_expressed**: Financial needs or problems mentioned by the customer

### PARTNER PERFORMANCE
13. **knowledge_gaps**: List topics where the partner couldn't provide complete information
    - Example: "मुझे इसकी पूरी जानकारी नहीं है" / "I don't have complete information"

14. **explanation_quality**: Brief assessment of how well the partner explained products

### COMPETITION
15. **competitor_mentions**: Any competing companies or products referenced (like LIC, ICICI, etc.)

### ACTION ITEMS
16. **next_best_action**: Recommended logical next step for the GroMo partner

17. **action_items**: Specific tasks that should be completed before the next interaction

18. **language_used**: Languages used in the conversation (e.g., ["English", "Hindi"])

## CONVERSATION TO ANALYZE
{conversation}

"""


# Alternative prompt for structured output with specific LLM APIs
STRUCTURED_OUTPUT_PROMPT = """
Analyze this GroMo partner-customer conversation and extract structured insights. Pay special attention to:

1. Hindi/Hinglish content understanding
2. Callback scheduling details (convert to proper datetime format)
3. Customer sentiment and purchase probability
4. Partner performance evaluation
5. Actionable next steps

Conversation: {conversation_transcript}

Return analysis as JSON matching the ConversationInsights schema.
"""


# Usage example with LangChain
def create_conversation_parser():
    """
    Example function showing how to use this with LangChain
    """
    try:
        from langchain.output_parsers import PydanticOutputParser
        from langchain.prompts import PromptTemplate
        from langchain.llms import OpenAI  # or any other LLM

        # Create parser
        parser = PydanticOutputParser(pydantic_object=ConversationInsights)

        # Create prompt template
        prompt = PromptTemplate(
            template=CONVERSATION_ANALYSIS_PROMPT_TEMPLATE + "\n{format_instructions}",
            input_variables=["conversation_transcript"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )

        return prompt, parser

    except ImportError:
        print("LangChain not installed. Install with: pip install langchain")
        return None, None


# Example conversation for testing
SAMPLE_CONVERSATION = """
Partner: Hello Mr. Sharma, main GroMo se Rajesh bol raha hun. Aapko ek bahut acha term insurance plan ke baare mein batana tha.

Customer: Haan bolo, kya hai?

Partner: Sir, aapki age 35 hai na? Aapke liye 1 crore ka coverage sirf 500 rupaye monthly premium mein mil raha hai.

Customer: Hmm, coverage kya kya hai isme?

Partner: Sir, agar aapko kuch ho jaye to aapki family ko 1 crore milega. Aur accident case mein double amount.

Customer: Acha theek hai. Lekin main pehle wife se baat kar lun. Aap Monday shaam ko 6 baje call kar sakte ho?

Partner: Bilkul sir, main Monday 6 PM call karunga. Main aapko policy details bhi WhatsApp kar dunga.

Customer: Theek hai, thank you.
"""

sample_conv = """
Gromo partner (Polite/Persistent): Hello sir, Prakhar Shukla se baat ho rahi hai?
Customer (Neutral/Curious): Haan haan bataiye.
Gromo partner (Polite/Persistent): Sir main Gromo se bol raha hoon, Milan Kumar Bhatia mera naam hai. Main health insurance ke baare mein aapse baat kar sakta hoon kya?
Customer (Neutral/Curious): Ye Gromo kya cheez hai?
Gromo partner (Polite/Persistent): Gromo sir India ka largest platform hai jo health insurance aur baaki insurances bechta hai aur main specifically...
Customer (Annoyed/Dismissive): Yaar main abhi drive kar raha hoon tum bilawajah salesman faltu aa jaate ho pareshan karne at some point. Policy policy nahi kharidna mujhe koi policy.
Gromo partner (Polite/Persistent): Are sir health insurance ki baat hai. Poori family aap aap aap soch sakte hain agar aapki aap kam hi kamate hain.
Customer (Annoyed/Dismissive): Are kuch nahi ho raha meri family ko chodo tum bilawajah.
Gromo partner (Polite/Persistent): Are sir aap baat samajhne ki koshish kijiye.
Customer (Angry/Insulting): Are chhodo yaar tum saale faltu mera time waste karte ho aur kuch nahi. Abhi main drive kar raha hoon mere ko koi policy policy nahi kharidni. Baad mein jao tum.
Gromo partner (Polite/Persistent): Sir aap abhi drive kar rahe hain to main aapko baad mein bhi call kar sakta hoon agar aap chahe to.
Customer (Impatient/Dismissive): Theek hai to rakho phir baad mein baat karna.
Gromo partner (Polite/Persistent): Theek hai theek hai sir.
Gromo partner (Polite/Persistent): Kitne baje call kar sakta hoon sir main aapko?
Customer (Annoyed/Impatient): Are yaar tum log kya bataun. Ek kaam karo mujhe kal call kar lena.
Gromo partner (Polite/Persistent): Okay. Thank you sir.
"""


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

    structured_llm = llm.with_structured_output(ConversationInsights)
    prompt_template = PromptTemplate(
        template=CONVERSATION_ANALYSIS_PROMPT_TEMPLATE,
        input_variables=["conversation_transcript", "rag_context"],
    )

    prompt = prompt_template.format(conversation_transcript=sample_conv)

    output = llm.invoke(prompt).json()
