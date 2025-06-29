import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Award, Flame, Target } from 'lucide-react';
import { TestResult, UserProfile } from '../types';

interface DashboardProps {
  results: TestResult[];
  profile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ results, profile }) => {
  const chartData = useMemo(() => {
    return results
      .slice(0, 20)
      .reverse()
      .map((result, index) => ({
        test: index + 1,
        wpm: result.stats.wpm,
        accuracy: Math.round(result.stats.accuracy * 100),
        errors: result.stats.errors,
        date: new Date(result.date).toLocaleDateString(),
      }));
  }, [results]);

  const recentAverage = useMemo(() => {
    if (results.length === 0) return { wpm: 0, accuracy: 0 };
    const recent = results.slice(0, 5);
    return {
      wpm: Math.round(recent.reduce((sum, r) => sum + r.stats.wpm, 0) / recent.length),
      accuracy: Math.round((recent.reduce((sum, r) => sum + r.stats.accuracy, 0) / recent.length) * 100),
    };
  }, [results]);

  const stats = [
    {
      label: 'Best WPM',
      value: profile.bestWPM,
      icon: TrendingUp,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      label: 'Average WPM',
      value: recentAverage.wpm,
      icon: Target,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Current Streak',
      value: profile.currentStreak,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Total Tests',
      value: profile.totalTests,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Yet</h3>
        <p className="text-gray-600">Complete some typing tests to see your progress here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`${stat.bgColor} rounded-xl p-4 border border-gray-100 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WPM Progress */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">WPM Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="test" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy Trend */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="test" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => [`${value}%`, 'Accuracy']}
              />
              <Bar dataKey="accuracy" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-600">Date</th>
                <th className="text-left py-2 font-medium text-gray-600">Mode</th>
                <th className="text-left py-2 font-medium text-gray-600">WPM</th>
                <th className="text-left py-2 font-medium text-gray-600">Accuracy</th>
                <th className="text-left py-2 font-medium text-gray-600">Duration</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 10).map((result) => (
                <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3">{new Date(result.date).toLocaleDateString()}</td>
                  <td className="py-3 capitalize">{result.mode}</td>
                  <td className="py-3 font-semibold text-primary-600">{result.stats.wpm}</td>
                  <td className="py-3 font-semibold text-success">
                    {Math.round(result.stats.accuracy * 100)}%
                  </td>
                  <td className="py-3">{Math.round(result.duration / 1000)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};