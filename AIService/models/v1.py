from pydantic import BaseModel
from typing import List, Optional
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