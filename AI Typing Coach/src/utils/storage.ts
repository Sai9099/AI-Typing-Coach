import { TestResult, UserProfile, Achievement } from '../types';

const STORAGE_KEYS = {
  TEST_RESULTS: 'typing-coach-results',
  USER_PROFILE: 'typing-coach-profile',
  ACHIEVEMENTS: 'typing-coach-achievements',
};

export const saveTestResult = (result: TestResult): void => {
  const existingResults = getTestResults();
  const updatedResults = [result, ...existingResults];
  localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(updatedResults));
};

export const getTestResults = (): TestResult[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
  return stored ? JSON.parse(stored) : [];
};

export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default profile
  return {
    totalTests: 0,
    bestWPM: 0,
    averageWPM: 0,
    bestAccuracy: 0,
    averageAccuracy: 0,
    totalWordsTyped: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    weakKeys: [],
    strongKeys: [],
  };
};

export const updateUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const getAchievements = (): Achievement[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
  return stored ? JSON.parse(stored) : getDefaultAchievements();
};

export const updateAchievements = (achievements: Achievement[]): void => {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
};

const getDefaultAchievements = (): Achievement[] => [
  {
    id: 'first-test',
    title: 'Getting Started',
    description: 'Complete your first typing test',
    icon: 'play',
    unlocked: false,
  },
  {
    id: 'speed-demon-50',
    title: 'Speed Demon',
    description: 'Reach 50 WPM',
    icon: 'zap',
    unlocked: false,
  },
  {
    id: 'accuracy-master',
    title: 'Accuracy Master',
    description: 'Achieve 95% accuracy',
    icon: 'target',
    unlocked: false,
  },
  {
    id: 'streak-warrior',
    title: 'Streak Warrior',
    description: 'Complete 7 tests in a row',
    icon: 'flame',
    unlocked: false,
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Reach 100 WPM',
    icon: 'trophy',
    unlocked: false,
  },
];