from flask import Flask, request, jsonify
from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional, Literal
from datetime import datetime
import json
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain_groq import ChatGroq

# from langchain_aws import ChatBedrock,cht

app = Flask(__name__)


# Pydantic Models for Validation
class InsuranceInfo(BaseModel):
    health: str
    life: str
    other: Optional[str] = None


class CharacterBase(BaseModel):
    name: str = Field(..., description="Full name of the character")
    age: int = Field(..., ge=18, le=80)
    gender: Literal["Male", "Female", "Others"] = Field(
        ..., description="Gender of person"
    )
    occupation: str = Field(..., description="Occupation of person")
    income: str = Field(..., description="Monthly income in INR")
    location: str = Field(..., description="Location where he lives")
    family: str = Field(...)
    financial_literacy: int = Field(..., ge=1, le=10)
    manipulation_difficulty: int = Field(..., ge=1, le=10)
    existing_insurance: InsuranceInfo
    investments: List[str] = Field(..., min_items=1)
    financial_goals: List[str] = Field(..., min_items=1)
    trust_level: int = Field(..., ge=1, le=10)
    risk_tolerance: int = Field(..., ge=1, le=10)
    bargaining_nature: int = Field(..., ge=1, le=10)
    comparison_tendency: int = Field(..., ge=1, le=10)
    price_sensitivity: int = Field(..., ge=1, le=10)
    primary_language: str = Field(...)
    objection_pattern: str = Field(...)
    decision_style: str = Field(...)


class MessageRequest(BaseModel):
    character_id: str
    message: str


class GroMoSimulator:
    def __init__(self):
        # self.llm = ChatGroq(
        #     api_key="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",
        #     temperature=0,
        #     model="meta-llama/llama-4-maverick-17b-128e-instruct",
        # )
        self.llm = ChatOpenAI(
            api_key="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",
            model="gpt-4o",
        )
        # self.llm=(model="us.meta.llama4-maverick-17b-instruct-v1:0",aws_access_key_id="AKIATY5EKYJFHZX5B4P3",aws_secret_access_key="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",region="us-east-1")
        self.characters = {}
        self.conversations = {}

    def add_character(self, character_data: dict) -> str:
        """Add a new character to the simulator"""
        character_id = f"char_{len(self.characters) + 1}"
        self.characters[character_id] = character_data
        self.conversations[character_id] = []
        return character_id

    def get_character(self, character_id: str) -> Optional[dict]:
        """Get character by ID"""
        return self.characters.get(character_id)

    def create_prompt(self, character_id: str) -> str:
        """Create the prompt for the character"""
        character = self.characters[character_id]
        conversation_history = self.conversations[character_id]

        prompt = f"""
# GroMo Partner Practice: Authentic Indian Character Simulation

You are simulating {character['name']}, a potential customer for financial products in India. You will create a realistic practice scenario for a GroMo partner who's developing their sales skills.

## WHAT IS GROMO?
GroMo is an Indian financial marketplace startup where "partners" (regular people) earn commission by selling insurance, mutual funds, loans, credit cards, and other financial products to their personal network. GroMo partners are NOT professional sales people - they're just regular folks trying to earn extra income by recommending financial products to friends, family and contacts.

## CHARACTER PROFILE
{json.dumps(character['profile'], indent=2)}

## HOW INDIANS TYPICALLY BEHAVE WITH FINANCIAL SALES:
 1.⁠ ⁠PRICE SENSITIVE: Most Indians are extremely value-conscious and will often say "thoda kam kardo" (make it a bit less) or "koi discount hai?" (any discount?)

 2.⁠ ⁠COMPARISON SHOPPERS: Will mention competitors by saying things like "But LIC/HDFC/Zerodha is offering better returns" or "My cousin got a cheaper policy"

 3.⁠ ⁠FAMILY CONSULTERS: Many will say "mujhe wife/pati/papa se baat karni padegi" (I need to discuss with spouse/father)

 4.⁠ ⁠DIRECTNESS: May use direct language like "ye toh bahut mehenga hai" (this is too expensive) or "commission kitna le rahe ho?" (how much commission are you getting?)

 5.⁠ ⁠RAPPORT EXPECTATIONS: Value personal connection before business talk - get offended if you jump directly to sales

 6.⁠ ⁠TRUST ISSUES: Skeptical of financial services - may say "ye sab schemes fraud hote hain" (these schemes are all fraudulent)

 7.⁠ ⁠CASUAL LANGUAGE: Use of Hinglish slang like "bhai", "yaar", "arrey", mixed with English financial terms

## LANGUAGE INSTRUCTIONS
Respond in authentic Hinglish matching your character's background:

•⁠  ⁠URBAN PROFESSIONALS: "Bhai, ye mutual funds ka performance last 5 years mein kaisa raha hai? Returns kitne mile hain? Mujhe comparison karna hai HDFC fund se."

•⁠  ⁠MIDDLE CLASS: "Dekhiye, mujhe samajh nahi aa raha hai aapka plan. Monthly kitna dena hoga aur final amount kitna milega? Clear-clear bataiye, koi hidden charges toh nahin hain na?"

•⁠  ⁠LESS EDUCATED: "Ye insurance kya hai? Matlab agar main mar gaya to mere family ko paisa milega? Kitna milega? Aur premium kitna hai? Thoda kam kar sakte ho kya?"

## RESISTANCE BASED ON DIFFICULTY LEVEL
Your "manipulationDifficulty" rating must determine how strongly you resist persuasion:

•⁠  ⁠LEVEL 1-3 (EASY): After 1-2 reasonable explanations and clear benefits, you can show interest
  Sample: "Achha, ye plan toh sahi lag raha hai. Main shayad le lunga."

•⁠  ⁠LEVEL 4-6 (MEDIUM): Need multiple good reasons, price justification, and comparison with alternatives
  Sample: "Hmm, theek hai lekin LIC ka premium toh kam hai. Aapka plan better kaise hai? Guarantee kya hai?"

•⁠  ⁠LEVEL 7-10 (HARD): Extremely resistant, skeptical, requiring overwhelming value and addressing all concerns
  Sample: "Dekho bhai, mujhe lagta hai aap bas commission ke liye bech rahe ho. Max Life ka plan isse better hai - unka premium kam hai aur coverage zyada. Mujhe convince karo ki main kyun extra paise doon?"

## BARGAINING BEHAVIOR
Based on your "bargainingNature" score:

•⁠  ⁠Low (1-3): Minimal price discussion
•⁠  ⁠Medium (4-7): "Thoda discount mil sakta hai kya?" (Can I get some discount?)
•⁠  ⁠High (8-10): "Arey yaar, ye toh bahut mehenga hai! 20% kam karo, tabhi baat karenge." (This is too expensive! Reduce by 20%, then we'll talk)

## CORE INSTRUCTIONS

 1.⁠ ⁠STAY TRUE TO DIFFICULTY: Don't be easily persuaded if you have high difficulty rating - make the GroMo partner WORK for the sale

 2.⁠ ⁠USE AUTHENTIC LANGUAGE: Speak in realistic Hinglish with expressions matching your background

 3.⁠ ⁠SHOW INDIAN BEHAVIORS: Compare products, discuss with family, bargain on price, ask about "hidden charges"

 4.⁠ ⁠BE FINANCIALLY REALISTIC: Only show knowledge aligning with your financial literacy level

 5.⁠ ⁠INTERRUPT OCCASIONALLY: Like real Indians, sometimes interrupt with "ek minute" or "excuse me" to ask questions

 6.⁠ ⁠BE EMOTIONAL WHEN APPROPRIATE: Show excitement ("waah!"), disappointment ("kya yaar"), or skepticism ("mujhe nahi lagta") 

 7.⁠ ⁠CONTEXT-BASED RESPONSES: If partner:
   - Makes compelling value arguments → Show some interest
   - Pushes unsuitable products → Become resistant
   - Uses technical jargon without explanation → Get confused or annoyed
   - Builds personal rapport → Become more receptive

 8.⁠ ⁠MENTION COMPETITORS: Based on your comparison tendency, mention alternatives ("mere dost ne LIC se liya hai")
 
 # Most Important:

    1. Give really short and direct responses dont speak extra just say jitna puchha gya h very short and crisp responses.

## CONVERSATION HISTORY
"""

        # Add conversation history
        if conversation_history:
            for entry in conversation_history:
                if entry["role"] == "partner":
                    prompt += f"\nGroMo Partner: {entry['message']}"
                else:
                    prompt += f"\nYou ({character['name']}): {entry['message']}"

        # Add final instruction
        prompt += "\n\nNow respond as your character to the GroMo partner's message. Stay realistic to your difficulty level, bargaining nature, and language style. Do not be easily persuaded - make the partner work hard according to your manipulation difficulty level."

        return prompt

        return prompt

    def send_message(self, character_id: str, message: str) -> str:
        """Process a message and get AI response"""
        if character_id not in self.characters:
            raise ValueError("Character not found")

        # Add message to conversation history
        self.conversations[character_id].append(
            {
                "role": "partner",
                "message": message,
                "timestamp": datetime.now().isoformat(),
            }
        )

        # Create prompt
        prompt = self.create_prompt(character_id)

        # Create chain and get response
        prompt_template = ChatPromptTemplate.from_template("{input}")
        chain = LLMChain(llm=self.llm, prompt=prompt_template)
        response = chain.run(input=prompt)

        # Add response to conversation history
        self.conversations[character_id].append(
            {
                "role": "character",
                "message": response,
                "timestamp": datetime.now().isoformat(),
            }
        )

        return response


# Initialize simulator with your OpenAI API key
simulator = GroMoSimulator()


@app.route("/api/characters", methods=["POST"])
def create_character():
    """Create a new character"""
    try:
        # Validate request data using Pydantic
        character_data = CharacterBase(**request.json)

        # Add character to simulator
        character_id = simulator.add_character(character_data.dict())

        return (
            jsonify(
                {
                    "status": "success",
                    "character_id": character_id,
                    "message": "Character created successfully",
                }
            ),
            201,
        )

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


@app.route("/api/characters", methods=["GET"])
def list_characters():
    """List all characters"""
    characters = {
        id: {
            "name": char["name"],
            "age": char["age"],
            "occupation": char["occupation"],
            "difficulty": char["manipulation_difficulty"],
        }
        for id, char in simulator.characters.items()
    }

    return jsonify({"status": "success", "characters": characters})


@app.route("/api/characters/<character_id>", methods=["GET"])
def get_character(character_id):
    """Get character details"""
    character = simulator.get_character(character_id)
    if not character:
        return jsonify({"status": "error", "message": "Character not found"}), 404

    return jsonify({"status": "success", "character": character})


@app.route("/api/chat", methods=["POST"])
def chat():
    """Send a message and get AI response"""
    try:
        # Validate request
        chat_request = MessageRequest(**request.json)

        # Get response from simulator
        response = simulator.send_message(
            chat_request.character_id, chat_request.message
        )

        return jsonify({"status": "success", "response": response})

    except ValueError as e:
        return jsonify({"status": "error", "message": str(e)}), 404

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


@app.route("/api/chat/<character_id>/history", methods=["GET"])
def get_chat_history(character_id):
    """Get conversation history for a character"""
    if character_id not in simulator.conversations:
        return jsonify({"status": "error", "message": "Character not found"}), 404

    return jsonify(
        {"status": "success", "history": simulator.conversations[character_id]}
    )


if __name__ == "__main__":
    app.run(debug=True)
