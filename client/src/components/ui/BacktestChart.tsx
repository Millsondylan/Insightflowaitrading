
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlockReveal from './BlockReveal';

interface BacktestChartProps {
  data: Array<{
    date: string;
    equity: number;
    drawdown: number;
  }>;
  title?: string;
}

const BacktestChart = ({ data, title = "Backtest Results" }: BacktestChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <p>No data available for charting</p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <p>Performance over time showing equity curve and drawdowns</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BlockReveal delay={0.2}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="rgba(255, 255, 255, 0.5)"
                    />
                    <YAxis 
                      tickFormatter={formatCurrency}
                      stroke="rgba(255, 255, 255, 0.5)"
                    />
                    <Tooltip 
                      labelFormatter={formatDate}
                      formatter={[formatCurrency, 'Equity']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 20, 20, 0.8)', 
                        borderColor: 'rgba(255, 255, 255, 0.2)' 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                      name="Equity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Drawdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="rgba(255, 255, 255, 0.5)"
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                      stroke="rgba(255, 255, 255, 0.5)"
                    />
                    <Tooltip 
                      labelFormatter={formatDate}
                      formatter={[(value: number) => `${(value * 100).toFixed(2)}%`, 'Drawdown']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 20, 20, 0.8)', 
                        borderColor: 'rgba(255, 255, 255, 0.2)' 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="drawdown" 
                      stroke="#ff6b6b" 
                      strokeWidth={2}
                      dot={false}
                      name="Drawdown"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </BlockReveal>
      </CardContent>
    </Card>
  );
};

export default BacktestChart;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
