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

export const AchievementsComponent: React.FC<AchievementsProps> = ({
  userId,
  onAchievementUnlocked,
  className = '',
}) => {
  const [userProfile, setUserProfile] = useState<span style={{fontSize: '16px'}}>👤</span>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<span style={{fontSize: '16px'}}>👤</span>([]);
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div ></div>
          <span >Loading achievements...</span>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
        <p >Failed to load user profile</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
      {/* Header with user stats */}
      <div >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img 
              src={userProfile.avatar} 
              alt={userProfile.displayName}
              
            />
            <div>
              <h2 style={{ fontWeight: "700", color: "white" }}>{userProfile.displayName}</h2>
              <p >Level {userProfile.level}</p>
            </div>
          </div>
          <div >
            <div style={{ fontWeight: "700" }}>{userProfile.experience} XP</div>
            <div >
              {completionStats.completed}/{completionStats.total} achievements
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%" }}>
          <div 
            
            style={{ width: `${completionStats.percentage}%` }}
          ></div>
        </div>
        <div >
          {completionStats.percentage}% Complete
        </div>
      </div>

      {/* Streak indicators */}
      <div >
        <div >
          <div style={{ fontWeight: "700" }}>🔥</div>
          <div >{userProfile.streaks.currentTradingStreak}</div>
          <div >Trading Streak</div>
        </div>
        <div >
          <div style={{ fontWeight: "700" }}>📚</div>
          <div >{userProfile.streaks.currentLearningStreak}</div>
          <div >Learning Streak</div>
        </div>
        <div >
          <div style={{ fontWeight: "700" }}>🎯</div>
          <div >{userProfile.stats.totalTrades}</div>
          <div >Total Trades</div>
        </div>
        <div >
          <div style={{ fontWeight: "700" }}>💎</div>
          <div >{userProfile.badges.length}</div>
          <div >Badges Earned</div>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: "flex" }}>
        {['all', 'trading', 'social', 'learning', 'milestone', 'unlocked', 'locked'].map(category => (
          <button
            key={category}
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
          </button>
        ))}
      </div>

      {/* Recent badges */}
      {userProfile.badges.length > 0 && (
        <div >
          <h3 style={{ color: "white" }}>Recent Badges</h3>
          <div style={{ display: "flex" }}>
            {userProfile.badges.slice(0, 6).map((badge, index) => (
              <div
                key={badge.id}
                style={{ display: "flex", alignItems: "center", border: "1px solid #374151" }}
                title={badge.description}
              >
                <span >{badge.icon}</span>
                <span >{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements grid */}
      <div >
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
              <div style={{ display: "flex" }}>
                <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {getAchievementIcon(achievement)}
                </div>
                <div >
                  <h4 className={`font-medium ${isUnlocked ? 'text-black' : 'text-white'} mb-1`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-xs ${isUnlocked ? 'text-black/70' : 'text-white/60'} mb-2`}>
                    {achievement.description}
                  </p>
                  
                  {/* Progress bar for locked achievements */}
                  {!isUnlocked && progress > 0 && (
                    <div >
                      <div style={{ width: "100%" }}>
                        <div 
                          
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div >{progress}% complete</div>
                    </div>
                  )}

                  {/* Achievement rewards */}
                  <div style={{ display: "flex", alignItems: "center" }}>
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
        <div style={{ paddingTop: "32px", paddingBottom: "32px" }}>
          <div style={{ marginBottom: "16px" }}>🎯</div>
          <p >No achievements found for this category</p>
        </div>
      )}
    </div>
  );
};

// Mock data functions (TODO: replace with real API calls)
const fetchUserProfile = async (userId: string): Promise<span style={{fontSize: '16px'}}>👤</span> => {
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

const fetchAllAchievements = async (): Promise<Achievement[]> => {
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

const fetchUserAchievements = async (userId: string): Promise<span style={{fontSize: '16px'}}>👤</span> => {
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