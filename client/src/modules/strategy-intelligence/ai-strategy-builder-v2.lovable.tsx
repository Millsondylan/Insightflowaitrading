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
    <Card  style={{ width: "100%", color: "white" }}>
      <Cardheader >
        <Cardtitle />AI Strategy Builder V2</Card />
      <Cardcontent >
        <div className="space-y-4">
          <div>
            <Label className="block text-sm mb-2">Strategy Name</Card>
            <Input /> setStrategyName(e.target.value)}
              placeholder="Enter strategy name"
              className="bg-zinc-900 border-zinc-700 text-white"
            / />

          <div>
            <Label className="block text-sm mb-2"></Input>Market</div>
            <Select >
              <SelectTrigger  style={{ color: "white" }}>
                <SelectValue placeholder="Select Market"/>
              <SelectContent >
                {markets.map((market) => (
                  <SelectItem >{market}</Select>
                ))}
              </SelectContent />
          </div>

          <div>
            <Label className="block text-sm mb-2"></div>Risk Level</div>
            <Select >
              <SelectTrigger  style={{ color: "white" }}>
                <SelectValue placeholder="Select Risk Level"/>
              <SelectContent >
                {riskLevels.map((level) => (
                  <SelectItem >{level}</Select>
                ))}
              </SelectContent />
          </div>

          <Button  style={{ width: "100%" }}>
            Generate AI Strategy
          </button>
        </div />
    </Card>
  )
}

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['strategies', 'strategyRules'],
  aiBlocks: ['strategyBuilder', 'strategyAnalysis'],
  functions: ['generateStrategy', 'saveStrategy']
}; 