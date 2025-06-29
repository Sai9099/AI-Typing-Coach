import React from 'react';
import { Clock, FileText, Zap, BookOpen } from 'lucide-react';
import { TestMode } from '../types';

interface TestModeSelectorProps {
  selectedMode: TestMode;
  onModeSelect: (mode: TestMode) => void;
}

const testModes: TestMode[] = [
  {
    id: 'timed-1',
    name: '1 Minute Sprint',
    description: 'Quick typing test to measure your speed',
    duration: 60,
    difficulty: 'easy',
  },
  {
    id: 'timed-3',
    name: '3 Minute Challenge',
    description: 'Balanced test for consistent performance',
    duration: 180,
    difficulty: 'medium',
  },
  {
    id: 'timed-5',
    name: '5 Minute Endurance',
    description: 'Test your stamina and consistency',
    duration: 300,
    difficulty: 'medium',
  },
  {
    id: 'custom-50',
    name: '50 Words',
    description: 'Practice with a specific word count',
    wordCount: 50,
    difficulty: 'easy',
  },
  {
    id: 'custom-100',
    name: '100 Words',
    description: 'Medium length practice session',
    wordCount: 100,
    difficulty: 'medium',
  },
  {
    id: 'advanced',
    name: 'Advanced Text',
    description: 'Complex vocabulary and punctuation',
    wordCount: 150,
    difficulty: 'hard',
  },
];

export const TestModeSelector: React.FC<TestModeSelectorProps> = ({
  selectedMode,
  onModeSelect,
}) => {
  const getIcon = (mode: TestMode) => {
    if (mode.duration) return Clock;
    if (mode.difficulty === 'hard') return BookOpen;
    if (mode.wordCount && mode.wordCount <= 50) return Zap;
    return FileText;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success bg-success/10 border-success/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'hard': return 'text-error bg-error/10 border-error/20';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Test Mode</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testModes.map((mode) => {
          const Icon = getIcon(mode);
          const isSelected = selectedMode.id === mode.id;
          
          return (
            <div
              key={mode.id}
              onClick={() => onModeSelect(mode)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-200' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${isSelected ? 'text-primary-800' : 'text-gray-800'}`}>
                    {mode.name}
                  </h4>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {mode.duration ? `${mode.duration}s` : `${mode.wordCount} words`}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(mode.difficulty)}`}>
                  {mode.difficulty}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};