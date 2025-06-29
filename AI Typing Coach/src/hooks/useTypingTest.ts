import { useState, useEffect, useCallback, useRef } from 'react';
import { TypingStats } from '../types';

interface UseTypingTestProps {
  text: string;
  onComplete: (stats: TypingStats, incorrectWords: string[]) => void;
  duration?: number;
}

export const useTypingTest = ({ text, onComplete, duration }: UseTypingTestProps) => {
  const [currentInput, setCurrentInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    cpm: 0,
    accuracy: 0,
    errors: 0,
    timeElapsed: 0,
  });
  const [incorrectWords, setIncorrectWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const words = text.split(' ');
  const currentWordIndex = currentInput.trim().split(' ').length - 1;
  const currentWord = currentInput.split(' ').pop() || '';

  const calculateStats = useCallback((input: string, elapsed: number): TypingStats => {
    const typedWords = input.trim().split(' ').filter(word => word.length > 0);
    const minutes = elapsed / 60000;
    const characters = input.length;
    
    const wpm = minutes > 0 ? Math.round((typedWords.length / minutes)) : 0;
    const cpm = minutes > 0 ? Math.round((characters / minutes)) : 0;
    
    // Calculate accuracy
    let correctChars = 0;
    let totalChars = 0;
    const targetText = text.substring(0, input.length);
    
    for (let i = 0; i < Math.min(input.length, targetText.length); i++) {
      totalChars++;
      if (input[i] === targetText[i]) {
        correctChars++;
      }
    }
    
    const accuracy = totalChars > 0 ? correctChars / totalChars : 1;
    const errors = totalChars - correctChars;
    
    return {
      wpm,
      cpm,
      accuracy,
      errors,
      timeElapsed: elapsed,
    };
  }, [text]);

  const handleInputChange = (value: string) => {
    if (isComplete) return;
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    setCurrentInput(value);
    
    const now = Date.now();
    const elapsed = startTime ? now - startTime : 0;
    const newStats = calculateStats(value, elapsed);
    setStats(newStats);
    
    // Check for completion
    if (value.trim() === text.trim()) {
      completeTest(value, elapsed);
    }
  };

  const completeTest = (finalInput: string, elapsed: number) => {
    setIsComplete(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const finalStats = calculateStats(finalInput, elapsed);
    
    // Identify incorrect words
    const typedWords = finalInput.trim().split(' ');
    const targetWords = text.trim().split(' ');
    const wrong: string[] = [];
    
    typedWords.forEach((typedWord, index) => {
      if (targetWords[index] && typedWord !== targetWords[index]) {
        wrong.push(targetWords[index]);
      }
    });
    
    setIncorrectWords(wrong);
    onComplete(finalStats, wrong);
  };

  // Timer effect for timed tests
  useEffect(() => {
    if (duration && startTime && !isComplete) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const remaining = Math.max(0, duration * 1000 - elapsed);
        
        setTimeLeft(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          completeTest(currentInput, duration * 1000);
        }
      }, 100);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [startTime, duration, isComplete, currentInput]);

  const reset = () => {
    setCurrentInput('');
    setStartTime(null);
    setIsComplete(false);
    setStats({
      wpm: 0,
      cpm: 0,
      accuracy: 0,
      errors: 0,
      timeElapsed: 0,
    });
    setIncorrectWords([]);
    setTimeLeft(duration);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return {
    currentInput,
    handleInputChange,
    stats,
    isComplete,
    reset,
    words,
    currentWordIndex,
    currentWord,
    timeLeft,
    startTime,
  };
};