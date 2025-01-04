import React, { useState, useEffect } from 'react';
import '../styles/speakeasy.css';
import { 
  getRandomQuestions, 
  shuffleAnswers, 
  checkAnswer 
} from '../utils/questionUtils';

const EntranceQuiz = ({ onAccessGranted }) => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (allQuestions.length > 0) {
      const randomSet = getRandomQuestions(allQuestions, 5);
      setDisplayQuestions(randomSet);
    }
  }, [allQuestions]);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/speakeasy/questions');
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load questions');
      }
      setAllQuestions(data.questions);
      setError(null);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Could not load the gateway questions. Please try again later.');
    }
  };

  const handleCheck = () => {
    if (!selectedQuestion || !selectedAnswer) {
      setError('Please select both a question and an answer.');
      return;
    }

    const questionObj = displayQuestions.find(q => q.question === selectedQuestion);
    if (checkAnswer(questionObj, selectedAnswer)) {
      sessionStorage.setItem('speakeasyAccess', 'granted');
      onAccessGranted && onAccessGranted();
    } else {
      setError('Hmm, that\'s not quite right. Try another combination!');
    }
  };

  const getShuffledAnswers = () => {
    return shuffleAnswers(displayQuestions.map(q => q.answer));
  };

  return (
    <div className="speakeasy-gateway">
      <header className="guide-header">
        <div className="guide-container">
          <h1>Welcome to the Tangible Speakeasy</h1>
          <p>Where work meets play and creativity knows no bounds.</p>
          <p>To enter, choose one question and its matching answer.</p>
        </div>
      </header>

      <div className="guide-principle-section">
        <div className="entrance-grid">
          <div className="guide-principle-box questions-column">
         
          <h2>Opening Questions</h2>
            <div className="guide-outcome-list">
              {displayQuestions.map((question, index) => (
                <div key={`q-${index}`} className="option question-option">
                  <input
                    type="radio"
                    name="question"
                    id={`q${index}`}
                    value={question.question}
                    checked={selectedQuestion === question.question}
                    onChange={() => {
                      setSelectedQuestion(question.question);
                      setError(null);
                    }}
                  />
                  <label htmlFor={`q${index}`}>{question.question}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="guide-principle-box answers-column">
            <h2>Possible Answers</h2>
            <div className="guide-outcome-list">
              {getShuffledAnswers().map((answer, index) => (
                <div key={`a-${index}`} className="option answer-option">
                  <input
                    type="radio"
                    name="answer"
                    id={`a${index}`}
                    value={answer}
                    checked={selectedAnswer === answer}
                    onChange={() => {
                      setSelectedAnswer(answer);
                      setError(null);
                    }}
                  />
                  <label htmlFor={`a${index}`}>{answer}</label>
                </div>
              ))}
            </div>
          </div>
        </div>   

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <div className="entrance-footer">
          <button 
            onClick={handleCheck} 
            className="btn btn-primary check-answers-btn"
          >
          Make it so
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntranceQuiz;
