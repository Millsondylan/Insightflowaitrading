import { User } from '../db/types';

export interface ReputationScore {
  userId: string;
  total: number;
  breakdown: {
    strategyContributions: number;
    helpfulAnswers: number;
    qualityContent: number;
    communityEngagement: number;
    tradingSuccess: number;
  };
  level: ReputationLevel;
  badges: ReputationBadge[];
  activityLog: ReputationActivity[];
}

export type ReputationLevel = 
  | 'novice'
  | 'intermediate'
  | 'expert'
  | 'master'
  | 'guru';

export interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ReputationCategory;
  earnedAt: Date;
}

export type ReputationCategory = 
  | 'strategy'
  | 'community'
  | 'trading'
  | 'education'
  | 'mentorship';

export interface ReputationActivity {
  id: string;
  type: ActivityType;
  points: number;
  description: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export type ActivityType = 
  | 'strategy_published'
  | 'strategy_liked'
  | 'question_answered'
  | 'answer_accepted'
  | 'content_created'
  | 'trading_milestone'
  | 'mentorship_provided';

export class ReputationSystem {
  private readonly levelThresholds = {
    novice: 0,
    intermediate: 1000,
    expert: 5000,
    master: 15000,
    guru: 50000
  };

  private readonly activityPoints = {
    strategy_published: 500,
    strategy_liked: 50,
    question_answered: 100,
    answer_accepted: 200,
    content_created: 150,
    trading_milestone: 300,
    mentorship_provided: 400
  };

  public async calculateReputation(user: User): Promise<ReputationScore> {
    const activities = await this.getUserActivities(user.id);
    const breakdown = this.calculateBreakdown(activities);
    const total = this.calculateTotal(breakdown);
    const level = this.determineLevel(total);
    const badges = await this.checkBadges(user.id, breakdown);

    return {
      userId: user.id,
      total,
      breakdown,
      level,
      badges,
      activityLog: activities
    };
  }

  private async getUserActivities(userId: string): Promise<ReputationActivity[]> {
    // Fetch from database
    return [];
  }

  private calculateBreakdown(
    activities: ReputationActivity[]
  ): ReputationScore['breakdown'] {
    const breakdown = {
      strategyContributions: 0,
      helpfulAnswers: 0,
      qualityContent: 0,
      communityEngagement: 0,
      tradingSuccess: 0
    };

    activities.forEach(activity => {
      switch (activity.type) {
        case 'strategy_published':
        case 'strategy_liked':
          breakdown.strategyContributions += activity.points;
          break;
        case 'question_answered':
        case 'answer_accepted':
          breakdown.helpfulAnswers += activity.points;
          break;
        case 'content_created':
          breakdown.qualityContent += activity.points;
          break;
        case 'mentorship_provided':
          breakdown.communityEngagement += activity.points;
          break;
        case 'trading_milestone':
          breakdown.tradingSuccess += activity.points;
          break;
      }
    });

    return breakdown;
  }

  private calculateTotal(
    breakdown: ReputationScore['breakdown']
  ): number {
    return Object.values(breakdown).reduce((a, b) => a + b, 0);
  }

  private determineLevel(total: number): ReputationLevel {
    const levels = Object.entries(this.levelThresholds)
      .sort(([, a], [, b]) => b - a);

    for (const [level, threshold] of levels) {
      if (total >= threshold) {
        return level as ReputationLevel;
      }
    }

    return 'novice';
  }

  private async checkBadges(
    userId: string,
    breakdown: ReputationScore['breakdown']
  ): Promise<ReputationBadge[]> {
    const badges: ReputationBadge[] = [];

    // Strategy Master Badge
    if (breakdown.strategyContributions >= 5000) {
      badges.push({
        id: 'strategy_master',
        name: 'Strategy Master',
        description: 'Contributed high-quality trading strategies',
        icon: '🎯',
        category: 'strategy',
        earnedAt: new Date()
      });
    }

    // Community Leader Badge
    if (breakdown.helpfulAnswers >= 3000) {
      badges.push({
        id: 'community_leader',
        name: 'Community Leader',
        description: 'Consistently helps other traders',
        icon: '👥',
        category: 'community',
        earnedAt: new Date()
      });
    }

    // Trading Expert Badge
    if (breakdown.tradingSuccess >= 10000) {
      badges.push({
        id: 'trading_expert',
        name: 'Trading Expert',
        description: 'Achieved significant trading milestones',
        icon: '📈',
        category: 'trading',
        earnedAt: new Date()
      });
    }

    // Content Creator Badge
    if (breakdown.qualityContent >= 2000) {
      badges.push({
        id: 'content_creator',
        name: 'Content Creator',
        description: 'Creates valuable educational content',
        icon: '✍️',
        category: 'education',
        earnedAt: new Date()
      });
    }

    // Mentor Badge
    if (breakdown.communityEngagement >= 4000) {
      badges.push({
        id: 'mentor',
        name: 'Mentor',
        description: 'Helps new traders succeed',
        icon: '🎓',
        category: 'mentorship',
        earnedAt: new Date()
      });
    }

    return badges;
  }

  public async logActivity(
    userId: string,
    type: ActivityType,
    metadata: Record<string, any> = {}
  ): Promise<ReputationActivity> {
    const activity: ReputationActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      points: this.activityPoints[type],
      description: this.getActivityDescription(type, metadata),
      timestamp: new Date(),
      metadata
    };

    // Save to database
    await this.saveActivity(activity);

    return activity;
  }

  private getActivityDescription(
    type: ActivityType,
    metadata: Record<string, any>
  ): string {
    switch (type) {
      case 'strategy_published':
        return `Published strategy: ${metadata.strategyName}`;
      case 'strategy_liked':
        return `Strategy liked by ${metadata.likedBy}`;
      case 'question_answered':
        return `Answered question: ${metadata.questionTitle}`;
      case 'answer_accepted':
        return `Answer marked as solution for: ${metadata.questionTitle}`;
      case 'content_created':
        return `Created content: ${metadata.contentTitle}`;
      case 'trading_milestone':
        return `Achieved trading milestone: ${metadata.milestone}`;
      case 'mentorship_provided':
        return `Provided mentorship to ${metadata.mentee}`;
      default:
        return 'Activity logged';
    }
  }

  private async saveActivity(activity: ReputationActivity): Promise<void> {
    // Save to database
  }

  public async getLeaderboard(
    category?: ReputationCategory
  ): Promise<Array<{
    user: User;
    reputation: ReputationScore;
  }>> {
    // Fetch from database
    return [];
  }

  public async getMentorshipRecommendations(
    userId: string
  ): Promise<Array<{
    mentor: User;
    reputation: ReputationScore;
    matchScore: number;
    specialties: string[];
  }>> {
    // Implementation
    return [];
  }

  public async getReputationHistory(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    activities: ReputationActivity[];
    totalEarned: number;
    breakdown: Record<ActivityType, number>;
  }> {
    // Implementation
    return {
      activities: [],
      totalEarned: 0,
      breakdown: {} as Record<ActivityType, number>
    };
  }
} 