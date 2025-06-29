import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PlayCircle, TrendingUp, BarChart, Star, GitCommit } from 'lucide-react';

// Mock data, in a real app this would come from an API
const strategyDetails = {
  id: '1',
  name: 'Momentum Scalper',
  author: 'CryptoWhale',
  description: 'A high-frequency strategy that aims to capture small profits from short-term momentum shifts in volatile assets like Bitcoin. It uses a combination of EMA crosses and RSI indicators.',
  tags: ['BTC', 'Scalping', 'High-Frequency'],
  performance: 23.5,
  stars: 1200,
  winRate: 68,
  avgPnl: 0.8,
  backtests: 124,
};

const GlassCard = ({ title, value, icon, unit = '' }: { title: string, value: string | number, icon: React.ElementType, unit?: string }) => {
    const Icon = icon;
    return (
        <Div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Div className="flex justify-center items-center gap-2 text-gray-400 text-sm mb-2">
                <Icon>
                {title}
            </Div>
            <P className="text-2xl font-bold text-white">{value}{unit}</P>
        </Div>
    );
};


export default function VaultDetailPage() {
  const { id } = useParams<{ id: string }>();
  // In a real app, you'd fetch strategy details based on the id
  const strategy = strategyDetails;

  return (
    <Div>
      <Link to="/vault" style={{ display: "flex", alignItems: "center" }}>
        <Arrowleft />
        Back to Vault
      </Div>

      <Div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <Header className="flex justify-between items-start mb-8">
            <Div>
                <H1 className="text-4xl font-bold text-white flex items-center gap-4">
                    <Span className="bg-white/10 p-3 rounded-lg"><Gitcommit ></Div>
                    {strategy.name}
                </H1>
                <P className="text-gray-400 mt-2">by {strategy.author}</P>
            </Div>
            <Link  />
                <Button size="lg" style={{ color: "white" }} /></Link /></Link />
                    <playcircle >
                    Launch Replay
                </Link />
        </Link>

        <P className="text-gray-300 max-w-3xl mb-6">{strategy.description}</P>
        
        <Div className="flex items-center gap-2 mb-8">
          {strategy.tags.map(tag => <Badge variant="secondary"></Div></Div>{tag}</Div>)}
        </Div>

        <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <glasscard title="Performance" unit="%">
            <glasscard title="Win Rate" unit="%">
            <glasscard title="Avg PnL/Trade" unit="%">
            <glasscard title="Backtests">
        </Div>
      </Div>
    </Div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
