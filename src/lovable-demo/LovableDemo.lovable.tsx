import React, { useState } from 'react';
import { SentimentDisplay } from '../lib/markets/sentiment-analyzer.lovable';
import { MLStrategyOptimizerUI } from '../lib/strategy/ml-optimizer.lovable';
import { ReflectionGenerator } from '../lib/journal/generateReflection.lovable';
import { PaymentForm } from '../lib/subscription/payments.lovable';

const demoStrategy = {
  id: 'demo-strategy',
  name: 'Demo Strategy',
  parameters: {
    entryThreshold: 0.5,
    exitThreshold: -0.5,
    stopLoss: 2,
    takeProfit: 4,
    positionSize: 0.1
  },
  rules: ['SMA(20) > SMA(50)', 'RSI(14) < 30'],
  timeframe: '1h',
  symbols: ['BTC/USD']
};

const demoTrade = {
  id: 'demo-trade',
  symbol: 'BTC/USD',
  type: 'buy' as const,
  entryPrice: 50000,
  exitPrice: 52000,
  quantity: 0.1,
  entryTime: '2024-03-20T10:00:00Z',
  exitTime: '2024-03-20T14:00:00Z',
  stopLoss: 49000,
  takeProfit: 53000,
  strategy: 'Demo Strategy',
  tags: ['trend-following', 'breakout']
};

const demoTier = {
  id: 'pro',
  name: 'Pro Plan',
  price: 49.99,
  cryptoPrice: 0.001,
  cryptoCurrency: 'BTC',
  cryptoAddress: '1Demo...ABC',
  features: [
    'Advanced Strategy Builder',
    'Real-time Market Analysis',
    'AI Trade Coach',
    'Portfolio Analytics'
  ],
  interval: 'monthly' as const
};

export const LovableDemo = () => {
  const [activeTab, setActiveTab] = useState('sentiment');

  const handleOptimizationComplete = (result) => {
    console.log('Optimization complete:', result);
  };

  const handleReflectionGenerated = (reflection) => {
    console.log('Reflection generated:', reflection);
  };

  const handlePaymentComplete = (transactionId) => {
    console.log('Payment complete:', transactionId);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        InsightFlow AI Trading Platform
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button  onClick={() => setActiveTab('sentiment')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'sentiment' ? '#2563eb' : '#e5e7eb',
              color: activeTab === 'sentiment' ? 'white' : 'black',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Market Sentiment
          </button>
          <Button  onClick={() => setActiveTab('optimizer')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'optimizer' ? '#2563eb' : '#e5e7eb',
              color: activeTab === 'optimizer' ? 'white' : 'black',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Strategy Optimizer
          </button>
          <Button  onClick={() => setActiveTab('reflection')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'reflection' ? '#2563eb' : '#e5e7eb',
              color: activeTab === 'reflection' ? 'white' : 'black',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Trade Reflection
          </button>
          <Button  onClick={() => setActiveTab('subscription')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'subscription' ? '#2563eb' : '#e5e7eb',
              color: activeTab === 'subscription' ? 'white' : 'black',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Subscription
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {activeTab === 'sentiment' && (
          <Sentimentdisplay symbol="BTC/USD" apiKey="demo-key">
        )}

        {activeTab === 'optimizer' && (
          <Mlstrategyoptimizerui />
        )}

        {activeTab === 'reflection' && (
          <Reflectiongenerator >
        )}

        {activeTab === 'subscription' && (
          <paymentform />
        )}
      </div>
    </div>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
