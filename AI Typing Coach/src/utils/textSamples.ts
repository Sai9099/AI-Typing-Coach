export const textSamples = {
  easy: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for practicing basic typing skills.",
    "A warm summer day brings joy to many people. Children play in the park while parents watch from nearby benches.",
    "Learning to type faster takes time and practice. Start slowly and focus on accuracy before building up your speed.",
  ],
  medium: [
    "Technology has revolutionized the way we communicate, work, and live our daily lives. From smartphones to artificial intelligence, innovation continues to shape our future in remarkable ways.",
    "The importance of effective communication cannot be overstated in today's interconnected world. Whether through written words or verbal expression, clear communication builds bridges between people.",
    "Success in any endeavor requires dedication, persistence, and the willingness to learn from both failures and achievements. Every expert was once a beginner who refused to give up.",
  ],
  hard: [
    "Quantum mechanics, with its counter-intuitive principles and mathematical complexity, challenges our fundamental understanding of reality. Phenomena such as superposition and entanglement defy classical physics' deterministic worldview.",
    "The socioeconomic implications of artificial intelligence deployment across various industries necessitate comprehensive policy frameworks that balance technological advancement with employment preservation and ethical considerations.",
    "Epistemological debates regarding the nature of knowledge acquisition have persisted throughout philosophical history, with rationalists and empiricists presenting compelling yet contradictory arguments about humanity's capacity for understanding truth.",
  ],
};

export const getRandomText = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  const samples = textSamples[difficulty];
  return samples[Math.floor(Math.random() * samples.length)];
};

export const generateCustomText = (wordCount: number, difficulty: 'easy' | 'medium' | 'hard'): string => {
  const baseText = getRandomText(difficulty);
  const words = baseText.split(' ');
  
  if (words.length >= wordCount) {
    return words.slice(0, wordCount).join(' ');
  }
  
  // If we need more words, repeat and shuffle
  const repeatedWords = [];
  while (repeatedWords.length < wordCount) {
    repeatedWords.push(...words);
  }
  
  return repeatedWords.slice(0, wordCount).join(' ');
};