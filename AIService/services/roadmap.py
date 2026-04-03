from services.text import AITextProcessor
from all_in_one.youtubeService import youtube
import ast
import json
from typing import Any
#for creating a json graph
class AIRoadmapService(AITextProcessor):

    def __init__(self,llm_client=None):
        self.youtube_service = youtube()
        super().__init__(llm_client)

    def generate_roadmap(self, topic: str) -> str:
        #define the llm call here.
        resp="""
        {
            "title": "Learn React",
            "nodes": [
                { "id": "n1", "label": "React", "type": "root", "status": "progress" },

                { "id": "n2", "label": "HTML Basics", "type": "topic", "status": "done" },
                { "id": "n3", "label": "CSS Basics", "type": "topic", "status": "done" },
                { "id": "n4", "label": "JavaScript Fundamentals", "type": "topic", "status": "progress" },

                { "id": "n5", "label": "JSX", "type": "subtopic", "status": "todo" },
                { "id": "n6", "label": "Components", "type": "subtopic", "status": "todo" },
                { "id": "n7", "label": "State & Props", "type": "subtopic", "status": "todo" },

                { "id": "n8", "label": "React Docs", "type": "resource", "status": "todo" },
                { "id": "n9", "label": "React Tutorial Video", "type": "resource", "status": "todo" }
            ],
            "edges": [
                { "from": "n1", "to": "n2" },
                { "from": "n1", "to": "n3" },
                { "from": "n1", "to": "n4" },

                { "from": "n4", "to": "n5" },
                { "from": "n4", "to": "n6" },
                { "from": "n4", "to": "n7" },

                { "from": "n5", "to": "n8" },
                { "from": "n6", "to": "n9" }
            ]
        }
        """
        return resp

    def make_changes_to_roadmap(self, topic: str, current_roadmap: str, student_request: str) -> str:
        #define the llm call here.
        resp="""
        {
            "title": "Learn React",
            "nodes": [
                { "id": "n1", "label": "React", "type": "root", "status": "progress" },

                { "id": "n2", "label": "HTML Basics", "type": "topic", "status": "done" },
                { "id": "n3", "label": "CSS Basics", "type": "topic", "status": "done" },
                { "id": "n4", "label": "JavaScript Fundamentals", "type": "topic", "status": "progress" },

                { "id": "n5", "label": "JSX", "type": "subtopic", "status": "todo" },
                { "id": "n6", "label": "Components", "type": "subtopic", "status": "todo" },
                { "id": "n7", "label": "State & Props", "type": "subtopic", "status": "todo" },

                { "id": "n8", "label": "React Docs", "type": "resource", "status": "todo" },
                { "id": "n9", "label": "React Tutorial Video", "type": "resource", "status": "todo" }
            ],
            "edges": [
                { "from": "n1", "to": "n2" },
                { "from": "n1", "to": "n3" },
                { "from": "n1", "to": "n4" },

                { "from": "n4", "to": "n5" },
                { "from": "n4", "to": "n6" },
                { "from": "n4", "to": "n7" },

                { "from": "n5", "to": "n8" },
                { "from": "n6", "to": "n9" }
            ]
        }
        """
        return resp

    def build_lesson(self, topic: str, change_request=0) -> dict[str, Any]:
        #define the llm call here.
        video_ids = self.youtube_service.video_recomendations(topic)
        if not video_ids:
            raise ValueError("No video recommendations found for the given topic.")

        # `change_request` is treated as the index into the returned video list.
        idx = int(change_request)
        if idx < 0:
            idx = 0
        if idx >= len(video_ids):
            idx = idx % len(video_ids)

        video_id = video_ids[idx]
        video_url = f"https://www.youtube.com/watch?v={video_id}"

        # 1) Fetch transcript of the selected video.
        transcript_data = self.youtube_service.transcribe(video_url)
        transcript = transcript_data.get("transcript", "")

        # 2) Generate quiz from transcript.
        quiz_payload = self.generate_questions(transcript)
        quiz_questions = self._parse_quiz_questions(quiz_payload)

        # Return payload expected by the frontend/integrations.
        return {
            "video_id": video_id,
            "transcript": transcript,
            "quiz_questions": quiz_questions,
        }

    def _parse_quiz_questions(self, quiz_payload: Any) -> Any:
        """
        `AITextProcessor.generate_questions()` returns a JSON-ish string.
        We try to parse it into actual python objects and extract `questions`.
        """
        if quiz_payload is None:
            return None

        if isinstance(quiz_payload, dict):
            return quiz_payload.get("questions", quiz_payload)

        if not isinstance(quiz_payload, str):
            return quiz_payload

        cleaned = quiz_payload.strip().replace("`", "")

        # First try strict JSON (double quotes).
        try:
            parsed = json.loads(cleaned)
            if isinstance(parsed, dict) and "questions" in parsed:
                return parsed["questions"]
            return parsed
        except Exception:
            pass

        # Then try python literal form (single quotes).
        try:
            parsed = ast.literal_eval(cleaned)
            if isinstance(parsed, dict) and "questions" in parsed:
                return parsed["questions"]
            return parsed
        except Exception:
            # If parsing fails, return raw payload so caller can inspect.
            return quiz_payload

