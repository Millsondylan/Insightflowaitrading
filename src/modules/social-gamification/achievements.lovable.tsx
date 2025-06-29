// Achievement System Component
// Badge UI with streak logic and gamification elements

import React, { useState, useEffect } from 'react';
import { 
  Achievement, 
  UserAchievement, 
  UserProfile, 
  Badge,
  SocialEvent 
} from './types';

interface AchievementsProps {
  userId: string;
  onAchievementUnlocked?: (event: SocialEvent) => void;
  className?: string;
}

export const AchievementsComponent: React.FC<Achievementsprops> = ({
  userId,
  onAchievementUnlocked,
  className = '',
}) => {
  const [userProfile, setUserProfile] = useState<Userprofile  />(null);
  const [achievements, setAchievements] = useState<Achievement >([]);
  const [userAchievements, setUserAchievements] = useState<Userachievement  />([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // TODO: implement real data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profile, allAchievements, userProgress] = await Promise.all([
          fetchUserProfile(userId),
          fetchAllAchievements(),
          fetchUserAchievements(userId),
        ]);

        setUserProfile(profile);
        setAchievements(allAchievements);
        setUserAchievements(userProgress);
      } catch (error) {
        console.error('Failed to fetch achievement data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  /**
   * Get achievement progress for display
   */
  const getAchievementProgress = (achievementId: string): UserAchievement | null => {
    return userAchievements.find(ua => ua.achievementId === achievementId) || null;
  };

  /**
   * Check if achievement is unlocked
   */
  const isAchievementUnlocked = (achievementId: string): boolean => {
    const progress = getAchievementProgress(achievementId);
    return progress?.isCompleted || false;
  };

  /**
   * Get achievement progress percentage
   */
  const getProgressPercentage = (achievementId: string): number => {
    const progress = getAchievementProgress(achievementId);
    return progress?.progress || 0;
  };

  /**
   * Get achievement icon with unlock status
   */
  const getAchievementIcon = (achievement: Achievement): string => {
    const isUnlocked = isAchievementUnlocked(achievement.id);
    return isUnlocked ? achievement.icon : '🔒';
  };

  /**
   * Get achievement color based on difficulty
   */
  const getDifficultyColor = (difficulty: string): string => {
    const colors = {
      bronze: 'from-amber-600 to-amber-400',
      silver: 'from-gray-400 to-gray-200',
      gold: 'from-yellow-500 to-yellow-300',
      platinum: 'from-purple-500 to-purple-300',
      diamond: 'from-blue-500 to-cyan-300',
    };
    return colors[difficulty as keyof typeof colors] || colors.bronze;
  };

  /**
   * Filter achievements by category
   */
  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'unlocked') return isAchievementUnlocked(achievement.id);
    if (selectedCategory === 'locked') return !isAchievementUnlocked(achievement.id);
    return achievement.category === selectedCategory;
  });

  /**
   * Calculate completion stats
   */
  const completionStats = {
    total: achievements.length,
    completed: achievements.filter(a => isAchievementUnlocked(a.id)).length,
    percentage: achievements.length > 0 
      ? Math.round((achievements.filter(a => isAchievementUnlocked(a.id)).length / achievements.length) * 100)
      : 0,
  };

  if (loading) {
    return (
      <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-2 text-white/60">Loading achievements...</span>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
        <p className="text-center text-white/60">Failed to load user profile</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
      {/* Header with user stats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.displayName}
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{userProfile.displayName}</h2>
              <p className="text-sm text-white/60">Level {userProfile.level}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-400">{userProfile.experience} XP</div>
            <div className="text-xs text-white/60">
              {completionStats.completed}/{completionStats.total} achievements
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionStats.percentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-white/60 text-center">
          {completionStats.percentage}% Complete
        </div>
      </div>

      {/* Streak indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <div className="text-lg font-bold text-orange-400">🔥</div>
          <div className="text-sm text-white/80">{userProfile.streaks.currentTradingStreak}</div>
          <div className="text-xs text-white/60">Trading Streak</div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-400">📚</div>
          <div className="text-sm text-white/80">{userProfile.streaks.currentLearningStreak}</div>
          <div className="text-xs text-white/60">Learning Streak</div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <div className="text-lg font-bold text-green-400">🎯</div>
          <div className="text-sm text-white/80">{userProfile.stats.totalTrades}</div>
          <div className="text-xs text-white/60">Total Trades</div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-400">💎</div>
          <div className="text-sm text-white/80">{userProfile.badges.length}</div>
          <div className="text-xs text-white/60">Badges Earned</div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'trading', 'social', 'learning', 'milestone', 'unlocked', 'locked'].map(category => (
          <Button key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
              ${selectedCategory === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
              }
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Recent badges */}
      {userProfile.badges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Recent Badges</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.badges.slice(0, 6).map((badge, index) => (
              <div
                key={badge.id}
                className="flex items-center space-x-2 bg-white/5 rounded-lg p-2 border border-white/10"
                title={badge.description}
              >
                <span className="text-lg">{badge.icon}</span>
                <span className="text-xs text-white/80">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const isUnlocked = isAchievementUnlocked(achievement.id);
          const progress = getProgressPercentage(achievement.id);
          
          return (
            <div
              key={achievement.id}
              className={`
                p-4 rounded-lg border transition-all duration-200 hover:scale-105
                ${isUnlocked 
                  ? `bg-gradient-to-br ${getDifficultyColor(achievement.difficulty)} border-white/20` 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {getAchievementIcon(achievement)}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${isUnlocked ? 'text-black' : 'text-white'} mb-1`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-xs ${isUnlocked ? 'text-black/70' : 'text-white/60'} mb-2`}>
                    {achievement.description}
                  </p>
                  
                  {/* Progress bar for locked achievements */}
                  {!isUnlocked && progress > 0 && (
                    <div className="mb-2">
                      <div className="w-full bg-white/20 rounded-full h-1">
                        <div 
                          className="bg-blue-400 h-1 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-white/60 mt-1">{progress}% complete</div>
                    </div>
                  )}

                  {/* Achievement rewards */}
                  <div className="flex items-center justify-between text-xs">
                    <span className={`${isUnlocked ? 'text-black/70' : 'text-white/60'}`}>
                      {achievement.difficulty.toUpperCase()}
                    </span>
                    <span className={`${isUnlocked ? 'text-black/70' : 'text-white/60'}`}>
                      +{achievement.rewards.points} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-white/60">No achievements found for this category</p>
        </div>
      )}
    </div>
  );
};

// Mock data functions (TODO: replace with real API calls)
const fetchUserProfile = async (userId: string): Promise<Userprofile  > => {
  // TODO: implement real API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: userId,
    username: 'trader123',
    displayName: 'Pro Trader',
    avatar: '/api/placeholder/48/48',
    level: 15,
    experience: 2450,
    titles: ['Strategy Master', 'Risk Manager'],
    badges: [
      {
        id: 'badge_1',
        name: 'First Trade',
        description: 'Completed your first trade',
        icon: '🎯',
        rarity: 'common',
        earnedAt: new Date(),
      },
      {
        id: 'badge_2',
        name: 'Profit Streak',
        description: '10 profitable trades in a row',
        icon: '🔥',
        rarity: 'rare',
        earnedAt: new Date(),
      },
    ],
    stats: {
      totalTrades: 156,
      totalProfit: 12450,
      bestStreak: 15,
      strategiesCreated: 3,
      strategiesPurchased: 8,
      socialInteractions: 234,
      lessonsCompleted: 45,
    },
    streaks: {
      currentTradingStreak: 5,
      longestTradingStreak: 15,
      currentLearningStreak: 12,
      longestLearningStreak: 28,
      lastTradingDate: new Date(),
      lastLearningDate: new Date(),
    },
    joinedAt: new Date(),
  };
};

const fetchAllAchievements = async (): Promise<achievement  > => {
  // TODO: implement real API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'ach_1',
      name: 'First Steps',
      description: 'Complete your first trade',
      category: 'trading',
      difficulty: 'bronze',
      icon: '🎯',
      criteria: {
        type: 'trade_count',
        targetValue: 1,
      },
      rewards: {
        points: 100,
        badges: ['first_trade'],
        titles: ['Beginner Trader'],
      },
      isHidden: false,
      unlockedBy: ['user_123'],
    },
    {
      id: 'ach_2',
      name: 'Profit Master',
      description: 'Achieve $10,000 in total profits',
      category: 'trading',
      difficulty: 'gold',
      icon: '💰',
      criteria: {
        type: 'profit_threshold',
        targetValue: 10000,
      },
      rewards: {
        points: 500,
        badges: ['profit_master'],
        titles: ['Profit Master'],
      },
      isHidden: false,
      unlockedBy: [],
    },
    // Add more achievements...
  ];
};

const fetchUserAchievements = async (userId: string): Promise<userachievement  > => {
  // TODO: implement real API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      achievementId: 'ach_1',
      userId,
      unlockedAt: new Date(),
      progress: 100,
      isCompleted: true,
    },
    {
      achievementId: 'ach_2',
      userId,
      unlockedAt: new Date(),
      progress: 75,
      isCompleted: false,
    },
  ];
};

export default AchievementsComponent; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
