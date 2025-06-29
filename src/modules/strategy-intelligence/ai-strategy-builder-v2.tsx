import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    <Card className="w-full bg-black/80 border-zinc-800 text-white" />
      <CardHeader>
        <CardTitle>AI Strategy Builder V2</Card>
      </CardHeader>
      <CardContent>
        <Div className="space-y-4">
          <Div>
            <Label className="block text-sm mb-2">Strategy Name</CardContent>
            <Input value={strategyName}
              onChange={(e) = /> setStrategyName(e.target.value)}
              placeholder="Enter strategy name"
              className="bg-zinc-900 border-zinc-700 text-white"
            />
          </Input>

          <Div>
            <Label className="block text-sm mb-2">Market</Div>
            <Select value={selectedMarket} 
              onValueChange={setSelectedMarket}
       >
              <selectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                <selectValue placeholder="Select Market" />
              </Select>
              <selectContent>
                {markets.map((market) => (
                  <selectItem key={market} value={market}>{market}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>

          <Div>
            <Label className="block text-sm mb-2">Risk Level</Div>
            <Select value={riskLevel} 
              onValueChange={setRiskLevel}
            />
              <selectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                <selectValue placeholder="Select Risk Level" />
              </Select>
              <selectContent>
                {riskLevels.map((level) => (
                  <selectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>

          <Button onClick={handleGenerateStrategy}
            className="w-full bg-blue-600 hover:bg-blue-700"
      >
            Generate AI Strategy
          </Button>
        </Div>
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