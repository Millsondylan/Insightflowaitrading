export interface StrategyFormData {
  strategyName?: string;
  tradeStyle: string;
  instruments: string;
  timeframe: string;
  entryConditions: string;
  exitConditions: string;
  riskManagement: string;
  extraContext?: string;
}

export const buildStrategyPrompt = (formData: StrategyFormData): string => {
  const {
    strategyName,
    tradeStyle,
    instruments,
    timeframe,
    entryConditions,
    exitConditions,
    riskManagement,
    extraContext,
  } = formData;

  const strategyNameSection = strategyName 
    ? `Strategy Name: ${strategyName}`
    : 'Please suggest an appropriate name for this strategy';

  const prompt = `
You are a trading strategy engine. Convert this config into a detailed trading strategy with clear rules, logic, edge case warnings, and scenario analysis.

${strategyNameSection}

TRADING PARAMETERS:
- Trade Style: ${tradeStyle}
- Instruments: ${instruments}
- Timeframe: ${timeframe}

STRATEGY LOGIC:
- Entry Conditions: ${entryConditions}
- Exit Conditions: ${exitConditions}
- Risk Management: ${riskManagement}
${extraContext ? `\nADDITIONAL CONTEXT:\n${extraContext}` : ''}

Please structure your response in the following JSON format:
{
  "strategyName": "Name of the strategy",
  "description": "A concise 2-3 sentence overview of the strategy approach",
  "rules": [
    "Rule 1: Detailed explanation",
    "Rule 2: Detailed explanation",
    ...
  ],
  "entryChecklist": [
    "Entry condition 1",
    "Entry condition 2",
    ...
  ],
  "warnings": [
    "Warning 1: Explanation of risk or edge case",
    "Warning 2: Explanation of risk or edge case",
    ...
  ],
  "backtestTips": [
    "Tip 1 for backtesting this strategy",
    "Tip 2 for backtesting this strategy",
    ...
  ]
}

Ensure the strategy is practical, specific to the instruments and timeframe provided, and includes realistic risk management guidelines. Provide at least 3-5 items in each list section.
`;

  return prompt.trim();
}; 