
import React from 'react';
import { type Question, type UserAnswer, AnswerStatus } from '../types';
import { AnsweredIcon, NotAnsweredIcon, MarkedForReviewIcon, NotVisitedIcon, AnsweredAndMarkedIcon } from './icons';

interface RightSidebarProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentQIndex: number;
  onQuestionSelect: (index: number) => void;
  onSubmit?: () => void;
  isReviewMode?: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ questions, userAnswers, currentQIndex, onQuestionSelect, onSubmit, isReviewMode = false }) => {
  const getStatusClass = (status: AnswerStatus, index: number) => {
    const baseClass = 'w-9 h-9 flex items-center justify-center rounded font-bold text-sm cursor-pointer transition-all duration-200 border-2';
    const activeClass = index === currentQIndex ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110';
    
    switch (status) {
      case AnswerStatus.ANSWERED:
        return `${baseClass} ${activeClass} bg-green-500 border-green-600 text-white`;
      case AnswerStatus.NOT_ANSWERED:
        return `${baseClass} ${activeClass} bg-red-500 border-red-600 text-white`;
      case AnswerStatus.MARKED_FOR_REVIEW:
        return `${baseClass} ${activeClass} bg-purple-500 border-purple-600 text-white`;
      case AnswerStatus.ANSWERED_AND_MARKED:
        return `${baseClass} ${activeClass} bg-purple-500 border-purple-600 text-white relative`; // Icon added separately
      case AnswerStatus.NOT_VISITED:
        return `${baseClass} ${activeClass} bg-gray-200 border-gray-300 text-gray-700`;
      default:
        return '';
    }
  };

  const statusCounts = userAnswers.reduce((acc, ans) => {
      acc[ans.status] = (acc[ans.status] || 0) + 1;
      return acc;
  }, {} as Record<AnswerStatus, number>);

  return (
    <aside className="w-80 bg-white shadow-lg p-4 flex flex-col border-l border-gray-200 overflow-y-auto">
      <div className="p-3 bg-gray-50 rounded-lg mb-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center"><AnsweredIcon /> <span className="ml-2">Answered ({statusCounts[AnswerStatus.ANSWERED] || 0})</span></div>
          <div className="flex items-center"><NotAnsweredIcon /> <span className="ml-2">Not Answered ({statusCounts[AnswerStatus.NOT_ANSWERED] || 0})</span></div>
          <div className="flex items-center"><NotVisitedIcon /> <span className="ml-2">Not Visited ({statusCounts[AnswerStatus.NOT_VISITED] || 0})</span></div>
          <div className="flex items-center"><MarkedForReviewIcon /> <span className="ml-2">Marked ({statusCounts[AnswerStatus.MARKED_FOR_REVIEW] || 0})</span></div>
          <div className="flex items-center col-span-2"><AnsweredAndMarkedIcon /> <span className="ml-2">Answered & Marked ({statusCounts[AnswerStatus.ANSWERED_AND_MARKED] || 0})</span></div>
        </div>
      </div>
      
      <div className="flex-1 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-bold text-blue-800 mb-3 text-center">Choose a Question</h3>
        <div className="grid grid-cols-5 gap-3">
          {questions.map((_, index) => (
            <div
              key={index}
              onClick={() => onQuestionSelect(index)}
              className={getStatusClass(userAnswers[index].status, index)}
            >
              {userAnswers[index].status === AnswerStatus.ANSWERED_AND_MARKED && 
                <div className="absolute bottom-0 right-0 transform translate-x-1 translate-y-1 bg-green-500 rounded-full h-3 w-3 border-2 border-white"></div>
              }
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      
      {!isReviewMode && onSubmit && (
          <div className="mt-auto pt-4">
              <button onClick={onSubmit} className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition">Submit Test</button>
          </div>
      )}
    </aside>
  );
};

export default RightSidebar;
