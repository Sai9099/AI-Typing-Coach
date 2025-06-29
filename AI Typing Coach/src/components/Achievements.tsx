import React from 'react';
import { Trophy, Star, Zap, Target, Flame, Award } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsProps {
  achievements: Achievement[];
}

const iconMap: Record<string, any> = {
  play: Star,
  zap: Zap,
  target: Target,
  flame: Flame,
  trophy: Trophy,
};

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Award className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Achievements</h3>
            <p className="text-gray-600 text-sm">
              {unlockedCount} of {achievements.length} unlocked
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{unlockedCount}</div>
          <div className="text-sm text-gray-500">Earned</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const Icon = iconMap[achievement.icon] || Star;
          
          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                achievement.unlocked
                  ? 'border-primary-200 bg-gradient-to-r from-primary-50 to-primary-100 shadow-md'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-3 rounded-full ${
                    achievement.unlocked
                      ? 'bg-primary-200 text-primary-600'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold ${
                      achievement.unlocked ? 'text-primary-800' : 'text-gray-500'
                    }`}
                  >
                    {achievement.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      achievement.unlocked ? 'text-primary-600' : 'text-gray-400'
                    }`}
                  >
                    {achievement.description}
                  </p>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <p className="text-xs text-primary-500 mt-1">
                      Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {achievement.unlocked && (
                  <div className="text-primary-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};