import React, { useState } from 'react'

export const AIStrategyBuilderV2: React.FC = () => {
  const [strategyName, setStrategyName] = useState('')
  const [selectedMarket, setSelectedMarket] = useState('')
  const [riskLevel, setRiskLevel] = useState('')

  const markets = ['Stocks', 'Crypto', 'Forex', 'Commodities']
  const riskLevels = ['Low', 'Medium', 'High']

  const handleGenerateStrategy = () => {
    // Placeholder for AI strategy generation logic
    console.log('Generating strategy:', { strategyName, selectedMarket, riskLevel })
  }

  return (
    <Card style={{ width: "100%", color: "white" }}>
      <CardHeader>
        <CardTitle>AI Strategy Builder V2</CardTitle>
      </CardHeader>
      <CardContent>
        <div >
          <div>
            <label >Strategy Name</label>
            <Input 
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              placeholder="Enter strategy name"
              style={{ color: "white" }}
            />
          </div>

          <div>
            <label >Market</label>
            <Select 
              value={selectedMarket} 
              onValueChange={setSelectedMarket}
            >
              <SelectTrigger style={{ color: "white" }}>
                <SelectValue placeholder="Select Market" />
              </SelectTrigger>
              <SelectContent>
                {markets.map((market) => (
                  <SelectItem key={market} value={market}>{market}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label >Risk Level</label>
            <Select 
              value={riskLevel} 
              onValueChange={setRiskLevel}
            >
              <SelectTrigger style={{ color: "white" }}>
                <SelectValue placeholder="Select Risk Level" />
              </SelectTrigger>
              <SelectContent>
                {riskLevels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerateStrategy}
            style={{ width: "100%" }}
          >
            Generate AI Strategy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['strategies', 'strategyRules'],
  aiBlocks: ['strategyBuilder', 'strategyAnalysis'],
  functions: ['generateStrategy', 'saveStrategy']
}; 