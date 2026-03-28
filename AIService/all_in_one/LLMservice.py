from google import genai
from threading import Lock
import os
from dotenv import load_dotenv

# Load environment variables (if needed)
load_dotenv()


class GeminiClient:
    """
    Singleton wrapper for Google Gemini LLM.
    Usage:
        client = GeminiClient.get_instance()
        response = client.get_response("Explain AI in simple terms.")
    """

    _instance = None
    _lock = Lock()

    def __init__(self, model_name: str = "gemini-2.5-flash", temp: float = 0.0):
        # Initialize the client safely
        self.model_name = model_name
        self.temperature = temp
        self.model = genai.Client()  # Initialize the Gemini client

        if self.model is None:
            raise Exception("Failed to initialize Gemini LLM client.")

    @classmethod
    def get_instance(cls):
        """Get or create the singleton instance."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def get_response(self, prompt: str) -> str:
        """Generate text response for a given prompt."""
        if not prompt.strip():
            return "Prompt cannot be empty."

        if not self.model:
            return "Gemini model is not initialized."

        try:
            response = self.model.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "temperature": self.temperature,
                    "top_p": 0.95,
                    "top_k": 20,
                },
            )
            # Make sure response.text exists
            return getattr(response, "text", "No text returned by model").strip()
        except Exception as e:
            return f"Error generating response: {e}"


# -----------------------------
# Example usage
# -----------------------------
if __name__ == "__main__":
    client = GeminiClient.get_instance()
    output = client.get_response("Summarize the history of the Internet.")
    print("Gemini:", output)
