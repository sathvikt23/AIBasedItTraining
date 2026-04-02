from all_in_one.LLMservice import GeminiClient
from typing_extensions import override
class AIChatService:
    def __init__(self,llm_client=None):
        if (llm_client==None):
            self.client=GeminiClient.get_instance()
        else:
         self.client=llm_client


    def chat(self, question: str) -> str:
        try:
            response = self.client.get_response(question)

            if response == "None":
                response = self.client.get_response(question)

            return response

        except Exception as e:
            raise Exception(f"Chat processing failed: {e}") from e

    def lesson_chat(self, context: str, question: str) -> str:
        try:
            if len(question) > 20000:
                raise ValueError("Text too large")

            # Call GeminiClient
            response = self.client.get_response(f"{question}\nCONTEXT: {context}")

            # If the response is empty or "None", fallback
            if not response or response.strip().lower() == "none":
                fallback = self.client.get_response(question)
                if not fallback or fallback.strip().lower() == "none":
                    fallback = "No valid response."
                return f"Out of context / {fallback}"

            # Return the text directly
            return response

        except ValueError as e:
            raise Exception(str(e)) from e
        except Exception as e:
            raise Exception(f"Lesson chat failed: {e}") from e

class AIChatServiceV2(AIChatService):
    def __init__(self,llm_client=None):
        super().__init__(llm_client)

    @override
    def chat(self, question: str) -> str:
        resp="""
        {
            "AI_Response": "Hello, how can I help you today?",
            "is_ready": true,
            "component_name": "roadmap",
            "metadata": {
                "title": "My Dashboard",
                "content": "Sample text",
                "actions":{
                    "build_roadmap": true,
                    "build_book": true
                }
            }
        }
        """
        return resp