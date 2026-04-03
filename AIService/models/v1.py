from pydantic import BaseModel
from typing import Any, List, Optional
from enum import Enum

class TextProcessType(str, Enum):
    explain = "explain"
    enhance = "enhance"
    questions = "questions"


class CodeAnalysisType(str, Enum):
    standard = "standard"
    custom = "custom"


class DSAType(str, Enum):
    topic = "topic"
    custom = "custom"

# Request/Response Models
class TextProcessRequest(BaseModel):
    text: str
    type: TextProcessType


class CodeAnalysisRequest(BaseModel):
    code: str
    type: CodeAnalysisType
    custom_prompt: str | None = None


class DSAQuestionRequest(BaseModel):
    topic: str
    type: DSAType
    custom_requirement: str | None = None


class ChatRequest(BaseModel):
    question: str


class LessonChatRequest(BaseModel):
    context: str
    question: str

class TranscribeRequest(BaseModel):
    youtube_link: str


class VideoRecommendationsRequest(BaseModel):
    transcript: str


class GenerateRoadmapRequest(BaseModel):
    topic: str


class ChangeRoadmapRequest(BaseModel):
    topic: str
    current_roadmap: Any
    student_request: str


class LessonRequest(BaseModel):
    topic: str
    change_request: int = 0