// src/pages/menusections/speakeasy/utils/questionUtils.js

/**
 * Get a random subset of questions
 * @param {Array} questions - Array of question objects
 * @param {number} count - Number of questions to return
 * @returns {Array} Random subset of questions
 */
export const getRandomQuestions = (questions, count = 5) => {
    if (!Array.isArray(questions) || questions.length === 0) {
      return [];
    }
    
    // Make a copy to avoid mutating original array
    const shuffled = [...questions]
      .sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, Math.min(count, questions.length));
  };
  
  /**
   * Get questions by category
   * @param {Array} questions - Array of question objects
   * @param {string} category - Category to filter by
   * @returns {Array} Filtered questions
   */
  export const getQuestionsByCategory = (questions, category) => {
    if (!Array.isArray(questions) || !category) {
      return [];
    }
    
    return questions.filter(q => q.category === category);
  };
  
  /**
   * Shuffle an array of answers
   * @param {Array} answers - Array of answer strings
   * @returns {Array} Shuffled answers
   */
  export const shuffleAnswers = (answers) => {
    return [...answers].sort(() => Math.random() - 0.5);
  };
  
  /**
   * Check if a question-answer pair is correct
   * @param {Object} question - Question object
   * @param {string} answer - Selected answer
   * @returns {boolean} Whether the pair is correct
   */
  export const checkAnswer = (question, answer) => {
    if (!question || !answer) {
      return false;
    }
    return question.answer === answer;
  };
