type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
};

export function validateStrategy(strategy: StrategyOutput): string | null {
  // Check if strategy has any rules
  if (!strategy.rules.length) {
    return "Strategy must include at least one rule.";
  }

  // Check for incomplete or unrecognized strategies
  if (strategy.rules.some(rule => rule.includes("not clearly specified"))) {
    return "Entry condition not clearly specified. Please describe your entry signal more clearly.";
  }

  // Check for exit conditions
  const hasExitCondition = strategy.rules.some(rule => 
    rule.toLowerCase().includes("exit") || 
    rule.toLowerCase().includes("stop") || 
    rule.toLowerCase().includes("target") ||
    rule.toLowerCase().includes("risk-reward")
  );

  if (!hasExitCondition) {
    return "Missing exit condition. Please specify when to close trades.";
  }

  // Check for risk management
  const hasRiskManagement = strategy.rules.some(rule => 
    rule.toLowerCase().includes("risk") || 
    rule.toLowerCase().includes("stop loss")
  ) || strategy.checklist.some(item => 
    item.toLowerCase().includes("risk") || 
    item.toLowerCase().includes("position size")
  );

  if (!hasRiskManagement) {
    return "Warning: No risk management rules detected. Consider adding stop loss or position sizing rules.";
  }

  // Check for entry confirmation
  if (strategy.checklist.length === 0) {
    return "Warning: No pre-trade checklist generated. Consider adding confirmation steps.";
  }

  // All validations passed
  return null;
} 