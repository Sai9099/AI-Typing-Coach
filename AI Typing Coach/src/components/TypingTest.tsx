import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, Play, Pause } from 'lucide-react';
import { useTypingTest } from '../hooks/useTypingTest';
import { TypingStats } from '../types';
import { StatsDisplay } from './StatsDisplay';
import { TextDisplay } from './TextDisplay';

interface TypingTestProps {
  text: string;
  duration?: number;
  onComplete: (stats: TypingStats, incorrectWords: string[]) => void;
  onReset?: () => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  text,
  duration,
  onComplete,
  onReset,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  
  const {
    currentInput,
    handleInputChange,
    stats,
    isComplete,
    reset,
    words,
    currentWordIndex,
    timeLeft,
    startTime,
  } = useTypingTest({
    text,
    duration,
    onComplete,
  });

  const handleReset = () => {
    reset();
    onReset?.();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const progress = text ? (currentInput.length / text.length) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {duration && (
            <div className="flex items-center space-x-2 text-primary-600">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">
                {timeLeft !== undefined ? `${timeLeft}s` : `${Math.floor(duration)}s`}
              </span>
            </div>
          )}
          <div className="text-sm text-gray-500">
            Progress: {Math.round(progress)}%
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {startTime && !isComplete && (
            <button
              onClick={togglePause}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="text-sm">{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats Display */}
      <StatsDisplay stats={stats} />

      {/* Text Display */}
      <div className="mb-6">
        <TextDisplay
          text={text}
          currentInput={currentInput}
          words={words}
          currentWordIndex={currentWordIndex}
        />
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <textarea
          value={currentInput}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={isComplete || isPaused}
          placeholder={startTime ? "Keep typing..." : "Click here and start typing..."}
          className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 resize-none font-mono text-lg leading-relaxed disabled:bg-gray-50 disabled:cursor-not-allowed"
          autoFocus
        />
        
        {!startTime && (
          <div className="text-center text-gray-500 text-sm">
            Start typing to begin the test
          </div>
        )}
        
        {isComplete && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-success text-white rounded-lg">
              <span>🎉 Test Complete!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};