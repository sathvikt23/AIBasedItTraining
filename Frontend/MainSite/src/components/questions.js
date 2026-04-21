
import React, { useState } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
//import './style2.css';


import './style.css';


function QuizApp(props) {
    
  
  const[check,setcheck]=useState("")
  
  const [quizData,setData] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const[works,setw]=useState(false)
  const getquestions=()=>{
    axios.post(('/genques'),{
        text:props.data
        
       })
       .then(function(response){
        let obj=JSON.parse(response.data);
        const ob=obj.questions;
        setcheck("kecvbuvwu")
        setData(ob)
        console.log(obj.questions)

       })
       .then(function (error){
        console.log(error)
       })
  }
  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  const lastcheck=quizData.length
  const checkAnswer = () => {
    if (selectedOption && currentQuestion < quizData.length) {
      const answer = selectedOption;
      if (answer === quizData[currentQuestion].answer) {
        setScore(score + 1);
      } else {
        setIncorrectAnswers([...incorrectAnswers, {
          question: quizData[currentQuestion].question,
          incorrectAnswer: answer,
          correctAnswer: quizData[currentQuestion].answer,
        }]);
      }
      setSelectedOption('');
      setCurrentQuestion(currentQuestion + 1);
      if (currentQuestion===lastcheck-1){
        setw(true)
      }
    }
  };

  const displayResult = () => {
    setShowResult(true);
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIncorrectAnswers([]);
    setShowResult(false);
    setSelectedOption('');
  };

  const showAnswer = () => {
    setShowResult(true);
  };

  return (
    <div>
<button class="inline-btn"onClick={getquestions}>Quiz</button>
 {check.length>0 && <section className="watch-video">
    <div className="video-container">
      <h1>Quiz</h1>
      {showResult ? (
        <div id="result" className="result">
          <p>You scored {score} out of {quizData.length}!</p>
          <p>Incorrect Answers:</p>
          {incorrectAnswers.map((answer, index) => (
            <div key={index}>
              <p>
                <strong >Question:</strong> {answer.question}<br />
                <strong>Your Answer:</strong> {answer.incorrectAnswer}<br />
                <strong>Correct Answer:</strong> {answer.correctAnswer}
              </p>
            </div>
          ))}
          {currentQuestion === quizData.length && (
            <>
            <button id="showAnswer" className="inline-btn" onClick={showAnswer}>Show Answer</button>
            <button id="retry" className="inline-btn" onClick={retryQuiz}>Retry</button>
  </>
          )}
        </div>
      ) : (
        <div id="quiz">
          {currentQuestion < quizData.length && (
            <>
              <div className="question">{quizData[currentQuestion].question}</div>
              <div className="options">
                {quizData[currentQuestion].choices.map((choice, index) => (
                  <label key={index} className="option">
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
              <button id="submit" className="inline-btn" onClick={checkAnswer}>Submit</button>
              
  
            </>
          )}
        </div>
      )}
      {!showResult && (
      <div>

  
         </div>
      )}
      {works&&!showResult && (
      <div>
    
         <button id="retry" className="inline-btn" onClick={displayResult}>Show answer</button>
  
         </div>
      )}
      
    </div>
    </section>}
    </div>
  );
  
}

export default QuizApp;
