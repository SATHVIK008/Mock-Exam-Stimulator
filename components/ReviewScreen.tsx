
import React, { useState } from 'react';
import { type Question, type UserAnswer } from '../types';
import RightSidebar from './RightSidebar';
import QuestionDisplay from './QuestionDisplay';

interface ReviewScreenProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onFinishReview: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ questions, userAnswers, onFinishReview }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQIndex(index);
    }
  };

  const handleNext = () => {
      if(currentQIndex < questions.length - 1) {
          setCurrentQIndex(prev => prev + 1);
      }
  }

  const handlePrev = () => {
      if(currentQIndex > 0) {
          setCurrentQIndex(prev => prev - 1);
      }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-md p-3 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold text-blue-700">Reviewing Answers</h1>
        <button onClick={onFinishReview} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Back to Results</button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm flex-1 flex flex-col">
                <QuestionDisplay
                    question={questions[currentQIndex]}
                    userAnswer={userAnswers[currentQIndex]}
                    onOptionChange={() => {}} // No-op in review mode
                    reviewMode={true}
                    questionNumber={currentQIndex + 1}
                />
            </div>
             <footer className="mt-4 bg-gray-50 p-3 rounded-lg shadow-inner sticky bottom-0">
                <div className="flex items-center justify-between">
                    <button onClick={handlePrev} disabled={currentQIndex === 0} className="px-6 py-3 text-base font-bold text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 transition">Previous</button>
                    <button onClick={handleNext} disabled={currentQIndex === questions.length - 1} className="px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition">Next</button>
                </div>
            </footer>
        </main>
        
        <RightSidebar
            questions={questions}
            userAnswers={userAnswers}
            currentQIndex={currentQIndex}
            onQuestionSelect={navigateToQuestion}
            isReviewMode={true}
        />
      </div>
    </div>
  );
};

export default ReviewScreen;
