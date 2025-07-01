
// Utility functions for Strategy Intelligence Module

export const calculateStrategyScore = (performance: any) => {
  const { winRate, profitFactor, maxDrawdown } = performance;
  
  // Simple scoring algorithm
  const winRateScore = winRate * 40;
  const profitFactorScore = profitFactor * 30;
  const drawdownPenalty = (1 - maxDrawdown) * 30;
  
  return Math.min(Math.max(winRateScore + profitFactorScore + drawdownPenalty, 0), 100);
};

export const filterStrategiesByRisk = (strategies: any[], riskLevel: string) => {
  return strategies.filter(strategy => strategy.risk === riskLevel);
};

export const sortStrategiesByPerformance = (strategies: any[], metric: string = 'winRate') => {
  return [...strategies].sort((a, b) => 
    b.performance[metric] - a.performance[metric]
  );
};
