import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { 
  Smartphone, Download, Zap, Brain, TrendingUp, Eye, 
  Monitor, Cpu, Layers, Settings, Crown, Sparkles, Target
} from 'lucide-react';
import DocumentHead from '@/components/core/DocumentHead';
import { toast } from '@/components/ui/use-toast';

interface AIModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  status: 'active' | 'training' | 'ready';
  predictions_today: number;
  success_rate: number;
}

interface MobileFeature {
  name: string;
  description: string;
  status: 'available' | 'beta' | 'coming_soon';
  icon: any;
}

const AdvancedFeaturesPage = () => {
  const { user } = useAuth();
  
  const [aiModels] = useState<AIModel[]>([
    {
      id: 'trend-predictor', name: 'Trend Predictor AI', description: 'Advanced market trend analysis',
      accuracy: 87.3, status: 'active', predictions_today: 247, success_rate: 82.1
    },
    {
      id: 'risk-analyzer', name: 'Risk Analyzer AI', description: 'Real-time portfolio risk assessment',
      accuracy: 91.7, status: 'active', predictions_today: 156, success_rate: 89.4
    },
    {
      id: 'sentiment-ai', name: 'Market Sentiment AI', description: 'Social media and news sentiment analysis',
      accuracy: 76.8, status: 'training', predictions_today: 89, success_rate: 74.2
    },
    {
      id: 'options-ai', name: 'Options Strategy AI', description: 'Advanced derivatives trading signals',
      accuracy: 94.2, status: 'ready', predictions_today: 0, success_rate: 0
    }
  ]);

  const [mobileFeatures] = useState<MobileFeature[]>([
    { name: 'Push Notifications', description: 'Real-time trade alerts', status: 'available', icon: Zap },
    { name: 'Offline Mode', description: 'Access data without internet', status: 'available', icon: Download },
    { name: 'Touch ID/Face ID', description: 'Biometric authentication', status: 'available', icon: Eye },
    { name: 'Native Charts', description: 'Hardware-accelerated charts', status: 'beta', icon: TrendingUp },
    { name: 'Voice Commands', description: 'AI voice trading assistant', status: 'coming_soon', icon: Brain },
    { name: 'AR Market View', description: 'Augmented reality market overlay', status: 'coming_soon', icon: Target }
  ]);

  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast({
        title: "App Installed! 📱",
        description: "InsightFlow AI has been added to your home screen.",
      });
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const enableAIModel = (modelId: string) => {
    toast({
      title: "AI Model Activated",
      description: "Advanced AI model is now processing your data.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'training': return 'bg-yellow-500/20 text-yellow-300';
      case 'ready': return 'bg-blue-500/20 text-blue-300';
      case 'available': return 'bg-green-500/20 text-green-300';
      case 'beta': return 'bg-orange-500/20 text-orange-300';
      case 'coming_soon': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <DocumentHead title="Advanced Features - InsightFlow AI" description="AI models, mobile app, and professional tools" />

      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Crown className="w-8 h-8 text-yellow-400" />
              Advanced Features
            </h1>
            <p className="text-gray-400">AI models, mobile app, and professional trading tools</p>
          </div>
          
          {isInstallable && (
            <Button onClick={installPWA} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Install Mobile App
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="ai-models" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20">
            <TabsTrigger value="ai-models" className="text-white data-[state=active]:bg-blue-600">
              <Brain className="w-4 h-4 mr-2" />AI Models
            </TabsTrigger>
            <TabsTrigger value="mobile" className="text-white data-[state=active]:bg-blue-600">
              <Smartphone className="w-4 h-4 mr-2" />Mobile App
            </TabsTrigger>
            <TabsTrigger value="professional" className="text-white data-[state=active]:bg-blue-600">
              <Monitor className="w-4 h-4 mr-2" />Pro Tools
            </TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-blue-600">
              <Settings className="w-4 h-4 mr-2" />System
            </TabsTrigger>
          </TabsList>

          {/* AI Models Tab */}
          <TabsContent value="ai-models" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {aiModels.map((model) => (
                <Card key={model.id} className="bg-black/20 border-gray-700 text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        {model.name}
                      </CardTitle>
                      <Badge className={getStatusColor(model.status)}>
                        {model.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{model.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Accuracy</p>
                        <p className="text-xl font-bold text-green-400">{model.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Success Rate</p>
                        <p className="text-xl font-bold text-blue-400">
                          {model.success_rate > 0 ? `${model.success_rate}%` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Predictions Today</p>
                        <p className="text-lg font-medium text-white">{model.predictions_today}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <p className="text-lg font-medium text-white capitalize">{model.status}</p>
                      </div>
                    </div>

                    {model.status === 'ready' ? (
                      <Button 
                        onClick={() => enableAIModel(model.id)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Activate Model
                      </Button>
                    ) : model.status === 'active' ? (
                      <Button disabled className="w-full bg-green-600/20 text-green-300">
                        <Zap className="w-4 h-4 mr-2" />
                        Active & Running
                      </Button>
                    ) : (
                      <Button disabled className="w-full bg-yellow-600/20 text-yellow-300">
                        <Cpu className="w-4 h-4 mr-2" />
                        Training in Progress
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <Brain className="w-5 h-5" />
                  AI Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">492</p>
                  <p className="text-sm text-gray-400">Total Predictions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">84.7%</p>
                  <p className="text-sm text-gray-400">Overall Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">127</p>
                  <p className="text-sm text-gray-400">Profitable Signals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">$2,847</p>
                  <p className="text-sm text-gray-400">AI-Generated Profit</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mobile App Tab */}
          <TabsContent value="mobile" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Progressive Web App
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    Install InsightFlow AI as a native mobile app with offline capabilities, 
                    push notifications, and full trading functionality.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Works offline with cached data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Native-like performance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Home screen installation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Background sync & notifications</span>
                    </div>
                  </div>

                  {isInstallable ? (
                    <Button onClick={installPWA} className="w-full bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Install Now
                    </Button>
                  ) : (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm text-green-300">✓ Already installed or available in app stores</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Mobile Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mobileFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <feature.icon className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-white">{feature.name}</p>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-300">
                  <Monitor className="w-5 h-5" />
                  Cross-Platform Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  {[
                    { platform: 'iOS Safari', compatibility: '100%', features: 'Full PWA support' },
                    { platform: 'Android Chrome', compatibility: '100%', features: 'Native app experience' },
                    { platform: 'Desktop', compatibility: '100%', features: 'Multi-monitor support' }
                  ].map((platform) => (
                    <div key={platform.platform} className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Monitor className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-medium text-white mb-1">{platform.platform}</h3>
                      <p className="text-2xl font-bold text-blue-400 mb-1">{platform.compatibility}</p>
                      <p className="text-sm text-gray-400">{platform.features}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Tools Tab */}
          <TabsContent value="professional" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Advanced Order Types', icon: Target, 
                  description: 'OCO, Iceberg, TWAP, and algorithmic orders',
                  features: ['One-Cancels-Other', 'Time-Weighted Average', 'Hidden Liquidity', 'Smart Routing']
                },
                {
                  title: 'Multi-Account Manager', icon: Layers,
                  description: 'Manage multiple trading accounts simultaneously',
                  features: ['Account Grouping', 'Risk Allocation', 'Performance Comparison', 'Unified Dashboard']
                },
                {
                  title: 'Institutional Tools', icon: Crown,
                  description: 'Professional-grade analysis and execution',
                  features: ['Market Microstructure', 'Flow Analysis', 'Prime Brokerage', 'Dark Pools']
                }
              ].map((tool, index) => (
                <Card key={index} className="bg-black/20 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <tool.icon className="w-5 h-5 text-yellow-400" />
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{tool.description}</p>
                    
                    <div className="space-y-2">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'CPU Usage', value: 23, max: 100, unit: '%' },
                    { label: 'Memory', value: 1.2, max: 4, unit: 'GB' },
                    { label: 'Network', value: 45, max: 100, unit: 'Mbps' },
                    { label: 'Storage', value: 67, max: 100, unit: '%' }
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">{metric.label}</span>
                        <span className="text-sm text-white">
                          {metric.value}{metric.unit} / {metric.max}{metric.unit}
                        </span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.value / metric.max > 0.8 ? 'bg-red-400' :
                            metric.value / metric.max > 0.6 ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${(metric.value / metric.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { service: 'Market Data Feed', status: 'operational', uptime: '99.97%' },
                    { service: 'AI Processing', status: 'operational', uptime: '99.94%' },
                    { service: 'Trading Engine', status: 'operational', uptime: '99.99%' },
                    { service: 'Risk Management', status: 'operational', uptime: '100%' },
                    { service: 'Backup Systems', status: 'operational', uptime: '99.87%' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          service.status === 'operational' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-white">{service.service}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-400">{service.uptime}</p>
                        <p className="text-xs text-gray-400 capitalize">{service.status}</p>
                      </div>
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

export default AdvancedFeaturesPage; 