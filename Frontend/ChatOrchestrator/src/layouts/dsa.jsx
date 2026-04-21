import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./style.css";

function DsaCompiler({ metadata = {}, data }) {
  const [obj1, setobj] = useState({});
  const [revCode, setRevcode] = useState("");
  const [terminal, setTer] = useState("");
  const [code, setCode] = useState("");
  const [current, setCurr] = useState(0);

  // ⭐ once true, never goes false — keeps UI visible
  const [hasPracticeLoaded, setHasPracticeLoaded] = useState(false);

  const [isCompiling, setIsCompiling] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const obj = obj1;

  // ================= EDGE ACTION DETECTOR =================
  const prevActionsRef = useRef({});

  useEffect(() => {
    const actions = metadata?.actions || {};
    const prev = prevActionsRef.current;

    const isTrue = (v) => v === true || v === "true";
    const becameTrue = (name) => isTrue(actions[name]) && !isTrue(prev[name]);

    if (becameTrue("practice_codes")) {
      getques();
      // ⭐ reset to false so next true triggers again
      prevActionsRef.current = { ...actions, practice_codes: false };
      return;
    }

    if (becameTrue("run_code")) {
      runCode();
      // ⭐ reset to false so next true triggers again
      prevActionsRef.current = { ...actions, run_code: false };
      return;
    }

    if (becameTrue("analyze_code")) {
      ai();
      // ⭐ reset to false so next true triggers again
      prevActionsRef.current = { ...actions, analyze_code: false };
      return;
    }

    prevActionsRef.current = { ...actions };
  }, [metadata]);

  // ================= FUNCTIONS =================

  function getques() {
    if (!data) return;
    setIsLoadingQuestions(true);

    axios
      .post("http://localhost:8082/ai/dsaques", { data })
      .then((res) => {
        const parsedData = JSON.parse(res.data.id);
        setobj(parsedData);
        setCurr(0);
        // ⭐ once true, never false
        setHasPracticeLoaded(true);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoadingQuestions(false));
  }

  async function runCode() {
    setIsCompiling(true);
    setTer("Compiling...");

    try {
      const apiResponse = await axios.post("/compilecode", {
        code,
        input: "",
        lang: "Python",
      });
      setCode(apiResponse.data.code);
      setTer(apiResponse.data.output);
    } catch (error) {
      setTer("Error: " + error.message);
    } finally {
      setIsCompiling(false);
    }
  }

  function ai() {
    setIsAnalyzing(true);
    setRevcode("Analyzing your code...");

    axios
      .post("http://localhost:8082/ai/compilecodeai", { code })
      .then((res) => {
        if (res.data?.anaylsis) setRevcode(res.data.anaylsis);
        else if (res.data?.analysis) setRevcode(res.data.analysis);
        else if (typeof res.data === "string") setRevcode(res.data);
        else setRevcode("No analysis available");
      })
      .catch((error) => setRevcode("Error: " + error.message))
      .finally(() => setIsAnalyzing(false));
  }

  function codeupdate(e) {
    setCode(e.target.value);
  }

  function nextq() {
    if (obj.questions && current < obj.questions.length - 1)
      setCurr(current + 1);
  }

  function prevq() {
    if (current > 0) setCurr(current - 1);
  }

  const actionFlag = (name) => {
    const raw = metadata?.actions?.[name];
    return raw === true || raw === "true";
  };

  // ================= UI =================
  return (
    <div>
      <button
        className="inline-btn"
        onClick={getques}
        disabled={isLoadingQuestions}
      >
        {isLoadingQuestions
          ? "Loading Questions..."
          : actionFlag("practice_codes")
          ? "Generate again"
          : "Practice Codes"}
      </button>

      {/* ⭐ NEVER UNMOUNT after first load */}
      {hasPracticeLoaded && obj.questions && (
        <>
          <section className="watch-video">
            <div className="video-container">
              <h2>Question</h2>
              <h3>{obj.questions[current].question}</h3>

              <h3>Expected output:</h3>
              <p>{obj.questions[current].output}</p>

              <button className="btn" onClick={prevq}>
                Prev
              </button>
              <button className="btn" onClick={nextq}>
                Next
              </button>
            </div>
          </section>

          <section className="watch-video">
            <div className="video-container">
              <h3 className="heading">Code</h3>

              <textarea
                rows="13"
                cols="100"
                className="globalsub2"
                value={code}
                onChange={codeupdate}
              />

              <h3 className="heading">Terminal</h3>

              <button
                className="inline-btn"
                onClick={runCode}
                disabled={isCompiling}
              >
                {isCompiling
                  ? "Compiling..."
                  : actionFlag("run_code")
                  ? "Run again"
                  : "Compile"}
              </button>

              <textarea
                className="globalsub3"
                rows="10"
                cols="100"
                value={terminal}
                readOnly
              />

              <h3 className="heading">AI Analysis</h3>

              <button
                className="inline-btn"
                onClick={ai}
                disabled={isAnalyzing}
              >
                {isAnalyzing
                  ? "Analyzing..."
                  : actionFlag("analyze_code")
                  ? "Analyze again"
                  : "Ask AI"}
              </button>

              <textarea
                className="globalsub4"
                rows="10"
                cols="100"
                value={revCode}
                readOnly
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default DsaCompiler;