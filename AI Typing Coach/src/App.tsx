import React, { useState, useEffect } from 'react';
import { BarChart3, Brain, Trophy, Settings, Home, Play } from 'lucide-react';
import { TypingTest } from './components/TypingTest';
import { Dashboard } from './components/Dashboard';
import { AIFeedback } from './components/AIFeedback';
import { Achievements } from './components/Achievements';
import { TestModeSelector } from './components/TestModeSelector';
import { TestResult, UserProfile, TestMode, AIFeedback as AIFeedbackType } from './types';
import { saveTestResult, getTestResults, getUserProfile, updateUserProfile, getAchievements, updateAchievements } from './utils/storage';
import { getRandomText, generateCustomText } from './utils/textSamples';
import { AITypingCoach } from './utils/aiCoach';

type TabType = 'test' | 'dashboard' | 'feedback' | 'achievements';

function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('test');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getUserProfile());
  const [achievements, setAchievements] = useState(() => getAchievements());
  const [currentTest, setCurrentTest] = useState<{ text: string; mode: TestMode } | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AIFeedbackType | null>(null);
  const [selectedMode, setSelectedMode] = useState<TestMode>({
    id: 'timed-1',
    name: '1 Minute Sprint',
    description: 'Quick typing test to measure your speed',
    duration: 60,
    difficulty: 'easy',
  });

  useEffect(() => {
    const results = getTestResults();
    setTestResults(results);
    
    if (results.length > 0) {
      const feedback = AITypingCoach.analyzePerformance(results, userProfile);
      setAiFeedback(feedback);
    }
  }, [userProfile]);

  const startTest = () => {
    let text: string;
    
    if (selectedMode.wordCount) {
      text = generateCustomText(selectedMode.wordCount, selectedMode.difficulty);
    } else {
      text = getRandomText(selectedMode.difficulty);
    }
    
    setCurrentTest({ text, mode: selectedMode });
  };

  const handleTestComplete = (stats: any, incorrectWords: string[]) => {
    if (!currentTest) return;

    const result: TestResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: selectedMode.duration ? selectedMode.duration * 1000 : stats.timeElapsed,
      mode: selectedMode.duration ? 'timed' : 'custom',
      stats,
      text: currentTest.text,
      incorrectWords,
      completedWords: currentTest.text.split(' ').length,
      totalWords: currentTest.text.split(' ').length,
    };

    // Save result
    saveTestResult(result);
    const updatedResults = [result, ...testResults];
    setTestResults(updatedResults);

    // Update profile
    const updatedProfile: UserProfile = {
      ...userProfile,
      totalTests: userProfile.totalTests + 1,
      bestWPM: Math.max(userProfile.bestWPM, stats.wpm),
      averageWPM: Math.round((userProfile.averageWPM * userProfile.totalTests + stats.wpm) / (userProfile.totalTests + 1)),
      bestAccuracy: Math.max(userProfile.bestAccuracy, stats.accuracy),
      averageAccuracy: ((userProfile.averageAccuracy * userProfile.totalTests + stats.accuracy) / (userProfile.totalTests + 1)),
      totalWordsTyped: userProfile.totalWordsTyped + result.completedWords,
      currentStreak: userProfile.currentStreak + 1,
      longestStreak: Math.max(userProfile.longestStreak, userProfile.currentStreak + 1),
    };

    setUserProfile(updatedProfile);
    updateUserProfile(updatedProfile);

    // Check for achievements
    checkAchievements(updatedProfile, stats);

    // Generate AI feedback
    const feedback = AITypingCoach.analyzePerformance(updatedResults, updatedProfile);
    setAiFeedback(feedback);

    // Switch to dashboard to show results
    setCurrentTab('dashboard');
    setCurrentTest(null);
  };

  const checkAchievements = (profile: UserProfile, stats: any) => {
    const updatedAchievements = [...achievements];
    let hasNewAchievement = false;

    // Check each achievement
    updatedAchievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first-test':
          shouldUnlock = profile.totalTests >= 1;
          break;
        case 'speed-demon-50':
          shouldUnlock = stats.wpm >= 50;
          break;
        case 'accuracy-master':
          shouldUnlock = stats.accuracy >= 0.95;
          break;
        case 'streak-warrior':
          shouldUnlock = profile.currentStreak >= 7;
          break;
        case 'century-club':
          shouldUnlock = stats.wpm >= 100;
          break;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedDate = new Date().toISOString();
        hasNewAchievement = true;
      }
    });

    if (hasNewAchievement) {
      setAchievements(updatedAchievements);
      updateAchievements(updatedAchievements);
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
  };

  const tabs = [
    { id: 'test' as const, label: 'Test', icon: Play },
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'feedback' as const, label: 'AI Coach', icon: Brain },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 font-inter">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Typing Coach</h1>
                <p className="text-sm text-gray-600">Improve your typing with AI-powered feedback</p>
              </div>
            </div>
            
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentTab === tab.id
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {currentTab === 'test' && (
            <div className="space-y-6">
              {!currentTest ? (
                <>
                  <TestModeSelector
                    selectedMode={selectedMode}
                    onModeSelect={setSelectedMode}
                  />
                  <div className="text-center">
                    <button
                      onClick={startTest}
                      className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Test</span>
                    </button>
                  </div>
                </>
              ) : (
                <TypingTest
                  text={currentTest.text}
                  duration={selectedMode.duration}
                  onComplete={handleTestComplete}
                  onReset={resetTest}
                />
              )}
            </div>
          )}

          {currentTab === 'dashboard' && (
            <Dashboard results={testResults} profile={userProfile} />
          )}

          {currentTab === 'feedback' && (
            <div className="space-y-6">
              {aiFeedback ? (
                <AIFeedback feedback={aiFeedback} />
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Feedback Yet</h3>
                  <p className="text-gray-600">Complete a few typing tests to get personalized AI feedback!</p>
                </div>
              )}
            </div>
          )}

          {currentTab === 'achievements' && (
            <Achievements achievements={achievements} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;