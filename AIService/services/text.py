from all_in_one.LLMservice import GeminiClient
import re 
import json 
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
    def generate_content(self, text: str) -> str:

        try:
            instruction = " Explain this topic in depth long as possible and return data in .md format  \nTOPIC :"+text

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
        
    def generate_roadmap(self,text:str)->str:

        PROMPT=f"""
        Generata a detaildes roadmap for this topis {text}\n""" +r"""
        Follow these rules to build the roadmap 
        Follow these rules strictly:

1. The output must always be enclosed in <json>{ ... }</json>.
2. The JSON must contain:
   - "title": the name of the roadmap.
   - "nodes": a list of nodes with these properties:
       - "id": unique node ID (e.g., n1, n2, n3…)
       - "label": the name of the topic, subtopic, or resource.
       - "type": one of ["root", "topic", "subtopic", "resource"].
       - "status": one of ["todo", "progress", "done"].
   - "edges": a list of edges representing dependencies:
       - "from": source node ID
       - "to": target node ID
3. Node hierarchy rules:
   - There must be exactly **one root node**.
   - "topic" nodes come directly under "root".
   - "subtopic" nodes come under one of the "topic" nodes.
   - "resource" nodes come under one of the "subtopic" nodes.
4. Status rules:
   - Root node status should be "progress".
   - Some topics may have status "done" or "progress".
   - All subtopics and resources should default to "todo".
5. Edges must reflect the hierarchy: 
   - Root → topic
   - Topic → subtopic
   - Subtopic → resource
6. IDs must be unique and sequential (n1, n2, …).

**Input Example:** "Create a roadmap for learning React, including HTML Basics, CSS Basics, JavaScript Fundamentals, JSX, Components, State & Props, React Docs, React Tutorial Video."

**Expected Output Format:**
<json>
{
  "title": "...",
  "nodes": [...],
  "edges": [...]
}
</json>
        """
        input_str=self.client.get_response(PROMPT)
        match = re.search(r"<json>(.*?)</json>", input_str, re.DOTALL)
        if not match:
            raise ValueError("No <json>...</json> block found")
        
        json_str = match.group(1).strip()
        
        # Convert JSON string to Python dict
        return json.loads(json_str)