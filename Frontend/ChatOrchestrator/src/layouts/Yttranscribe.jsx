import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import QuizApp from "./questions";
import DsaCompiler from "./dsa";

// ⭐ Outside component to prevent remount on every render
const DisplayContent = ({ video_id, data, metadata }) => (
  <section className="watch-video">
    <div className="video-container">
      <div className="video">
        <iframe
          width="1080"
          height="600"
          src={`https://www.youtube.com/embed/${video_id}`}
          controls
          poster="images/post-1-1.png"
          id="video"
        />
      </div>
      <h1 className="heading">Study guide</h1>
      <form action="" className="add-commentt">
        <textarea
          name="comment_box"
          value={data}
          readOnly
          className="add-commentt"
          maxLength={1000}
          cols="30"
          rows="10"
        />
      </form>
    </div>
    <div>
      <QuizApp metadata={metadata} data={data} />
      <DsaCompiler metadata={metadata} data={data} />
    </div>
  </section>
);

function Ytlink({ metadata = {} }) {
  const [ytlink, setLink] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⭐ once lesson is built, never unmount children
  const [hasLessonLoaded, setHasLessonLoaded] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8082/ai/transcribe", {
        youtubeLink: ytlink,
      });
      const data = response.data;
      console.log("API Response:", data);
      setList([data]);
      setHasLessonLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  function takeData(event) {
    setLink(event.target.value);
  }

  // ================= EDGE ACTION DETECTOR =================
  const prevActionsRef = useRef({});

  useEffect(() => {
    const actions = metadata?.actions || {};
    const prev = prevActionsRef.current;

    const isTrue = (v) => v === true || v === "true";
    const becameTrue = (name) => isTrue(actions[name]) && !isTrue(prev[name]);

    if (becameTrue("build_lesson")) {
      fetchItems();
      // ⭐ reset to false so next true triggers again
      prevActionsRef.current = { ...actions, build_lesson: false };
      return;
    }

    prevActionsRef.current = { ...actions };
  }, [metadata]);

  const actionFlag = metadata?.actions?.build_lesson;
  const isBuildTrue = actionFlag === true || actionFlag === "true";

  return (
    <div>
      <section className="comments">
        <h1 className="heading">Paste your YouTube Link here ...</h1>

        <input type="text" className="add-comment2" onChange={takeData} />
        <button onClick={fetchItems} className="inline-option-btn">
          {isBuildTrue ? "Generate again" : "Build Lesson"}
        </button>

        <br />

        {loading && (
          <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle
              className="pl__ring pl__ring--a"
              cx="120" cy="120" r="105"
              fill="none" stroke="#000" strokeWidth="20"
              strokeDasharray="0 660" strokeDashoffset="-330"
              strokeLinecap="round"
            />
            <circle
              className="pl__ring pl__ring--b"
              cx="120" cy="120" r="35"
              fill="none" stroke="#000" strokeWidth="20"
              strokeDasharray="0 220" strokeDashoffset="-110"
              strokeLinecap="round"
            />
            <circle
              className="pl__ring pl__ring--c"
              cx="85" cy="120" r="70"
              fill="none" stroke="#000" strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            />
            <circle
              className="pl__ring pl__ring--d"
              cx="155" cy="120" r="70"
              fill="none" stroke="#000" strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* ⭐ NEVER UNMOUNT after first load */}
        {!loading && hasLessonLoaded &&
          list.map((item, index) => (
            <div className="details" key={index}>
              <DisplayContent
                video_id={item.video_id}
                data={item.transcript}
                metadata={metadata}
              />
            </div>
          ))}
      </section>
    </div>
  );
}

export default Ytlink;