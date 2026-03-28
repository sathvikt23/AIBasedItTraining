from all_in_one.LLMservice import GeminiClient

class AIDSAQuestionService:

    def __init__(self,llm_client=None):
        if (llm_client==None):
            self.client=GeminiClient.get_instance()
        else :
         self.client=llm_client

    def generate_dsa_questions(self, topic: str) -> str:
        try:
            prompt = (
                "Generate 5 coding DSA questions with expected output on this topic, "
                "return in JSON format {'questions': [{'question':'', 'output':''}]}"
            )

            result = self.client.get_response(topic + "\n" + prompt)
            cleaned_result = result.replace("`", "").replace("json", "").replace("JSON", "")
            return cleaned_result

        except Exception as e:
            raise Exception(f"Failed to generate DSA questions: {str(e)}") from e

    def generate_custom_dsa_question(self, topic: str, custom_requirement: str) -> str:
        try:
            output_format = """{
  "title": "",
  "difficulty": "",
  "description": "",
  "examples": [
    {
      "input": {},
      "expectedOutput": "",
      "explanation": ""
    }
  ],
  "constraints": [],
  "testCases": [
    {
      "input": {},
      "expectedOutput": ""
    }
  ]
}"""

            prompt = (
                f"Generate a DSA question based on: {custom_requirement}\n"
                f"Make sure the output strictly follows this JSON format:\n{output_format}"
            )

            result = self.client.get_response(topic + "\n" + prompt)
            cleaned_result = result.replace("`", "").replace("json", "").replace("JSON", "")
            return cleaned_result

        except Exception as e:
            raise Exception(f"Failed to generate custom DSA question: {str(e)}") from e
