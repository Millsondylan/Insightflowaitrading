import { OpenAI } from 'openai';
import { Trade } from '../strategy/types';
import * as tf from '@tensorflow/tfjs';
import { JournalEntry, PsychologicalAnalysis, EmotionalState, BehavioralPattern } from './types';

export interface PsychologicalProfile {
  emotionalBias: EmotionalBias;
  behavioralPatterns: BehavioralPatterns;
  riskManagement: RiskManagement;
  tradingStyle: TradingStyle;
  personalityTraits: PersonalityTraits;
  stressIndicators: StressIndicators;
  recommendations: Recommendation[];
  timestamp: Date;
}

export interface EmotionalBias {
  fearLevel: number;  // 0-1
  greedLevel: number;  // 0-1
  overconfidence: number;  // 0-1
  hesitation: number;  // 0-1
  anxiety: number;  // 0-1
  euphoria: number;  // 0-1
  frustration: number;  // 0-1
  dominantEmotion: string;
  emotionalStability: number;  // 0-1
}

export interface BehavioralPatterns {
  revengeTradingScore: number;  // 0-1
  overTradingScore: number;  // 0-1
  fomoBehavior: number;  // 0-1
  disciplineScore: number;  // 0-1
  impulsiveness: number;  // 0-1
  consistency: number;  // 0-1
  adaptability: number;  // 0-1
  learningRate: number;  // 0-1
  patterns: DetectedPattern[];
}

export interface DetectedPattern {
  type: string;
  frequency: number;
  impact: number;
  context: string;
  examples: string[];
}

export interface RiskManagement {
  stopLossAdherence: number;  // 0-1
  positionSizingConsistency: number;  // 0-1
  riskRewardRespect: number;  // 0-1
  riskTolerance: number;  // 0-1
  drawdownHandling: number;  // 0-1
  leverageUsage: number;  // 0-1
  hedgingBehavior: number;  // 0-1
}

export interface TradingStyle {
  aggressiveness: number;  // 0-1
  patience: number;  // 0-1
  adaptability: number;  // 0-1
  methodicalness: number;  // 0-1
  innovativeness: number;  // 0-1
  preferredTimeframes: string[];
  preferredPatterns: string[];
  strengthsByMarketType: Record<string, number>;
}

export interface PersonalityTraits {
  openness: number;  // 0-1
  conscientiousness: number;  // 0-1
  extraversion: number;  // 0-1
  agreeableness: number;  // 0-1
  neuroticism: number;  // 0-1
  decisionMakingStyle: string;
  stressResponse: string;
  learningStyle: string;
}

export interface StressIndicators {
  overallStressLevel: number;  // 0-1
  cognitiveLoad: number;  // 0-1
  emotionalFatigue: number;  // 0-1
  burnoutRisk: number;  // 0-1
  recoveryRate: number;  // 0-1
  triggers: StressTrigger[];
}

export interface StressTrigger {
  trigger: string;
  impact: number;
  frequency: number;
  copingMechanism: string;
}

export interface Recommendation {
  area: string;
  issue: string;
  impact: number;
  suggestion: string;
  timeframe: string;
  difficulty: string;
  expectedOutcome: string;
}

export class TradePsychologicalAnalyzer {
  private openai: OpenAI;
  private emotionModel: tf.LayersModel;
  private behaviorModel: tf.LayersModel;
  private personalityModel: tf.LayersModel;
  private readonly emotionKeywords: Map<string, string[]>;
  private readonly behavioralPatterns: Map<string, (trades: Trade[]) => number>;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.emotionKeywords = this.initializeEmotionKeywords();
    this.behavioralPatterns = this.initializeBehaviorPatterns();
    this.initializeModels();
  }

  private async initializeModels(): Promise<void> {
    this.emotionModel = await this.buildEmotionModel();
    this.behaviorModel = await this.buildBehaviorModel();
    this.personalityModel = await this.buildPersonalityModel();
  }

  private async buildEmotionModel(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.embedding({
          inputDim: 10000,
          outputDim: 128,
          inputLength: 100,
          maskZero: true
        }),
        tf.layers.bidirectional({
          layer: tf.layers.lstm({
            units: 64,
            returnSequences: true
          })
        }),
        tf.layers.globalMaxPooling1d({}),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.dense({ units: 7, activation: 'sigmoid' })  // 7 emotions
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  private async buildBehaviorModel(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [20], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'sigmoid' })  // 8 behavior patterns
      ]
    });

    model.compile({
      optimizer: 'rmsprop',
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  private async buildPersonalityModel(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [30], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.4 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 5, activation: 'sigmoid' })  // Big Five personality traits
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    return model;
  }

  private initializeEmotionKeywords(): Map<string, string[]> {
    return new Map([
      ['fear', ['scared', 'worried', 'anxious', 'nervous', 'panic']],
      ['greed', ['excited', 'fomo', 'greedy', 'overconfident', 'euphoric']],
      ['anger', ['frustrated', 'angry', 'upset', 'annoyed', 'mad']],
      ['regret', ['regret', 'should have', 'wish', 'if only', 'mistake']]
    ]);
  }

  private initializeBehaviorPatterns(): Map<string, (trades: Trade[]) => number> {
    return new Map([
      ['revenge_trading', this.calculateRevengeTradingScore.bind(this)],
      ['over_trading', this.calculateOverTradingScore.bind(this)],
      ['fomo', this.calculateFOMOScore.bind(this)],
      ['discipline', this.calculateDisciplineScore.bind(this)],
      ['impulsiveness', this.calculateImpulsivenessScore.bind(this)],
      ['consistency', this.calculateConsistencyScore.bind(this)],
      ['adaptability', this.calculateAdaptabilityScore.bind(this)]
    ]);
  }

  async analyzeTradingPsychology(trades: Trade[], journalEntries: JournalEntry[]): Promise<psychologicalAnalysis> {
    const emotionalStates = await this.analyzeEmotionalStates(journalEntries);
    const patterns = await this.identifyBehavioralPatterns(trades, journalEntries);
    const biases = await this.detectCognitiveBiases(trades, journalEntries);
    
    return {
      emotionalProfile: this.createEmotionalProfile(emotionalStates),
      behavioralPatterns: patterns,
      cognitiveBiases: biases,
      recommendations: this.generateRecommendations(emotionalStates, patterns, biases)
    };
  }

  private async analyzeEmotionalStates(entries: JournalEntry[]): Promise<emotionalState[]> {
    return entries.map(entry => {
      const emotions = this.detectEmotions(entry.content);
      const intensity = this.calculateEmotionalIntensity(entry.content);
      
      return {
        timestamp: entry.timestamp,
        primaryEmotion: this.identifyPrimaryEmotion(emotions),
        emotions: emotions,
        intensity: intensity,
        triggers: this.identifyEmotionalTriggers(entry)
      };
    });
  }

  private async identifyBehavioralPatterns(
    trades: Trade[],
    entries: JournalEntry[]
  ): Promise<behavioralPattern[]> {
    const patterns: BehavioralPattern[] = [];
    
    // Check for overtrading
    if (this.detectOvertrading(trades)) {
      patterns.push({
        type: 'overtrading',
        frequency: this.calculateTradeFrequency(trades),
        impact: this.calculatePatternImpact(trades, 'overtrading'),
        suggestions: this.generatePatternSuggestions('overtrading')
      });
    }
    
    // Check for revenge trading
    if (this.detectRevengeTradingPattern(trades, entries)) {
      patterns.push({
        type: 'revenge',
        frequency: this.calculateRevengeFrequency(trades),
        impact: this.calculatePatternImpact(trades, 'revenge'),
        suggestions: this.generatePatternSuggestions('revenge')
      });
    }
    
    // Check for FOMO
    if (this.detectFOMOPattern(trades, entries)) {
      patterns.push({
        type: 'fomo',
        frequency: this.calculateFOMOFrequency(trades),
        impact: this.calculatePatternImpact(trades, 'fomo'),
        suggestions: this.generatePatternSuggestions('fomo')
      });
    }
    
    return patterns;
  }

  private detectEmotions(text: string): Record<string, number> {
    const emotions: Record<string, number> = {};
    
    for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
      emotions[emotion] = this.calculateEmotionScore(text, keywords);
    }
    
    return emotions;
  }

  private calculateEmotionScore(text: string, keywords: string[]): number {
    const words = text.toLowerCase().split(' ');
    let score = 0;
    
    for (const keyword of keywords) {
      const count = words.filter(word => word.includes(keyword)).length;
      score += count * this.getKeywordWeight(keyword);
    }
    
    return score / words.length;
  }

  private getKeywordWeight(keyword: string): number {
    // Implement custom weighting based on keyword significance
    return 1;
  }

  private calculateEmotionalIntensity(text: string): number {
    // Implement sentiment intensity analysis
    return 0.5;
  }

  private identifyPrimaryEmotion(emotions: Record<string, number>): string {
    return Object.entries(emotions)
      .reduce((max, [emotion, score]) => 
        score > max[1] ? [emotion, score] : max, ['neutral', 0])[0];
  }

  private identifyEmotionalTriggers(entry: JournalEntry): string[] {
    // Implement trigger identification logic
    return [];
  }

  private detectOvertrading(trades: Trade[]): boolean {
    const tradesPerDay = this.calculateTradeFrequency(trades);
    return tradesPerDay > 5; // Threshold for overtrading
  }

  private calculateTradeFrequency(trades: Trade[]): number {
    if (trades.length < 2) return 0;
    
    const timeSpan = trades[trades.length - 1].timestamp - trades[0].timestamp;
    const days = timeSpan / (24 * 60 * 60 * 1000);
    
    return trades.length / days;
  }

  private detectRevengeTradingPattern(trades: Trade[], entries: JournalEntry[]): boolean {
    // Implement revenge trading detection
    return false;
  }

  private calculateRevengeFrequency(trades: Trade[]): number {
    // Implement revenge trading frequency calculation
    return 0;
  }

  private detectFOMOPattern(trades: Trade[], entries: JournalEntry[]): boolean {
    // Implement FOMO pattern detection
    return false;
  }

  private calculateFOMOFrequency(trades: Trade[]): number {
    // Implement FOMO frequency calculation
    return 0;
  }

  private calculatePatternImpact(trades: Trade[], pattern: string): number {
    // Implement pattern impact calculation
    return 0;
  }

  private generatePatternSuggestions(pattern: string): string[] {
    switch (pattern) {
      case 'overtrading':
        return [
          'Set a maximum number of trades per day',
          'Implement mandatory cooling-off periods',
          'Focus on quality over quantity'
        ];
      case 'revenge':
        return [
          'Take a break after losses',
          'Stick to your risk management rules',
          'Review your trading plan before new entries'
        ];
      case 'fomo':
        return [
          'Develop a clear entry criteria',
          'Wait for proper setup confirmation',
          'Focus on missed trades analysis instead of jumping in'
        ];
      default:
        return [];
    }
  }

  private async detectCognitiveBiases(
    trades: Trade[],
    entries: JournalEntry[]
  ): Promise<string[]> {
    const biases = [];
    
    // Confirmation Bias
    if (this.detectConfirmationBias(entries)) {
      biases.push('confirmation');
    }
    
    // Anchoring Bias
    if (this.detectAnchoringBias(trades)) {
      biases.push('anchoring');
    }
    
    // Recency Bias
    if (this.detectRecencyBias(trades, entries)) {
      biases.push('recency');
    }
    
    return biases;
  }

  private detectConfirmationBias(entries: JournalEntry[]): boolean {
    // Implement confirmation bias detection
    return false;
  }

  private detectAnchoringBias(trades: Trade[]): boolean {
    // Implement anchoring bias detection
    return false;
  }

  private detectRecencyBias(trades: Trade[], entries: JournalEntry[]): boolean {
    // Implement recency bias detection
    return false;
  }

  private createEmotionalProfile(states: EmotionalState[]): Record<string, number> {
    const profile: Record<string, number> = {};
    
    for (const state of states) {
      for (const [emotion, score] of Object.entries(state.emotions)) {
        profile[emotion] = (profile[emotion] || 0) + score;
      }
    }
    
    // Normalize scores
    const total = Object.values(profile).reduce((sum, score) => sum + score, 0);
    for (const emotion in profile) {
      profile[emotion] /= total;
    }
    
    return profile;
  }

  private generateRecommendations(
    emotions: EmotionalState[],
    patterns: BehavioralPattern[],
    biases: string[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Emotional recommendations
    if (this.hasHighEmotionalVolatility(emotions)) {
      recommendations.push(
        'Practice mindfulness techniques before trading',
        'Implement a pre-trade emotional checklist'
      );
    }
    
    // Pattern-based recommendations
    for (const pattern of patterns) {
      recommendations.push(...this.generatePatternSuggestions(pattern.type));
    }
    
    // Bias-related recommendations
    for (const bias of biases) {
      recommendations.push(...this.generateBiasRecommendations(bias));
    }
    
    return recommendations;
  }

  private hasHighEmotionalVolatility(emotions: EmotionalState[]): boolean {
    if (emotions.length < 2) return false;
    
    const intensities = emotions.map(e => e.intensity);
    const volatility = this.calculateVolatility(intensities);
    
    return volatility > 0.5;  // Threshold for high volatility
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    
    return Math.sqrt(variance);
  }

  private generateBiasRecommendations(bias: string): string[] {
    switch (bias) {
      case 'confirmation':
        return [
          'Actively seek contradicting evidence',
          'Document both supporting and opposing factors'
        ];
      case 'anchoring':
        return [
          'Use multiple reference points for analysis',
          'Regularly update your market perspective'
        ];
      case 'recency':
        return [
          'Maintain a longer-term market perspective',
          'Review historical similar scenarios'
        ];
      default:
        return [];
    }
  }

  private calculateRevengeTradingScore(trades: Trade[]): number {
    let revengeTrades = 0;
    
    for (let i = 1; i < trades.length; i++) {
      const previousTrade = trades[i - 1];
      const currentTrade = trades[i];
      
      if (previousTrade.pnl < 0 && 
          currentTrade.timestamp.getTime() - previousTrade.timestamp.getTime() < 300000) {
        revengeTrades++;
      }
    }
    
    return revengeTrades / trades.length;
  }

  private calculateOverTradingScore(trades: Trade[]): number {
    const tradesPerDay = new Map<string, number>();
    
    trades.forEach(trade => {
      const date = trade.timestamp.toISOString().split('T')[0];
      tradesPerDay.set(date, (tradesPerDay.get(date) || 0) + 1);
    });
    
    const avgTradesPerDay = Array.from(tradesPerDay.values())
      .reduce((a, b) => a + b, 0) / tradesPerDay.size;
    
    return Math.min(avgTradesPerDay / 10, 1);
  }

  private calculateFOMOScore(trades: Trade[]): number {
    let fomoTrades = 0;
    
    trades.forEach((trade, i) => {
      if (i === 0) return;
      
      const previousTrade = trades[i - 1];
      const timeDiff = trade.timestamp.getTime() - previousTrade.timestamp.getTime();
      const priceChange = (trade.entryPrice - previousTrade.exitPrice) / previousTrade.exitPrice;
      
      if (timeDiff < 300000 && Math.abs(priceChange) > 0.01) {
        fomoTrades++;
      }
    });
    
    return fomoTrades / trades.length;
  }

  private calculateDisciplineScore(trades: Trade[]): number {
    let disciplinedTrades = 0;
    
    trades.forEach(trade => {
      if (this.isPositionSizingCorrect(trade) && this.isStopLossRespected(trade)) {
        disciplinedTrades++;
      }
    });
    
    return disciplinedTrades / trades.length;
  }

  private calculateImpulsivenessScore(trades: Trade[]): number {
    // Implementation
    return 0;
  }

  private calculateConsistencyScore(trades: Trade[]): number {
    // Implementation
    return 0;
  }

  private calculateAdaptabilityScore(trades: Trade[]): number {
    // Implementation
    return 0;
  }

  private calculateLearningRate(trades: Trade[]): number {
    // Implementation
    return 0;
  }

  private calculateStopLossAdherence(trades: Trade[]): number {
    // Implementation
    return 0.8;
  }

  private calculatePositionSizingConsistency(trades: Trade[]): number {
    // Implementation
    return 0.7;
  }

  private calculateRiskRewardRespect(trades: Trade[]): number {
    // Implementation
    return 0.9;
  }

  private calculateRiskTolerance(trades: Trade[]): number {
    // Implementation
    return 0.7;
  }

  private calculateDrawdownHandling(trades: Trade[]): number {
    // Implementation
    return 0.8;
  }

  private calculateLeverageUsage(trades: Trade[]): number {
    // Implementation
    return 0.9;
  }

  private calculateHedgingBehavior(trades: Trade[]): number {
    // Implementation
    return 0.8;
  }

  private calculateAggressiveness(trades: Trade[]): number {
    // Implementation
    return 0.6;
  }

  private calculatePatience(trades: Trade[]): number {
    // Implementation
    return 0.7;
  }

  private calculateAdaptability(trades: Trade[]): number {
    // Implementation
    return 0.8;
  }

  private calculateMethodicalness(trades: Trade[], journalEntries: JournalEntry[]): number {
    // Implementation
    return 0.7;
  }

  private calculateInnovativeness(trades: Trade[], journalEntries: JournalEntry[]): number {
    // Implementation
    return 0.8;
  }

  private identifyPreferredTimeframes(trades: Trade[]): string[] {
    // Implementation
    return [];
  }

  private identifyPreferredPatterns(trades: Trade[]): string[] {
    // Implementation
    return [];
  }

  private analyzeMarketTypeStrengths(trades: Trade[]): Record<string, number> {
    // Implementation
    return {};
  }

  private extractTextFeatures(text: string): Promise<tf.Tensor> {
    // Implementation
    return tf.tensor([[]]);
  }

  private calculateEmotionalStability(scores: Float32Array): number {
    // Implementation
    return 0;
  }

  private determineDominantEmotion(scores: Float32Array): string {
    // Implementation
    return '';
  }

  private async detectTradePatterns(
    trades: Trade[],
    journalEntries: JournalEntry[]
  ): Promise<DetectedPattern[]> {
    // Implementation
    return [];
  }

  private extractPersonalityFeatures(journalEntries: JournalEntry[]): Promise<tf.Tensor> {
    // Implementation
    return tf.tensor([[]]);
  }

  private determineDecisionMakingStyle(traits: Float32Array): string {
    // Implementation
    return '';
  }

  private determineStressResponse(traits: Float32Array): string {
    // Implementation
    return '';
  }

  private determineLearningStyle(traits: Float32Array): string {
    // Implementation
    return '';
  }

  private extractStressFeatures(journalEntries: JournalEntry[]): Float32Array {
    // Implementation
    return new Float32Array();
  }

  private calculateOverallStress(stressFeatures: Float32Array): number {
    // Implementation
    return 0;
  }

  private calculateCognitiveLoad(stressFeatures: Float32Array): number {
    // Implementation
    return 0;
  }

  private calculateEmotionalFatigue(stressFeatures: Float32Array): number {
    // Implementation
    return 0;
  }

  private calculateBurnoutRisk(stressFeatures: Float32Array): number {
    // Implementation
    return 0;
  }

  private calculateRecoveryRate(stressFeatures: Float32Array): number {
    // Implementation
    return 0;
  }

  private isPositionSizingCorrect(trade: Trade): boolean {
    // Implementation
    return true;
  }

  private isStopLossRespected(trade: Trade): boolean {
    // Implementation
    return true;
  }
} 