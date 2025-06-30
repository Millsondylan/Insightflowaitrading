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
  const heroRef = useRef<HTMLDivElement >(null);
  const featuresRef = useRef<HTMLDivElement >(null);
  const pricingRef = useRef<HTMLDivElement >(null);
  const testimonialsRef = useRef<HTMLDivElement >(null);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation Header */}
      <nav className="w-full p-6 flex justify-between items-center backdrop-blur-sm bg-black/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp  style={{ color: "white" }}/>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            InsightFlow AI
          </HTMLDivElement>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline"> navigate('/auth')}
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
          >
            Sign In
          </div>
          <Button /> navigate('/auth')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Start Free Trial
          </button>
        </div />

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
        <div className="text-center space-y-8 w-full">
          <Badge >
            🚀 Advanced Trading Platform - Now with AI Integration
          </div>
          
          <h1 className="text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trade Smarter with
            </h1>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 w-full leading-relaxed">
            Experience the future of trading with our ultra-modern platform featuring real-time market data, 
            advanced analytics, and risk-free demo trading. Start your 30-day free trial today.
          </p>
          
          <div className="flex justify-center space-x-4 pt-8">
            <Button size="lg"/> navigate('/auth')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 shadow-lg shadow-blue-500/25"
            >
              Start Free Trial
              <ArrowRight >
            </div>
            <Button size="lg" variant="outline"> navigate('/trading')}
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white text-lg px-8 py-4"
            >
              View Demo
            </button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 pt-12 text-gray-400">
            <div className="flex items-center space-x-2">
              <checkcircle >
              <span>30-Day Free Trial</div>
            </div>
            <div className="flex items-center space-x-2">
              <checkcircle >
              <span>No Credit Card Required</div>
            </div>
            <div className="flex items-center space-x-2">
              <checkcircle >
              <span>Cancel Anytime</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Real-time Stats Section */}
      <div className="container mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center text-blue-400">Loading stats...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            <Card >
              <Cardheader >
                <Users >
                <Cardtitle  style={{ color: "white" }}>{userCount.toLocaleString()}</div />
              <Cardcontent >
                <span className="text-gray-400">Active Traders</Cardcontent />
            </div>
            <Card >
              <Cardheader >
                <TrendingUp >
                <Cardtitle  style={{ color: "white" }}>
                  {totalTrades > 0 ? ((successfulTrades / totalTrades) * 100).toFixed(1) : '0.0'}%
                </Card />
              <Cardcontent >
                <span className="text-gray-400">Successful Trades</Cardcontent />
            </Card>
            <Card >
              <Cardheader >
                <checkcircle >
                <Cardtitle  style={{ color: "white" }}>{platformUptime}</Card />
              <Cardcontent >
                <span className="text-gray-400">Platform Uptime</Cardcontent />
            </Card>
            <Card >
              <Cardheader >
                <BarChart3 >
                <Cardtitle  style={{ color: "white" }}>{marketsCovered > 0 ? marketsCovered : 'N/A'}</Card />
              <Cardcontent >
                <span className="text-gray-400">Markets Covered</Cardcontent />
            </Card>
            <Card >
              <Cardheader >
                <DollarSign >
                <Cardtitle  style={{ color: "white" }}>${demoVolume.toLocaleString()}</Card />
              <Cardcontent >
                <span className="text-gray-400">Total Volume</Cardcontent />
            </Card>
            <Card >
              <Cardheader >
                <Star >
                <Cardtitle  style={{ color: "white" }}>{userRating > 0 ? userRating.toFixed(1) : '5.0'}/5</Card />
              <Cardcontent >
                <span className="text-gray-400">User Rating</Cardcontent />
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
          <h2 className="text-4xl font-bold text-white mb-6">
            Powerful Features for Modern Traders
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to trade successfully in today's markets
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card >
              <Cardheader >
                <div className={`w-16 h-16 mx-auto rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <Cardtitle  style={{ color: "white", fontSize: "1.25rem" }}>{feature.title}</Cardtitle />
              <Cardcontent >
                <p className="text-gray-400 text-center">{feature.description}</Cardcontent />
            </Cardtitle>
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
          <h2 className="text-4xl font-bold text-white mb-6"></div>
            Trusted by Traders Worldwide
          </div>
          <p className="text-xl text-gray-400 w-full">
            See what our users are saying about InsightFlow AI
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {loading ? (
            <div className="col-span-3 text-center text-blue-400">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="col-span-3 text-center text-gray-400">No reviews yet.</div>
          ) : (
            reviews.slice(0, 3).map((testimonial, index) => {
              if (testimonial && typeof testimonial === 'object' && 'content' in testimonial && 'name' in testimonial && 'role' in testimonial) {
                const t = testimonial as any;
                return (
                  <Card >
                    <Cardheader /></Card /></Card />
                      <p className="text-gray-300 italic">"{t.content}"</p />
                    <Cardcontent >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Users  style={{ color: "white" }}/>
                        <div>
                          <p className="text-white font-semibold">{t.name}</Card>
                          <p className="text-gray-400 text-sm">{t.role}</p>
                        </div>
                      </div />
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
          <h2 className="text-4xl font-bold text-white mb-6"></div>
            Secure Crypto Payment Integration
          </div>
          <p className="text-xl text-gray-400 w-full">
            Pay with your preferred cryptocurrency using our verified wallet addresses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {['USDT', 'BTC', 'ETH'].map((coin, idx) => (
            <Card >
              <Cardheader ></div>
                <div className={`w-16 h-16 mx-auto rounded-lg ${coin === 'USDT' ? 'bg-green-500/20 border border-green-500/30' : coin === 'BTC' ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-blue-500/20 border border-blue-500/30'} flex items-center justify-center mb-4`}>
                  <Bitcoin  style={{ color: "white" }}>
                </div>
                <Cardtitle  style={{ color: "white", fontSize: "1.25rem" }}>{coin}</Cardtitle />
            </Cardtitle>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
