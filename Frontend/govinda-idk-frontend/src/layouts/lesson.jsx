import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import QuizApp from "./questions";
import DsaCompiler from "./dsa";
import "./lesson.css"
// ─────────────────────────────────────────────
// Section wrapper with animated reveal
// ─────────────────────────────────────────────
const Section = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="lesson-section">
      <button className="lesson-section__header" onClick={() => setOpen((o) => !o)}>
        <span className="lesson-section__icon">{icon}</span>
        <span className="lesson-section__title">{title}</span>
        <span className={`lesson-section__chevron ${open ? "open" : ""}`}>▾</span>
      </button>
      {open && <div className="lesson-section__body">{children}</div>}
    </div>
  );
};

// ─────────────────────────────────────────────
// Source: YouTube embed or File upload
// ─────────────────────────────────────────────
const SourcePanel = ({ videoId, onFileUpload, fileUploading, fileMarkdown }) => {
  const [tab, setTab] = useState(videoId ? "youtube" : "file");
  const fileRef = useRef();

  return (
    <div className="source-panel">
      <div className="source-tabs">
        <button
          className={`source-tab ${tab === "youtube" ? "active" : ""}`}
          onClick={() => setTab("youtube")}
        >
          ▶ YouTube
        </button>
        <button
          className={`source-tab ${tab === "file" ? "active" : ""}`}
          onClick={() => setTab("file")}
        >
          📄 File
        </button>
      </div>

      {tab === "youtube" && (
        <div className="source-youtube">
          {videoId ? (
            <iframe
              className="yt-embed"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Lesson Video"
              allowFullScreen
            />
          ) : (
            <div className="source-empty">No YouTube video linked to this lesson.</div>
          )}
        </div>
      )}

      {tab === "file" && (
        <div className="source-file">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            style={{ display: "none" }}
            onChange={(e) => onFileUpload(e.target.files[0])}
          />
          <button
            className="upload-btn"
            onClick={() => fileRef.current.click()}
            disabled={fileUploading}
          >
            {fileUploading ? "Processing..." : "Upload File"}
          </button>
          {fileMarkdown && (
            <div className="file-preview">
              <p className="file-preview__label">File content loaded ✓</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Lesson Component
// ─────────────────────────────────────────────
function Lesson({ metadata = {} }) {
  const [lessonData, setLessonData] = useState(null);   // { topic, content, video_id, past_quiz, past_codes }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // File upload state
  const [fileMarkdown, setFileMarkdown] = useState("");
  const [fileUploading, setFileUploading] = useState(false);

  // ── Fetch lesson by flow_id ──────────────────
  const fetchLesson = async (flow_id) => {
    if (!flow_id) return;
    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://127.0.0.1:8032/api/v1/lesson", { flow_id });
      setLessonData(res.data); // expects { topic, content, video_id, past_quiz?, past_codes? }
    } catch (e) {
      console.error("Lesson fetch error:", e);
      setError("Failed to load lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── File upload handler ──────────────────────
  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      setFileUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://127.0.0.1:8032/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFileMarkdown(res.data.markdown || res.data);
    } catch (e) {
      console.error("File upload error:", e);
    } finally {
      setFileUploading(false);
    }
  };

  // ── Edge action detector ─────────────────────
  const prevActionsRef = useRef({});

  useEffect(() => {
    const actions = metadata?.actions || {};
    const prev = prevActionsRef.current;
    const isTrue = (v) => v === true || v === "true";
    const becameTrue = (name) => isTrue(actions[name]) && !isTrue(prev[name]);

    if (becameTrue("load_lesson")) {
      fetchLesson(metadata.flow_id);
      prevActionsRef.current = { ...actions, load_lesson: false };
      return;
    }

    prevActionsRef.current = { ...actions };
  }, [metadata]);

  // Auto-load on mount if flow_id present
  useEffect(() => {
    if (metadata?.flow_id) fetchLesson(metadata.flow_id);
  }, []);

  // ── The markdown content to show (lesson or file) ──
  const markdownContent = fileMarkdown || lessonData?.content || "";
  // The transcript/raw text to pass into Quiz & DSA
  const textData = markdownContent;

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <>
    

      <div className="lesson-page">
        {/* ── Header ── */}
        <div className="lesson-header">
          <div className="lesson-header__eyebrow">Lesson</div>
          <h1 className="lesson-header__title">
            {lessonData?.topic || "Loading lesson..."}
          </h1>
          {metadata?.flow_id && (
            <div className="lesson-header__meta">flow_id: {metadata.flow_id}</div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="lesson-body">

          {loading && (
            <div className="lesson-loader">
              <div className="loader-ring" />
              <span>Fetching lesson...</span>
            </div>
          )}

          {error && <div className="lesson-error">{error}</div>}

          {!loading && (
            <>
              {/* 1. SOURCE */}
              <Section title="Source" icon="🎬" defaultOpen={true}>
                <SourcePanel
                  videoId={lessonData?.video_id}
                  onFileUpload={handleFileUpload}
                  fileUploading={fileUploading}
                  fileMarkdown={fileMarkdown}
                />
              </Section>

              {/* 2. CONTENT */}
              <Section title={lessonData?.topic || "Content"} icon="📖" defaultOpen={true}>
                {markdownContent ? (
                  <div className="md-body">
                    <ReactMarkdown>{markdownContent}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="md-empty">
                    No content yet. Load a lesson or upload a file.
                  </div>
                )}
              </Section>

              {/* 3. QUIZ */}
              <Section title="Quiz" icon="🧠" defaultOpen={false}>
                {lessonData?.past_quiz && (
                  <div className="past-badge">📊 Past results available</div>
                )}
                <QuizApp metadata={metadata} data={textData} />
              </Section>

              {/* 4. PRACTICE CODES */}
              <Section title="Practice Codes" icon="💻" defaultOpen={false}>
                {lessonData?.past_codes && (
                  <div className="past-badge">📊 Past results available</div>
                )}
                <DsaCompiler metadata={metadata} data={textData} />
              </Section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Lesson;