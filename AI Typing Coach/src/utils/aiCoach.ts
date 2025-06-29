import { TestResult, UserProfile, AIFeedback } from '../types';

export class AITypingCoach {
  static analyzePerformance(results: TestResult[], profile: UserProfile): AIFeedback {
    if (results.length === 0) {
      return {
        overallScore: 0,
        strengths: [],
        weaknesses: ['No data available yet'],
        recommendations: ['Complete a few typing tests to get personalized feedback'],
        nextGoal: 'Complete your first typing test',
        difficultyAdjustment: 'maintain',
      };
    }

    const recentResults = results.slice(0, 10);
    const latestResult = results[0];
    
    const overallScore = this.calculateOverallScore(latestResult, profile);
    const strengths = this.identifyStrengths(recentResults, profile);
    const weaknesses = this.identifyWeaknesses(recentResults, profile);
    const recommendations = this.generateRecommendations(recentResults, profile);
    const nextGoal = this.setNextGoal(profile);
    const difficultyAdjustment = this.determineDifficultyAdjustment(recentResults);

    return {
      overallScore,
      strengths,
      weaknesses,
      recommendations,
      nextGoal,
      difficultyAdjustment,
    };
  }

  private static calculateOverallScore(result: TestResult, profile: UserProfile): number {
    const wpmScore = Math.min(result.stats.wpm / 60, 1) * 40; // Max 40 points for WPM
    const accuracyScore = result.stats.accuracy * 0.6; // Max 60 points for accuracy
    return Math.round(wpmScore + accuracyScore);
  }

  private static identifyStrengths(results: TestResult[], profile: UserProfile): string[] {
    const strengths: string[] = [];
    const avgWPM = results.reduce((sum, r) => sum + r.stats.wpm, 0) / results.length;
    const avgAccuracy = results.reduce((sum, r) => sum + r.stats.accuracy, 0) / results.length;

    if (avgWPM > 40) strengths.push('Excellent typing speed');
    if (avgAccuracy > 0.95) strengths.push('Outstanding accuracy');
    if (profile.currentStreak > 3) strengths.push('Great consistency with regular practice');
    
    // Check for improvement trends
    if (results.length >= 5) {
      const recent = results.slice(0, 3);
      const older = results.slice(3, 6);
      const recentAvgWPM = recent.reduce((sum, r) => sum + r.stats.wpm, 0) / recent.length;
      const olderAvgWPM = older.reduce((sum, r) => sum + r.stats.wpm, 0) / older.length;
      
      if (recentAvgWPM > olderAvgWPM + 2) {
        strengths.push('Showing clear improvement in speed');
      }
    }

    return strengths;
  }

  private static identifyWeaknesses(results: TestResult[], profile: UserProfile): string[] {
    const weaknesses: string[] = [];
    const avgAccuracy = results.reduce((sum, r) => sum + r.stats.accuracy, 0) / results.length;
    const avgWPM = results.reduce((sum, r) => sum + r.stats.wpm, 0) / results.length;

    if (avgAccuracy < 0.85) weaknesses.push('Accuracy needs improvement');
    if (avgWPM < 25) weaknesses.push('Typing speed could be faster');
    
    // Analyze error patterns
    const allIncorrectWords = results.flatMap(r => r.incorrectWords);
    const errorFreq: { [key: string]: number } = {};
    
    allIncorrectWords.forEach(word => {
      errorFreq[word] = (errorFreq[word] || 0) + 1;
    });
    
    const frequentErrors = Object.entries(errorFreq)
      .filter(([_, count]) => count > 2)
      .map(([word, _]) => word);
    
    if (frequentErrors.length > 0) {
      weaknesses.push(`Frequent mistakes with: ${frequentErrors.slice(0, 3).join(', ')}`);
    }

    // Check for consistency
    const wpmVariance = this.calculateVariance(results.map(r => r.stats.wpm));
    if (wpmVariance > 100) {
      weaknesses.push('Inconsistent performance between sessions');
    }

    return weaknesses;
  }

  private static generateRecommendations(results: TestResult[], profile: UserProfile): string[] {
    const recommendations: string[] = [];
    const avgAccuracy = results.reduce((sum, r) => sum + r.stats.accuracy, 0) / results.length;
    const avgWPM = results.reduce((sum, r) => sum + r.stats.wpm, 0) / results.length;

    if (avgAccuracy < 0.9) {
      recommendations.push('Focus on accuracy first - slow down and type more carefully');
      recommendations.push('Practice common word patterns and letter combinations');
    }

    if (avgWPM < 30) {
      recommendations.push('Practice daily for 15-20 minutes to build muscle memory');
      recommendations.push('Use proper finger positioning and touch typing technique');
    }

    if (avgWPM > 30 && avgAccuracy > 0.9) {
      recommendations.push('Try longer practice sessions to build endurance');
      recommendations.push('Challenge yourself with more complex texts');
    }

    // Analyze timing patterns
    const longTests = results.filter(r => r.duration > 300); // 5+ minute tests
    if (longTests.length > 0) {
      const endAccuracy = longTests.reduce((sum, r) => sum + r.stats.accuracy, 0) / longTests.length;
      if (endAccuracy < avgAccuracy - 0.05) {
        recommendations.push('Work on maintaining accuracy during longer sessions');
      }
    }

    if (profile.currentStreak < 3) {
      recommendations.push('Establish a daily practice routine for consistent improvement');
    }

    return recommendations;
  }

  private static setNextGoal(profile: UserProfile): string {
    if (profile.bestWPM < 20) return 'Reach 20 WPM with 90% accuracy';
    if (profile.bestWPM < 30) return 'Reach 30 WPM with 92% accuracy';
    if (profile.bestWPM < 40) return 'Reach 40 WPM with 94% accuracy';
    if (profile.bestWPM < 50) return 'Join the 50 WPM club with 95% accuracy';
    if (profile.bestWPM < 70) return 'Achieve 70 WPM - you\'re getting fast!';
    if (profile.bestWPM < 100) return 'Break into the elite 100 WPM club';
    return 'Master advanced typing techniques and maintain consistency';
  }

  private static determineDifficultyAdjustment(results: TestResult[]): 'increase' | 'decrease' | 'maintain' {
    if (results.length < 3) return 'maintain';
    
    const recent = results.slice(0, 3);
    const avgWPM = recent.reduce((sum, r) => sum + r.stats.wpm, 0) / recent.length;
    const avgAccuracy = recent.reduce((sum, r) => sum + r.stats.accuracy, 0) / recent.length;
    
    if (avgWPM > 40 && avgAccuracy > 0.95) return 'increase';
    if (avgWPM < 20 || avgAccuracy < 0.85) return 'decrease';
    return 'maintain';
  }

  private static calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((sum, sq) => sum + sq, 0) / numbers.length;
  }
}