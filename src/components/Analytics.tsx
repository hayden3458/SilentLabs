import React from 'react';

interface PromptHistory {
  id: string;
  original: string;
  enhanced: string;
  rating: number;
  timestamp: Date;
  category: string;
}

interface AnalyticsProps {
  promptHistory: PromptHistory[];
}

const Analytics: React.FC<AnalyticsProps> = ({ promptHistory }) => {
  const getCategoryStats = () => {
    const stats = promptHistory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / promptHistory.length) * 100)
    }));
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    promptHistory.forEach(item => {
      if (item.rating > 0 && item.rating <= 5) {
        distribution[item.rating - 1]++;
      }
    });
    return distribution;
  };

  const getAverageRating = () => {
    if (promptHistory.length === 0) return 0;
    const total = promptHistory.reduce((sum, item) => sum + item.rating, 0);
    return (total / promptHistory.length).toFixed(1);
  };

  const getMostUsedCategories = () => {
    const stats = getCategoryStats();
    return stats.sort((a, b) => b.count - a.count).slice(0, 3);
  };

  const getRecentActivity = () => {
    const today = new Date();
    const last7Days = promptHistory.filter(item => {
      const diffTime = Math.abs(today.getTime() - item.timestamp.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });
    return last7Days.length;
  };

  const categoryIcons: Record<string, string> = {
    general: '💬',
    creative: '✍️',
    business: '💼',
    technical: '⚙️',
    academic: '📚',
    marketing: '📢'
  };

  const categoryNames: Record<string, string> = {
    general: 'General',
    creative: 'Creative',
    business: 'Business',
    technical: 'Technical',
    academic: 'Academic',
    marketing: 'Marketing'
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
      <h3 className="text-xl font-medium text-gray-900 mb-8">Analytics Dashboard</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-3xl font-bold text-emerald-400">{promptHistory.length}</div>
          <div className="text-sm text-emerald-200/70">Total Prompts</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-3xl font-bold text-teal-400">{getAverageRating()}</div>
          <div className="text-sm text-emerald-200/70">Avg Rating</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-3xl font-bold text-cyan-400">{getRecentActivity()}</div>
          <div className="text-sm text-emerald-200/70">Last 7 Days</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-3xl font-bold text-orange-400">
            {promptHistory.length > 0 ? Math.round((promptHistory.filter(item => item.rating >= 4).length / promptHistory.length) * 100) : 0}%
          </div>
          <div className="text-sm text-emerald-200/70">High Quality</div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Category Distribution</h4>
        <div className="space-y-3">
          {getCategoryStats().map((stat) => (
            <div key={stat.category} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{categoryIcons[stat.category]}</span>
                <span className="text-sm text-gray-700">{categoryNames[stat.category]}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700 w-8">{stat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Rating Distribution</h4>
        <div className="space-y-3">
          {getRatingDistribution().map((count, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">{index + 1} ⭐</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${promptHistory.length > 0 ? (count / promptHistory.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Used Categories */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Most Used Categories</h4>
        <div className="space-y-3">
          {getMostUsedCategories().map((stat, index) => (
            <div key={stat.category} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{categoryIcons[stat.category]}</span>
                <span className="text-sm font-medium text-gray-700">{categoryNames[stat.category]}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">{stat.count} prompts</span>
                <span className="text-xs text-gray-500">({stat.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 