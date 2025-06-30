import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { 
  Plug, CheckCircle, ExternalLink, Copy, Key, Zap, Code, 
  Activity, TrendingUp, AlertCircle, Settings, Monitor
} from 'lucide-react';
import DocumentHead from '@/components/core/DocumentHead';
import { toast } from '@/components/ui/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  status: 'connected' | 'available' | 'coming_soon';
  features: string[];
  setup_complexity: 'easy' | 'medium' | 'advanced';
}

interface APIEndpoint {
  method: string;
  endpoint: string;
  description: string;
  parameters: string[];
  response: string;
}

const IntegrationsPage = () => {
  const { user } = useAuth();
  
  const [integrations] = useState<Integration[]>([
    {
      id: 'mt4', name: 'MetaTrader 4', description: 'Connect your MT4 account for live trading',
      logo: '📊', category: 'Trading Platforms', status: 'connected',
      features: ['Live Trading', 'Position Sync', 'Trade History', 'Risk Management'],
      setup_complexity: 'medium'
    },
    {
      id: 'mt5', name: 'MetaTrader 5', description: 'Advanced MT5 integration with AI signals',
      logo: '📈', category: 'Trading Platforms', status: 'available',
      features: ['Multi-Asset Trading', 'Advanced Orders', 'Market Data', 'Copy Trading'],
      setup_complexity: 'medium'
    },
    {
      id: 'tradingview', name: 'TradingView', description: 'Professional charting and analysis',
      logo: '📉', category: 'Charting', status: 'connected',
      features: ['Advanced Charts', 'Pine Script', 'Social Trading', 'Alerts'],
      setup_complexity: 'easy'
    },
    {
      id: 'binance', name: 'Binance', description: 'World\'s largest crypto exchange',
      logo: '₿', category: 'Exchanges', status: 'available',
      features: ['Spot Trading', 'Futures', 'Options', 'Staking'],
      setup_complexity: 'easy'
    },
    {
      id: 'coinbase', name: 'Coinbase Pro', description: 'Professional crypto trading platform',
      logo: '🔵', category: 'Exchanges', status: 'coming_soon',
      features: ['Advanced Trading', 'API Access', 'Institutional', 'Custody'],
      setup_complexity: 'easy'
    },
    {
      id: 'discord', name: 'Discord Bot', description: 'Get trading alerts in Discord',
      logo: '🎮', category: 'Notifications', status: 'available',
      features: ['Trade Alerts', 'Market Updates', 'Commands', 'Community'],
      setup_complexity: 'easy'
    },
    {
      id: 'telegram', name: 'Telegram Bot', description: 'Real-time trading notifications',
      logo: '✈️', category: 'Notifications', status: 'connected',
      features: ['Instant Alerts', 'Portfolio Updates', 'Commands', 'Groups'],
      setup_complexity: 'easy'
    },
    {
      id: 'webhooks', name: 'Custom Webhooks', description: 'Connect any external service',
      logo: '🔗', category: 'Custom', status: 'available',
      features: ['Real-time Data', 'Custom Events', 'Filtering', 'Retries'],
      setup_complexity: 'advanced'
    }
  ]);

  const [apiEndpoints] = useState<APIEndpoint[]>([
    {
      method: 'GET', endpoint: '/api/portfolio', description: 'Get portfolio overview',
      parameters: ['user_id', 'timeframe'], response: 'Portfolio data with positions and P&L'
    },
    {
      method: 'POST', endpoint: '/api/trades', description: 'Create new trade entry',
      parameters: ['symbol', 'side', 'size', 'price'], response: 'Trade confirmation with ID'
    },
    {
      method: 'GET', endpoint: '/api/strategies', description: 'List user strategies',
      parameters: ['status', 'category'], response: 'Array of strategy objects'
    },
    {
      method: 'POST', endpoint: '/api/alerts', description: 'Create price alert',
      parameters: ['symbol', 'condition', 'target_price'], response: 'Alert ID and confirmation'
    },
    {
      method: 'GET', endpoint: '/api/market-data', description: 'Real-time market prices',
      parameters: ['symbols', 'timeframe'], response: 'Live price data and indicators'
    }
  ]);

  const [apiKey] = useState('if_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz');
  const [webhookUrl] = useState('https://api.insightflow.ai/webhooks/user-12345');

  const connectIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;
    
    toast({
      title: `Connecting to ${integration.name}`,
      description: "Follow the setup instructions to complete integration.",
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'available': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'coming_soon': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <DocumentHead title="Integrations - InsightFlow AI" description="Connect external platforms and APIs" />

      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Integrations & API</h1>
            <p className="text-gray-400">Connect external platforms and build custom solutions</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/20">
            <TabsTrigger value="integrations" className="text-white data-[state=active]:bg-blue-600">
              <Plug className="w-4 h-4 mr-2" />Integrations
            </TabsTrigger>
            <TabsTrigger value="api" className="text-white data-[state=active]:bg-blue-600">
              <Code className="w-4 h-4 mr-2" />API Access
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="text-white data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" />Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id} className="bg-black/20 border-gray-700 text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{integration.logo}</div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-1">{integration.category}</Badge>
                        </div>
                      </div>
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {integration.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{integration.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-400">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">Setup:</span>
                        <span className={`text-xs font-medium ${getComplexityColor(integration.setup_complexity)}`}>
                          {integration.setup_complexity.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {integration.status === 'connected' ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 border-green-500 text-green-400">
                          <CheckCircle className="w-4 h-4 mr-2" />Connected
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-400">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : integration.status === 'available' ? (
                      <Button 
                        size="sm" 
                        onClick={() => connectIntegration(integration.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Plug className="w-4 h-4 mr-2" />Connect
                      </Button>
                    ) : (
                      <Button disabled size="sm" className="w-full bg-gray-600/20 text-gray-400">
                        <AlertCircle className="w-4 h-4 mr-2" />Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />API Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">API Key</label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={apiKey}
                        readOnly
                        className="flex-1 bg-black/20 border-gray-600 text-white font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(apiKey, 'API Key')}
                        className="border-gray-600 text-gray-300"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-300">Security Notice</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Keep your API key secure. It provides full access to your account data and trading functions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400">Rate Limits:</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Data:</span>
                        <span className="text-white">100/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trading:</span>
                        <span className="text-white">60/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Portfolio:</span>
                        <span className="text-white">30/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Webhooks:</span>
                        <span className="text-white">1000/min</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />API Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { endpoint: 'Market Data', calls: 1247, limit: 6000, percentage: 20.8 },
                    { endpoint: 'Portfolio', calls: 89, limit: 1800, percentage: 4.9 },
                    { endpoint: 'Trading', calls: 23, limit: 3600, percentage: 0.6 },
                    { endpoint: 'Strategies', calls: 156, limit: 1800, percentage: 8.7 }
                  ].map((usage) => (
                    <div key={usage.endpoint} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">{usage.endpoint}</span>
                        <span className="text-sm text-white">{usage.calls}/{usage.limit}</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            usage.percentage > 80 ? 'bg-red-400' :
                            usage.percentage > 60 ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${usage.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/20 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                    <div>Method</div>
                    <div>Endpoint</div>
                    <div>Description</div>
                    <div>Parameters</div>
                    <div>Response</div>
                  </div>
                  
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                      <div>
                        <Badge className={`text-xs ${
                          endpoint.method === 'GET' ? 'bg-green-500/20 text-green-300' :
                          endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-orange-500/20 text-orange-300'
                        }`}>
                          {endpoint.method}
                        </Badge>
                      </div>
                      <div className="text-white font-mono text-sm">{endpoint.endpoint}</div>
                      <div className="text-gray-300 text-sm">{endpoint.description}</div>
                      <div className="text-gray-400 text-xs">
                        {endpoint.parameters.join(', ')}
                      </div>
                      <div className="text-gray-400 text-xs">{endpoint.response}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />Webhook Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Webhook URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={webhookUrl}
                        readOnly
                        className="flex-1 bg-black/20 border-gray-600 text-white font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(webhookUrl, 'Webhook URL')}
                        className="border-gray-600 text-gray-300"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-400">Available Events:</p>
                    {[
                      'trade.opened', 'trade.closed', 'strategy.signal', 
                      'portfolio.update', 'alert.triggered', 'risk.warning'
                    ].map((event) => (
                      <div key={event} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-sm text-white font-mono">{event}</span>
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Recent Webhook Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { event: 'trade.closed', timestamp: '2 min ago', status: 'success' },
                    { event: 'strategy.signal', timestamp: '5 min ago', status: 'success' },
                    { event: 'portfolio.update', timestamp: '8 min ago', status: 'success' },
                    { event: 'alert.triggered', timestamp: '12 min ago', status: 'failed' },
                    { event: 'trade.opened', timestamp: '15 min ago', status: 'success' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded">
                      <div>
                        <p className="text-sm text-white font-mono">{log.event}</p>
                        <p className="text-xs text-gray-400">{log.timestamp}</p>
                      </div>
                      <Badge className={`text-xs ${
                        log.status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {log.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntegrationsPage; 