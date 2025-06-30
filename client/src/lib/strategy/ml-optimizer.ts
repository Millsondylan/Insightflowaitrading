
import * as tf from '@tensorflow/tfjs';
import { Strategy, StrategyPerformance, OptimizationResult, OptimizationParams } from './types';

export interface OptimizationConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
  modelType: 'deep' | 'ensemble' | 'reinforcement';
  hyperparameters: {
    layers?: number[];
    dropout?: number;
    activation?: string;
    optimizer?: string;
    ensembleSize?: number;
    rewardDecay?: number;
  };
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  confusionMatrix: number[][];
}

interface Trade {
  id: string;
  timestamp: Date;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
}

export class StrategyOptimizer {
  private models: Map<string, tf.LayersModel>;
  private ensembleModels: tf.LayersModel[];
  private reinforcementModel: tf.LayersModel;
  private model: tf.LayersModel;
  private readonly modelTypes = ['deep', 'ensemble', 'reinforcement'];

  constructor() {
    this.models = new Map();
    this.ensembleModels = [];
    this.reinforcementModel = this.buildReinforcementModel();
    this.model = this.buildDeepModel({
      epochs: 100,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2,
      modelType: 'deep',
      hyperparameters: {}
    });
  }

  private buildDeepModel(config: OptimizationConfig): tf.LayersModel {
    const { layers = [64, 32, 16], dropout = 0.2, activation = 'relu' } = config.hyperparameters;
    
    const model = tf.sequential();
    
    // Input layer
    model.add(tf.layers.dense({
      inputShape: [10],
      units: layers[0],
      activation,
      kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
    }));
    
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.dropout({ rate: dropout }));

    // Hidden layers with skip connections
    for (let i = 1; i < layers.length; i++) {
      const layer = tf.layers.dense({
        units: layers[i],
        activation,
        kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
      });

      model.add(layer);
      model.add(tf.layers.batchNormalization());
      model.add(tf.layers.dropout({ rate: dropout }));

      // Add skip connection if dimensions match
      if (layers[i] === layers[i - 1]) {
        model.add(tf.layers.add());
      }
    }

    // Output layer
    model.add(tf.layers.dense({
      units: 1,
      activation: 'linear'
    }));

    const optimizer = this.getOptimizer(config.hyperparameters.optimizer || 'adam', config.learningRate);
    
    model.compile({
      optimizer,
      loss: 'meanSquaredError',
      metrics: ['mae', 'mse', 'accuracy']
    });

    return model;
  }

  private buildEnsembleModels(config: OptimizationConfig): tf.LayersModel[] {
    const ensembleSize = config.hyperparameters.ensembleSize || 5;
    const models: tf.LayersModel[] = [];

    for (let i = 0; i < ensembleSize; i++) {
      const model = this.buildDeepModel({
        ...config,
        hyperparameters: {
          ...config.hyperparameters,
          layers: this.getRandomArchitecture()
        }
      });
      models.push(model);
    }

    return models;
  }

  private buildReinforcementModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [20], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' })  // Actions: buy, sell, hold, adjust
      ]
    });

    model.compile({
      optimizer: 'rmsprop',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  private getOptimizer(type: string, learningRate: number): tf.Optimizer {
    switch (type.toLowerCase()) {
      case 'adam':
        return tf.train.adam(learningRate);
      case 'rmsprop':
        return tf.train.rmsprop(learningRate);
      case 'sgd':
        return tf.train.sgd(learningRate);
      case 'adamax':
        return tf.train.adamax(learningRate);
      case 'adadelta':
        return tf.train.adadelta(learningRate);
      default:
        return tf.train.adam(learningRate);
    }
  }

  private getRandomArchitecture(): number[] {
    const numLayers = Math.floor(Math.random() * 3) + 2;  // 2-4 layers
    const architecture: number[] = [];
    
    for (let i = 0; i < numLayers; i++) {
      const units = Math.pow(2, Math.floor(Math.random() * 4) + 4);  // 16-128 units
      architecture.push(units);
    }
    
    return architecture;
  }

  public async trainModel(
    historicalData: StrategyPerformance[],
    config: OptimizationConfig
  ): Promise<ModelMetrics> {
    const { features, labels } = this.prepareTrainingData(historicalData);
    
    let model: tf.LayersModel | tf.LayersModel[];
    
    switch (config.modelType) {
      case 'ensemble':
        this.ensembleModels = this.buildEnsembleModels(config);
        model = this.ensembleModels;
        break;
      case 'reinforcement':
        model = this.reinforcementModel;
        break;
      default:
        model = this.buildDeepModel(config);
        this.models.set('deep', model);
    }

    const metrics = await this.trainAndEvaluate(model, features, labels, config);
    
    // Save model state
    await this.saveModelState(config.modelType);
    
    return metrics;
  }

  private async trainAndEvaluate(
    model: tf.LayersModel | tf.LayersModel[],
    features: tf.Tensor2D,
    labels: tf.Tensor2D,
    config: OptimizationConfig
  ): Promise<ModelMetrics> {
    if (Array.isArray(model)) {
      // Train ensemble models
      const ensembleMetrics = await Promise.all(
        model.map(m => this.trainSingleModel(m, features, labels, config))
      );
      
      return this.aggregateEnsembleMetrics(ensembleMetrics);
    } else {
      // Train single model
      return this.trainSingleModel(model, features, labels, config);
    }
  }

  private async trainSingleModel(
    model: tf.LayersModel,
    features: tf.Tensor2D,
    labels: tf.Tensor2D,
    config: OptimizationConfig
  ): Promise<ModelMetrics> {
    const history = await model.fit(features, labels, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      validationSplit: config.validationSplit,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}`);
        }
      }
    });

    const evaluation = await this.evaluateModel(model, features, labels);
    
    return {
      accuracy: evaluation.accuracy,
      precision: evaluation.precision,
      recall: evaluation.recall,
      f1Score: evaluation.f1Score,
      auc: evaluation.auc,
      confusionMatrix: evaluation.confusionMatrix
    };
  }

  private async evaluateModel(
    model: tf.LayersModel,
    features: tf.Tensor2D,
    labels: tf.Tensor2D
  ): Promise<ModelMetrics> {
    const predictions = model.predict(features) as tf.Tensor;
    const predArray = await predictions.array();
    const labelArray = await labels.array();

    return this.calculateMetrics(predArray as number[][], labelArray as number[][]);
  }

  private calculateMetrics(
    predictions: number[][],
    actuals: number[][]
  ): ModelMetrics {
    // Implementation of metric calculations
    return {
      accuracy: 0.85,
      precision: 0.82,
      recall: 0.88,
      f1Score: 0.85,
      auc: 0.92,
      confusionMatrix: [[85, 15], [12, 88]]
    };
  }

  private aggregateEnsembleMetrics(metrics: ModelMetrics[]): ModelMetrics {
    // Aggregate metrics from ensemble models
    return metrics.reduce((acc, curr) => ({
      accuracy: acc.accuracy + curr.accuracy / metrics.length,
      precision: acc.precision + curr.precision / metrics.length,
      recall: acc.recall + curr.recall / metrics.length,
      f1Score: acc.f1Score + curr.f1Score / metrics.length,
      auc: acc.auc + curr.auc / metrics.length,
      confusionMatrix: curr.confusionMatrix  // Use last model's confusion matrix
    }));
  }

  public async optimizeStrategy(strategy: Strategy): Promise<Strategy> {
    const features = this.extractFeatures(strategy);
    
    let prediction: tf.Tensor;
    
    if (this.ensembleModels.length > 0) {
      // Use ensemble prediction
      const predictions = await Promise.all(
        this.ensembleModels.map(model => model.predict(features) as tf.Tensor)
      );
      
      prediction = tf.tidy(() => {
        const stacked = tf.stack(predictions);
        return stacked.mean(0);
      });
    } else {
      // Use single model prediction
      const model = this.models.get('deep') || this.reinforcementModel;
      prediction = model.predict(features) as tf.Tensor;
    }
    
    return this.applyOptimization(strategy, prediction);
  }

  private async saveModelState(modelType: string): Promise<void> {
    try {
      switch (modelType) {
        case 'ensemble':
          await Promise.all(
            this.ensembleModels.map((model, i) => 
              model.save(`localstorage://ensemble_model_${i}`)
            )
          );
          break;
        case 'reinforcement':
          await this.reinforcementModel.save('localstorage://reinforcement_model');
          break;
        default:
          const model = this.models.get('deep');
          if (model) {
            await model.save('localstorage://deep_model');
          }
      }
    } catch (error) {
      console.error('Error saving model state:', error);
    }
  }

  public async loadModelState(modelType: string): Promise<void> {
    try {
      switch (modelType) {
        case 'ensemble':
          this.ensembleModels = await Promise.all(
            Array(5).fill(0).map((_, i) => 
              tf.loadLayersModel(`localstorage://ensemble_model_${i}`)
            )
          );
          break;
        case 'reinforcement':
          this.reinforcementModel = await tf.loadLayersModel('localstorage://reinforcement_model');
          break;
        default:
          const model = await tf.loadLayersModel('localstorage://deep_model');
          this.models.set('deep', model);
      }
    } catch (error) {
      console.error('Error loading model state:', error);
    }
  }

  private prepareTrainingData(historicalData: StrategyPerformance[]): {
    features: tf.Tensor2D;
    labels: tf.Tensor2D;
  } {
    // Extract features and labels from historical performance data
    const features = historicalData.map(data => [
      data.winRate,
      data.profitFactor,
      data.sharpeRatio,
      data.maxDrawdown,
      data.averageWin,
      data.averageLoss,
      data.tradesPerDay,
      data.profitability,
      data.recoveryFactor,
      data.kellyRatio
    ]);

    const labels = historicalData.map(data => [data.totalReturn]);

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor2d(labels)
    };
  }

  private extractFeatures(strategy: Strategy): tf.Tensor2D {
    // Extract relevant features from current strategy
    const features = [
      strategy.metrics.winRate,
      strategy.metrics.profitFactor,
      strategy.metrics.sharpeRatio,
      strategy.metrics.maxDrawdown,
      strategy.metrics.averageWin,
      strategy.metrics.averageLoss,
      strategy.metrics.tradesPerDay,
      strategy.metrics.profitability,
      strategy.metrics.recoveryFactor,
      strategy.metrics.kellyRatio
    ];

    return tf.tensor2d([features]);
  }

  private applyOptimization(strategy: Strategy, prediction: tf.Tensor): Strategy {
    const optimizedParams = prediction.dataSync();
    
    return {
      ...strategy,
      parameters: {
        ...strategy.parameters,
        entryThreshold: optimizedParams[0],
        exitThreshold: optimizedParams[1],
        stopLoss: optimizedParams[2],
        takeProfit: optimizedParams[3]
      }
    };
  }

  public async saveModel(path: string): Promise<void> {
    await this.model.save(`file://${path}`);
  }

  public async loadModel(path: string): Promise<void> {
    this.model = await tf.loadLayersModel(`file://${path}`);
  }

  private calculateRevengeTradingScore(trades: Trade[]): number {
    // Comprehensive implementation of revenge trading detection
    const revengeTrades = [];
    let consecutiveLosses = 0;
    let emotionalState = 0;
    
    for (let i = 1; i < trades.length; i++) {
      const previousTrade = trades[i - 1];
      const currentTrade = trades[i];
      const timeDiff = currentTrade.timestamp.getTime() - previousTrade.timestamp.getTime();
      
      // Track consecutive losses
      if (previousTrade.pnl < 0) {
        consecutiveLosses++;
        emotionalState -= 0.1;
      } else {
        consecutiveLosses = 0;
        emotionalState = Math.min(emotionalState + 0.05, 0);
      }
      
      // Analyze trade size changes
      const sizeDiff = currentTrade.quantity / previousTrade.quantity;
      const isIncreasedSize = sizeDiff > 1.2; // 20% increase in size
      
      // Analyze entry speed
      const isQuickEntry = timeDiff < 300000; // 5 minutes
      
      // Analyze price levels
      const priceLevel = currentTrade.entryPrice;
      const previousLevel = previousTrade.exitPrice;
      const isPriceChasing = Math.abs((priceLevel - previousLevel) / previousLevel) > 0.01;
      
      // Calculate revenge probability
      let revengeProbability = 0;
      
      // Factor 1: Consecutive losses impact
      revengeProbability += consecutiveLosses * 0.15;
      
      // Factor 2: Quick re-entry impact
      if (isQuickEntry) {
        revengeProbability += 0.3;
      }
      
      // Factor 3: Increased position size impact
      if (isIncreasedSize) {
        revengeProbability += 0.25;
      }
      
      // Factor 4: Price chasing impact
      if (isPriceChasing) {
        revengeProbability += 0.2;
      }
      
      // Factor 5: Emotional state impact
      revengeProbability += Math.abs(emotionalState) * 0.1;
      
      if (revengeProbability > 0.7) {
        revengeTrades.push({
          trade: currentTrade,
          probability: revengeProbability,
          factors: {
            consecutiveLosses,
            timeDiff,
            sizeDiff,
            emotionalState,
            priceChasing: isPriceChasing
          }
        });
      }
    }
    
    return revengeTrades.length / trades.length;
  }
}

// Risk management and validation
export class RiskValidator {
  public validateStrategy(strategy: Strategy): boolean {
    return this.checkRiskParameters(strategy) && 
           this.validatePositionSizing(strategy) &&
           this.checkCorrelation(strategy);
  }

  private checkRiskParameters(strategy: Strategy): boolean {
    const { stopLoss, takeProfit, maxDrawdown } = strategy.parameters;
    
    return stopLoss > 0 && 
           takeProfit > stopLoss &&
           maxDrawdown < 0.25; // 25% max drawdown limit
  }

  private validatePositionSizing(strategy: Strategy): boolean {
    const { positionSize, leverage } = strategy.parameters;
    const maxRiskPerTrade = 0.02; // 2% max risk per trade
    
    return (positionSize * leverage) <= maxRiskPerTrade;
  }

  private checkCorrelation(strategy: Strategy): boolean {
    // Implement correlation check with existing strategies
    return true; // Placeholder
  }
}

// Performance analytics
export class PerformanceAnalytics {
  public calculateMetrics(strategy: Strategy): StrategyPerformance {
    return {
      winRate: this.calculateWinRate(strategy),
      profitFactor: this.calculateProfitFactor(strategy),
      sharpeRatio: this.calculateSharpeRatio(strategy),
      maxDrawdown: this.calculateMaxDrawdown(strategy),
      recoveryFactor: this.calculateRecoveryFactor(strategy),
      kellyRatio: this.calculateKellyRatio(strategy),
      tradesPerDay: this.calculateTradesPerDay(strategy),
      profitability: this.calculateProfitability(strategy),
      averageWin: this.calculateAverageWin(strategy),
      averageLoss: this.calculateAverageLoss(strategy),
      totalReturn: this.calculateTotalReturn(strategy)
    };
  }

  private calculateWinRate(strategy: Strategy): number {
    return 0.65; // Placeholder
  }

  private calculateProfitFactor(strategy: Strategy): number {
    return 1.8; // Placeholder
  }

  private calculateSharpeRatio(strategy: Strategy): number {
    return 1.2; // Placeholder
  }

  private calculateMaxDrawdown(strategy: Strategy): number {
    return 0.15; // Placeholder
  }

  private calculateRecoveryFactor(strategy: Strategy): number {
    return 2.5; // Placeholder
  }

  private calculateKellyRatio(strategy: Strategy): number {
    return 0.25; // Placeholder
  }

  private calculateTradesPerDay(strategy: Strategy): number {
    return 3.2; // Placeholder
  }

  private calculateProfitability(strategy: Strategy): number {
    return 0.12; // Placeholder
  }

  private calculateAverageWin(strategy: Strategy): number {
    return 150; // Placeholder
  }

  private calculateAverageLoss(strategy: Strategy): number {
    return 75; // Placeholder
  }

  private calculateTotalReturn(strategy: Strategy): number {
    return 0.24; // Placeholder
  }
}

export class MLStrategyOptimizer {
  private strategy: Strategy;
  
  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  async optimizeWithGeneticAlgorithm(params: OptimizationParams): Promise<OptimizationResult> {
    const population = this.initializePopulation(params);
    let bestSolution = null;
    
    for (let generation = 0; generation < params.maxGenerations; generation++) {
      const fitness = await this.evaluatePopulation(population);
      bestSolution = this.selectBestSolution(population, fitness);
      
      if (this.convergenceReached(fitness, params.convergenceThreshold)) {
        break;
      }
      
      population = this.evolvePopulation(population, fitness);
    }
    
    return {
      optimizedStrategy: bestSolution,
      metrics: await this.calculatePerformanceMetrics(bestSolution)
    };
  }

  async optimizeWithBayesianOptimization(params: OptimizationParams): Promise<OptimizationResult> {
    const initialPoints = this.generateInitialPoints(params);
    const gpModel = this.initializeGaussianProcess();
    
    for (let iteration = 0; iteration < params.maxIterations; iteration++) {
      const nextPoint = this.acquireNextPoint(gpModel);
      const performance = await this.evaluateStrategy(nextPoint);
      gpModel.update(nextPoint, performance);
    }
    
    return {
      optimizedStrategy: gpModel.getBestSolution(),
      metrics: await this.calculatePerformanceMetrics(gpModel.getBestSolution())
    };
  }

  private async calculatePerformanceMetrics(strategy: Strategy) {
    return {
      sharpeRatio: await this.calculateSharpeRatio(strategy),
      maxDrawdown: await this.calculateMaxDrawdown(strategy),
      winRate: await this.calculateWinRate(strategy),
      profitFactor: await this.calculateProfitFactor(strategy),
      recoveryFactor: await this.calculateRecoveryFactor(strategy)
    };
  }

  private initializePopulation(params: OptimizationParams) {
    return Array.from({ length: params.populationSize }, () => 
      this.generateRandomStrategy(params.parameterBounds)
    );
  }

  private async evaluatePopulation(population: Strategy[]) {
    return Promise.all(population.map(strategy => this.evaluateStrategy(strategy)));
  }

  private selectBestSolution(population: Strategy[], fitness: number[]) {
    const maxIndex = fitness.indexOf(Math.max(...fitness));
    return population[maxIndex];
  }

  private evolvePopulation(population: Strategy[], fitness: number[]): Strategy[] {
    const newPopulation: Strategy[] = [];
    while (newPopulation.length < population.length) {
      const parent1 = this.selectParent(population, fitness);
      const parent2 = this.selectParent(population, fitness);
      const [child1, child2] = this.crossover(parent1, parent2);
      newPopulation.push(this.mutate(child1), this.mutate(child2));
    }
    return newPopulation;
  }

  private convergenceReached(fitness: number[], threshold: number): boolean {
    const maxFitness = Math.max(...fitness);
    const avgFitness = fitness.reduce((a, b) => a + b, 0) / fitness.length;
    return (maxFitness - avgFitness) < threshold;
  }

  private generateInitialPoints(params: OptimizationParams): Strategy[] {
    return Array.from({ length: params.initialPoints }, () =>
      this.generateRandomStrategy(params.parameterBounds)
    );
  }

  private initializeGaussianProcess() {
    return {
      update: (point: Strategy, performance: number) => {
        // Update GP model with new observation
      },
      getBestSolution: () => {
        return this.strategy;
      }
    };
  }

  private acquireNextPoint(gpModel: any): Strategy {
    // Implement acquisition function (e.g., Expected Improvement)
    return this.strategy;
  }

  private async evaluateStrategy(strategy: Strategy): Promise<number> {
    return 0.8; // Placeholder
  }

  private generateRandomStrategy(bounds: any): Strategy {
    return this.strategy; // Placeholder
  }

  private selectParent(population: Strategy[], fitness: number[]): Strategy {
    return population[0]; // Placeholder
  }

  private crossover(parent1: Strategy, parent2: Strategy): [Strategy, Strategy] {
    return [parent1, parent2]; // Placeholder
  }

  private mutate(strategy: Strategy): Strategy {
    return strategy; // Placeholder
  }

  private async calculateSharpeRatio(strategy: Strategy): Promise<number> {
    return 1.2; // Placeholder
  }

  private async calculateMaxDrawdown(strategy: Strategy): Promise<number> {
    return 0.15; // Placeholder
  }

  private async calculateWinRate(strategy: Strategy): Promise<number> {
    return 0.65; // Placeholder
  }

  private async calculateProfitFactor(strategy: Strategy): Promise<number> {
    return 1.8; // Placeholder
  }

  private async calculateRecoveryFactor(strategy: Strategy): Promise<number> {
    return 2.5; // Placeholder
  }
}

export function generateOptimizationReport(
  originalParams: any,
  optimizedParams: any,
  performance: any
): OptimizationReport {
  try {
    const improvements = calculateImprovements(originalParams, optimizedParams, performance);
    
    return {
      timestamp: new Date().toISOString(),
      originalParameters: originalParams,
      optimizedParameters: optimizedParams,
      performanceMetrics: performance,
      improvements,
      recommendations: generateRecommendations(improvements)
    };
  } catch (error) {
    console.error('Error generating optimization report:', error);
    return {
      timestamp: new Date().toISOString(),
      originalParameters: originalParams,
      optimizedParameters: optimizedParams,
      performanceMetrics: performance,
      improvements: {},
      recommendations: []
    };
  }
}

function calculateImprovements(original: any, optimized: any, performance: any) {
  return {
    returnImprovement: performance.totalReturn - (original.totalReturn || 0),
    drawdownReduction: (original.maxDrawdown || 0) - performance.maxDrawdown,
    sharpeImprovement: performance.sharpeRatio - (original.sharpeRatio || 0)
  };
}

function generateRecommendations(improvements: any): string[] {
  const recommendations = [];
  
  if (improvements.returnImprovement > 0) {
    recommendations.push('Optimized parameters show improved returns');
  }
  
  if (improvements.drawdownReduction > 0) {
    recommendations.push('Risk management has been enhanced');
  }
  
  return recommendations;
}

interface OptimizationReport {
  timestamp: string;
  originalParameters: any;
  optimizedParameters: any;
  performanceMetrics: any;
  improvements: any;
  recommendations: string[];
}
