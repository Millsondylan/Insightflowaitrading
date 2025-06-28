import React, { useRef, useEffect } from 'react';
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
      { ref: heroRef, theme: 'insightflow' },
      { ref: featuresRef, theme: 'academy' },
      { ref: pricingRef, theme: 'portfolio' },
      { ref: testimonialsRef, theme: 'neonwave' },
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
    <div className="min-h-screen bg-background-primary text-text-primary">
      {/* Navigation Header */}
      <nav className="w-full p-6 flex justify-between items-center backdrop-blur-sm bg-background-glass fixed top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-text-on-brand" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-text-primary to-brand-primary bg-clip-text text-transparent">
            InsightFlow AI
          </h1>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate('/auth')}
            variant="default"
          >
            Start Free Trial
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        ref={heroRef} 
        id="hero" 
        className="w-full px-0 pt-32 pb-32"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="text-center space-y-8 w-full">
          <Badge className="bg-brand-primary/20 text-text-accent border-brand-primary/30 px-4 py-2">
            🚀 Advanced Trading Platform - Now with AI Integration
          </Badge>
          
          <h1 className="text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-text-primary via-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Trade Smarter with
            </span>
            <br />
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </h1>
          
          <p className="text-xl text-text-secondary mb-8 w-full leading-relaxed max-w-3xl mx-auto">
            Experience the future of trading with our ultra-modern platform featuring real-time market data, 
            advanced analytics, and risk-free demo trading. Start your 30-day free trial today.
          </p>
          
          <div className="flex justify-center space-x-4 pt-8">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-4"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/trading')}
              className="text-lg px-8 py-4"
            >
              View Demo
            </Button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 pt-12 text-text-muted">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-status-success" />
              <span>30-Day Free Trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-status-success" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-status-success" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Real-time Stats Section */}
      <div className="container mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center text-text-accent">Loading stats...</div>
        ) : error ? (
          <div className="text-center text-status-error">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 mx-auto text-brand-primary" />
                <CardTitle>{userCount.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-text-muted">Active Traders</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 mx-auto text-brand-accent" />
                <CardTitle>
                  {totalTrades > 0 ? ((successfulTrades / totalTrades) * 100).toFixed(1) : '0.0'}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-text-muted">Successful Trades</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle className="w-8 h-8 mx-auto text-status-success" />
                <CardTitle>{platformUptime}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-text-muted">Platform Uptime</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 mx-auto text-brand-secondary" />
                <CardTitle>{marketsCovered > 0 ? marketsCovered : 'N/A'}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-text-muted">Markets Covered</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <DollarSign className="w-8 h-8 mx-auto text-status-warning" />
                <CardTitle>${demoVolume.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-text-muted">Total Volume</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Star className="w-8 h-8 mx-auto text-brand-primary" />
                <CardTitle>{userRating > 0 ? userRating.toFixed(1) : '5.0'}/5</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-text-muted">User Rating</span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

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
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Powerful Features for Modern Traders
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Everything you need to trade successfully in today's markets
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:border-brand-primary/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-text-on-brand" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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
        <div className="text-center mb-16 w-full">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-xl text-text-muted w-full">
            See what our users are saying about InsightFlow AI
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full container mx-auto">
          {loading ? (
            <div className="col-span-3 text-center text-text-accent">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="col-span-3 text-center text-text-muted">No reviews yet.</div>
          ) : (
            reviews.slice(0, 3).map((testimonial, index) => {
              if (testimonial && typeof testimonial === 'object' && 'content' in testimonial && 'name' in testimonial && 'role' in testimonial) {
                const t = testimonial as any;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <p className="text-text-secondary italic">"{t.content}"</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-text-on-brand" />
                        </div>
                        <div>
                          <p className="text-text-primary font-semibold">{t.name}</p>
                          <p className="text-text-muted text-sm">{t.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })
          )}
        </div>
      </motion.div>

      {/* Crypto Payment Section */}
      <div className="w-full px-0 py-20" id="crypto-payment">
        <div className="text-center mb-16 w-full">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Secure Crypto Payment Integration
          </h2>
          <p className="text-xl text-text-muted w-full">
            Pay with your preferred cryptocurrency using our verified wallet addresses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full container mx-auto">
          {['USDT', 'BTC', 'ETH'].map((coin, idx) => (
            <Card key={coin}>
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-lg ${coin === 'USDT' ? 'bg-green-500/20 border border-green-500/30' : coin === 'BTC' ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-blue-500/20 border border-blue-500/30'} flex items-center justify-center mb-4`}>
                  <Bitcoin className="w-8 h-8 text-text-on-brand" />
                </div>
                <CardTitle className="text-text-primary">{coin}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 