import React, { useEffect, useState } from "react";
import axios from "axios";
import "./compiler.css";
import Editor from "@monaco-editor/react";

import QuizApp from "./questions";
import GenVid from "./Videogen";

function Compiler2() {
  const [apidata, setAPi] = useState({});
  const [revCode, setRevcode] = useState("");
  const [terminal, setTer] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [activeOutputTab, setActiveOutputTab] = useState("testcases");
  const [customInput, setCustomInput] = useState("[2,7,11,15]\n9");
  const [customOutput, setCustomOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [code, setCode] = useState(`def twoSum(nums, target):
    # Write your solution here
    pass`);
  const [analysis, setAnalysis] = useState("");

  const problemData = {
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: null
      }
    ],
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109",
      "Only one valid answer exists."
    ],
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "[0,1]"
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "[1,2]"
      }
    ]
  };

  // Run code with custom input
  async function runCode(input = "") {
    console.log("=== RUN CODE STARTED ===");
    console.log("Input:", input);
    console.log("Code:", code);
    
    setIsRunning(true);
    setCustomOutput("Running...");
    
    try {
      console.log("Making API call to /compilecode...");
      const response = await axios.post("/compilecode", {
        code: code,
        input: input,
        lang: "Python",
      });
      
      console.log("Run Code Response:", response.data);
      setCustomOutput(response.data.output);
      console.log("Output set successfully");
    } catch (error) {
      console.error("Run Code Error:", error);
      console.error("Error details:", error.response?.data || error.message);
      setCustomOutput("Error: " + error.message);
    } finally {
      setIsRunning(false);
      console.log("=== RUN CODE COMPLETED ===");
    }
  }

  // Submit code for test cases
  async function submitCode() {
    console.log("=== SUBMIT CODE STARTED ===");
    console.log("Code:", code);
    
    setIsSubmitting(true);
    setTer("Running test cases...");
    
    try {
      console.log("Making API call to /compilecode for submission...");
      const response = await axios.post("/compilecode", {
        code: code,
        input: "",
        lang: "Python",
      });
      
      console.log("Submit Code Response:", response.data);
      setTer(response.data.output);
      console.log("Test results set successfully");
    } catch (error) {
      console.error("Submit Code Error:", error);
      console.error("Error details:", error.response?.data || error.message);
      setTer("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
      console.log("=== SUBMIT CODE COMPLETED ===");
    }
  }

  // Editor change
  function handleEditorChange(value) {
    console.log("Editor changed, new code length:", value?.length);
    setCode(value);
  }

  // Custom input change
  function handleInputChange(e) {
    console.log("Custom input changed:", e.target.value);
    setCustomInput(e.target.value);
  }

  // AI Analysis - Main function
  const analyzeCode = async () => {
    console.log("=== AI ANALYSIS STARTED ===");
    console.log("Code to analyze:", code);
    
    setActiveOutputTab("analysis");
    setIsAnalyzing(true);
    setAnalysis("Analyzing your code...");
    
    try {
      console.log("Making API call to /compilecodeai...");
      const response = await axios.post("/compilecodeai", {
        code: code
      });
      
      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);
      
      // Check for different possible response formats
      if (response.data && response.data.anaylsis) {
        console.log("Analysis found in response.data.anaylsis");
        setAnalysis(response.data.anaylsis);
      } else if (response.data && response.data.analysis) {
        console.log("Analysis found in response.data.analysis");
        setAnalysis(response.data.analysis);
      } else if (response.data && typeof response.data === 'string') {
        console.log("Analysis is a direct string");
        setAnalysis(response.data);
      } else {
        console.warn("Unexpected response format:", response.data);
        setAnalysis("No analysis available. Response format: " + JSON.stringify(response.data));
      }
      
      console.log("Analysis state updated successfully");
    } catch (error) {
      console.error("Analysis Error:", error);
      console.error("Error Response:", error.response?.data);
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
      setAnalysis(`Error during analysis: ${error.message}\n\nDetails: ${JSON.stringify(error.response?.data || {})}`);
    } finally {
      setIsAnalyzing(false);
      console.log("=== AI ANALYSIS COMPLETED ===");
    }
  };

  // Old AI function (kept for backwards compatibility if needed)
  function ai() {
    console.log("=== OLD AI FUNCTION CALLED ===");
    console.log("Note: This function is deprecated. Use analyzeCode() instead.");
    
    setActiveOutputTab("analysis");
    setRevcode("Analyzing code...");
    
    axios
      .post("/compilecodeai", {
        code: code,
      })
      .then(function (response) {
        console.log("Old AI Response:", response.data);
        setRevcode(response.data.anaylsis);
      })
      .catch(function (error) {
        console.error("Old AI Error:", error);
        setRevcode("Error getting AI analysis: " + error.message);
      });
  }

  return (
    <div className="leetcode-layout">
      {/* Problem Description Panel */}
      <div className="description-panel">
        <div className="problem-header">
          <h1>{problemData.title}</h1>
          <span className={`difficulty ${problemData.difficulty.toLowerCase()}`}>
            {problemData.difficulty}
          </span>
        </div>

        <div className="description-tabs">
          <button
            className={`tab ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab ${activeTab === "solution" ? "active" : ""}`}
            onClick={() => setActiveTab("solution")}
          >
            Solution
          </button>
          <button
            className={`tab ${activeTab === "submissions" ? "active" : ""}`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
        </div>

        <div className="description-content">
          <div className="problem-description">
            {problemData.description}
          </div>

          <div className="examples-section">
            <h3>Examples:</h3>
            {problemData.examples.map((example, index) => (
              <div key={index} className="example-box">
                <div className="example-header">Example {index + 1}:</div>
                <div className="example-content">
                  <div className="example-input">
                    <strong>Input:</strong> {example.input}
                  </div>
                  <div className="example-output">
                    <strong>Output:</strong> {example.output}
                  </div>
                  {example.explanation && (
                    <div className="example-explanation">
                      <strong>Explanation:</strong> {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="constraints-section">
            <h3>Constraints:</h3>
            <ul>
              {problemData.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Code Editor and Output Panel */}
      <div className="editor-panel">
        <div className="editor-header">
          <div className="editor-controls">
            <select className="language-select" defaultValue="Python">
              <option value="Python">Python</option>
            </select>
            <button className="theme-toggle">
              <i className="fas fa-moon"></i>
            </button>
          </div>
          <div className="editor-actions">
            <button
              className={`action-button submit-btn ${isSubmitting ? "disabled" : ""}`}
              onClick={submitCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              className={`action-button run-btn ${isRunning ? "disabled" : ""}`}
              onClick={() => runCode(customInput)}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run"}
            </button>
            <button
              className={`action-button analyze-btn ${isAnalyzing ? "disabled" : ""}`}
              onClick={analyzeCode}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="code-editor">
          <Editor
            height="50vh"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 4,
              renderLineHighlight: "all",
              matchBrackets: "always",
              autoClosingBrackets: "always",
              rulers: [80],
              wordWrap: "on",
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>

        {/* Output Tabs and Panels */}
        <div className="output-section">
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeOutputTab === "testcases" ? "active" : ""}`}
              onClick={() => setActiveOutputTab("testcases")}
            >
              Test Cases
            </button>
            <button
              className={`tab-button ${activeOutputTab === "custom" ? "active" : ""}`}
              onClick={() => setActiveOutputTab("custom")}
            >
              Custom Input
            </button>
            <button
              className={`tab-button ${activeOutputTab === "analysis" ? "active" : ""}`}
              onClick={() => setActiveOutputTab("analysis")}
            >
              Analysis
            </button>
          </div>

          <div className="output-content">
            {activeOutputTab === "testcases" && (
              <div className="test-cases-output">
                <div className="test-case-header">
                  <span>Test Results</span>
                  <span className="test-stats">
                    {isSubmitting ? "Running..." : "Accepted: 0/2 | Runtime: -- | Memory: --"}
                  </span>
                </div>
                <div className="test-case-results">
                  {terminal ? (
                    <div className="result-box">
                      <pre className="terminal-output">{terminal}</pre>
                    </div>
                  ) : (
                    <div className="test-placeholder">
                      Click "Submit" to run all test cases
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeOutputTab === "custom" && (
              <div className="custom-test-panel">
                <div className="custom-input-section">
                  <div className="section-header">
                    <span>Input:</span>
                    <button
                      className="run-custom-btn"
                      onClick={() => runCode(customInput)}
                      disabled={isRunning}
                    >
                      {isRunning ? "Running..." : "Run"}
                    </button>
                  </div>
                  <textarea
                    value={customInput}
                    onChange={handleInputChange}
                    placeholder="Enter your test case here..."
                    className="custom-input"
                  />
                </div>
                <div className="custom-output-section">
                  <div className="section-header">Output:</div>
                  <div className="result-box">
                    {customOutput ? (
                      <pre className="custom-output">{customOutput}</pre>
                    ) : (
                      <div className="output-placeholder">
                        Output will appear here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeOutputTab === "analysis" && (
              <div className="analysis-output">
                <div className="analysis-header">
                  <span>AI Analysis</span>
                  {isAnalyzing && <span className="analyzing-indicator"> - Analyzing...</span>}
                </div>
                {analysis ? (
                  <div className="result-box">
                    <pre>{analysis}</pre>
                  </div>
                ) : (
                  <div className="analysis-placeholder">
                    Click "Analyze" to get AI insights
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compiler2;