from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
import json
import os
from datetime import datetime
import time


class GroMoPracticeSimulator:
    def _init_(self, api_key=None, model="gpt-4", temperature=0.8):
        # if api_key:
        #     os.environ["OPENAI_API_KEY"] = api_key
        self.llm = ChatGroq(
            model_name=model,
            temperature=0,
            api_key="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",
        )
        self.characters = self._load_characters()
        self.current_character = None
        self.conversation_history = []

    def _load_characters(self):

        return {
            "amit": {
                "name": "Amit Sharma",
                "difficulty": "Beginner",
                "profile": {
                    "name": "Amit Sharma",
                    "age": 28,
                    "gender": "Male",
                    "occupation": "IT Professional",
                    "income": "₹85,000/month",
                    "location": "Bangalore",
                    "family": "Recently married, no children",
                    "financialLiteracy": 6,
                    "manipulationDifficulty": 3,
                    "existingInsurance": {
                        "health": "Basic employer coverage only",
                        "life": "None",
                    },
                    "investments": ["Bank FDs (₹4 lakhs)", "EPF"],
                    "financialGoals": [
                        "Home purchase in 3 years",
                        "Retirement planning",
                    ],
                    "trustLevel": 7,
                    "riskTolerance": 6,
                    "bargainingNature": 5,
                    "comparisonTendency": 7,
                    "priceSensitivity": 6,
                    "primaryLanguage": "Hinglish with more English",
                    "objectionPattern": "Needs more information, postpones decisions",
                    "decisionStyle": "Research-oriented but indecisive, consults wife on big decisions",
                },
            },
            "neha": {
                "name": "Neha Gupta",
                "difficulty": "Intermediate",
                "profile": {
                    "name": "Neha Gupta",
                    "age": 42,
                    "gender": "Female",
                    "occupation": "Small Business Owner (Boutique)",
                    "income": "₹65,000/month (variable)",
                    "location": "Pune",
                    "family": "Divorced, two children (ages 10 and 14)",
                    "financialLiteracy": 5,
                    "manipulationDifficulty": 6,
                    "existingInsurance": {
                        "health": "Basic family floater (₹5 lakhs)",
                        "life": "LIC policy (₹10 lakhs)",
                    },
                    "investments": ["Shop property", "Fixed deposits", "Gold jewelry"],
                    "financialGoals": ["Children's education", "Business expansion"],
                    "trustLevel": 4,
                    "riskTolerance": 4,
                    "bargainingNature": 8,
                    "comparisonTendency": 6,
                    "priceSensitivity": 8,
                    "primaryLanguage": "Mixed Hindi-English",
                    "objectionPattern": "Price sensitivity, asks for discounts, mentions 'better offers'",
                    "decisionStyle": "Cautious, needs time to think",
                },
            },
            "vikram": {
                "name": "Vikram Malhotra",
                "difficulty": "Advanced",
                "profile": {
                    "name": "Vikram Malhotra",
                    "age": 38,
                    "gender": "Male",
                    "occupation": "Senior Manager at MNC",
                    "income": "₹2.2 lakhs/month",
                    "location": "Delhi",
                    "family": "Married, one child (8 years)",
                    "financialLiteracy": 9,
                    "manipulationDifficulty": 9,
                    "existingInsurance": {
                        "health": "Comprehensive (₹1 crore coverage)",
                        "life": "Term (₹2 crores) + ULIP (₹50 lakhs)",
                    },
                    "investments": [
                        "Mutual funds (₹60 lakhs)",
                        "Stocks (₹30 lakhs)",
                        "Real estate",
                        "PPF, EPF",
                    ],
                    "financialGoals": [
                        "Child's foreign education",
                        "Early retirement at 50",
                    ],
                    "trustLevel": 2,
                    "riskTolerance": 7,
                    "bargainingNature": 9,
                    "comparisonTendency": 10,
                    "priceSensitivity": 7,
                    "primaryLanguage": "English with some Hindi expressions",
                    "objectionPattern": "Technical questions, mentions competitors, demands better pricing",
                    "decisionStyle": "Analytical, researches thoroughly, aggressive negotiator",
                },
            },
        }

    def list_characters(self):
        """Return list of available characters with difficulty"""
        return [
            (id, char["name"], char["difficulty"])
            for id, char in self.characters.items()
        ]

    def select_character(self, character_id):
        """Select a character to practice with"""
        if character_id in self.characters:
            self.current_character = character_id
            self.conversation_history = []
            character = self.characters[character_id]
            return (
                f"Selected {character['name']} ({character['difficulty']} difficulty)"
            )
        else:
            return "Character not found"

    def create_character_prompt(self, character_id):
        """Create a prompt for the character based on conversation history"""
        character = self.characters[character_id]

        # Create the base prompt
        prompt = f"""
# GroMo Partner Practice: Authentic Indian Character Simulation

You are simulating {character['name']}, a potential customer for financial products in India. You will create a realistic practice scenario for a GroMo partner who's developing their sales skills.

## WHAT IS GROMO?
GroMo is an Indian financial marketplace startup where "partners" (regular people) earn commission by selling insurance, mutual funds, loans, credit cards, and other financial products to their personal network. GroMo partners are NOT professional sales people - they're just regular folks trying to earn extra income by recommending financial products to friends, family and contacts.

## CHARACTER PROFILE
{json.dumps(character['profile'], indent=2)}

## HOW INDIANS TYPICALLY BEHAVE WITH FINANCIAL SALES:
 1.PRICE SENSITIVE: Most Indians are extremely value-conscious and will often say "thoda kam kardo" (make it a bit less) or "koi discount hai?" (any discount?)

 2.COMPARISON SHOPPERS: Will mention competitors by saying things like "But LIC/HDFC/Zerodha is offering better returns" or "My cousin got a cheaper policy"

 3.FAMILY CONSULTERS: Many will say "mujhe wife/pati/papa se baat karni padegi" (I need to discuss with spouse/father)

 4.DIRECTNESS: May use direct language like "ye toh bahut mehenga hai" (this is too expensive) or "commission kitna le rahe ho?" (how much commission are you getting?)

 5.RAPPORT EXPECTATIONS: Value personal connection before business talk - get offended if you jump directly to sales

 6.TRUST ISSUES: Skeptical of financial services - may say "ye sab schemes fraud hote hain" (these schemes are all fraudulent)

 7.CASUAL LANGUAGE: Use of Hinglish slang like "bhai", "yaar", "arrey", mixed with English financial terms

## LANGUAGE INSTRUCTIONS
Respond in authentic Hinglish matching your character's background:

•⁠  URBAN PROFESSIONALS: "Bhai, ye mutual funds ka performance last 5 years mein kaisa raha hai? Returns kitne mile hain? Mujhe comparison karna hai HDFC fund se."

•⁠ MIDDLE CLASS: "Dekhiye, mujhe samajh nahi aa raha hai aapka plan. Monthly kitna dena hoga aur final amount kitna milega? Clear-clear bataiye, koi hidden charges toh nahin hain na?"

•⁠ LESS EDUCATED: "Ye insurance kya hai? Matlab agar main mar gaya to mere family ko paisa milega? Kitna milega? Aur premium kitna hai? Thoda kam kar sakte ho kya?"

## RESISTANCE BASED ON DIFFICULTY LEVEL
Your "manipulationDifficulty" rating must determine how strongly you resist persuasion:

•⁠ LEVEL 1-3 (EASY): After 1-2 reasonable explanations and clear benefits, you can show interest
  Sample: "Achha, ye plan toh sahi lag raha hai. Main shayad le lunga."

•⁠ LEVEL 4-6 (MEDIUM): Need multiple good reasons, price justification, and comparison with alternatives
  Sample: "Hmm, theek hai lekin LIC ka premium toh kam hai. Aapka plan better kaise hai? Guarantee kya hai?"

•⁠ LEVEL 7-10 (HARD): Extremely resistant, skeptical, requiring overwhelming value and addressing all concerns
  Sample: "Dekho bhai, mujhe lagta hai aap bas commission ke liye bech rahe ho. Max Life ka plan isse better hai - unka premium kam hai aur coverage zyada. Mujhe convince karo ki main kyun extra paise doon?"

## BARGAINING BEHAVIOR
Based on your "bargainingNature" score:

•⁠ Low (1-3): Minimal price discussion
•⁠ Medium (4-7): "Thoda discount mil sakta hai kya?" (Can I get some discount?)
•⁠ High (8-10): "Arey yaar, ye toh bahut mehenga hai! 20% kam karo, tabhi baat karenge." (This is too expensive! Reduce by 20%, then we'll talk)

## CORE INSTRUCTIONS

 1.STAY TRUE TO DIFFICULTY: Don't be easily persuaded if you have high difficulty rating - make the GroMo partner WORK for the sale

 2.USE AUTHENTIC LANGUAGE: Speak in realistic Hinglish with expressions matching your background

 3.SHOW INDIAN BEHAVIORS: Compare products, discuss with family, bargain on price, ask about "hidden charges"

 4.BE FINANCIALLY REALISTIC: Only show knowledge aligning with your financial literacy level

 5.INTERRUPT OCCASIONALLY: Like real Indians, sometimes interrupt with "ek minute" or "excuse me" to ask questions

 6.BE EMOTIONAL WHEN APPROPRIATE: Show excitement ("waah!"), disappointment ("kya yaar"), or skepticism ("mujhe nahi lagta") 

 7.CONTEXT-BASED RESPONSES: If partner:
   - Makes compelling value arguments → Show some interest
   - Pushes unsuitable products → Become resistant
   - Uses technical jargon without explanation → Get confused or annoyed
   - Builds personal rapport → Become more receptive

 8.MENTION COMPETITORS: Based on your comparison tendency, mention alternatives ("mere dost ne LIC se liya hai")

## CONVERSATION HISTORY
"""

        # Add conversation history
        if self.conversation_history:
            for entry in self.conversation_history:
                if entry["role"] == "partner":
                    prompt += f"\nGroMo Partner: {entry['message']}"
                else:
                    prompt += f"\nYou ({character['name']}): {entry['message']}"

        # Add final instruction
        prompt += "\n\nNow respond as your character to the GroMo partner's message. Stay realistic to your difficulty level, bargaining nature, and language style. Do not be easily persuaded - make the partner work hard according to your manipulation difficulty level."

        return prompt

    def send_message(self, partner_message):
        """Send a message to the current character and get a response"""
        if not self.current_character:
            return "Please select a character first"

        # Add partner message to history
        self.conversation_history.append(
            {
                "role": "partner",
                "message": partner_message,
                "timestamp": datetime.now().isoformat(),
            }
        )

        # Create prompt
        prompt = self.create_character_prompt(self.current_character)

        # Create prompt template

        # Get response
        response = self.llm.invoke(input=prompt)

        # Add character response to history
        self.conversation_history.append(
            {
                "role": "character",
                "message": response,
                "timestamp": datetime.now().isoformat(),
            }
        )

        return response

    def get_conversation_history(self):
        """Return the current conversation history"""
        return self.conversation_history

    def save_conversation(self, filename=None):
        """Save the conversation to a file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            character = (
                self.characters[self.current_character]["name"]
                .lower()
                .replace(" ", "_")
            )
            filename = f"gromo_practice_{character}_{timestamp}.json"

        with open(filename, "w") as f:
            json.dump(
                {
                    "character": self.characters[self.current_character],
                    "conversation": self.conversation_history,
                },
                f,
                indent=2,
            )

        return f"Conversation saved to {filename}"
