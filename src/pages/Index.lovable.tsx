import React, { useRef, useEffect } from 'react';
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
    <div style={{ minHeight: "100vh" }}>
      {/* Navigation Header */}
      <nav style={{ width: "100%", padding: "24px", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{fontSize: '16px'}}>📈</span>
          </div>
          <h1 style={{ fontWeight: "700" }}>
            InsightFlow AI
          </h1>
        </div>
        <div style={{ display: "flex" }}>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate('/auth')}
            
          >
            Start Free Trial
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        ref={heroRef} 
        id="hero" 
        style={{ width: "100%" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div style={{ marginTop: "32px", width: "100%" }}>
          <Badge style={{ paddingLeft: "16px", paddingRight: "16px" }}>
            🚀 Advanced Trading Platform - Now with AI Integration
          </Badge>
          
          <h1 style={{ fontWeight: "700" }}>
            <span >
              Trade Smarter with
            </span>
            <br />
            <span >
              AI-Powered Insights
            </span>
          </h1>
          
          <p style={{ marginBottom: "32px", width: "100%" }}>
            Experience the future of trading with our ultra-modern platform featuring real-time market data, 
            advanced analytics, and risk-free demo trading. Start your 30-day free trial today.
          </p>
          
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              
            >
              Start Free Trial
              <ArrowRight  />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/trading')}
              
            >
              View Demo
            </Button>
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#9CA3AF" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>✅</span>
              <span>30-Day Free Trial</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>✅</span>
              <span>No Credit Card Required</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>✅</span>
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Real-time Stats Section */}
      <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
        {loading ? (
          <div >Loading stats...</div>
        ) : error ? (
          <div >{error}</div>
        ) : (
          <div >
            <Card >
              <CardHeader>
                <span style={{fontSize: '16px'}}>👤</span>
                <CardTitle style={{ color: "white" }}>{userCount.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <span style={{ color: "#9CA3AF" }}>Active Traders</span>
              </CardContent>
            </Card>
            <Card >
              <CardHeader>
                <span style={{fontSize: '16px'}}>📈</span>
                <CardTitle style={{ color: "white" }}>
                  {totalTrades > 0 ? ((successfulTrades / totalTrades) * 100).toFixed(1) : '0.0'}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span style={{ color: "#9CA3AF" }}>Successful Trades</span>
              </CardContent>
            </Card>
            <Card >
              <CardHeader>
                <span style={{fontSize: '16px'}}>✅</span>
                <CardTitle style={{ color: "white" }}>{platformUptime}</CardTitle>
              </CardHeader>
              <CardContent>
                <span style={{ color: "#9CA3AF" }}>Platform Uptime</span>
              </CardContent>
            </Card>
            <Card >
              <CardHeader>
                <BarChart3 style={{ marginLeft: "auto", marginRight: "auto" }} />
                <CardTitle style={{ color: "white" }}>{marketsCovered > 0 ? marketsCovered : 'N/A'}</CardTitle>
              </CardHeader>
              <CardContent>
                <span style={{ color: "#9CA3AF" }}>Markets Covered</span>
              </CardContent>
            </Card>
            <Card >
              <CardHeader>
                <span style={{fontSize: '16px'}}>💰</span>
                <CardTitle style={{ color: "white" }}>${demoVolume.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <span style={{ color: "#9CA3AF" }}>Total Volume</span>
              </CardContent>
            </Card>
            <Card >
              <CardHeader>
                <span style={{fontSize: '16px'}}>⭐</span>
                <CardTitle style={{ color: "white" }}>{userRating > 0 ? userRating.toFixed(1) : '5.0'}/5</CardTitle>
              </CardHeader>
              <CardContent>
                <span style={{ color: "#9CA3AF" }}>User Rating</span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Features Section */}
      <motion.div 
        ref={featuresRef} 
        id="features" 
        style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
      >
        <div >
          <h2 style={{ fontWeight: "700", color: "white" }}>
            Powerful Features for Modern Traders
          </h2>
          <p style={{ color: "#9CA3AF", marginLeft: "auto", marginRight: "auto" }}>
            Everything you need to trade successfully in today's markets
          </p>
        </div>
        
        <div >
          {features.map((feature, index) => (
            <Card key={index} >
              <CardHeader >
                <div className={`w-16 h-16 mx-auto rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon style={{ color: "white" }} />
                </div>
                <CardTitle style={{ color: "white" }}>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: "#9CA3AF" }}>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div 
        ref={testimonialsRef} 
        id="testimonials" 
        style={{ width: "100%" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
      >
        <div style={{ width: "100%" }}>
          <h2 style={{ fontWeight: "700", color: "white" }}>
            Trusted by Traders Worldwide
          </h2>
          <p style={{ color: "#9CA3AF", width: "100%" }}>
            See what our users are saying about InsightFlow AI
          </p>
        </div>
        <div style={{ width: "100%" }}>
          {loading ? (
            <div >Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div style={{ color: "#9CA3AF" }}>No reviews yet.</div>
          ) : (
            reviews.slice(0, 3).map((testimonial, index) => {
              if (testimonial && typeof testimonial === 'object' && 'content' in testimonial && 'name' in testimonial && 'role' in testimonial) {
                const t = testimonial as any;
                return (
                  <Card key={index} >
                    <CardHeader>
                      <p >"{t.content}"</p>
                    </CardHeader>
                    <CardContent>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{fontSize: '16px'}}>👤</span>
                        </div>
                        <div>
                          <p style={{ color: "white" }}>{t.name}</p>
                          <p style={{ color: "#9CA3AF" }}>{t.role}</p>
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
      <div style={{ width: "100%" }} id="crypto-payment">
        <div style={{ width: "100%" }}>
          <h2 style={{ fontWeight: "700", color: "white" }}>
            Secure Crypto Payment Integration
          </h2>
          <p style={{ color: "#9CA3AF", width: "100%" }}>
            Pay with your preferred cryptocurrency using our verified wallet addresses
          </p>
        </div>
        
        <div style={{ width: "100%" }}>
          {['USDT', 'BTC', 'ETH'].map((coin, idx) => (
            <Card key={coin} >
              <CardHeader >
                <div className={`w-16 h-16 mx-auto rounded-lg ${coin === 'USDT' ? 'bg-green-500/20 border border-green-500/30' : coin === 'BTC' ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-blue-500/20 border border-blue-500/30'} flex items-center justify-center mb-4`}>
                  <Bitcoin style={{ color: "white" }} />
                </div>
                <CardTitle style={{ color: "white" }}>{coin}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
