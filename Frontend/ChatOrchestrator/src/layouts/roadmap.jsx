import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import mermaid from "mermaid";
import "./roadmap.css"
// ─────────────────────────────────────────────
// Convert API JSON → Mermaid flowchart string
// Expected shape:
// {
//   title: "Learn React",
//   nodes: [{ id, label, type: "root"|"topic"|"subtopic"|"resource", status: "done"|"progress"|"todo" }],
//   edges: [{ from, to }]
// }
// ─────────────────────────────────────────────
function buildMermaid(data) {
  const { nodes = [], edges = [] } = data;

  const styleMap = {
    root:     "fill:#4f8ef7,stroke:#4f8ef7,color:#fff,font-weight:bold",
    topic:    "fill:#1f2433,stroke:#4f8ef7,color:#e8eaf0",
    subtopic: "fill:#13161e,stroke:#6b7280,color:#9ca3af",
    resource: "fill:#0d0f14,stroke:#374151,color:#6b7280",
  };

  const statusStyle = {
    done:     "fill:#052e16,stroke:#34d399,color:#34d399",
    progress: "fill:#1c1917,stroke:#f59e0b,color:#f59e0b",
    todo:     null,
  };

  let diagram = "flowchart TD\n";

  // Node definitions
  nodes.forEach((n) => {
    const safeLabel = (n.label || n.id).replace(/"/g, "'");
    if (n.type === "root") {
      diagram += `  ${n.id}(["${safeLabel}"])\n`;
    } else if (n.type === "resource") {
      diagram += `  ${n.id}["📎 ${safeLabel}"]\n`;
    } else {
      diagram += `  ${n.id}["${safeLabel}"]\n`;
    }
  });

  // Edges
  edges.forEach((e) => {
    diagram += `  ${e.from} --> ${e.to}\n`;
  });

  // Class definitions
  diagram += `\n  classDef root     ${styleMap.root}\n`;
  diagram += `  classDef topic    ${styleMap.topic}\n`;
  diagram += `  classDef subtopic ${styleMap.subtopic}\n`;
  diagram += `  classDef resource ${styleMap.resource}\n`;
  diagram += `  classDef done     ${statusStyle.done}\n`;
  diagram += `  classDef progress ${statusStyle.progress}\n`;

  // Assign classes — status overrides type
  nodes.forEach((n) => {
    const cls = (n.status && n.status !== "todo" && statusStyle[n.status])
      ? n.status
      : (n.type || "topic");
    diagram += `  class ${n.id} ${cls}\n`;
  });

  return diagram;
}

// ─────────────────────────────────────────────
// Mermaid renderer
// ─────────────────────────────────────────────
// ── initialize once at module level ──
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    background: "#0d0f14",
    mainBkg: "#13161e",
    nodeBorder: "#4f8ef7",
    clusterBkg: "#1f2433",
    titleColor: "#e8eaf0",
    edgeLabelBackground: "#13161e",
    lineColor: "#4f8ef7",
    primaryTextColor: "#e8eaf0",
    fontFamily: "'Sora', sans-serif",
    fontSize: "14px",
  },
  flowchart: { curve: "basis", nodeSpacing: 50, rankSpacing: 70, padding: 20 },
});

let mermaidCounter = 0;

const MermaidChart = ({ chart }) => {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current || !chart) return;

    // Clear previous render
    ref.current.innerHTML = "";

    // Each render needs a globally unique id
    const id = `mermaid-${++mermaidCounter}`;

    // Create a fresh hidden div for mermaid to render into
    const container = document.createElement("div");
    container.id = id;
    container.style.display = "none";
    document.body.appendChild(container);

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
          const svgEl = ref.current.querySelector("svg");
          if (svgEl) {
            svgEl.removeAttribute("width");
            svgEl.removeAttribute("height");
            svgEl.style.width = "100%";
            svgEl.style.height = "auto";
            svgEl.style.minHeight = "500px";
          }
        }
      })
      .catch((e) => {
        console.error("Mermaid render error:", e);
        if (ref.current) {
          ref.current.innerHTML = `<pre style="color:#f87171;font-size:12px;white-space:pre-wrap;padding:16px">${chart}</pre>`;
        }
      })
      .finally(() => {
        // Clean up the temp container
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      });
  }, [chart]);

  return <div ref={ref} className="mermaid-output" />;
};

// ─────────────────────────────────────────────
// Tab Button
// ─────────────────────────────────────────────
const TabBtn = ({ active, onClick, icon, label }) => (
  <button className={`rm-tab ${active ? "active" : ""}`} onClick={onClick}>
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

// ─────────────────────────────────────────────
// Legend Item
// ─────────────────────────────────────────────
const LegendItem = ({ color, border, label }) => (
  <div className="legend-item">
    <div className="legend-dot" style={{ background: color, borderColor: border }} />
    <span>{label}</span>
  </div>
);

// ─────────────────────────────────────────────
// Main Roadmap Component
// ─────────────────────────────────────────────
function Roadmap({ metadata = {} }) {
  const [ytLink, setYtLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);   // NEW
  const [acceptStatus, setAcceptStatus] = useState(""); // NEW: "success" | "error" | ""
  const [error, setError] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [mermaidChart, setMermaidChart] = useState("");
  const [zoom, setZoom] = useState(1);

  // ── Generate roadmap (YouTube only) ─────────
  const generateRoadmap = async (linkOverride) => {
  const link = String(linkOverride ?? ytLink ?? "").trim()        // ← use override if provided

  setLoading(true);
  setError("");
  setRoadmapData(null);
  setMermaidChart("");

  try {
    if (!link.trim()) throw new Error("Please enter a YouTube link.");

    const res = await axios.post(
      "http://127.0.0.1:8032/api/v1/generateRoadmap",
      {
        
          link: link,                         // ← uses the freshest value
        
      }
    );

    const data = res.data;
    const chart = buildMermaid(data);
    setRoadmapData(data);
    setMermaidChart(chart);
  } catch (e) {
    console.error("Roadmap error:", e);
    setError(e.message || "Failed to generate roadmap.");
  } finally {
    setLoading(false);
  }
};

  // ── Accept roadmap ──────────────────────────  NEW
  const acceptRoadmap = async () => {
    if (!roadmapData) return;

    setAccepting(true);
    setAcceptStatus("");

    try {
      await axios.post("http://localhost:8082/api/roadmap/create", {
        map: {
          nodes: roadmapData.nodes,
          edges: roadmapData.edges,
        },
      });

      setAcceptStatus("success");
    } catch (e) {
      console.error("Accept roadmap error:", e);
      setAcceptStatus("error");
    } finally {
      setAccepting(false);
    }
  };

  // ── Edge action detector ─────────────────────
  const prevActionsRef = useRef({});

  useEffect(() => {
    const actions = metadata?.actions || {};
    const inputs = metadata?.inputs || {};
    const prev = prevActionsRef.current;
    const isTrue = (v) => v === true || v === "true";
    const becameTrue = (name) => isTrue(actions[name]) && !isTrue(prev[name]);
    if (inputs.link !== undefined) {
      setYtLink(inputs.link);
    }

    if (becameTrue("generate_roadmap")) {
      generateRoadmap();
      prevActionsRef.current = { ...actions, generate_roadmap: false };
      return;
    }

    // NEW: accept_roadmap action trigger
    if (becameTrue("accept_roadmap")) {
      acceptRoadmap();
      prevActionsRef.current = { ...actions, accept_roadmap: false };
      return;
    }

    prevActionsRef.current = { ...actions };
  }, [metadata]);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="rm-page">
      {/* ── Hero ── */}
      <div className="rm-hero">
        <div className="rm-hero__eyebrow">AI-Powered</div>
        <h1 className="rm-hero__title">Learning Roadmap</h1>
        <p className="rm-hero__sub">
          Drop a YouTube link — get a structured visual roadmap in seconds.
        </p>
      </div>

      {/* ── Input Card ── */}
      <div className="rm-input-card">
        <div className="rm-card">
          <input
            className="rm-input"
            placeholder="https://www.youtube.com/watch?v=..."
            value={ytLink}
            onChange={(e) => setYtLink(e.target.value)}
          />

          {error && <div className="rm-error">⚠ {error}</div>}

          <button
            className="rm-generate-btn"
            onClick={generateRoadmap}
            disabled={loading}
          >
            {loading ? "Generating Roadmap..." : "✦ Generate Roadmap"}
          </button>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="rm-loading">
          <div className="rm-spinner" />
          <span>Building your roadmap...</span>
        </div>
      )}

      {/* ── Output ── */}
      {!loading && mermaidChart && roadmapData && (
        <div className="rm-output">
          {/* Header */}
          <div className="rm-output-header">
            <div className="rm-output-title">
              {roadmapData.title
                ? <><span>Roadmap:</span> {roadmapData.title}</>
                : "Your Roadmap"}
            </div>
            <div className="rm-controls">
              <button className="rm-zoom-btn" onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(1)))}>−</button>
              <span className="rm-zoom-label">{Math.round(zoom * 100)}%</span>
              <button className="rm-zoom-btn" onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))}>+</button>
              <button className="rm-zoom-btn" onClick={() => setZoom(1)} title="Reset">↺</button>
            </div>
          </div>

          {/* Stats (unchanged) */}
          {roadmapData.nodes?.length > 0 && (
            <div className="rm-stats">
              {/* ... your existing stats ... */}
            </div>
          )}

          {/* Legend (unchanged) */}
          <div className="rm-legend">
            {/* ... your existing legend ... */}
          </div>

          {/* Chart */}
          <div className="rm-chart-wrap">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform .2s" }}>
              <MermaidChart chart={mermaidChart} />
            </div>
          </div>

          {/* ── Accept Roadmap ── NEW */}
          <div className="rm-accept-section">
            <button
              className="rm-accept-btn"
              onClick={acceptRoadmap}
              disabled={accepting}
            >
              {accepting ? "Submitting..." : "✓ Accept Roadmap"}
            </button>

            {acceptStatus === "success" && (
              <div className="rm-accept-status rm-accept-status--success">
                ✓ Roadmap accepted successfully!
              </div>
            )}
            {acceptStatus === "error" && (
              <div className="rm-accept-status rm-accept-status--error">
                ⚠ Failed to submit roadmap. Please try again.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Roadmap;