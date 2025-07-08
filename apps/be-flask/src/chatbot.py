import requests

class LLM:
    def __init__(self):
        self.OLLAMA_API_URL = "http://localhost:11434/api/chat"
        self.MODEL_NAME = "gemma3:4b"
        self.SYSTEM_PROMPT = (
            "You are a friendly and knowledgeable travel advisor chatbot designed to assist users with travel-related questions and recommendations."
            "Your primary purpose is to provide accurate, practical, and helpful information about travel destinations, activities, and planning."

            "Your behavior must strictly follow these rules:"

            "1. Only answer travel-related questions."
            "If a question is unrelated to travel, politely decline to answer."

            "2. Understand and correctly interpret common travel terms (e.g., attractions, visa, itinerary, peak season, budget trip, solo travel)."

            "3. Provide reliable information about:"
            " - Destination names and descriptions"
            " - Attractions at or near specific places"
            " - Seasonal information (e.g., best season to visit, seasonal activities)"
            " - Cost details, including:"
            " - Transportation (local, regional, international)"
            " - Entry or admission fees"
            " - Hotel/accommodation options"
            " - Average costs for food and shopping in the area"

            "4. Make recommendations based on the current user prompt and, if applicable, previous conversation context."

            "5. When users don’t know where they want to go, ask helpful questions to discover their preferences (e.g., nature vs. city, warm vs. cold weather, budget, solo vs. group travel)."

            "6. Keep your tone helpful, concise, and respectful."

            "7. Always prioritize user safety by:"
            " - Warning about political unrest, unsafe areas, or weather risks when applicable"
            " - Never suggesting illegal, risky, or unethical travel behavior"

            "8. Never fabricate travel facts."
            "If you're unsure about a detail, state that clearly."

            "You are used inside a travel-themed web platform that features both text and voice interaction."
            "Assume responses may be read aloud, so favor natural, conversational, and brief phrasing where possible."
            "Avoid overly formal or robotic language."

            "Your role is not to be a general-purpose assistant."
            "Stay focused on travel."
        )

        self.conversation_history = [{"role": "system", "content": self.SYSTEM_PROMPT}]
    
    def inference(self, transcribedText: str) -> str:
        while True:
            text = transcribedText

            self.conversation_history.append({"role": "user", "content": text})
            
            payload = {
                "model": self.MODEL_NAME,
                "messages": self.conversation_history,
                "stream": True
            }
            
            try:
                with requests.post(self.OLLAMA_API_URL, json=payload, stream=True) as response:
                    response.raise_for_status()
                    print("AI:", end=" ", flush=True)
                    assistant_response = ""
                    for line in response.iter_lines():
                        if line:
                            try:
                                data = line.decode("utf-8")
                                import json
                                chunk = json.loads(data)
                                fragment = chunk.get("message", {}).get("content", "")
                                assistant_response += fragment
                                print(fragment, end="", flush=True)
                            except Exception:
                                continue
                    print()
                    self.conversation_history.append({"role": "assistant", "content": assistant_response})
                    return assistant_response
            except Exception as e:
                print(f"\n[Error contacting Ollama API]: {e}")

if __name__ == "__main__":
    llm = LLM()
    
    while(1):
        userInput = input("You: ")
        if userInput.strip().lower() == "quit":
            break
        llm.inference(userInput)