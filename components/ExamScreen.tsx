import React, { useState, useEffect, useCallback, useRef } from 'react';
import { type Question, type UserAnswer, AnswerStatus, SectionName } from '../types';
import RightSidebar from './RightSidebar';
import Timer from './Timer';
import QuestionDisplay from './QuestionDisplay';
import { TIME_PER_SECTION_SECONDS } from '../constants';

interface ExamScreenProps {
  allQuestions: Question[];
  sections: SectionName[];
  initialAnswers: UserAnswer[];
  onFinishExam: (answers: UserAnswer[], timeTaken: number) => void;
}

const ExamScreen: React.FC<ExamScreenProps> = ({ allQuestions, sections, initialAnswers, onFinishExam }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0); // This is the global index
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(initialAnswers);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_SECTION_SECONDS);

  const answersRef = useRef(userAnswers);
  useEffect(() => {
    answersRef.current = userAnswers;
  }, [userAnswers]);

  const currentSection = sections[currentSectionIndex];
  const sectionQuestions = allQuestions.filter(q => q.section === currentSection);
  const globalIndexOffset = allQuestions.findIndex(q => q.section === currentSection);

  const endExam = useCallback((timedOut = false) => {
    if (timedOut && currentSectionIndex < sections.length - 1) return; // Not the final timeout

    if (timedOut) {
      alert("Time's Up! The exam has been automatically submitted.");
    } else {
        const confirmed = window.confirm('Are you sure you want to submit the exam?');
        if (!confirmed) return;
    }
    
    const finalAnswers = answersRef.current.map(ans => ans.status === AnswerStatus.NOT_VISITED ? { ...ans, status: AnswerStatus.NOT_ANSWERED } : ans);
    const totalTime = sections.length * TIME_PER_SECTION_SECONDS;
    onFinishExam(finalAnswers, totalTime - timeLeft);
  }, [onFinishExam, timeLeft, sections.length, currentSectionIndex]);

  const handleSectionEnd = useCallback(() => {
    if (currentSectionIndex < sections.length - 1) {
      alert(`Time's up for ${currentSection}! Moving to the next section.`);
      const nextSectionIndex = currentSectionIndex + 1;
      const nextSectionGlobalIndex = allQuestions.findIndex(q => q.section === sections[nextSectionIndex]);
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentQIndex(nextSectionGlobalIndex);
      setTimeLeft(TIME_PER_SECTION_SECONDS);
    } else {
      endExam(true);
    }
  }, [currentSectionIndex, sections, currentSection, allQuestions, endExam]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSectionEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSectionEnd]);
  
  useEffect(() => {
     if (userAnswers[currentQIndex].status === AnswerStatus.NOT_VISITED) {
         updateAnswer(currentQIndex, userAnswers[currentQIndex].answer, AnswerStatus.NOT_ANSWERED);
     }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQIndex]);

  const updateAnswer = (index: number, answer: string | null, status: AnswerStatus) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = { answer, status };
      return newAnswers;
    });
  };

  const handleOptionChange = (option: string) => {
    const currentStatus = userAnswers[currentQIndex].status;
    const newStatus = currentStatus === AnswerStatus.MARKED_FOR_REVIEW || currentStatus === AnswerStatus.ANSWERED_AND_MARKED 
      ? AnswerStatus.ANSWERED_AND_MARKED 
      : AnswerStatus.ANSWERED;
    updateAnswer(currentQIndex, option, newStatus);
  };
  
  const handleClearResponse = () => {
    const currentStatus = userAnswers[currentQIndex].status;
    const newStatus = currentStatus === AnswerStatus.ANSWERED_AND_MARKED
      ? AnswerStatus.MARKED_FOR_REVIEW
      : AnswerStatus.NOT_ANSWERED;
    updateAnswer(currentQIndex, null, newStatus);
  };

  const navigateToQuestion = (localIndex: number) => {
      const globalIndex = globalIndexOffset + localIndex;
    if (globalIndex >= 0 && globalIndex < allQuestions.length) {
      setCurrentQIndex(globalIndex);
    }
  };
  
  const handleSaveAndNext = () => {
      const localIndex = currentQIndex - globalIndexOffset;
      if (localIndex < sectionQuestions.length - 1) {
          navigateToQuestion(localIndex + 1);
      }
  };
  
  const handleMarkForReviewAndNext = () => {
      const currentAnswer = userAnswers[currentQIndex];
      const newStatus = currentAnswer.answer ? AnswerStatus.ANSWERED_AND_MARKED : AnswerStatus.MARKED_FOR_REVIEW;
      updateAnswer(currentQIndex, currentAnswer.answer, newStatus);
      handleSaveAndNext();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-md p-3 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold text-blue-700">CAT Mock Test</h1>
        <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
                {sections.map((sec, index) => (
                    <button key={sec} className={`px-4 py-2 text-sm font-semibold rounded-md focus:outline-none ${index === currentSectionIndex ? 'text-white bg-blue-600' : 'text-gray-600 bg-gray-200 cursor-not-allowed'}`}>{sec}</button>
                ))}
            </div>
            <Timer timeLeft={timeLeft} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm flex-1 flex flex-col">
                <QuestionDisplay
                    question={allQuestions[currentQIndex]}
                    userAnswer={userAnswers[currentQIndex]}
                    onOptionChange={handleOptionChange}
                    reviewMode={false}
                    questionNumber={currentQIndex - globalIndexOffset + 1}
                />
            </div>
             <footer className="mt-4 bg-white p-3 rounded-lg shadow-inner sticky bottom-0 border-t">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-2 mb-2 md:mb-0">
                        <button onClick={handleMarkForReviewAndNext} className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded hover:bg-purple-700 transition">Mark for Review & Next</button>
                        <button onClick={handleClearResponse} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition">Clear Response</button>
                    </div>
                    <button onClick={handleSaveAndNext} className="px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition transform hover:scale-105">Save & Next</button>
                </div>
            </footer>
        </main>
        
        <RightSidebar
            questions={sectionQuestions}
            userAnswers={userAnswers.slice(globalIndexOffset, globalIndexOffset + sectionQuestions.length)}
            currentQIndex={currentQIndex - globalIndexOffset}
            onQuestionSelect={navigateToQuestion}
            onSubmit={endExam}
        />
      </div>
    </div>
  );
};

export default ExamScreen;
