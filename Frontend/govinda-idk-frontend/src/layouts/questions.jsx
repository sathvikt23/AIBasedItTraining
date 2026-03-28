import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./style.css";

function QuizApp({ metadata = {}, data }) {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ once true, never goes false — keeps UI visible
  const [hasQuizLoaded, setHasQuizLoaded] = useState(false);

  // ================= FETCH QUIZ =================
  const getQuestions = async () => {
    if (!data) return;

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:8082/ai/genques", {
        text: data,
      });

      const raw = response.data?.questions;

      let questions = [];
      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        questions = parsed.questions || [];
      }

      setQuizData(questions);
      setCurrentQuestion(0);
      setScore(0);
      setIncorrectAnswers([]);
      setShowResult(false);
      setSelectedOption("");

      // ⭐ once true, never false
      setHasQuizLoaded(true);
    } catch (e) {
      console.error("Quiz fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ================= EDGE ACTION DETECTOR =================
  const prevActionsRef = useRef({});

  useEffect(() => {
    const actions = metadata?.actions || {};
    const prev = prevActionsRef.current;

    const isTrue = (v) => v === true || v === "true";
    const becameTrue = (name) => isTrue(actions[name]) && !isTrue(prev[name]);

    if (becameTrue("gen_quiz")) {
      getQuestions();
      // ⭐ reset to false so next true triggers again
      prevActionsRef.current = { ...actions, gen_quiz: false };
      return;
    }

    prevActionsRef.current = { ...actions };
  }, [metadata]);

  // ================= QUIZ LOGIC =================
  const current = quizData[currentQuestion];

  const checkAnswer = () => {
    if (!current || !selectedOption) return;

    if (selectedOption === current.answer) {
      setScore((s) => s + 1);
    } else {
      setIncorrectAnswers((arr) => [
        ...arr,
        {
          question: current.question,
          incorrectAnswer: selectedOption,
          correctAnswer: current.answer,
        },
      ]);
    }

    setSelectedOption("");

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setShowResult(true);
    }
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIncorrectAnswers([]);
    setShowResult(false);
    setSelectedOption("");
  };

  const actionFlag = metadata?.actions?.gen_quiz;
  const isGenQuizTrue = actionFlag === true || actionFlag === "true";

  // ================= RENDER =================
  return (
    <div>
      <button onClick={getQuestions} className="inline-btn" disabled={loading}>
        {loading
          ? "Generating Quiz, Please wait..."
          : isGenQuizTrue
          ? "Generate Quiz again"
          : "Generate Quiz"}
      </button>

      {/* ⭐ NEVER UNMOUNT after first load */}
      {hasQuizLoaded && quizData.length > 0 && (
        <section className="watch-video">
          <div className="video-container">
            <h1>Quiz</h1>

            {showResult ? (
              <div className="result">
                <p>
                  You scored {score} / {quizData.length}
                </p>

                {incorrectAnswers.map((a, i) => (
                  <div key={i}>
                    <p>
                      <strong>Q:</strong> {a.question}
                      <br />
                      <strong>Your:</strong> {a.incorrectAnswer}
                      <br />
                      <strong>Correct:</strong> {a.correctAnswer}
                    </p>
                  </div>
                ))}

                <button onClick={retryQuiz} className="inline-btn">
                  Retry
                </button>
              </div>
            ) : (
              current && (
                <div>
                  <div className="question">{current.question}</div>

                  <div className="options">
                    {current.choices?.map((choice, i) => (
                      <label key={i} className="option">
                        <input
                          type="radio"
                          name="quiz"
                          value={choice}
                          checked={selectedOption === choice}
                          onChange={() => setSelectedOption(choice)}
                        />
                        {choice}
                      </label>
                    ))}
                  </div>

                  <button onClick={checkAnswer} className="inline-btn">
                    Submit
                  </button>
                </div>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default QuizApp;