
import React from 'react';

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 300; // 5 minutes warning

  return (
    <div className={`text-lg font-bold p-2 rounded-md transition-colors duration-300 ${isLowTime ? 'text-red-600 bg-red-100 border border-red-300' : 'text-gray-700 bg-gray-100'}`}>
      <span>Time Left: </span>
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
