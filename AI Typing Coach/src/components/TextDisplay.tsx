import React from 'react';

interface TextDisplayProps {
  text: string;
  currentInput: string;
  words: string[];
  currentWordIndex: number;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  currentInput,
  words,
  currentWordIndex,
}) => {
  const renderText = () => {
    const typedWords = currentInput.trim().split(' ');
    
    return words.map((word, wordIndex) => {
      const typedWord = typedWords[wordIndex] || '';
      const isCurrentWord = wordIndex === currentWordIndex;
      const isCompleted = wordIndex < typedWords.length - 1;
      
      return (
        <span
          key={wordIndex}
          className={`inline-block mr-2 mb-1 px-2 py-1 rounded transition-all duration-200 ${
            isCurrentWord
              ? 'bg-primary-100 border-2 border-primary-300 shadow-sm'
              : isCompleted
              ? typedWord === word
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-error/10 text-error border border-error/20'
              : 'text-gray-600'
          }`}
        >
          {word.split('').map((char, charIndex) => {
            const typedChar = typedWord[charIndex];
            const isCurrentChar = isCurrentWord && charIndex === typedWord.length;
            
            return (
              <span
                key={charIndex}
                className={`relative ${
                  isCurrentChar
                    ? 'bg-primary-400 text-white animate-pulse'
                    : typedChar === undefined
                    ? ''
                    : typedChar === char
                    ? 'text-success'
                    : 'text-error bg-error/20'
                }`}
              >
                {char}
                {isCurrentChar && (
                  <span className="absolute -right-0.5 top-0 w-0.5 h-full bg-primary-500 animate-pulse" />
                )}
              </span>
            );
          })}
          
          {/* Show extra characters typed */}
          {isCurrentWord && typedWord.length > word.length && (
            <span className="text-error bg-error/20">
              {typedWord.slice(word.length)}
            </span>
          )}
        </span>
      );
    });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="text-lg leading-relaxed font-mono select-none">
        {renderText()}
      </div>
    </div>
  );
};