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
        // setSelectedTimeframe(defaultChartSettings.timeframe);
      }
      
      // Set default symbols/markets to watch
      if (defaultChartSettings.symbols?.length) {
        // setWatchlist(defaultChartSettings.symbols);
      }
      
      // Set default indicators
      if (defaultChartSettings.indicators?.length) {
        // setActiveIndicators(defaultChartSettings.indicators);
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
            onClick={() => navigate('/auth')}
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
          >
            Sign In
          </Div>
          <Button onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Start Free Trial
          </Button>
        </Div>
      </Nav>

      {/* Hero Section */}
      <Main ref={heroRef} className="container mx-auto px-6 py-24 text-center">
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
          🚀 Advanced Trading Platform - Now with AI Integration
        </Main>
        
        <H1 className="text-6xl font-bold leading-tight mt-4">
          <Span className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Trade Smarter with
          </H1>
          <br />
          <Span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Insights
          </Span>
        </H1>
        
        <P className="text-xl text-gray-400 mt-6 max-w-3xl mx-auto">
          Elevate your trading with our institutional-grade platform. Real-time data, advanced analytics, and AI-driven strategies at your fingertips.
        </P>

        <Div className="mt-8 flex justify-center gap-4">
          <Button size="lg" 
            onClick={() => navigate('/auth/register')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Div>
          <Button size="lg" 
            variant="outline"
            onClick={() => navigate('/features')}
            className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            Explore Features
          </Button>
        </Div>
      </Main>

      {/* Stats Section */}
      <Section className="container mx-auto px-6 py-12">
        <Div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Div className="p-4 rounded-lg bg-white/5">
            <H3 className="text-4xl font-bold text-white">{userCount}+</Section>
            <P className="text-gray-400">Traders Trust Us</P>
          </Div>
          <Div className="p-4 rounded-lg bg-white/5">
            <H3 className="text-4xl font-bold text-white">{successfulTrades}</Div>
            <P className="text-gray-400">Successful Trades</P>
          </Div>
          <Div className="p-4 rounded-lg bg-white/5">
            <H3 className="text-4xl font-bold text-white">${(demoVolume / 1000000).toFixed(1)}M+</Div>
            <P className="text-gray-400">Demo Volume</P>
          </Div>
          <Div className="p-4 rounded-lg bg-white/5">
            <Div className="flex items-center justify-center">
              <H3 className="text-4xl font-bold text-white">{userRating.toFixed(1)}</Div>
              <Star className="w-8 h-8 text-yellow-400 ml-2" />
            </Star>
            <P className="text-gray-400">User Rating</P>
          </Div>
        </Div>
      </Section>

      {/* Features Section */}
      <Section ref={featuresRef} className="container mx-auto px-6 py-24">
        <Div className="text-center mb-12">
          <H2 className="text-4xl font-bold text-white">Why InsightFlow AI?</Section>
          <P className="text-lg text-gray-400 mt-4">Unleash your trading potential with our powerful features</P>
        </Div>
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/40 border-gray-700/60 text-white h-full">
                <CardHeader>
                  <Div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </Div>
                  <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <P className="text-gray-400">{feature.description}</CardContent>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Div>
      </Section>

      {/* Pricing Section */}
      <Section ref={pricingRef} className="container mx-auto px-6 py-24">
        <Div className="text-center mb-12">
          <H2 className="text-4xl font-bold text-white">Pricing Plans</Section>
          <P className="text-lg text-gray-400 mt-4">Choose the plan that fits your trading journey</P>
        </Div>
        <Div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`bg-gray-800/40 border-gray-700/60 text-white flex flex-col ${plan.popular ? 'border-blue-500' : ''}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</Div>
                <P className="text-4xl font-bold mt-2">
                  ${plan.price}
                  <Span className="text-lg font-normal text-gray-400">/ {plan.period}</P>
                </P>
              </CardHeader>
              <CardContent className="flex-grow">
                <Ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <Li key={fIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <Span>{feature}</CardContent>
                    </Li>
                  ))}
                </Ul>
              </CardContent>
              <Div className="p-6">
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.popular ? 'Get Started' : 'Choose Plan'}
                </Div>
              </Div>
            </Card>
          ))}
        </Div>
      </Section>

      {/* Testimonials Section */}
      <Section ref={testimonialsRef} className="container mx-auto px-6 py-24">
        <Div className="text-center mb-12">
          <H2 className="text-4xl font-bold text-white">What Our Traders Say</Section>
        </Div>
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="bg-gray-800/40 border-gray-700/60 text-white">
              <CardContent className="pt-6">
                <Div className="flex items-center mb-4">
                  <Img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                  <Div>
                    <P className="font-semibold">{review.name}</Div>
                    <P className="text-sm text-gray-400">{review.handle}</P>
                  </Div>
                </Div>
                <P className="text-gray-300">"{review.text}"</P>
              </CardContent>
            </Card>
          ))}
        </Div>
      </Section>

      {/* Footer */}
      <Footer className="border-t border-gray-800/50 mt-24">
        <Div className="container mx-auto px-6 py-8">
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Div>
              <H3 className="font-semibold text-white">Platform</Footer>
              <Ul className="space-y-2 mt-4 text-gray-400">
                <Li><A href="#" className="hover:text-white">Features</Ul></Li>
                <Li><A href="#" className="hover:text-white">Pricing</Li></Li>
                <Li><A href="#" className="hover:text-white">Security</Li></Li>
              </Ul>
            </Div>
            <Div>
              <H3 className="font-semibold text-white">Company</Div>
              <Ul className="space-y-2 mt-4 text-gray-400">
                <Li><A href="#" className="hover:text-white">About Us</Ul></Li>
                <Li><A href="#" className="hover:text-white">Careers</Li></Li>
                <Li><A href="#" className="hover:text-white">Contact</Li></Li>
              </Ul>
            </Div>
            <Div>
              <H3 className="font-semibold text-white">Resources</Div>
              <Ul className="space-y-2 mt-4 text-gray-400">
                <Li><A href="#" className="hover:text-white">Blog</Ul></Li>
                <Li><A href="#" className="hover:text-white">API Docs</Li></Li>
                <Li><A href="#" className="hover:text-white">Help Center</Li></Li>
              </Ul>
            </Div>
            <Div>
              <H3 className="font-semibold text-white">Legal</Div>
              <Ul className="space-y-2 mt-4 text-gray-400">
                <Li><A href="#" className="hover:text-white">Terms of Service</Ul></Li>
                <Li><A href="#" className="hover:text-white">Privacy Policy</Li></Li>
              </Ul>
            </Div>
          </Div>
          <Div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-gray-500">
            <P>&copy; {new Date().getFullYear()} InsightFlow AI. All rights reserved.</Div>
          </Div>
        </Div>
      </Footer>
    </Div>
  );
};

export default LandingPage;

export const lovable = {
  component: LandingPage,
  name: 'Landing Page',
  key: 'landing-page',
  supportsTailwind: true,
  visualEditing: true,
  editableComponents: [
    {
      name: 'Hero Title',
      selector: '.text-6xl',
    },
    {
      name: 'Hero Subtitle',
      selector: '.text-xl',
    },
    {
      name: 'Feature Card',
      selector: '.grid > div > .bg-gray-800\\/40',
    }
  ]
};
