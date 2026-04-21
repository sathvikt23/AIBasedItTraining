from fastapi import FastAPI, APIRouter, HTTPException,Request
from pydantic import BaseModel
from enum import Enum
from models.v1 import *

from services.text import AITextProcessor
from services.code import AICodeAnalysisService
from services.dsa import AIDSAQuestionService
from services.chat import AIChatService

from all_in_one.youtubeService import youtube
from GoogleADK.agent import call_agent
app = FastAPI()
router = APIRouter()





text_service = AITextProcessor()
code_service = AICodeAnalysisService()
dsa_service = AIDSAQuestionService()
chat_service = AIChatService()




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
        result = chat_service.chat(request.question)
        return {"response": result}

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
async def get_roadmap(request: Request):
    data = await request.json() 
    return {
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
class genContentQuery(BaseModel):
    topic: str
@router.post("/generatecontent")
async def getContent(request:genContentQuery):
    
    content =text_service.generate_content(request.topic)
    return {"content":content}


@router.post("/lesson")
async def get_sample_lesson(request:Request):
    data = await request.json() 
    return {
  "topic": "Introduction to React",
  "content": "# Introduction to React\n\nReact is a JavaScript library...",
  "video_id": "dQw4w9WgXcQ",
  "past_quiz": { },
  "past_codes": { }  
}
class QueryRequest(BaseModel):
    query: str
@router.post("/ask_aiagent")
async def ask_aigent(req: QueryRequest):
    return {
        "response": call_agent(req.query)
    }
app.include_router(router)


#should be integrate to  frontend a,d java get by lesson id youtube url is not set 