from all_in_one.LLMservice import GeminiClient

class AICodeAnalysisService:

    def __init__(self,llm_client=None):
        if (llm_client==None):
            self.client=GeminiClient.get_instance()
        else:
         self.client=llm_client
    def analyze_code(self, code: str) -> str:
        try:
            prompt = (
                "Explain this code and give a better alternative approach with time complexity:\n"
                f"{code}"
            )
            return self.client.get_response(prompt)

        except Exception as e:
            raise Exception(f"Failed to analyze code: {str(e)}") from e

    def custom_code_analysis(self, custom_prompt: str, code: str) -> str:
        try:
            full_prompt = f"{custom_prompt}\n{code}"
            return self.client.get_response(full_prompt)

        except Exception as e:
            raise Exception(f"Failed to run custom code analysis: {str(e)}") from e
