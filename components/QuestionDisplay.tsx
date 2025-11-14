import React from 'react';
import { type Question, type UserAnswer } from '../types';

interface QuestionDisplayProps {
  question: Question;
  userAnswer: UserAnswer;
  onOptionChange: (option: string) => void;
  reviewMode: boolean;
  questionNumber: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, userAnswer, onOptionChange, reviewMode, questionNumber }) => {
  const getOptionClass = (option: string) => {
    if (!reviewMode) {
      return userAnswer.answer === option
        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
        : 'border-gray-300 bg-white hover:bg-gray-50';
    }

    const isCorrect = option === question.correct;
    const isSelected = option === userAnswer.answer;

    if (isCorrect) {
      return 'border-green-500 bg-green-100 ring-2 ring-green-500';
    }
    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-100 ring-2 ring-red-500';
    }
    return 'border-gray-300 bg-gray-50 cursor-not-allowed';
  };

  const getReviewIcon = (option: string) => {
    if (!reviewMode) return null;
    
    const isCorrect = option === question.correct;
    const isSelected = option === userAnswer.answer;

    if (isCorrect) {
        return <span className="ml-auto text-green-700 font-bold">✓ Correct</span>;
    }
    if (isSelected && !isCorrect) {
        return <span className="ml-auto text-red-700 font-bold">✗ Your Answer</span>;
    }
    return null;
  };

  const hasContext = !!(question.passage || question.image);

  const QuestionContent = () => (
    <>
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-500">Section: {question.section}</p>
        <h2 className="text-lg font-bold text-gray-800">Question No. {questionNumber}</h2>
        <p className="mt-1 text-red-600 text-sm font-semibold">Type: MCQ | Marks: +3, -1</p>
      </div>
      {/* whitespace-pre-wrap allows line breaks in question text to be rendered */}
      <div className="prose max-w-none mb-6 whitespace-pre-wrap">
        <p>{question.question}</p>
      </div>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${getOptionClass(option)}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={userAnswer.answer === option}
              onChange={() => onOptionChange(option)}
              disabled={reviewMode}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 mr-4"
            />
            <span className="flex-1 text-gray-700">{option}</span>
            {getReviewIcon(option)}
          </label>
        ))}
      </div>
    </>
  );

  if (!hasContext) {
    return (
      <div className="flex-1 flex flex-col">
        <QuestionContent />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
      {/* Left Pane: Context */}
      <div className="w-full md:w-1/2 bg-gray-50 p-4 rounded-lg border overflow-y-auto">
        {question.image && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Set Information</h3>
            {question.passage && <p className="prose prose-sm max-w-none text-gray-600 mb-4 whitespace-pre-wrap">{question.passage}</p>}
            <img src={question.image} alt="Question context" className="rounded-md w-full object-contain" />
          </div>
        )}
        {question.passage && !question.image && (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            <h3 className="font-semibold text-gray-700 mb-2">Passage</h3>
            {question.passage}
          </div>
        )}
      </div>
      {/* Right Pane: Question */}
      <div className="w-full md:w-1/2 flex flex-col overflow-y-auto pr-2">
        <QuestionContent />
      </div>
    </div>
  );
};

export default QuestionDisplay;
