
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import QuizApp from "./questions";
import DsaCompiler from "./dsa";
import "./lesson.css";
 
// ─────────────────────────────────────────────
// Thinking Loader — animated multi-step indicator
// ─────────────────────────────────────────────
const ThinkingLoader = ({ step }) => {
  const steps = [
    { id: 1, label: "Fetching lesson details..." },
    { id: 2, label: "Generating content..." },
  ];
 
  return (
    <div className="thinking-loader">
      <div className="thinking-loader__orb-wrap">
        <div className="thinking-loader__orb" />
        <div className="thinking-loader__orb thinking-loader__orb--2" />
        <div className="thinking-loader__orb thinking-loader__orb--3" />
      </div>
      <div className="thinking-loader__steps">
        {steps.map((s) => (
          <div
            key={s.id}
            className={`thinking-step ${
              step === s.id
                ? "thinking-step--active"
                : step > s.id
                ? "thinking-step--done"
                : "thinking-step--pending"
            }`}
          >
            <span className="thinking-step__dot" />
            <span className="thinking-step__label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
 
// ─────────────────────────────────────────────
// Section wrapper with animated reveal
// ─────────────────────────────────────────────
const Section = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
 
  return (
    <div className="lesson-section">
      <button
        className="lesson-section__header"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="lesson-section__icon">{icon}</span>
        <span className="lesson-section__title">{title}</span>
        <span className={`lesson-section__chevron ${open ? "open" : ""}`}>
          ▾
        </span>
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
            <div className="source-empty">
              No YouTube video linked to this lesson.
            </div>
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
  // lessonMeta    → raw response from GET /lesson_id, stored as-is, never modified
  // topic         → extracted from lessonMeta, kept in its own state, passed to step 2
  // lessonContent → generated markdown returned by POST /generatecontent
  const [lessonMeta, setLessonMeta] = useState(null);
  const [topic, setTopic] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [loadStep, setLoadStep] = useState(0); // 0=idle, 1=fetching meta, 2=generating content, 3=done
  const [error, setError] = useState("");
 
  // File upload state
  const [fileMarkdown, setFileMarkdown] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
 
  // ── Two-step sequential fetch ─────────────────
  const fetchLesson = async (lesson_id) => {
    if (!lesson_id) return;
    try {
      setError("");
      setLessonMeta(null);
      setTopic("");
      setLessonContent("");
 
      // ── STEP 1: GET localhost:8082/{lesson_id} ──
      // Raw response stored in lessonMeta untouched.
      // topic is extracted separately into its own state.
      setLoadStep(1);
      const metaRes = await axios.get(`http://localhost:8082/${lesson_id}`);
      setLessonMeta(metaRes.data);
      const fetchedTopic = metaRes.data.topic;
      setTopic(fetchedTopic);
 
      // ── STEP 2: POST localhost:8032/generatecontent ──
      // Only fetchedTopic is passed — nothing from lessonMeta leaks in.
      setLoadStep(2);
      const contentRes = await axios.post("http://localhost:8032/generatecontent", {
        topic: fetchedTopic,
      });
      const content =
        typeof contentRes.data === "string"
          ? contentRes.data
          : contentRes.data.content ?? "";
      setLessonContent(content);
 
      setLoadStep(3); // done
    } catch (e) {
      console.error("Lesson fetch error:", e);
      setError(
        e?.response?.data?.message ||
          "Failed to load lesson. Please try again."
      );
      setLoadStep(0);
    }
  };
 
  // ── File upload handler ──────────────────────
  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      setFileUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        "http://127.0.0.1:8032/api/v1/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
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
      fetchLesson(metadata.lesson_id);
      prevActionsRef.current = { ...actions, load_lesson: false };
      return;
    }
 
    prevActionsRef.current = { ...actions };
  }, [metadata]);
 
  // Auto-load on mount if lesson_id present
  useEffect(() => {
    if (metadata?.lesson_id) fetchLesson(metadata.lesson_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  // ── Derived state ────────────────────────────
  const isLoading = loadStep === 1 || loadStep === 2;
  const markdownContent = fileMarkdown || lessonContent;
  const textData = markdownContent;
 
  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="lesson-page">
      {/* ── Header ── */}
      <div className="lesson-header">
        <div className="lesson-header__eyebrow">Lesson</div>
        <h1 className="lesson-header__title">
          {topic || (isLoading ? "Loading…" : "Lesson")}
        </h1>
        {metadata?.lesson_id && (
          <div className="lesson-header__meta">
            lesson_id: {metadata.lesson_id}
          </div>
        )}
      </div>
 
      {/* ── Body ── */}
      <div className="lesson-body">
        {/* THINKING LOADER — shown while either step is in progress */}
        {isLoading && <ThinkingLoader step={loadStep} />}
 
        {/* ERROR */}
        {error && !isLoading && (
          <div className="lesson-error">{error}</div>
        )}
 
        {/* CONTENT — only shown once both steps complete */}
        {!isLoading && loadStep === 3 && (
          <>
            {/* 1. SOURCE */}
            <Section title="Source" icon="🎬" defaultOpen={true}>
              <SourcePanel
                videoId={lessonMeta?.video_id}
                onFileUpload={handleFileUpload}
                fileUploading={fileUploading}
                fileMarkdown={fileMarkdown}
              />
            </Section>
 
            {/* 2. CONTENT */}
            <Section
              title={topic || "Content"}
              icon="📖"
              defaultOpen={true}
            >
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
              {lessonMeta?.past_quiz && (
                <div className="past-badge">📊 Past results available</div>
              )}
              <QuizApp metadata={metadata} data={textData} />
            </Section>
 
            {/* 4. PRACTICE CODES */}
            <Section title="Practice Codes" icon="💻" defaultOpen={false}>
              {lessonMeta?.past_codes && (
                <div className="past-badge">📊 Past results available</div>
              )}
              <DsaCompiler metadata={metadata} data={textData} />
            </Section>
          </>
        )}
 
        {/* IDLE — no lesson loaded yet */}
        {!isLoading && loadStep === 0 && !error && (
          <div className="md-empty">
            No lesson loaded yet. Trigger load_lesson action or provide a
            lesson_id.
          </div>
        )}
      </div>
    </div>
  );
}
 
export default Lesson;
 
