# test_api_sync.py
import requests

BASE_URL = "http://127.0.0.1:8032"

# -----------------------------
# TEST DATA
# -----------------------------
text_sample = "This is a sample text for testing."
code_sample = "print('Hello World')"
dsa_topic = "Arrays"
chat_question = "What is AI?"
lesson_context = "Python basics"
lesson_question = "Explain functions in Python"

# -----------------------------
# TEXT PROCESSING
# -----------------------------
# def test_text_process_explain():
#     payload = {"text": text_sample, "type": "explain"}
#     response = requests.post(f"{BASE_URL}/text-process", json=payload)
#     assert response.status_code == 200
#     assert "explanation" in response.json()


# def test_text_process_enhance():
#     payload = {"text": text_sample, "type": "enhance"}
#     response = requests.post(f"{BASE_URL}/text-process", json=payload)
#     assert response.status_code == 200
#     assert "enhanced_text" in response.json()


# def test_text_process_questions():
#     payload = {"text": text_sample, "type": "questions"}
#     response = requests.post(f"{BASE_URL}/text-process", json=payload)
#     assert response.status_code == 200
#     assert "questions" in response.json()


# # -----------------------------
# # CODE ANALYSIS
# # -----------------------------
# def test_code_analyze_standard():
#     payload = {"code": code_sample, "type": "standard"}
#     response = requests.post(f"{BASE_URL}/code-analyze", json=payload)
#     assert response.status_code == 200
#     assert "analysis" in response.json()


# def test_code_analyze_custom():
#     payload = {"code": code_sample, "type": "custom", "custom_prompt": "Optimize this code"}
#     response = requests.post(f"{BASE_URL}/code-analyze", json=payload)
#     assert response.status_code == 200
#     assert "analysis" in response.json()


# # -----------------------------
# # DSA GENERATION
# # -----------------------------
# def test_dsa_generate_topic():
#     payload = {"topic": dsa_topic, "type": "topic"}
#     response = requests.post(f"{BASE_URL}/dsa-generate", json=payload)
#     assert response.status_code == 200
#     assert "result" in response.json()


# def test_dsa_generate_custom():
#     payload = {"topic": dsa_topic, "type": "custom", "custom_requirement": "Hard level"}
#     response = requests.post(f"{BASE_URL}/dsa-generate", json=payload)
#     assert response.status_code == 200
#     assert "result" in response.json()


# # -----------------------------
# # CHAT
# # -----------------------------
# def test_chat():
#     payload = {"question": chat_question}
#     response = requests.post(f"{BASE_URL}/chat", json=payload)
#     assert response.status_code == 200
#     assert "response" in response.json()


# def test_lesson_chat():
#     payload = {"context": lesson_context, "question": lesson_question}
#     response = requests.post(f"{BASE_URL}/chat-lesson", json=payload)
#     assert response.status_code == 200
#     assert "response" in response.json()

youtube_link = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # sample video
sample_transcript = "This is a sample transcript for testing."


# -----------------------------
# Test /transcribe endpoint
# -----------------------------
def test_transcribe_video():
    payload = {"youtube_link": youtube_link}
    response = requests.post(f"{BASE_URL}/transcribe", json=payload)
    assert response.status_code == 200, f"Status code was {response.status_code}"
    data = response.json()
    assert "transcript" in data, "No transcript in response"
    assert isinstance(data["transcript"], str)
    assert len(data["transcript"]) > 0


# -----------------------------
# Test /recommendations endpoint
# -----------------------------
def test_video_recommendations():
    payload = {"transcript": sample_transcript}
    response = requests.post(f"{BASE_URL}/recommendations", json=payload)
    assert response.status_code == 200, f"Status code was {response.status_code}"
    data = response.json()
    assert "video_ids" in data, "No video_ids in response"
    assert isinstance(data["video_ids"], list)
    assert len(data["video_ids"]) > 0