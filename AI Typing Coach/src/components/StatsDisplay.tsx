import React from 'react';
import { Zap, Target, AlertCircle, Clock } from 'lucide-react';
import { TypingStats } from '../types';

interface StatsDisplayProps {
  stats: TypingStats;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const statItems = [
    {
      label: 'WPM',
      value: stats.wpm,
      icon: Zap,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      label: 'Accuracy',
      value: `${Math.round(stats.accuracy * 100)}%`,
      icon: Target,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Errors',
      value: stats.errors,
      icon: AlertCircle,
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
    {
      label: 'Time',
      value: formatTime(stats.timeElapsed),
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`${item.bgColor} rounded-xl p-4 border border-gray-100 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
            </div>
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};