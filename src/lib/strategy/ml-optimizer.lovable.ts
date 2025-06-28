import { Strategy, OptimizationResult, OptimizationParams } from './types';
import { toast } from '@/components/ui/toast';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';

export const MLStrategyOptimizerUI: React.FC<{
  strategy: Strategy;
  onOptimizationComplete: (result: OptimizationResult) => void;
}> = ({ strategy, onOptimizationComplete }) => {
  const [optimizer] = useState(() => new MLStrategyOptimizer(strategy));
  const [optimizing, setOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async (method: 'genetic' | 'bayesian') => {
    setOptimizing(true);
    setError(null);
    setProgress(0);

    try {
      const params: OptimizationParams = {
        maxGenerations: 100,
        populationSize: 50,
        convergenceThreshold: 0.001,
        maxIterations: 100,
        initialPoints: 10,
        parameterBounds: {
          entryThreshold: [-1, 1],
          exitThreshold: [-1, 1],
          stopLoss: [0.1, 5],
          takeProfit: [0.1, 10],
          positionSize: [0.1, 1],
        }
      };

      const result = method === 'genetic' 
        ? await optimizer.optimizeWithGeneticAlgorithm(params, {
            onProgress: (p) => setProgress(p * 100),
            onPhaseChange: setCurrentPhase
          })
        : await optimizer.optimizeWithBayesianOptimization(params, {
            onProgress: (p) => setProgress(p * 100),
            onPhaseChange: setCurrentPhase
          });

      onOptimizationComplete(result);
      toast({
        title: 'Optimization Complete',
        description: `Strategy optimized successfully using ${method} algorithm.`,
        variant: 'success'
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Optimization Failed',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Strategy Optimizer</h2>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Choose an optimization method to improve your strategy's performance.
        </p>
        
        <div className="flex space-x-4">
          <Button
            onClick={() => handleOptimize('genetic')}
            disabled={optimizing}
            variant="default"
          >
            Genetic Algorithm
          </Button>
          
          <Button
            onClick={() => handleOptimize('bayesian')}
            disabled={optimizing}
            variant="default"
          >
            Bayesian Optimization
          </Button>
        </div>
      </div>

      {optimizing && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{currentPhase}</p>
          <Progress value={progress} className="w-full" />
          <p className="text-xs text-muted-foreground">
            Progress: {Math.round(progress)}%
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </Card>
  );
};

export class MLStrategyOptimizer {
  private strategy: Strategy;
  
  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  async optimizeWithGeneticAlgorithm(
    params: OptimizationParams,
    callbacks?: {
      onProgress?: (progress: number) => void;
      onPhaseChange?: (phase: string) => void;
    }
  ): Promise<OptimizationResult> {
    const { onProgress, onPhaseChange } = callbacks || {};
    let bestSolution = null;
    
    onPhaseChange?.('Initializing population...');
    const population = this.initializePopulation(params);
    
    for (let generation = 0; generation < params.maxGenerations; generation++) {
      onPhaseChange?.(`Generation ${generation + 1}/${params.maxGenerations}`);
      onProgress?.((generation + 1) / params.maxGenerations);
      
      const fitness = await this.evaluatePopulation(population);
      bestSolution = this.selectBestSolution(population, fitness);
      
      if (this.convergenceReached(fitness, params.convergenceThreshold)) {
        break;
      }
      
      population = this.evolvePopulation(population, fitness);
    }
    
    onPhaseChange?.('Calculating final metrics...');
    const metrics = await this.calculatePerformanceMetrics(bestSolution);
    
    return {
      optimizedStrategy: bestSolution,
      metrics
    };
  }

  async optimizeWithBayesianOptimization(
    params: OptimizationParams,
    callbacks?: {
      onProgress?: (progress: number) => void;
      onPhaseChange?: (phase: string) => void;
    }
  ): Promise<OptimizationResult> {
    const { onProgress, onPhaseChange } = callbacks || {};
    
    onPhaseChange?.('Generating initial points...');
    const initialPoints = this.generateInitialPoints(params);
    const gpModel = this.initializeGaussianProcess();
    
    for (let iteration = 0; iteration < params.maxIterations; iteration++) {
      onPhaseChange?.(`Iteration ${iteration + 1}/${params.maxIterations}`);
      onProgress?.((iteration + 1) / params.maxIterations);
      
      const nextPoint = this.acquireNextPoint(gpModel);
      const performance = await this.evaluateStrategy(nextPoint);
      gpModel.update(nextPoint, performance);
    }
    
    onPhaseChange?.('Calculating final metrics...');
    const bestSolution = gpModel.getBestSolution();
    const metrics = await this.calculatePerformanceMetrics(bestSolution);
    
    return {
      optimizedStrategy: bestSolution,
      metrics
    };
  }

  // ... rest of the implementation remains the same ...
} 