import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

export default function InterviewTaker({ flow_id = "dummy_flow" }) {
  const [started, setStarted] = useState(false);
  const [resume, setResume] = useState(null);
  const [code, setCode] = useState("// Start coding here...");
  const [recording, setRecording] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // ================= START SESSION =================
  const startSession = async () => {
    setStarted(true);

    // ===== CAMERA INIT =====
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;

      // ===== RECORDING SETUP =====
      const recorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/mp4" });
        chunksRef.current = [];

        // ===== DUMMY API SEND =====
        console.log("Sending interview data", {
          flow_id: flow_id || "dummy_flow",
          code,
          blob,
        });

        // ===== PLAY DUMMY AI AUDIO =====
        const audio = new Audio(
          "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
        );
        audio.play();

        /* ===== REAL API (KEEP) =====
        const form = new FormData();
        form.append("flow_id", flow_id);
        form.append("code", code);
        form.append("video", blob);
        if (resume) form.append("resume", resume);

        fetch("/api/interview/session", {
          method: "POST",
          body: form,
        })
          .then((r) => r.blob())
          .then((aiAudio) => {
            const url = URL.createObjectURL(aiAudio);
            new Audio(url).play();
          });
        */
      };
    } catch (err) {
      console.error("Camera error", err);
      alert("Camera/mic permission needed");
    }
  };

  // ================= TOGGLE CAMERA =================
  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraOn;
        setCameraOn(!cameraOn);
      }
    }
  };

  // ================= SPACEBAR TALK =================
  useEffect(() => {
    const down = (e) => {
      if (e.code === "Space" && started && mediaRecorderRef.current && !recording) {
        e.preventDefault();
        mediaRecorderRef.current.start();
        setRecording(true);
      }
    };

    const up = (e) => {
      if (e.code === "Space" && recording && mediaRecorderRef.current) {
        e.preventDefault();
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [started, recording]);

  // ================= CLEANUP =================
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // ================= UI =================
  if (!started) {
    return (
      <div className="itk-start">
        <div className="itk-card">
          <div className="itk-logo">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 11L11 13L15 9" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="itk-title">AI Coding Interview</h2>
          <p className="itk-subtitle">Ace your technical interview with AI assistance</p>
          
          <div className="itk-upload">
            <label className="itk-upload-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 18C4.79 18 3 16.21 3 14C3.6 10.9 6.5 9 9.5 9C10.5 6.2 13.2 4 16.5 4C20.1 4 23 6.9 23 10.5C23 14.1 20.1 17 16.5 17" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 13L12 21M12 13L9 16M12 13L15 16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{resume ? resume.name : "Upload Resume (Optional)"}</span>
              <input
                type="file"
                onChange={(e) => setResume(e.target.files[0])}
                accept=".pdf,.doc,.docx"
              />
            </label>
          </div>

          <button className="itk-btn" onClick={startSession}>
            <span>Start Interview Session</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12L19 12M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="itk-layout">
      {/* LEFT CODE EDITOR */}
      <div className="itk-editor">
        <div className="itk-editor-header">
          <span className="itk-editor-title">Code Editor</span>
          <div className="itk-editor-lang">JavaScript</div>
        </div>
        <Editor
          height="calc(60% - 50px)"
          theme="vs-dark"
          defaultLanguage="python"
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="itk-right">
        <div className="itk-ai-section">
          <div className="itk-ai-avatar">
            <div className="itk-avatar-ring"></div>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9M20 19V21C20 21.55 19.55 22 19 22H5C4.45 22 4 21.55 4 21V19C4 17.9 4.9 17 6 17H18C19.1 17 20 17.9 20 19Z"/>
            </svg>
          </div>
          <div className="itk-ai-info">
            <div className="itk-ai-name">AI Interviewer</div>
            <div className="itk-ai-status">
              <span className="itk-status-dot"></span>
              Active
            </div>
          </div>
        </div>

        <div className="itk-video-container">
          <video
            ref={videoRef}
            autoPlay
            muted
            className={`itk-video ${!cameraOn ? 'itk-video-off' : ''}`}
          />
          {!cameraOn && (
            <div className="itk-camera-off">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18M20 8.69L20 15.31L16.46 11.77C16.46 11.51 16.5 11.26 16.5 11C16.5 9.07 14.93 7.5 13 7.5C12.74 7.5 12.49 7.54 12.23 7.54L8.69 4L15.31 4L20 8.69M3.27 2.27L2 3.54L5.46 7L4 8.46L4 15.54L8.46 20L15.54 20L19.46 23.92L20.73 22.65L3.27 2.27Z"/>
              </svg>
              <span>Camera Off</span>
            </div>
          )}
          <button className="itk-camera-toggle" onClick={toggleCamera}>
            {cameraOn ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.27 2L2 3.27L4.73 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.21 18 16.39 17.92 16.54 17.82L19.73 21L21 19.73M21 6.5L17 10.5V7C17 6.45 16.55 6 16 6H9.82L21 17.18V6.5Z"/>
              </svg>
            )}
          </button>
        </div>

        <div className={`itk-controls ${recording ? 'itk-recording' : ''}`}>
          <div className="itk-mic-indicator">
            <div className="itk-mic-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14M17.91 11C17.66 14.78 14.78 17.58 11 17.82V21H13V19.82C16.47 19.47 19 16.67 19 13.11V11H17.91M7 11V13C7 16.31 9.69 19 13 19C16.31 19 19 16.31 19 13V11"/>
              </svg>
            </div>
            <div className="itk-mic-text">
              {recording ? "Recording... Release SPACE to stop" : "Hold SPACE to talk"}
            </div>
            {recording && <div className="itk-recording-pulse"></div>}
          </div>
        </div>

        <div className="itk-tips">
          <div className="itk-tip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7V13H9V11M13 11H11V13H13V11M17 11H15V13H17V11M20 2H4C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2M20 20H4V8H20V20Z"/>
            </svg>
            Press and hold SPACE to speak
          </div>
          <div className="itk-tip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6Z"/>
            </svg>
            Write your solution in the editor
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= CSS ================= */

const style = document.createElement("style");
style.innerHTML = `
/* ========== Variables & Reset ========== */
:root {
  --itk-bg-primary: #0a0e27;
  --itk-bg-secondary: #151933;
  --itk-bg-tertiary: #1e2139;
  --itk-border: #2a2e4e;
  --itk-text-primary: #e4e7f1;
  --itk-text-secondary: #9ca3b8;
  --itk-accent: #5865f2;
  --itk-accent-hover: #4752c4;
  --itk-success: #3ba55d;
  --itk-danger: #ed4245;
  --itk-warning: #faa81a;
  --itk-radius: 12px;
  --itk-radius-sm: 8px;
  --itk-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== Start Screen ========== */
.itk-start {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--itk-bg-primary) 0%, var(--itk-bg-secondary) 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  position: relative;
  overflow: hidden;
}

.itk-start::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 20% 80%, rgba(88, 101, 242, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(88, 101, 242, 0.05) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(-10%, -10%) rotate(0deg); }
  50% { transform: translate(10%, 10%) rotate(180deg); }
}

.itk-card {
  background: rgba(30, 33, 57, 0.95);
  backdrop-filter: blur(10px);
  padding: 48px;
  border-radius: 20px;
  width: 450px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid var(--itk-border);
  color: var(--itk-text-primary);
  z-index: 1;
  position: relative;
}

.itk-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--itk-accent) 0%, #7289da 100%);
  border-radius: 20px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 8px 24px rgba(88, 101, 242, 0.3);
}

.itk-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #fff 0%, #9ca3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.itk-subtitle {
  color: var(--itk-text-secondary);
  font-size: 14px;
  margin: 0 0 32px 0;
}

.itk-upload {
  margin-bottom: 24px;
}

.itk-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border: 2px dashed var(--itk-border);
  border-radius: var(--itk-radius);
  background: var(--itk-bg-primary);
  color: var(--itk-text-secondary);
  cursor: pointer;
  transition: var(--itk-transition);
  position: relative;
  overflow: hidden;
}

.itk-upload-label:hover {
  border-color: var(--itk-accent);
  background: rgba(88, 101, 242, 0.1);
  color: var(--itk-text-primary);
}

.itk-upload-label input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.itk-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  width: 100%;
  border: none;
  border-radius: var(--itk-radius);
  background: linear-gradient(135deg, var(--itk-accent) 0%, #4752c4 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--itk-transition);
  box-shadow: 0 4px 12px rgba(88, 101, 242, 0.3);
  position: relative;
  overflow: hidden;
}

.itk-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.itk-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(88, 101, 242, 0.4);
}

.itk-btn:hover::before {
  left: 100%;
}

/* ========== Main Layout ========== */
.itk-layout {
  display: grid;
  grid-template-columns: 1fr 420px;
  height: 100vh;
  background: var(--itk-bg-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ========== Code Editor ========== */
.itk-editor {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--itk-border);
  background: var(--itk-bg-secondary);
}

.itk-editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--itk-bg-primary);
  border-bottom: 1px solid var(--itk-border);
  height: 50px;
}

.itk-editor-title {
  color: var(--itk-text-primary);
  font-weight: 600;
  font-size: 14px;
}

.itk-editor-lang {
  padding: 4px 12px;
  background: var(--itk-accent);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* ========== Right Panel ========== */
.itk-right {
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;
  color: var(--itk-text-primary);
  background: var(--itk-bg-primary);
}

/* ========== AI Section ========== */
.itk-ai-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--itk-bg-secondary);
  border-radius: var(--itk-radius);
  border: 1px solid var(--itk-border);
}

.itk-ai-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--itk-accent), #7289da);
  color: white;
}

.itk-avatar-ring {
  position: absolute;
  inset: -4px;
  border: 2px solid var(--itk-accent);
  border-radius: 50%;
  opacity: 0.3;
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.1; }
  100% { transform: scale(0.95); opacity: 0.3; }
}

.itk-ai-info {
  flex: 1;
}

.itk-ai-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.itk-ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--itk-text-secondary);
  font-size: 14px;
}

.itk-status-dot {
  width: 8px;
  height: 8px;
  background: var(--itk-success);
  border-radius: 50%;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ========== Video Section ========== */
.itk-video-container {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: var(--itk-radius);
  overflow: hidden;
  background: var(--itk-bg-secondary);
  border: 2px solid var(--itk-border);
}

.itk-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.itk-video-off {
  filter: brightness(0.1);
}

.itk-camera-off {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--itk-text-secondary);
  pointer-events: none;
}

.itk-camera-toggle {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(21, 25, 51, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid var(--itk-border);
  border-radius: var(--itk-radius-sm);
  color: var(--itk-text-primary);
  cursor: pointer;
  transition: var(--itk-transition);
}

.itk-camera-toggle:hover {
  background: var(--itk-accent);
  border-color: var(--itk-accent);
}

/* ========== Controls Section ========== */
.itk-controls {
  padding: 20px;
  background: var(--itk-bg-secondary);
  border-radius: var(--itk-radius);
  border: 1px solid var(--itk-border);
  transition: var(--itk-transition);
}

.itk-controls.itk-recording {
  background: rgba(237, 66, 69, 0.1);
  border-color: var(--itk-danger);
}

.itk-mic-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.itk-mic-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--itk-bg-tertiary);
  border-radius: 50%;
  color: var(--itk-text-secondary);
  transition: var(--itk-transition);
}

.itk-recording .itk-mic-icon {
  background: var(--itk-danger);
  color: white;
}

.itk-mic-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.itk-recording-pulse {
  position: absolute;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--itk-danger);
  animation: recording-pulse 1.5s ease-out infinite;
}

@keyframes recording-pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* ========== Tips Section ========== */
.itk-tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

.itk-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--itk-bg-secondary);
  border-radius: var(--itk-radius-sm);
  color: var(--itk-text-secondary);
  font-size: 13px;
  border: 1px solid var(--itk-border);
}

.itk-tip svg {
  flex-shrink: 0;
  opacity: 0.6;
}

/* ========== Responsive Design ========== */
@media (max-width: 1024px) {
  .itk-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  
  .itk-editor {
    border-right: none;
    border-bottom: 1px solid var(--itk-border);
  }
  
  .itk-right {
    padding: 16px;
  }
}

@media (max-width: 640px) {
  .itk-card {
    width: 90%;
    padding: 32px 24px;
  }
  
  .itk-title {
    font-size: 24px;
  }
  
  .itk-tips {
    display: none;
  }
}
`;
document.head.appendChild(style);
