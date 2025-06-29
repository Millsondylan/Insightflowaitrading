import { User, Trade, Strategy, LessonProgress } from '../db/types';
import { ReputationScore } from '../community/reputation-system';
import { SupabaseClient } from '@supabase/supabase-js';

// Enhanced analytics event with more detailed tracking
interface AnalyticsEvent {
  id: string;
  userId: string;
  type: string;
  timestamp: Date;
  metadata: Record<string, any>;
  context: {
    deviceInfo: {
      type: string;
      os: string;
      browser: string;
      screenSize: string;
    };
    sessionInfo: {
      id: string;
      startTime: Date;
      duration: number;
      isActive: boolean;
    };
    locationInfo: {
      country: string;
      region: string;
      timezone: string;
    };
    performanceMetrics: {
      loadTime: number;
      responseTime: number;
      renderTime: number;
      resourceUsage: {
        cpu: number;
        memory: number;
        network: number;
      };
    };
  };
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  correlationId?: string;
  parentEventId?: string;
}

// Enhanced metrics interfaces with more detailed tracking
interface UserMetrics {
  userId: string;
  tradingMetrics: TradingMetrics;
  learningMetrics: LearningMetrics;
  engagementMetrics: EngagementMetrics;
  riskMetrics: RiskMetrics;
  psychologicalMetrics: PsychologicalMetrics;
  performanceMetrics: PerformanceMetrics;
  timestamp: Date;
  lastUpdated: Date;
  version: number;
}

interface TradingMetrics {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  averageRR: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitableStrategies: number;
  averageHoldingTime: number;
  bestPerformingPair: string;
  worstPerformingPair: string;
  consistencyScore: number;
  advancedMetrics: {
    calmarRatio: number;
    sortinoRatio: number;
    informationRatio: number;
    alphaScore: number;
    betaScore: number;
    rSquared: number;
    treynorRatio: number;
    jensenAlpha: number;
  };
  riskAdjustedMetrics: {
    valueAtRisk: number;
    conditionalVaR: number;
    downsideDeviation: number;
    omegaRatio: number;
    kappaRatio: number;
  };
  timeBasedAnalysis: {
    hourlyPerformance: Record<number, number>;
    dailyPerformance: Record<string, number>;
    monthlyPerformance: Record<string, number>;
    seasonalityScore: number;
  };
  marketConditionAnalysis: {
    trendingMarket: {
      winRate: number;
      profitFactor: number;
      averageReturn: number;
    };
    rangingMarket: {
      winRate: number;
      profitFactor: number;
      averageReturn: number;
    };
    volatileMarket: {
      winRate: number;
      profitFactor: number;
      averageReturn: number;
    };
  };
}

interface LearningMetrics {
  lessonsCompleted: number;
  quizScore: number;
  practiceTime: number;
  skillProgress: Record<string, number>;
  learningStreak: number;
  comprehensionRate: number;
  reviewEfficiency: number;
  challengeCompletion: number;
  advancedMetrics: {
    knowledgeRetention: number;
    skillApplication: number;
    conceptMastery: Record<string, number>;
    learningVelocity: number;
    adaptabilityScore: number;
  };
  personalizedLearning: {
    preferredLearningStyle: string;
    strengthAreas: string[];
    improvementAreas: string[];
    recommendedPath: string[];
  };
  engagementMetrics: {
    focusTime: number;
    interactionRate: number;
    completionRate: number;
    revisitRate: number;
  };
  performanceMetrics: {
    accuracyTrend: number[];
    speedTrend: number[];
    confidenceScores: number[];
  };
}

interface EngagementMetrics {
  dailyActiveTime: number;
  featureUsage: Record<string, number>;
  socialInteractions: number;
  contentCreated: number;
  communityContributions: number;
  referrals: number;
  feedbackProvided: number;
  toolExploration: number;
  advancedMetrics: {
    userJourney: {
      stageProgress: Record<string, number>;
      milestones: string[];
      nextActions: string[];
    };
    featureAdoption: {
      discoveryRate: number;
      utilizationRate: number;
      masteryRate: number;
    };
    satisfaction: {
      nps: number;
      csat: number;
      featureSatisfaction: Record<string, number>;
    };
    retention: {
      dayRetention: Record<number, number>;
      weekRetention: Record<number, number>;
      monthRetention: Record<number, number>;
    };
  };
}

interface RiskMetrics {
  averageRiskPerTrade: number;
  riskDistribution: number[];
  positionSizing: number;
  leverageUsage: number;
  marginUtilization: number;
  portfolioDiversification: number;
  correlationScore: number;
  volatilityExposure: number;
  advancedMetrics: {
    riskAdjustedReturn: number;
    expectedShortfall: number;
    stressTestResults: {
      scenario: string;
      impact: number;
      probability: number;
    }[];
    concentrationRisk: {
      asset: number;
      sector: number;
      strategy: number;
    };
    liquidityRisk: {
      score: number;
      factors: Record<string, number>;
    };
  };
}

interface PsychologicalMetrics {
  emotionalControl: number;
  disciplineScore: number;
  confidenceLevel: number;
  stressManagement: number;
  decisionQuality: {
    accuracy: number;
    consistency: number;
    speed: number;
  };
  behavioralPatterns: {
    overtrading: number;
    revengeTradingRisk: number;
    fomo: number;
    lossAversion: number;
  };
  adaptabilityScore: {
    marketChange: number;
    strategyChange: number;
    riskChange: number;
  };
  mentalState: {
    focus: number;
    fatigue: number;
    motivation: number;
  };
}

interface PerformanceMetrics {
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    resourceUtilization: {
      cpu: number;
      memory: number;
      network: number;
      storage: number;
    };
  };
  userExperience: {
    pageLoadTime: number;
    interactionLatency: number;
    errorFrequency: number;
    satisfactionScore: number;
  };
  technicalMetrics: {
    apiPerformance: {
      latency: number;
      throughput: number;
      errorRate: number;
    };
    databasePerformance: {
      queryTime: number;
      connectionPool: number;
      cacheHitRate: number;
    };
    networkMetrics: {
      bandwidth: number;
      latency: number;
      packetLoss: number;
    };
  };
}

export class AnalyticsSystem {
  private supabase: SupabaseClient;
  private eventBuffer: AnalyticsEvent[] = [];
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL = 60000; // 1 minute
  private readonly BATCH_SIZE = 50;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 seconds

  private metricsCache: Map<string, UserMetrics> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes
  private readonly CACHE_CLEANUP_INTERVAL = 900000; // 15 minutes

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.initializeSystem();
  }

  private async initializeSystem(): Promise<void> {
    this.startEventProcessing();
    this.startCacheCleanup();
    await this.loadInitialData();
  }

  private startEventProcessing(): void {
    setInterval(() => this.processEventBuffer(), this.FLUSH_INTERVAL);
  }

  private startCacheCleanup(): void {
    setInterval(() => this.cleanupCache(), this.CACHE_CLEANUP_INTERVAL);
  }

  private async loadInitialData(): Promise<void> {
    try {
      const { data: activeUsers, error } = await this.supabase
        .from('users')
        .select('id')
        .eq('status', 'active')
        .limit(1000);

      if (error) throw error;

      await Promise.all(
        activeUsers.map(user => this.preloadUserMetrics(user.id))
      );
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  private async preloadUserMetrics(userId: string): Promise<void> {
    try {
      const metrics = await this.calculateUserMetrics(userId);
      this.metricsCache.set(userId, metrics);
    } catch (error) {
      console.error(`Error preloading metrics for user ${userId}:`, error);
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [userId, metrics] of this.metricsCache.entries()) {
      if (now - metrics.lastUpdated.getTime() > this.CACHE_TTL) {
        this.metricsCache.delete(userId);
      }
    }
  }

  public async trackEvent(
    userId: string,
    type: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const event: AnalyticsEvent = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      timestamp: new Date(),
      metadata,
      context: {
        deviceInfo: {
          type: 'unknown',
          os: 'unknown',
          browser: 'unknown',
          screenSize: 'unknown'
        },
        sessionInfo: {
          id: Math.random().toString(36).substr(2, 9),
          startTime: new Date(),
          duration: 0,
          isActive: true
        },
        locationInfo: {
          country: 'unknown',
          region: 'unknown',
          timezone: 'unknown'
        },
        performanceMetrics: {
          loadTime: 0,
          responseTime: 0,
          renderTime: 0,
          resourceUsage: {
            cpu: 0,
            memory: 0,
            network: 0
          }
        }
      },
      tags: [],
      priority: 'low',
      processingStatus: 'pending',
      retryCount: 0
    };

    this.eventBuffer.push(event);

    if (this.eventBuffer.length >= this.BUFFER_SIZE) {
      await this.flushEvents();
    }
  }

  private async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      const { error } = await this.supabase
        .from('analytics_events')
        .insert(events);

      if (error) {
        console.error('Error flushing events:', error);
        this.eventBuffer = [...events, ...this.eventBuffer];
      }
    } catch (error) {
      console.error('Error flushing events:', error);
      this.eventBuffer = [...events, ...this.eventBuffer];
    }
  }

  public async calculateUserMetrics(userId: string): Promise<UserMetrics> {
    const [
      trades,
      learningProgress,
      reputation,
      strategies
    ] = await Promise.all([
      this.getUserTrades(userId),
      this.getLearningProgress(userId),
      this.getReputationScore(userId),
      this.getUserStrategies(userId)
    ]);

    return {
      userId,
      tradingMetrics: await this.calculateTradingMetrics(trades, strategies),
      learningMetrics: await this.calculateLearningMetrics(learningProgress),
      engagementMetrics: await this.calculateEngagementMetrics(userId, reputation),
      riskMetrics: await this.calculateRiskMetrics(trades),
      psychologicalMetrics: await this.calculatePsychologicalMetrics(userId),
      performanceMetrics: await this.calculatePerformanceMetrics(userId),
      timestamp: new Date(),
      lastUpdated: new Date(),
      version: 1
    };
  }

  private async calculateTradingMetrics(
    trades: Trade[],
    strategies: Strategy[]
  ): Promise<tradingMetrics> {
    const profitableTrades = trades.filter(t => t.profit > 0);
    const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
    const totalLoss = trades.reduce((sum, t) => t.profit < 0 ? sum + Math.abs(t.profit) : sum, 0);
    const profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;

    const returns = this.calculateReturns(trades);
    const sharpeRatio = this.calculateSharpeRatio(returns);
    const maxDrawdown = this.calculateMaxDrawdown(returns);

    const holdingTimes = trades.map(t => 
      new Date(t.closeTime).getTime() - new Date(t.openTime).getTime()
    );

    const pairPerformance = this.calculatePairPerformance(trades);
    const consistencyScore = this.calculateConsistencyScore(trades);

    return {
      totalTrades: trades.length,
      winRate: trades.length > 0 ? profitableTrades.length / trades.length : 0,
      profitFactor,
      averageRR: this.calculateAverageRR(trades),
      sharpeRatio,
      maxDrawdown,
      profitableStrategies: strategies.filter(s => s.performance.profitFactor > 1).length,
      averageHoldingTime: holdingTimes.reduce((a, b) => a + b, 0) / trades.length,
      bestPerformingPair: pairPerformance.best,
      worstPerformingPair: pairPerformance.worst,
      consistencyScore,
      advancedMetrics: {
        calmarRatio: this.calculateCalmarRatio(returns),
        sortinoRatio: this.calculateSortinoRatio(returns),
        informationRatio: this.calculateInformationRatio(returns),
        alphaScore: this.calculateAlphaScore(returns),
        betaScore: this.calculateBetaScore(returns),
        rSquared: this.calculateRSquared(returns),
        treynorRatio: this.calculateTreynorRatio(returns),
        jensenAlpha: this.calculateJensenAlpha(returns)
      },
      riskAdjustedMetrics: {
        valueAtRisk: this.calculateValueAtRisk(returns),
        conditionalVaR: this.calculateConditionalVaR(returns),
        downsideDeviation: this.calculateDownsideDeviation(returns),
        omegaRatio: this.calculateOmegaRatio(returns),
        kappaRatio: this.calculateKappaRatio(returns)
      },
      timeBasedAnalysis: {
        hourlyPerformance: this.calculateHourlyPerformance(returns),
        dailyPerformance: this.calculateDailyPerformance(returns),
        monthlyPerformance: this.calculateMonthlyPerformance(returns),
        seasonalityScore: this.calculateSeasonalityScore(returns)
      },
      marketConditionAnalysis: {
        trendingMarket: {
          winRate: this.calculateTrendingMarketWinRate(trades),
          profitFactor: this.calculateTrendingMarketProfitFactor(trades),
          averageReturn: this.calculateTrendingMarketAverageReturn(trades)
        },
        rangingMarket: {
          winRate: this.calculateRangingMarketWinRate(trades),
          profitFactor: this.calculateRangingMarketProfitFactor(trades),
          averageReturn: this.calculateRangingMarketAverageReturn(trades)
        },
        volatileMarket: {
          winRate: this.calculateVolatileMarketWinRate(trades),
          profitFactor: this.calculateVolatileMarketProfitFactor(trades),
          averageReturn: this.calculateVolatileMarketAverageReturn(trades)
        }
      }
    };
  }

  private calculateReturns(trades: Trade[]): number[] {
    return trades.map(trade => trade.profit / trade.openPrice);
  }

  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    );
    
    return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252); // Annualized
  }

  private calculateMaxDrawdown(returns: number[]): number {
    let peak = 0;
    let maxDrawdown = 0;
    let runningTotal = 1;

    returns.forEach(return_ => {
      runningTotal *= (1 + return_);
      if (runningTotal > peak) peak = runningTotal;
      const drawdown = (peak - runningTotal) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    return maxDrawdown;
  }

  private calculateAverageRR(trades: Trade[]): number {
    if (trades.length === 0) return 0;
    
    const rrs = trades.map(trade => 
      trade.profit / (trade.stopLoss ? Math.abs(trade.openPrice - trade.stopLoss) : trade.openPrice)
    );
    
    return rrs.reduce((a, b) => a + b, 0) / trades.length;
  }

  private calculatePairPerformance(trades: Trade[]): { best: string; worst: string } {
    const pairStats = new Map<string, { profit: number; count: number }>();
    
    trades.forEach(trade => {
      const stats = pairStats.get(trade.pair) || { profit: 0, count: 0 };
      stats.profit += trade.profit;
      stats.count++;
      pairStats.set(trade.pair, stats);
    });

    let bestPair = '', worstPair = '';
    let bestProfit = -Infinity, worstProfit = Infinity;

    pairStats.forEach((stats, pair) => {
      const avgProfit = stats.profit / stats.count;
      if (avgProfit > bestProfit) {
        bestProfit = avgProfit;
        bestPair = pair;
      }
      if (avgProfit < worstProfit) {
        worstProfit = avgProfit;
        worstPair = pair;
      }
    });

    return { best: bestPair, worst: worstPair };
  }

  private calculateConsistencyScore(trades: Trade[]): number {
    if (trades.length < 2) return 0;

    const profits = trades.map(t => t.profit);
    const mean = profits.reduce((a, b) => a + b, 0) / profits.length;
    const variance = profits.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / profits.length;
    const stdDev = Math.sqrt(variance);

    // Lower coefficient of variation indicates more consistency
    const cv = Math.abs(mean) < 0.0001 ? Infinity : stdDev / Math.abs(mean);
    
    // Convert to 0-100 score, where lower CV means higher consistency
    return Math.max(0, Math.min(100, 100 * (1 - cv / 2)));
  }

  private async calculateLearningMetrics(
    progress: LessonProgress[]
  ): Promise<LearningMetrics> {
    const quizScores = progress.map(p => p.quizScore);
    const avgQuizScore = quizScores.reduce((a, b) => a + b, 0) / quizScores.length;

    const skillProgress = this.calculateSkillProgress(progress);
    const comprehensionRate = this.calculateComprehensionRate(progress);
    const reviewEfficiency = this.calculateReviewEfficiency(progress);

    return {
      lessonsCompleted: progress.length,
      quizScore: avgQuizScore,
      practiceTime: progress.reduce((sum, p) => sum + p.practiceTime, 0),
      skillProgress,
      learningStreak: this.calculateLearningStreak(progress),
      comprehensionRate,
      reviewEfficiency,
      challengeCompletion: this.calculateChallengeCompletion(progress),
      advancedMetrics: {
        knowledgeRetention: this.calculateKnowledgeRetention(progress),
        skillApplication: this.calculateSkillApplication(progress),
        conceptMastery: this.calculateConceptMastery(progress),
        learningVelocity: this.calculateLearningVelocity(progress),
        adaptabilityScore: this.calculateAdaptabilityScore(progress)
      },
      personalizedLearning: {
        preferredLearningStyle: this.calculatePreferredLearningStyle(progress),
        strengthAreas: this.calculateStrengthAreas(progress),
        improvementAreas: this.calculateImprovementAreas(progress),
        recommendedPath: this.calculateRecommendedPath(progress)
      },
      engagementMetrics: {
        focusTime: this.calculateFocusTime(progress),
        interactionRate: this.calculateInteractionRate(progress),
        completionRate: this.calculateCompletionRate(progress),
        revisitRate: this.calculateRevisitRate(progress)
      },
      performanceMetrics: {
        accuracyTrend: this.calculateAccuracyTrend(progress),
        speedTrend: this.calculateSpeedTrend(progress),
        confidenceScores: this.calculateConfidenceScores(progress)
      }
    };
  }

  private calculateSkillProgress(progress: LessonProgress[]): Record<string, number> {
    const skillProgress: Record<string, number> = {};
    
    progress.forEach(p => {
      p.skills.forEach(skill => {
        if (!skillProgress[skill.name]) {
          skillProgress[skill.name] = 0;
        }
        skillProgress[skill.name] = Math.max(skillProgress[skill.name], skill.level);
      });
    });

    return skillProgress;
  }

  private calculateComprehensionRate(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    const comprehensionScores = progress.map(p => ({
      quizScore: p.quizScore,
      practiceSuccess: p.practiceResults.successRate,
      reviewRetention: p.reviewResults.retentionRate
    }));

    return comprehensionScores.reduce((sum, scores) => 
      sum + (scores.quizScore + scores.practiceSuccess + scores.reviewRetention) / 3
    , 0) / progress.length;
  }

  private calculateReviewEfficiency(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    const reviewScores = progress.map(p => ({
      timeBetweenReviews: p.reviewResults.timeBetweenReviews,
      retentionImprovement: p.reviewResults.retentionImprovement,
      reviewCount: p.reviewResults.count
    }));

    return reviewScores.reduce((sum, scores) => 
      sum + (scores.retentionImprovement / scores.timeBetweenReviews) * scores.reviewCount
    , 0) / progress.length;
  }

  private calculateLearningStreak(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    let streak = 0;
    let currentStreak = 0;
    let lastDate = new Date(0);

    progress
      .map(p => new Date(p.completedAt))
      .sort((a, b) => a.getTime() - b.getTime())
      .forEach(date => {
        const dayDiff = Math.floor(
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          currentStreak++;
          streak = Math.max(streak, currentStreak);
        } else if (dayDiff > 1) {
          currentStreak = 1;
        }

        lastDate = date;
      });

    return streak;
  }

  private calculateChallengeCompletion(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    const challengeStats = progress.map(p => ({
      attempted: p.challenges.total,
      completed: p.challenges.completed,
      difficulty: p.challenges.averageDifficulty
    }));

    return challengeStats.reduce((sum, stats) => 
      sum + (stats.completed / stats.attempted) * stats.difficulty
    , 0) / progress.length * 100;
  }

  private calculateKnowledgeRetention(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    const retentionScores = progress.map(p => ({
      quizScore: p.quizScore,
      practiceRetention: p.practiceResults.successRate,
      reviewRetention: p.reviewResults.retentionRate
    }));

    return retentionScores.reduce((sum, scores) => 
      sum + (scores.quizScore + scores.practiceRetention + scores.reviewRetention) / 3
    , 0) / progress.length;
  }

  private calculateSkillApplication(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    const applicationScores = progress.map(p => ({
      practiceSuccess: p.practiceResults.successRate,
      applicationRate: p.applicationResults.successRate
    }));

    return applicationScores.reduce((sum, scores) => 
      sum + (scores.practiceSuccess + scores.applicationRate) / 2
    , 0) / progress.length;
  }

  private calculateConceptMastery(progress: LessonProgress[]): Record<string, number> {
    if (progress.length === 0) return {};

    const masteryScores = progress.map(p => ({
      concept: p.concept,
      masteryLevel: p.masteryLevel
    }));

    const conceptMastery: Record<string, number> = {};
    masteryScores.forEach(scores => {
      if (!conceptMastery[scores.concept]) {
        conceptMastery[scores.concept] = 0;
      }
      conceptMastery[scores.concept] = Math.max(conceptMastery[scores.concept], scores.masteryLevel);
    });

    return conceptMastery;
  }

  private calculateLearningVelocity(progress: LessonProgress[]): number {
    if (progress.length < 2) return 0;

    const firstDate = new Date(progress[0].completedAt);
    const lastDate = new Date(progress[progress.length - 1].completedAt);
    const timeDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

    return progress.length / timeDiff;
  }

  private calculatePreferredLearningStyle(progress: LessonProgress[]): string {
    if (progress.length === 0) return 'unknown';

    const styles = progress.map(p => p.learningStyle);
    const styleCounts: Record<string, number> = {};

    styles.forEach(style => {
      if (!styleCounts[style]) {
        styleCounts[style] = 0;
      }
      styleCounts[style]++;
    });

    let preferredStyle = 'unknown';
    let maxCount = 0;

    for (const [style, count] of Object.entries(styleCounts)) {
      if (count > maxCount) {
        maxCount = count;
        preferredStyle = style;
      }
    }

    return preferredStyle;
  }

  private calculateStrengthAreas(progress: LessonProgress[]): string[] {
    if (progress.length === 0) return [];

    const strengths: Record<string, number> = {};

    progress.forEach(p => {
      p.skills.forEach(skill => {
        if (!strengths[skill.name]) {
          strengths[skill.name] = 0;
        }
        strengths[skill.name] += skill.level;
      });
    });

    const topStrengths = Object.entries(strengths)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    return topStrengths;
  }

  private calculateImprovementAreas(progress: LessonProgress[]): string[] {
    if (progress.length === 0) return [];

    const weaknesses: Record<string, number> = {};

    progress.forEach(p => {
      p.skills.forEach(skill => {
        if (!weaknesses[skill.name]) {
          weaknesses[skill.name] = 0;
        }
        weaknesses[skill.name] += 1 - skill.level;
      });
    });

    const topWeaknesses = Object.entries(weaknesses)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    return topWeaknesses;
  }

  private calculateRecommendedPath(progress: LessonProgress[]): string[] {
    if (progress.length === 0) return [];

    const recommendedPaths: Record<string, number> = {};

    progress.forEach(p => {
      p.recommendedPath.forEach(path => {
        if (!recommendedPaths[path]) {
          recommendedPaths[path] = 0;
        }
        recommendedPaths[path]++;
      });
    });

    const topPaths = Object.entries(recommendedPaths)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    return topPaths;
  }

  private calculateFocusTime(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    const focusTimes = progress.map(p => p.focusTime);
    return focusTimes.reduce((sum, time) => sum + time, 0) / progress.length;
  }

  private calculateInteractionRate(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    const interactionCounts = progress.map(p => p.interactionCount);
    return interactionCounts.reduce((sum, count) => sum + count, 0) / progress.length;
  }

  private calculateCompletionRate(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    const completionCounts = progress.map(p => p.completionCount);
    return completionCounts.reduce((sum, count) => sum + count, 0) / progress.length;
  }

  private calculateRevisitRate(progress: LessonProgress[]): number {
    if (progress.length === 0) return 0;

    const revisitCounts = progress.map(p => p.revisitCount);
    return revisitCounts.reduce((sum, count) => sum + count, 0) / progress.length;
  }

  private calculateAccuracyTrend(progress: LessonProgress[]): number[] {
    if (progress.length < 2) return [];

    const accuracyScores = progress.map(p => p.accuracyScore);
    const trend: number[] = [];

    for (let i = 1; i < accuracyScores.length; i++) {
      const change = accuracyScores[i] - accuracyScores[i - 1];
      trend.push(change);
    }

    return trend;
  }

  private calculateSpeedTrend(progress: LessonProgress[]): number[] {
    if (progress.length < 2) return [];

    const speedScores = progress.map(p => p.speedScore);
    const trend: number[] = [];

    for (let i = 1; i < speedScores.length; i++) {
      const change = speedScores[i] - speedScores[i - 1];
      trend.push(change);
    }

    return trend;
  }

  private calculateConfidenceScores(progress: LessonProgress[]): number[] {
    if (progress.length === 0) return [];

    const confidenceScores = progress.map(p => p.confidenceScore);
    return confidenceScores;
  }

  private async calculateEngagementMetrics(
    userId: string,
    reputation: ReputationScore
  ): Promise<EngagementMetrics> {
    const [
      activityLog,
      featureUsage,
      socialStats
    ] = await Promise.all([
      this.getUserActivityLog(userId),
      this.getFeatureUsage(userId),
      this.getSocialStats(userId)
    ]);

    return {
      dailyActiveTime: this.calculateDailyActiveTime(activityLog),
      featureUsage: this.calculateFeatureUsage(featureUsage),
      socialInteractions: socialStats.interactions,
      contentCreated: socialStats.contentCreated,
      communityContributions: reputation.breakdown.communityEngagement,
      referrals: socialStats.referrals,
      feedbackProvided: socialStats.feedbackCount,
      toolExploration: this.calculateToolExploration(featureUsage),
      advancedMetrics: {
        userJourney: {
          stageProgress: this.calculateStageProgress(activityLog),
          milestones: this.calculateMilestones(activityLog),
          nextActions: this.calculateNextActions(activityLog)
        },
        featureAdoption: {
          discoveryRate: this.calculateDiscoveryRate(featureUsage),
          utilizationRate: this.calculateUtilizationRate(featureUsage),
          masteryRate: this.calculateMasteryRate(featureUsage)
        },
        satisfaction: {
          nps: this.calculateNPS(socialStats),
          csat: this.calculateCSAT(socialStats),
          featureSatisfaction: this.calculateFeatureSatisfaction(featureUsage)
        },
        retention: {
          dayRetention: this.calculateDayRetention(activityLog),
          weekRetention: this.calculateWeekRetention(activityLog),
          monthRetention: this.calculateMonthRetention(activityLog)
        }
      }
    };
  }

  private async calculateRiskMetrics(trades: Trade[]): Promise<RiskMetrics> {
    const riskPerTrade = trades.map(t => 
      (t.stopLoss ? Math.abs(t.openPrice - t.stopLoss) : 0) * t.size
    );

    const portfolioStats = await this.calculatePortfolioStats(trades);

    return {
      averageRiskPerTrade: riskPerTrade.reduce((a, b) => a + b, 0) / trades.length,
      riskDistribution: this.calculateRiskDistribution(riskPerTrade),
      positionSizing: this.calculatePositionSizing(trades),
      leverageUsage: this.calculateAverageLeverage(trades),
      marginUtilization: this.calculateMarginUtilization(trades),
      portfolioDiversification: portfolioStats.diversification,
      correlationScore: portfolioStats.correlation,
      volatilityExposure: portfolioStats.volatility,
      advancedMetrics: {
        riskAdjustedReturn: this.calculateRiskAdjustedReturn(trades),
        expectedShortfall: this.calculateExpectedShortfall(trades),
        stressTestResults: this.calculateStressTestResults(trades),
        concentrationRisk: this.calculateConcentrationRisk(trades),
        liquidityRisk: this.calculateLiquidityRisk(trades)
      }
    };
  }

  private calculateRiskDistribution(risks: number[]): number[] {
    if (risks.length === 0) return [];

    const min = Math.min(...risks);
    const max = Math.max(...risks);
    const range = max - min;
    const bucketCount = 10;
    const bucketSize = range / bucketCount;

    const distribution = new Array(bucketCount).fill(0);

    risks.forEach(risk => {
      const bucketIndex = Math.min(
        Math.floor((risk - min) / bucketSize),
        bucketCount - 1
      );
      distribution[bucketIndex]++;
    });

    return distribution.map(count => count / risks.length);
  }

  private calculatePositionSizing(trades: Trade[]): number {
    if (trades.length === 0) return 0;

    const accountSizes = trades.map(t => t.accountSize);
    const positionSizes = trades.map(t => t.size * t.openPrice);
    
    return positionSizes.reduce((sum, size, i) => 
      sum + (size / accountSizes[i])
    , 0) / trades.length;
  }

  private calculateAverageLeverage(trades: Trade[]): number {
    if (trades.length === 0) return 0;
    return trades.reduce((sum, t) => sum + t.leverage, 0) / trades.length;
  }

  private calculateMarginUtilization(trades: Trade[]): number {
    if (trades.length === 0) return 0;
    
    return trades.reduce((sum, t) => 
      sum + (t.marginUsed / t.accountSize)
    , 0) / trades.length;
  }

  private async calculatePortfolioStats(
    trades: Trade[]
  ): Promise<{
    diversification: number;
    correlation: number;
    volatility: number;
  }> {
    if (trades.length === 0) {
      return { diversification: 0, correlation: 0, volatility: 0 };
    }

    const pairs = [...new Set(trades.map(t => t.pair))];
    const pairReturns = new Map<string, number[]>();

    // Calculate returns per pair
    pairs.forEach(pair => {
      const pairTrades = trades.filter(t => t.pair === pair);
      pairReturns.set(pair, pairTrades.map(t => t.profit / t.openPrice));
    });

    // Calculate correlation matrix
    const correlationMatrix = this.calculateCorrelationMatrix(pairReturns);

    // Calculate average correlation
    let totalCorr = 0, corrCount = 0;
    correlationMatrix.forEach((row, i) => {
      row.forEach((corr, j) => {
        if (i < j) {
          totalCorr += Math.abs(corr);
          corrCount++;
        }
      });
    });

    const avgCorrelation = corrCount > 0 ? totalCorr / corrCount : 0;

    // Calculate portfolio volatility
    const returns = trades.map(t => t.profit / t.openPrice);
    const volatility = this.calculateVolatility(returns);

    // Calculate diversification score
    const diversification = pairs.length > 1 
      ? (1 - avgCorrelation) * Math.min(pairs.length / 10, 1)
      : 0;

    return {
      diversification: diversification * 100,
      correlation: (1 - avgCorrelation) * 100,
      volatility
    };
  }

  private calculateCorrelationMatrix(
    pairReturns: Map<string, number[]>
  ): number[][] {
    const pairs = [...pairReturns.keys()];
    const matrix: number[][] = Array(pairs.length).fill(0).map(() => 
      Array(pairs.length).fill(0)
    );

    pairs.forEach((pair1, i) => {
      pairs.forEach((pair2, j) => {
        if (i === j) {
          matrix[i][j] = 1;
        } else if (i < j) {
          const correlation = this.calculateCorrelation(
            pairReturns.get(pair1)!,
            pairReturns.get(pair2)!
          );
          matrix[i][j] = matrix[j][i] = correlation;
        }
      });
    });

    return matrix;
  }

  private calculateCorrelation(returns1: number[], returns2: number[]): number {
    const n = Math.min(returns1.length, returns2.length);
    if (n < 2) return 0;

    const mean1 = returns1.reduce((a, b) => a + b, 0) / n;
    const mean2 = returns2.reduce((a, b) => a + b, 0) / n;

    const variance1 = returns1.reduce((sum, r) => sum + Math.pow(r - mean1, 2), 0) / n;
    const variance2 = returns2.reduce((sum, r) => sum + Math.pow(r - mean2, 2), 0) / n;

    if (variance1 === 0 || variance2 === 0) return 0;

    const covariance = returns1
      .slice(0, n)
      .reduce((sum, r, i) => sum + (r - mean1) * (returns2[i] - mean2), 0) / n;

    return covariance / (Math.sqrt(variance1) * Math.sqrt(variance2));
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length < 2) return 0;

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility in percentage
  }

  private calculateRiskAdjustedReturn(trades: Trade[]): number {
    if (trades.length === 0) return 0;

    const returns = trades.map(t => t.profit / t.openPrice);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    
    return avgReturn / stdDev;
  }

  private calculateExpectedShortfall(trades: Trade[]): number {
    if (trades.length === 0) return 0;

    const returns = trades.map(t => t.profit / t.openPrice);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    
    const zScore = (avgReturn - 0) / stdDev;
    const expectedShortfall = avgReturn - zScore * stdDev;
    
    return expectedShortfall;
  }

  private calculateStressTestResults(trades: Trade[]): { scenario: string; impact: number; probability: number }[] {
    if (trades.length === 0) return [];

    const returns = trades.map(t => t.profit / t.openPrice);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    
    const scenarios = [
      { scenario: 'Bear Market', impact: -0.2, probability: 0.2 },
      { scenario: 'Moderate Market', impact: -0.1, probability: 0.5 },
      { scenario: 'Bull Market', impact: 0.1, probability: 0.3 }
    ];

    const results: { scenario: string; impact: number; probability: number }[] = [];

    scenarios.forEach(scenario => {
      const scenarioReturn = avgReturn + scenario.impact * stdDev;
      const scenarioProbability = scenario.probability;
      const scenarioImpact = scenarioReturn - avgReturn;
      results.push({ scenario: scenario.scenario, impact: scenarioImpact, probability: scenarioProbability });
    });

    return results;
  }

  private calculateConcentrationRisk(trades: Trade[]): { asset: number; sector: number; strategy: number } {
    if (trades.length === 0) return { asset: 0, sector: 0, strategy: 0 };

    const pairs = [...new Set(trades.map(t => t.pair))];
    const pairReturns = new Map<string, number[]>();

    // Calculate returns per pair
    pairs.forEach(pair => {
      const pairTrades = trades.filter(t => t.pair === pair);
      pairReturns.set(pair, pairTrades.map(t => t.profit / t.openPrice));
    });

    // Calculate correlation matrix
    const correlationMatrix = this.calculateCorrelationMatrix(pairReturns);

    // Calculate average correlation
    let totalCorr = 0, corrCount = 0;
    correlationMatrix.forEach((row, i) => {
      row.forEach((corr, j) => {
        if (i < j) {
          totalCorr += Math.abs(corr);
          corrCount++;
        }
      });
    });

    const avgCorrelation = corrCount > 0 ? totalCorr / corrCount : 0;

    // Calculate portfolio volatility
    const returns = trades.map(t => t.profit / t.openPrice);
    const volatility = this.calculateVolatility(returns);

    // Calculate diversification score
    const diversification = pairs.length > 1 
      ? (1 - avgCorrelation) * Math.min(pairs.length / 10, 1)
      : 0;

    // Calculate concentration risk
    const assetRisk = volatility;
    const sectorRisk = avgCorrelation * volatility;
    const strategyRisk = diversification * volatility;

    return {
      asset: assetRisk,
      sector: sectorRisk,
      strategy: strategyRisk
    };
  }

  private calculateLiquidityRisk(trades: Trade[]): { score: number; factors: Record<string, number> } {
    if (trades.length === 0) return { score: 0, factors: {} };

    const liquidityScores = trades.map(t => {
      const liquidity = t.size / t.accountSize;
      const liquidityScore = liquidity < 0.1 ? 0.1 : liquidity > 0.9 ? 0.9 : liquidity;
      return liquidityScore;
    });

    const avgLiquidityScore = liquidityScores.reduce((sum, score) => sum + score, 0) / liquidityScores.length;

    const liquidityRiskFactors: Record<string, number> = {};
    liquidityScores.forEach(score => {
      const factor = Math.abs(score - avgLiquidityScore);
      liquidityRiskFactors[`liquidity_${score.toFixed(2)}`] = factor;
    });

    const liquidityRiskScore = liquidityRiskFactors.reduce((sum, factor) => sum + factor, 0) / liquidityRiskFactors.length;

    return {
      score: liquidityRiskScore,
      factors: liquidityRiskFactors
    };
  }

  // Database interaction methods
  private async getUserTrades(userId: string): Promise<trade[]> {
    const { data, error } = await this.supabase
      .from('trades')
      .select('*')
      .eq('userId', userId)
      .order('openTime', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  private async getLearningProgress(userId: string): Promise<LessonProgress[]> {
    const { data, error } = await this.supabase
      .from('lesson_progress')
      .select('*')
      .eq('userId', userId)
      .order('completedAt', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  private async getReputationScore(userId: string): Promise<ReputationScore> {
    const { data, error } = await this.supabase
      .from('reputation_scores')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    return data;
  }

  private async getUserStrategies(userId: string): Promise<Strategy[]> {
    const { data, error } = await this.supabase
      .from('strategies')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;
    return data || [];
  }

  private async getUserActivityLog(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('activity_log')
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  private async getFeatureUsage(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('feature_usage')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;
    return data || [];
  }

  private async getSocialStats(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('social_stats')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    return data || {
      interactions: 0,
      contentCreated: 0,
      referrals: 0,
      feedbackCount: 0
    };
  }

  private calculateDailyActiveTime(activityLog: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): number {
    if (activityLog.length === 0) return 0;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayActivities = activityLog.filter(activity =>
      new Date(activity.timestamp) >= todayStart
    );

    return todayActivities.reduce((sum, activity) => 
      sum + (activity.duration || 0)
    , 0);
  }

  private calculateFeatureUsage(usage: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): Record<string, number> {
    const featureUsage: Record<string, number> = {};
    
    usage.forEach(u => {
      if (!featureUsage[u.feature]) {
        featureUsage[u.feature] = 0;
      }
      featureUsage[u.feature] += u.count;
    });

    return featureUsage;
  }

  private calculateToolExploration(usage: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): number {
    const totalFeatures = Object.keys(usage).length;
    const usedFeatures = usage.filter(u => u.count > 0).length;
    
    return (usedFeatures / totalFeatures) * 100;
  }

  private calculateStageProgress(activityLog: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): Record<string, number> {
    if (activityLog.length === 0) return {};

    const stages: Record<string, number> = {};

    activityLog.forEach(activity => {
      if (activity.stage) {
        if (!stages[activity.stage]) {
          stages[activity.stage] = 0;
        }
        stages[activity.stage]++;
      }
    });

    const totalActivities = activityLog.length;
    const progress: Record<string, number> = {};

    for (const [stage, count] of Object.entries(stages)) {
      progress[stage] = count / totalActivities;
    }

    return progress;
  }

  private calculateMilestones(activityLog: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): string[] {
    if (activityLog.length === 0) return [];

    const milestones: string[] = [];

    activityLog.forEach(activity => {
      if (activity.milestone) {
        milestones.push(activity.milestone);
      }
    });

    return [...new Set(milestones)];
  }

  private calculateNextActions(activityLog: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): string[] {
    if (activityLog.length === 0) return [];

    const nextActions: string[] = [];

    activityLog.forEach(activity => {
      if (activity.nextAction) {
        nextActions.push(activity.nextAction);
      }
    });

    return [...new Set(nextActions)];
  }

  private calculateDiscoveryRate(usage: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): number {
    if (usage.length === 0) return 0;

    const totalFeatures = Object.keys(usage).length;
    const usedFeatures = usage.filter(u => u.count > 0).length;
    
    return (usedFeatures / totalFeatures) * 100;
  }

  private calculateUtilizationRate(usage: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): number {
    if (usage.length === 0) return 0;

    const totalFeatures = Object.keys(usage).length;
    const usedFeatures = usage.filter(u => u.count > 0).length;
    
    return (usedFeatures / totalFeatures) * 100;
  }

  private calculateMasteryRate(usage: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): number {
    if (usage.length === 0) return 0;

    const totalFeatures = Object.keys(usage).length;
    const masteredFeatures = usage.filter(u => u.level === 100).length;
    
    return (masteredFeatures / totalFeatures) * 100;
  }

  private calculateNPS(socialStats: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): number {
    if (socialStats.feedbackCount === 0) return 0;

    const promoters = socialStats.feedback.filter(f => f.rating >= 9).length;
    const detractors = socialStats.feedback.filter(f => f.rating <= 6).length;
    
    const nps = ((promoters - detractors) / socialStats.feedbackCount) * 100;
    return nps;
  }

  private calculateCSAT(socialStats: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): number {
    if (socialStats.feedbackCount === 0) return 0;

    const satisfiedCount = socialStats.feedback.filter(f => f.rating >= 7).length;
    
    const csat = (satisfiedCount / socialStats.feedbackCount) * 100;
    return csat;
  }

  private calculateFeatureSatisfaction(usage: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): Record<string, number> {
    if (usage.length === 0) return {};

    const satisfactionScores: Record<string, number> = {};

    usage.forEach(u => {
      if (!satisfactionScores[u.feature]) {
        satisfactionScores[u.feature] = 0;
      }
      satisfactionScores[u.feature] += u.rating;
    });

    const totalFeatures = Object.keys(usage).length;
    const satisfaction: Record<string, number> = {};

    for (const [feature, score] of Object.entries(satisfactionScores)) {
      satisfaction[feature] = score / totalFeatures;
    }

    return satisfaction;
  }

  private calculateDayRetention(activityLog: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): Record<number, number> {
    if (activityLog.length === 0) return {};

    const retention: Record<number, number> = {};

    activityLog.forEach(activity => {
      const day = new Date(activity.timestamp).getDate();
      if (!retention[day]) {
        retention[day] = 0;
      }
      retention[day]++;
    });

    return retention;
  }

  private calculateWeekRetention(activityLog: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): Record<number, number> {
    if (activityLog.length === 0) return {};

    const retention: Record<number, number> = {};

    activityLog.forEach(activity => {
      const week = Math.floor(new Date(activity.timestamp).getTime() / (1000 * 60 * 60 * 24 * 7));
      if (!retention[week]) {
        retention[week] = 0;
      }
      retention[week]++;
    });

    return retention;
  }

  private calculateMonthRetention(activityLog: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): Record<number, number> {
    if (activityLog.length === 0) return {};

    const retention: Record<number, number> = {};

    activityLog.forEach(activity => {
} 