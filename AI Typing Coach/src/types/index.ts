export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
}

export interface TestResult {
  id: string;
  date: string;
  duration: number;
  mode: 'timed' | 'custom' | 'race';
  stats: TypingStats;
  text: string;
  incorrectWords: string[];
  completedWords: number;
  totalWords: number;
}

export interface UserProfile {
  totalTests: number;
  bestWPM: number;
  averageWPM: number;
  bestAccuracy: number;
  averageAccuracy: number;
  totalWordsTyped: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  weakKeys: string[];
  strongKeys: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface AIFeedback {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextGoal: string;
  difficultyAdjustment: 'increase' | 'decrease' | 'maintain';
}

export interface TestMode {
  id: string;
  name: string;
  description: string;
  duration?: number;
  wordCount?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}