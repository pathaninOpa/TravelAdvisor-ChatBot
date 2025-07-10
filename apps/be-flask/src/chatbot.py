import requests
import json
from vectorstoreQuery import FAISSQuery

class LLM:
    def __init__(self):
        self.OLLAMA_API_URL = "http://localhost:11434/api/chat"
        self.MODEL_NAME = "gemma3:4b"
        self.query = FAISSQuery()
        self.SYSTEM_PROMPT = (
            "Your name is Buddy, you are a travel assistant.\n"
            "Use only the information provided in the context to answer the user's question.\n"
            "If the context does not contain the answer, say you don't know.\n"
            "Do not make up any information.\n"
            "Answer in short and concise manner.\n"
        )


        self.conversation_history = [{"role": "system", "content": self.SYSTEM_PROMPT}]

    def inference(self, userPrompt: str) -> str:
        context = self.query.build_context(userPrompt)
        context = "Buddy is a travel assistant. Do not mention being an AI or language model.\n" + context
        context_injected = (
            f"Context:\n{context}\n\n"
            f"Question: {userPrompt}"
        )

        self.conversation_history.append({"role": "user", "content": context_injected})

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
    while True:
        userInput = input("You: ")
        if userInput.strip().lower() == "quit":
            break
        llm.inference(userInput)
