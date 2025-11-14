import React, { useMemo } from 'react';
import { type Question, type UserAnswer, AnswerStatus, SectionName } from '../types';
import { MARKING_SCHEME, TIME_PER_SECTION_SECONDS } from '../constants';

interface ResultsScreenProps {
  questions: Question[];
  sections: SectionName[];
  userAnswers: UserAnswer[];
  timeTaken: number;
  onReviewExam: () => void;
  onStartNewExam: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, sections, userAnswers, timeTaken, onReviewExam, onStartNewExam }) => {
  const scoreDetails = useMemo(() => {
    let correctCount = 0;
    let incorrectCount = 0;
    
    const sectionScores = sections.reduce((acc, sec) => {
        acc[sec] = { correct: 0, incorrect: 0, unattempted: 0, score: 0 };
        return acc;
    }, {} as Record<SectionName, { correct: number, incorrect: number, unattempted: number, score: number }>);


    questions.forEach((q, index) => {
      const userAns = userAnswers[index];
      const section = q.section;

      if (userAns.status === AnswerStatus.ANSWERED || userAns.status === AnswerStatus.ANSWERED_AND_MARKED) {
        if (userAns.answer === q.correct) {
          correctCount++;
          sectionScores[section].correct++;
        } else {
          incorrectCount++;
          sectionScores[section].incorrect++;
        }
      } else {
        sectionScores[section].unattempted++;
      }
    });

    Object.values(sectionScores).forEach(details => {
        details.score = (details.correct * MARKING_SCHEME.correct) + (details.incorrect * MARKING_SCHEME.incorrect);
    });

    const unattemptedCount = questions.length - (correctCount + incorrectCount);
    const finalScore = (correctCount * MARKING_SCHEME.correct) + (incorrectCount * MARKING_SCHEME.incorrect);
    const maxMarks = questions.length * MARKING_SCHEME.correct;
    const accuracy = correctCount + incorrectCount > 0 ? (correctCount / (correctCount + incorrectCount)) * 100 : 0;


    return { correctCount, incorrectCount, unattemptedCount, finalScore, maxMarks, accuracy, sectionScores };
  }, [questions, userAnswers, sections]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const totalTime = sections.length * TIME_PER_SECTION_SECONDS;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Exam Results</h1>
        <p className="text-gray-500 mb-6 text-center">Here is your performance summary.</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center">
            <p className="text-lg text-blue-800">Your Score</p>
            <p className="text-6xl font-extrabold text-blue-600 my-2">{scoreDetails.finalScore} <span className="text-3xl font-medium text-gray-500">/ {scoreDetails.maxMarks}</span></p>
            <p className="text-md text-blue-700">Accuracy: {scoreDetails.accuracy.toFixed(2)}%</p>
        </div>

        {sections.length > 1 && (
             <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-3 text-lg text-center">Section-wise Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sections.map(sec => (
                        <div key={sec} className="bg-gray-50 p-4 rounded-lg text-center border">
                            <h4 className="font-bold text-blue-800">{sec}</h4>
                            <p className="text-3xl font-bold my-1">{scoreDetails.sectionScores[sec].score}</p>
                            <p className="text-xs text-gray-500">
                                <span className="text-green-600">C:{scoreDetails.sectionScores[sec].correct}</span> | 
                                <span className="text-red-600"> I:{scoreDetails.sectionScores[sec].incorrect}</span> | 
                                <span className="text-gray-600"> U:{scoreDetails.sectionScores[sec].unattempted}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Overall Summary</h3>
                <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span>Correct Answers:</span> <span className="font-bold text-green-600">{scoreDetails.correctCount} (+{scoreDetails.correctCount * MARKING_SCHEME.correct})</span></li>
                    <li className="flex justify-between"><span>Incorrect Answers:</span> <span className="font-bold text-red-600">{scoreDetails.incorrectCount} ({scoreDetails.incorrectCount * MARKING_SCHEME.incorrect})</span></li>
                    <li className="flex justify-between"><span>Unattempted:</span> <span className="font-bold text-gray-600">{scoreDetails.unattemptedCount}</span></li>
                </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Time Analysis</h3>
                 <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span>Time Taken:</span> <span className="font-bold">{formatTime(timeTaken)}</span></li>
                    <li className="flex justify-between"><span>Total Duration:</span> <span className="font-bold">{formatTime(totalTime)}</span></li>
                </ul>
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
          <button 
            onClick={onReviewExam} 
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Review Answers
          </button>
          <button 
            onClick={onStartNewExam} 
            className="w-full md:w-auto px-8 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-800 transition-transform transform hover:scale-105"
          >
            Start New Exam
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultsScreen;
