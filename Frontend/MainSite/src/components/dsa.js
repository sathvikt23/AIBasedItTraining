import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";
import Editor from "@monaco-editor/react";

import QuizApp from "./questions";
import GenVid from "./Videogen";

function DsaCompiler(props) {
  const [apidata, setAPi] = useState({});
  const [obj1, setobj] = useState({});
  const [revCode, setRevcode] = useState("");
  const [terminal, setTer] = useState("");
  const [code, setCode] = useState("");
  const [current, setCurr] = useState(0);
  const [check, setcheck] = useState("");
  
  // Separate loading states for each button
  const [isCompiling, setIsCompiling] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Compile code function
  async function response() {
    console.log("=== COMPILE CODE STARTED ===");
    console.log("Code to compile:", code);
    
    setIsCompiling(true);
    setTer("Compiling...");
    
    try {
      console.log("Making API call to /compilecode...");
      const apiResponse = await axios.post("/compilecode", {
        code: code,
        input: "",
        lang: "Python",
      });
      
      console.log("Compile Response:", apiResponse.data);
      setCode(apiResponse.data.code);
      setTer(apiResponse.data.output);
      console.log("Terminal output set successfully");
    } catch (error) {
      console.error("Compile Error:", error);
      console.error("Error details:", error.response?.data || error.message);
      setTer("Error: " + error.message);
    } finally {
      setIsCompiling(false);
      console.log("=== COMPILE CODE COMPLETED ===");
    }
  }

  // Get questions function
  function getques() {
    console.log("=== GET QUESTIONS STARTED ===");
    console.log("Props data:", props.data);
    
    setIsLoadingQuestions(true);
    
    axios
      .post("/dsaques", {
        data: props.data,
      })
      .then(function (response) {
        console.log("Questions Response:", response.data);
        const parsedData = JSON.parse(response.data.id);
        console.log("Parsed questions:", parsedData);
        setobj(parsedData);
        setcheck("vudwbuv");
        console.log("Questions loaded successfully");
      })
      .catch(function (error) {
        console.error("Get Questions Error:", error);
        console.error("Error details:", error.response?.data || error.message);
      })
      .finally(() => {
        setIsLoadingQuestions(false);
        console.log("=== GET QUESTIONS COMPLETED ===");
      });
  }

  const obj = obj1;

  // Code update handler
  function codeupdate(event) {
    const newCode = event.target.value;
    console.log("Code updated, length:", newCode.length);
    setCode(newCode);
  }

  // AI Analysis function
  function ai() {
    console.log("=== AI ANALYSIS STARTED ===");
    console.log("Code to analyze:", code);
    
    setIsAnalyzing(true);
    setRevcode("Analyzing your code...");
    
    axios
      .post("/compilecodeai", {
        code: code,
      })
      .then(function (response) {
        console.log("Full AI Response:", response);
        console.log("AI Response Data:", response.data);
        
        // Check for different possible response formats
        if (response.data && response.data.anaylsis) {
          console.log("Analysis found in response.data.anaylsis");
          setRevcode(response.data.anaylsis);
        } else if (response.data && response.data.analysis) {
          console.log("Analysis found in response.data.analysis");
          setRevcode(response.data.analysis);
        } else if (response.data && typeof response.data === 'string') {
          console.log("Analysis is a direct string");
          setRevcode(response.data);
        } else {
          console.warn("Unexpected response format:", response.data);
          setRevcode("No analysis available. Response: " + JSON.stringify(response.data));
        }
        
        console.log("AI analysis state updated successfully");
      })
      .catch(function (error) {
        console.error("AI Analysis Error:", error);
        console.error("Error Response:", error.response?.data);
        console.error("Error Message:", error.message);
        setRevcode("Error getting AI analysis: " + error.message + "\n\nDetails: " + JSON.stringify(error.response?.data || {}));
      })
      .finally(() => {
        setIsAnalyzing(false);
        console.log("=== AI ANALYSIS COMPLETED ===");
      });
  }

  // Navigation functions
  function nextq() {
    if (current < obj.questions.length - 1) {
      console.log("Moving to next question:", current + 1);
      setCurr(current + 1);
    }
  }

  function prevq() {
    if (current >= 1) {
      console.log("Moving to previous question:", current - 1);
      setCurr(current - 1);
    }
  }

  function Display() {
    return (
      <section class="watch-video">
        <div class="video-container">
          <h1 class="heading">Study guide </h1>
          <form action="" class="add-commentt"></form>
        </div>

        <div class="video-container"></div>
        <div>
          <GenVid data={code} />
          <QuizApp data={code} />
        </div>
      </section>
    );
  }

  return (
    <div>
      <button 
        class="inline-btn" 
        onClick={getques}
        disabled={isLoadingQuestions}
      >
        {isLoadingQuestions ? "Loading Questions..." : "Practice Codes"}
      </button>
      
      {check.length > 0 && (
        <>
          <section class="watch-video">
            <div class="video-container">
              <h2>Question</h2>
              <h2>{obj.questions[current].question}</h2>
              <br></br>
              <h2>Expected output: </h2>
              <h2>{obj.questions[current].output}</h2>
              <button class="btn" onClick={nextq}>
                Next
              </button>
              <button class="btn" onClick={prevq}>
                Prev
              </button>
            </div>
          </section>
          
          <section class="watch-video">
            <div class="video-container">
              <h3 class="heading">Code</h3>
              <textarea
                rows="13"
                cols="100"
                id="code"
                name="code"
                class="globalsub2"
                onChange={codeupdate}
                value={code}
                placeholder="Type your code here..."
              ></textarea>
              <br />
              <br></br>
              
              <h3 class="heading">Terminal</h3>
              <button
                type="button"
                class="inline-btn"
                onClick={response}
                disabled={isCompiling}
              >
                {isCompiling ? "Compiling..." : "Compile"}
              </button>
              <br></br>
              <br></br>
              <textarea
                class="globalsub3"
                rows="10"
                cols="100"
                id="input"
                name="input"
                value={terminal}
                readOnly
                placeholder="Terminal output will appear here..."
              ></textarea>
              <br />
              Language:
              <select name="lang">
                <option value="Python">Python</option>
              </select>
              Compile with Input:
              <input type="radio" name="inputRadio" value="true" />
              yes
              <input type="radio" name="inputRadio" id="inputRadio" value="false" />
              No
              <br />
              <br></br>
              <br></br>
              
              <h3 class="heading">AI analysis</h3>
              <button
                class="inline-btn"
                type="button"
                onClick={ai}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Ask AI"}
              </button>
              <br></br>
              <br></br>
              <textarea
                class="globalsub4"
                rows="10"
                cols="100"
                value={revCode}
                placeholder="AI analysis will appear here..."
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