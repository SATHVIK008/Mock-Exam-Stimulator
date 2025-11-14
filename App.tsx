import React, { useState, useCallback } from 'react';
import InputScreen from './components/InputScreen';
import ExamScreen from './components/ExamScreen';
import ResultsScreen from './components/ResultsScreen';
import ReviewScreen from './components/ReviewScreen';
import { type Question, type UserAnswer, ExamState, SectionName } from './types';
import { AnswerStatus } from './types';

const App: React.FC = () => {
  const [examState, setExamState] = useState<ExamState>(ExamState.INPUT);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<SectionName[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeTaken, setTimeTaken] = useState<number>(0);

  const startExam = useCallback((parsedQuestions: Question[], examSections: SectionName[]) => {
    // Don't shuffle questions to maintain section order
    setQuestions(parsedQuestions);
    setSections(examSections);
    setUserAnswers(
      Array(parsedQuestions.length)
        .fill(null)
        .map(() => ({ answer: null, status: AnswerStatus.NOT_VISITED }))
    );
    setExamState(ExamState.EXAM);
  }, []);

  const finishExam = useCallback((finalAnswers: UserAnswer[], time: number) => {
    setUserAnswers(finalAnswers);
    setTimeTaken(time);
    setExamState(ExamState.RESULTS);
  }, []);

  const reviewExam = useCallback(() => {
    setExamState(ExamState.REVIEW);
  }, []);

  const finishReview = useCallback(() => {
    setExamState(ExamState.RESULTS);
  }, []);
  
  const startNewExam = useCallback(() => {
    setQuestions([]);
    setUserAnswers([]);
    setSections([]);
    setTimeTaken(0);
    setExamState(ExamState.INPUT);
  }, []);


  const renderScreen = () => {
    switch (examState) {
      case ExamState.INPUT:
        return <InputScreen onStartExam={startExam} />;
      case ExamState.EXAM:
        return <ExamScreen allQuestions={questions} sections={sections} initialAnswers={userAnswers} onFinishExam={finishExam} />;
      case ExamState.RESULTS:
        return <ResultsScreen questions={questions} sections={sections} userAnswers={userAnswers} timeTaken={timeTaken} onReviewExam={reviewExam} onStartNewExam={startNewExam}/>;
      case ExamState.REVIEW:
        return <ReviewScreen questions={questions} userAnswers={userAnswers} onFinishReview={finishReview} />;
      default:
        return <InputScreen onStartExam={startExam} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
      {renderScreen()}
    </div>
  );
};

export default App;
