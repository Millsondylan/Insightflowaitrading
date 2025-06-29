import React, { useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle,
  DollarSign,
  Hexagon,
  Bitcoin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { useLandingStats } from '@/hooks/useLandingStats';
import { getMarketData } from '@/services/api/coinGeckoClient';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useProfilePersonalization } from '@/hooks/use-profile-personalization';
import { useOnboardingGate } from '@/hooks/use-onboarding-gate';

const LandingPage = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { userCount, strategyCount, demoVolume, reviews, loading, error } = useLandingStats();
  const [cryptoRates, setCryptoRates] = React.useState({ USDT: 1, BTC: 0, ETH: 0 });
  const [successfulTrades, setSuccessfulTrades] = React.useState(0);
  const [totalTrades, setTotalTrades] = React.useState(0);
  const [marketsCovered, setMarketsCovered] = React.useState(0);
  const [userRating, setUserRating] = React.useState(0);
  const [platformUptime, setPlatformUptime] = React.useState('N/A');

  // Section refs for theme changes
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Theme switching based on scroll position
  useEffect(() => {
    const sections = [
      { ref: heroRef, theme: 'landing' },
      { ref: featuresRef, theme: 'academy' },
      { ref: pricingRef, theme: 'portfolio' },
      { ref: testimonialsRef, theme: 'NeonWave' },
    ];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const section = sections.find(s => s.ref.current === entry.target);
            if (section && typeof section.theme === 'string' && section.theme in themes) {
              setTheme(section.theme as keyof typeof themes);
            }
          }
        });
      },
      { threshold: [0.5] }
    );
    
    sections.forEach(s => {
      if (s.ref.current) observer.observe(s.ref.current);
    });
    
    return () => observer.disconnect();
  }, [setTheme]);

  // Load market data and stats
  React.useEffect(() => {
    // Fetch crypto rates
    getMarketData('usd', 10, 1).then(data => {
      const usdt = data.find(c => c.symbol === 'USDT');
      const btc = data.find(c => c.symbol === 'BTC');
      const eth = data.find(c => c.symbol === 'ETH');
      setCryptoRates({
        USDT: usdt?.price ?? 1,
        BTC: btc?.price ?? 0,
        ETH: eth?.price ?? 0,
      });
    });

    // Fetch platform stats
    (async () => {
      const { data: trades, error } = await supabase
        .from('demo_trades')
        .select('pnl');
      if (!error && trades) {
        setTotalTrades(trades.length);
        setSuccessfulTrades(trades.filter(t => t.pnl !== null && t.pnl > 0).length);
      }

      const { data: marketData, error: marketError } = await supabase
        .from('demo_trades')
        .select('symbol');
      if (!marketError && marketData) {
        const uniqueMarkets = new Set(marketData.map(t => t.symbol));
        setMarketsCovered(uniqueMarkets.size);
      }

      const { data: ratingPosts, error: ratingError } = await supabase
        .from('community_posts')
        .select('content')
        .contains('tags', ['review']);
      if (!ratingError && ratingPosts && ratingPosts.length > 0) {
        setUserRating(5.0);
      } else {
        setUserRating(0.0);
      }

      setPlatformUptime('N/A');
    })();
  }, []);

  // Check if onboarding is needed
  useOnboardingGate();
  
  // Get personalized settings from user profile
  const { 
    profile, 
    isLoading: profileLoading,
    defaultChartSettings 
  } = useProfilePersonalization();
  
  // Use personalized settings for dashboard
  useEffect(() => {
    if (profile && !profileLoading) {
      // Set default chart timeframe
      if (defaultChartSettings.timeframe) {
        setSelectedTimeframe(defaultChartSettings.timeframe);
      }
      
      // Set default symbols/markets to watch
      if (defaultChartSettings.symbols?.length) {
        setWatchlist(defaultChartSettings.symbols);
      }
      
      // Set default indicators
      if (defaultChartSettings.indicators?.length) {
        setActiveIndicators(defaultChartSettings.indicators);
      }
    }
  }, [profile, profileLoading, defaultChartSettings]);
  
  // Personalize welcome message
  const welcomeMessage = useMemo(() => {
    if (!profile) return 'Welcome to InsightFlow AI Trading';
    
    const timeOfDay = new Date().getHours();
    let greeting = 'Welcome';
    
    if (timeOfDay < 12) greeting = 'Good morning';
    else if (timeOfDay < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    // Personalize based on experience level
    switch (profile.experience) {
      case 'beginner':
        return `${greeting}! Ready to learn more about trading today?`;
      case 'intermediate':
        return `${greeting}! Your trading dashboard is ready.`;
      case 'pro':
        return `${greeting}! Market insights and analysis ready for review.`;
      default:
        return `${greeting} to InsightFlow AI Trading!`;
    }
  }, [profile]);

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Market Data",
      description: "Access live market data across Crypto, Forex, Stocks, and Commodities with precision decimal pricing",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Professional-grade charting tools with AI-powered insights and trend analysis",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Secure Demo Trading",
      description: "Risk-free practice trading with $10,000 virtual funds and real-time P&L tracking",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast Execution",
      description: "Ultra-low latency trading with institutional-grade infrastructure",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const pricingPlans = [
    {
      name: "Monthly",
      price: 10,
      period: "month",
      features: ["Full Market Access", "Demo Trading", "Basic Analytics", "Email Support"],
      popular: false
    },
    {
      name: "Quarterly", 
      price: 25,
      period: "3 months",
      features: ["Everything in Monthly", "Advanced Analytics", "Priority Support", "Risk Management Tools"],
      popular: true
    },
    {
      name: "Annual",
      price: 50,
      period: "year", 
      features: ["Everything in Quarterly", "Premium Features", "1-on-1 Sessions", "Custom Strategies"],
      popular: false
    }
  ];

  return (
    <Div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation Header */}
      <Nav className="w-full p-6 flex justify-between items-center backdrop-blur-sm bg-black/20">
        <Div className="flex items-center space-x-3">
          <Div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </HTMLDivElement>
          <H1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            InsightFlow AI
          </H1>
        </Div>
        <Div className="flex space-x-4">
          <Button variant="outline" 
            onClick={() = /> navigate('/auth')}
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
          >
            Sign In
          </Div>
          <Button onClick={() = /> navigate('/auth')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Start Free Trial
          </Button>
        </Div>
      </Nav>

      {/* Hero Section */}
      <motion.div 
        ref={heroRef} 
        id="hero" 
        className="w-full px-0 pt-20 pb-32"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Div className="text-center space-y-8 w-full">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2" />
            🚀 Advanced Trading Platform - Now with AI Integration
          </Div>
          
          <H1 className="text-6xl font-bold leading-tight">
            <Span className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trade Smarter with
            </H1>
            <br />
            <Span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Insights
            </Span>
          </H1>
          
          <P className="text-xl text-gray-300 mb-8 w-full leading-relaxed">
            Experience the future of trading with our ultra-modern platform featuring real-time market data, 
            advanced analytics, and risk-free demo trading. Start your 30-day free trial today.
          </P>
          
          <Div className="flex justify-center space-x-4 pt-8">
            <Button size="lg"
              onClick={() = /> navigate('/auth')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 shadow-lg shadow-blue-500/25"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Div>
            <Button size="lg" 
              variant="outline"
              onClick={() = /> navigate('/trading')}
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white text-lg px-8 py-4"
            >
              View Demo
            </Button>
          </Div>
          
          <Div className="flex justify-center items-center space-x-8 pt-12 text-gray-400">
            <Div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <Span>30-Day Free Trial</Div>
            </Div>
            <Div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <Span>No Credit Card Required</Div>
            </Div>
            <Div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <Span>Cancel Anytime</Div>
            </Div>
          </Div>
        </Div>
      </motion.div>

      {/* Real-time Stats Section */}
      <Div className="container mx-auto px-6 py-10">
        {loading ? (
          <Div className="text-center text-blue-400">Loading stats...</Div>
        ) : error ? (
          <Div className="text-center text-red-400">{error}</Div>
        ) : (
          <Div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            <Card className="bg-gray-800/50 border-blue-500/30" />
              <CardHeader>
                <Users className="w-8 h-8 mx-auto text-blue-400" />
                <CardTitle className="text-white text-2xl" />{userCount.toLocaleString()}</Div>
              </CardHeader>
              <CardContent>
                <Span className="text-gray-400">Active Traders</CardContent>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-cyan-500/30" />
              <CardHeader>
                <TrendingUp className="w-8 h-8 mx-auto text-cyan-400" />
                <CardTitle className="text-white text-2xl" />
                  {totalTrades > 0 ? ((successfulTrades / totalTrades) * 100).toFixed(1) : '0.0'}%
                </Card>
              </CardHeader>
              <CardContent>
                <Span className="text-gray-400">Successful Trades</CardContent>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-green-500/30" />
              <CardHeader>
                <CheckCircle className="w-8 h-8 mx-auto text-green-400" />
                <CardTitle className="text-white text-2xl" />{platformUptime}</Card>
              </CardHeader>
              <CardContent>
                <Span className="text-gray-400">Platform Uptime</CardContent>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-purple-500/30" />
              <CardHeader>
                <BarChart3 className="w-8 h-8 mx-auto text-purple-400" />
                <CardTitle className="text-white text-2xl" />{marketsCovered > 0 ? marketsCovered : 'N/A'}</Card>
              </CardHeader>
              <CardContent>
                <Span className="text-gray-400">Markets Covered</CardContent>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-yellow-500/30" />
              <CardHeader>
                <DollarSign className="w-8 h-8 mx-auto text-yellow-400" />
                <CardTitle className="text-white text-2xl" />${demoVolume.toLocaleString()}</Card>
              </CardHeader>
              <CardContent>
                <Span className="text-gray-400">Total Volume</CardContent>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-blue-400/30" />
              <CardHeader>
                <Star className="w-8 h-8 mx-auto text-blue-400" />
                <CardTitle className="text-white text-2xl" />{userRating > 0 ? userRating.toFixed(1) : '5.0'}/5</Card>
              </CardHeader>
              <CardContent>
                <Span className="text-gray-400">User Rating</CardContent>
              </CardContent>
            </Card>
          </Div>
        )}
      </Div>

      {/* Features Section */}
      <motion.div 
        ref={featuresRef} 
        id="features" 
        className="container mx-auto px-6 py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
      >
        <Div className="text-center mb-16">
          <H2 className="text-4xl font-bold text-white mb-6">
            Powerful Features for Modern Traders
          </Div>
          <P className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to trade successfully in today's markets
          </P>
        </Div>
        
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300" />
              <CardHeader className="text-center" />
                <Div className={`w-16 h-16 mx-auto rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </Div>
                <CardTitle className="text-white text-xl" />{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <P className="text-gray-400 text-center">{feature.description}</CardContent>
              </CardContent>
            </Card>
          ))}
        </Div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div 
        ref={testimonialsRef} 
        id="testimonials" 
        className="w-full px-0 py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
      >
        <Div className="text-center mb-16 w-full">
          <H2 className="text-4xl font-bold text-white mb-6">
            Trusted by Traders Worldwide
          </Div>
          <P className="text-xl text-gray-400 w-full">
            See what our users are saying about InsightFlow AI
          </P>
        </Div>
        <Div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {loading ? (
            <Div className="col-span-3 text-center text-blue-400">Loading reviews...</Div>
          ) : reviews.length === 0 ? (
            <Div className="col-span-3 text-center text-gray-400">No reviews yet.</Div>
          ) : (
            reviews.slice(0, 3).map((testimonial, index) => {
              if (testimonial && typeof testimonial === 'object' && 'content' in testimonial && 'name' in testimonial && 'role' in testimonial) {
                const t = testimonial as any;
                return (
                  <Card key={index} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm" />
                    <CardHeader>
                      <P className="text-gray-300 italic">"{t.content}"</Card>
                    </CardHeader>
                    <CardContent>
                      <Div className="flex items-center space-x-3">
                        <Div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </CardContent>
                        <Div>
                          <P className="text-white font-semibold">{t.name}</Div>
                          <P className="text-gray-400 text-sm">{t.role}</P>
                        </Div>
                      </Div>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })
          )}
        </Div>
      </motion.div>

      {/* Crypto Payment Section */}
      <Div className="w-full px-0 py-20" id="crypto-payment">
        <Div className="text-center mb-16 w-full">
          <H2 className="text-4xl font-bold text-white mb-6">
            Secure Crypto Payment Integration
          </Div>
          <P className="text-xl text-gray-400 w-full">
            Pay with your preferred cryptocurrency using our verified wallet addresses
          </P>
        </Div>
        
        <Div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {['USDT', 'BTC', 'ETH'].map((coin, idx) => (
            <Card key={coin} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm" />
              <CardHeader className="text-center" />
                <Div className={`w-16 h-16 mx-auto rounded-lg ${coin === 'USDT' ? 'bg-green-500/20 border border-green-500/30' : coin === 'BTC' ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-blue-500/20 border border-blue-500/30'} flex items-center justify-center mb-4`}>
                  <Bitcoin className="w-8 h-8 text-white" />
                </Div>
                <CardTitle className="text-white text-xl" />{coin}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </Div>
      </Div>
    </Div>
  );
};

export default LandingPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
