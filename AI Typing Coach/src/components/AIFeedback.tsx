import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { AIFeedback as AIFeedbackType } from '../types';

interface AIFeedbackProps {
  feedback: AIFeedbackType;
}

export const AIFeedback: React.FC<AIFeedbackProps> = ({ feedback }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-success/10 border-success/20';
    if (score >= 60) return 'bg-warning/10 border-warning/20';
    return 'bg-error/10 border-error/20';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Brain className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">AI Coach Feedback</h3>
          <p className="text-gray-600 text-sm">Personalized insights to improve your typing</p>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`rounded-xl p-4 border mb-6 ${getScoreBackground(feedback.overallScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Overall Performance</h4>
            <p className="text-sm text-gray-600">Your current typing assessment</p>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
            {feedback.overallScore}/100
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <h4 className="font-semibold text-gray-800">Strengths</h4>
          </div>
          <div className="space-y-2">
            {feedback.strengths.length > 0 ? (
              feedback.strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{strength}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Keep practicing to develop your strengths!</p>
            )}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h4 className="font-semibold text-gray-800">Areas to Improve</h4>
          </div>
          <div className="space-y-2">
            {feedback.weaknesses.length > 0 ? (
              feedback.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{weakness}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Great job! No major areas of concern.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-primary-600" />
          <h4 className="font-semibold text-gray-800">Recommendations</h4>
        </div>
        <div className="space-y-2">
          {feedback.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Goal */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-5 h-5 text-primary-600" />
          <h4 className="font-semibold text-primary-800">Your Next Goal</h4>
        </div>
        <p className="text-primary-700 font-medium">{feedback.nextGoal}</p>
      </div>

      {/* Difficulty Adjustment Suggestion */}
      {feedback.difficultyAdjustment !== 'maintain' && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">AI Suggestion:</span>{' '}
            {feedback.difficultyAdjustment === 'increase'
              ? 'You\'re ready for more challenging texts! 🚀'
              : 'Consider practicing with easier texts to build confidence. 💪'}
          </p>
        </div>
      )}
    </div>
  );
};