from all_in_one.LLMservice import GeminiClient

class AITextProcessor:

    def __init__(self,llm_client=None):
        if (llm_client==None):
            self.client=GeminiClient.get_instance()
        else :
         self.client=llm_client

    def explain_transcript(self, transcript: str) -> str:
        try:
            instruction = " Explain it in very depth and extra information "

            if len(transcript) <= 40000:
                return self.client.get_response(transcript + instruction)

            explanations = []
            prev = 0
            for i in range(5000, len(transcript), 5000):
                part = self.client.get_response(transcript[prev:i] + instruction)
                explanations.append(part)
                prev = i

            return " ".join(explanations)

        except Exception as e:
            raise Exception(f"Failed to explain transcript: {str(e)}") from e

    def enhance_text(self, text: str) -> str:
        try:
            instruction = " reframe the text and explain in detail "

            if len(text) <= 40000:
                return self.client.get_response(text + instruction)

            enhanced_parts = []
            prev = 0
            for i in range(1000, len(text), 1000):
                part = self.client.get_response(text[prev:i] + instruction)
                enhanced_parts.append(part)
                prev = i

            return " ".join(enhanced_parts)

        except Exception as e:
            raise Exception(f"Failed to enhance text: {str(e)}") from e

    def generate_questions(self, text: str) -> str:
        try:
            prompt = (
                "Generate 5 questions with 4 multiple choices on this text, "
                "return in JSON format {'questions':[{'question':'', 'choices':[], 'answer':''}]}"
            )

            result = self.client.get_response(text + "\n" + prompt)
            cleaned_result = result.replace("`", "").replace("json", "").replace("JSON", "")
            return cleaned_result

        except Exception as e:
            raise Exception(f"Failed to generate questions: {str(e)}") from e
