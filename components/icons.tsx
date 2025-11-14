
import React from 'react';

export const AnsweredIcon: React.FC = () => (
  <div className="w-5 h-5 bg-green-500 rounded-md border border-green-600"></div>
);

export const NotAnsweredIcon: React.FC = () => (
  <div className="w-5 h-5 bg-red-500 rounded-full border border-red-600"></div>
);

export const NotVisitedIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-200 rounded-sm border border-gray-400"></div>
);

export const MarkedForReviewIcon: React.FC = () => (
  <div className="w-5 h-5 bg-purple-500 rounded-full border border-purple-600"></div>
);

export const AnsweredAndMarkedIcon: React.FC = () => (
    <div className="relative">
        <div className="w-5 h-5 bg-purple-500 rounded-full border border-purple-600"></div>
        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full h-2.5 w-2.5 border border-white"></div>
    </div>
);
