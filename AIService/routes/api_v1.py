from fastapi import FastAPI, APIRouter, HTTPException
import json
from models.v1 import *

from services.text import AITextProcessor
from services.code import AICodeAnalysisService
from services.dsa import AIDSAQuestionService
from services.chat import AIChatService
from services.roadmap import AIRoadmapService

from all_in_one.youtubeService import youtube

app = FastAPI()
router = APIRouter()





text_service = AITextProcessor()
code_service = AICodeAnalysisService()
dsa_service = AIDSAQuestionService()
chat_service = AIChatService()
roadmap_service = AIRoadmapService()




@router.post("/text-process")
async def process_text(request: TextProcessRequest):
    try:
        if request.type == TextProcessType.explain:
            result = text_service.explain_transcript(request.text)
            return {"explanation": result}

        elif request.type == TextProcessType.enhance:
            result = text_service.enhance_text(request.text)
            return {"enhanced_text": result}

        elif request.type == TextProcessType.questions:
            result = text_service.generate_questions(request.text)
            return {"questions": result}
        print(result)
    except HTTPException as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.post("/code-analyze")
async def analyze_code(request: CodeAnalysisRequest):
    try:
        if request.type == CodeAnalysisType.standard:
            result = code_service.analyze_code(request.code)

        elif request.type == CodeAnalysisType.custom:
            if not request.custom_prompt:
                raise HTTPException(status_code=400, detail="custom_prompt is required for custom analysis")
            result = code_service.custom_code_analysis(request.custom_prompt, request.code)

        return {"analysis": result}

    except HTTPException as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.post("/dsa-generate")
async def generate_dsa_questions(request: DSAQuestionRequest):
    try:
        if request.type == DSAType.topic:
            result = dsa_service.generate_dsa_questions(request.topic)

        elif request.type == DSAType.custom:
            if not request.custom_requirement:
                raise HTTPException(status_code=400, detail="custom_requirement is required for custom DSA generation")
            result = dsa_service.generate_custom_dsa_question(request.topic, request.custom_requirement)

        return {"result": result}

    except HTTPException as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        # result = chat_service.chat(request.question)
        # return {"response": result}
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

        # `resp` is a JSON string; parse it so the API always returns a JSON object.
        return json.loads(resp)

    except json.JSONDecodeError as e:
        return {"error": "Failed to parse chat JSON", "detail": str(e)}

    except HTTPException as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat-lesson")
async def lesson_chat(request: LessonChatRequest):
    try:
        result = chat_service.lesson_chat(request.context, request.question)
        return {"response": result}

    except HTTPException as e:
        status = 400 if "Text too large" in str(e) else 500
        raise HTTPException(status_code=status, detail=str(e))

@router.post("/transcribe")
async def transcribe_video(request: TranscribeRequest):
    try:
        transcript_data = youtube().transcribe(request.youtube_link)
        return transcript_data
    except Exception as e:
        return {"video_id":"Sr9RxZvYGzg","transcript":"for loops "}
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommendations")
async def get_video_recommendations(request: VideoRecommendationsRequest):
    try:
        video_ids = youtube().video_recomendations(request.transcript)
        return {"video_ids": video_ids}
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generateRoadmap")
async def generate_roadmap(request: GenerateRoadmapRequest):
    """
    POST /generateRoadmap

    Request JSON:
    {
      "topic": "Introduction to React"
    }

    Response JSON (success):
    {
      "title": "string",
      "nodes": [
        { "id": "string", "label": "string", "type": "string", "status": "string" }
      ],
      "edges": [
        { "from": "string", "to": "string" }
      ]
    }

    Response JSON (error):
    { "error": "string", "detail": "string" }
    """
    try:
        roadmap_payload = roadmap_service.generate_roadmap(request.topic)

        parsed = (
            json.loads(roadmap_payload)
            if isinstance(roadmap_payload, str)
            else roadmap_payload
        )

        if not isinstance(parsed, dict):
            return {"error": "Invalid roadmap response", "detail": "Expected JSON object"}

        return parsed
    except json.JSONDecodeError as e:
        return {"error": "Failed to parse roadmap JSON", "detail": str(e)}
    except Exception as e:
        return {"error": "Roadmap generation failed", "detail": str(e)}


@router.post("/changeRoadmap")
async def change_roadmap(request: ChangeRoadmapRequest):
    """
    POST /changeRoadmap

    Request JSON:
    {
      "topic": "string",
      "current_roadmap": {},
      "student_request": "string"
    }

    Response JSON (success):
    {
      "title": "string",
      "nodes": [
        { "id": "string", "label": "string", "type": "string", "status": "string" }
      ],
      "edges": [
        { "from": "string", "to": "string" }
      ]
    }

    Response JSON (error):
    { "error": "string", "detail": "string" }
    """
    try:
        roadmap_payload = roadmap_service.make_changes_to_roadmap(
            request.topic,
            request.current_roadmap,
            request.student_request,
        )

        parsed = (
            json.loads(roadmap_payload)
            if isinstance(roadmap_payload, str)
            else roadmap_payload
        )

        if not isinstance(parsed, dict):
            return {"error": "Invalid roadmap response", "detail": "Expected JSON object"}

        return parsed
    except json.JSONDecodeError as e:
        return {"error": "Failed to parse changed roadmap JSON", "detail": str(e)}
    except Exception as e:
        return {"error": "Roadmap change failed", "detail": str(e)}

@router.post("/lesson")
async def lesson(request: LessonRequest):
    """
    POST /lesson

    Request JSON:
    {
      "topic": "Introduction to React",
      "change_request": 0
    }

    Response JSON (success):
    {
      "video_id": "string",
      "transcript": "string",
      "quiz_questions": [
        {
          "question": "string",
          "choices": ["string", "string", "string", "string"],
          "answer": "string"
        }
      ]
    }

    Response JSON (error):
    { "error": "string", "detail": "string" }
    """
    try:
        # build_lesson returns a dict (already a parsed JSON object).
        return roadmap_service.build_lesson(request.topic, request.change_request)
    except Exception as e:
        return {"error": "Lesson building failed", "detail": str(e)}
app.include_router(router)


